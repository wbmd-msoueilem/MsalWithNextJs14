import { msalInstance } from "@/msal/authConfig"; // Import the MSAL instance from authConfig.js
import { Connection, Request } from "tedious"; // Import Tedious for querying the XMLA endpoint


export async function queryAdventureWorks() {
  // Check if the user is logged in
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw new Error("User is not logged in");
  }


  // Acquire an access token for Azure Analysis Services
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    scopes: ["https://\*.asazure.windows.net/.default"], // Scope for AAS
  });


  const accessToken = tokenResponse.accessToken;


  // Define the AAS server URL
  const serverUrl = "asazure://<region>.asazure.windows.net/<server-name>"; // Replace with your AAS server URL


  // Create a connection to the XMLA endpoint
  const config = {
    server: serverUrl,
    authentication: {
      type: undefined, // Correct authentication type
      options: {
        token: accessToken,
      },
    },
    options: {
      encrypt: true,
      rowCollectionOnRequestCompletion: true,
    },
  };


  const connection = new Connection(config);


  return new Promise((resolve, reject) => {
    connection.on("connect", (err) => {
      if (err) {
        reject(err);
        return;
      }


      // Define the DAX query to retrieve data from AdventureWorks
      const daxQuery = `
  EVALUATE
  SUMMARIZECOLUMNS(
  'Sales'[Year],
  "Total Sales", SUM('Sales'[Amount])
  )
  `;


      const request = new Request(daxQuery, (err, rowCount, rows) => {
        if (err) {
          reject(err);
          return;
        }


        // Parse the rows into a readable format
        const results = rows.map((columns: any) =>
          columns.reduce((acc: any, column: any) => {
            acc[column.metadata.colName] = column.value;
            return acc;
          }, {})
        );


        resolve(results);
      });


      connection.execSql(request);
    });


    connection.connect();
  });
}