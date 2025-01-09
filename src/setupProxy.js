const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Any requests starting with "/api" will be proxied
    createProxyMiddleware({
      target: 'https://invosycn.onrender.com:4000/', // The server URL
      changeOrigin: true,  // Changes the origin of the request to the target URL
    })
  );
};
