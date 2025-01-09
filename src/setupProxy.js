const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Any requests starting with "/api" will be proxied
    createProxyMiddleware({
      target: 'http://localhost:4000', // The server URL
      changeOrigin: true,  // Changes the origin of the request to the target URL
    })
  );
};
