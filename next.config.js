/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only apply polyfills/fallbacks for the client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Spread existing fallbacks
        fs: false, // Tells Webpack to replace 'fs' with an empty module on the client
        net: false, // Same for 'net'
        tls: false, // Same for 'tls'
        dns: false, // Same for 'dns'
        url: false, // Same for 'url' - Careful, 'url' has browser polyfills, but might cause issues if a Node.js specific feature is used
      };
    }

    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig