import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import { Connection, Request as TediousRequest, ConnectionConfiguration } from 'tedious'; // Import ConnectionConfiguration and alias Request

export async function GET(request: NextRequest) { // Use NextRequest type
  // 1. Get the Authorization header using NextRequest properties
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
  }
  const accessToken = authHeader.split(' ')[1];

  // 2. Define AAS connection details (Ensure env vars are set)
  const serverUrl = process.env.AAS_SERVER_URL;
  const databaseName = process.env.AAS_DATABASE;

  if (!serverUrl) {
     console.error("AAS_SERVER_URL environment variable is not set.");
     return NextResponse.json({ error: 'Server configuration missing: Server URL not set' }, { status: 500 });
  }
   if (!databaseName) {
     console.error("AAS_DATABASE environment variable is not set.");
     return NextResponse.json({ error: 'Server configuration missing: Database name not set' }, { status: 500 });
  }

  // 3. Configure Tedious Connection using the access token
  // Explicitly type the config object
  const config: ConnectionConfiguration = {
    server: serverUrl, // Now guaranteed to be a string
    authentication: {
        type: 'azure-active-directory-access-token',
        options: {
            token: accessToken, // Guaranteed to be a string here
        },
    },
    options: {
        database: databaseName, // Now guaranteed to be a string
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        trustServerCertificate: true, // Consider security implications
    },
  };

  // 4. Connect and Query (Wrap Tedious logic in a Promise)
  const executeQuery = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      // Pass the explicitly typed config object
      const connection = new Connection(config);

      connection.on('connect', (err) => {
        if (err) {
          console.error("Connection Error:", err);
          // Attempt to close connection even if connect event errors
          if (!connection.closed) connection.close();
          reject(new Error(`Connection failed: ${err.message}`));
          return;
        }
        console.log("Connected to AAS.");

        const daxQuery = `
          EVALUATE
          SUMMARIZECOLUMNS(
            'Date'[Calendar Year],
            "Total Sales Amount", SUM(ResellerSales[SalesAmount])
          ) ORDER BY [Calendar Year]
        `;

        // Use the aliased TediousRequest type
        const daxRequest = new TediousRequest(daxQuery, (err, rowCount, rows) => {
          if (!connection.closed) connection.close(); // Ensure connection is closed

          if (err) {
            console.error("DAX Query Error:", err);
            reject(new Error(`DAX query failed: ${err.message}`));
            return;
          }

          console.log(`Query successful, received ${rowCount} rows.`);
          // Process rows
          const results = rows.map((columns: any) =>
            columns.reduce((acc: any, column: any) => {
              // Use colName from metadata for clearer keys
              acc[column.metadata.colName] = column.value;
              return acc;
            }, {})
          );
          resolve(results);
        });

         // Add error handling for the request object itself
         daxRequest.on('error', (reqErr) => {
            console.error('Tedious Request Error:', reqErr);
            if (!connection.closed) connection.close();
            reject(new Error(`Tedious request failed: ${reqErr.message}`));
         });


        try {
           console.log("Executing DAX query...");
           connection.execSql(daxRequest);
        } catch (execErr) {
            console.error("Error executing SQL/DAX:", execErr);
            if (!connection.closed) connection.close();
            reject(new Error(`Error executing query: ${ (execErr as Error).message }`));
        }
      });

      connection.on('error', (err) => {
          console.error("Connection Error Event:", err);
           if (!connection.closed) connection.close();
           // Avoid rejecting if already rejected by 'connect' or 'request' error
           // This might need more sophisticated state management in complex scenarios
           // For now, we log it. Consider if you need to reject here too.
           console.error(`Connection error event: ${err.message}`);
           // reject(new Error(`Connection error event: ${err.message}`));
      });

       // Add debug logging for connection end and info messages
       connection.on('end', () => {
           console.log('Connection closed.');
       });
       connection.on('infoMessage', (info) => {
           console.log('Info message: ', info.message);
       });
        connection.on('errorMessage', (errorMsg) => {
           console.error('Error message: ', errorMsg.message);
       });


      // Initiate connection
      try {
         console.log("Attempting to connect...");
         connection.connect();
      } catch (connectErr) {
         console.error("Error initiating connection:", connectErr);
         reject(new Error(`Error initiating connection: ${ (connectErr as Error).message }`));
      }
    });
  };

  // 5. Execute and Respond
  try {
    const data = await executeQuery();
    return NextResponse.json(data);
  } catch (error: any) {
     // Log the specific error leading to the 500 response
     console.error("API Route Error caught:", error.message, error.stack);
    return NextResponse.json({ error: `Failed to fetch data from AAS: ${error.message}` }, { status: 500 });
  }
}