const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.REACT_APP_SERVER_PORT;
module.exports = function(app) {
  app.use(
    '/api', // Any requests starting with "/api" will be proxied
    createProxyMiddleware({
      target: `${port}`, // The server URL
      changeOrigin: true,  // Changes the origin of the request to the target URL
    })
  );
};
