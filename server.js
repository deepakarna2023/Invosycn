const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const jsonServerApp = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

// Serve React app from build folder
app.use(express.static(path.join(__dirname, 'build')));

// Attach JSON server middleware under the `/api` path
app.use('/api', middlewares);
app.use('/api', router);

// Handle React frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`JSON API available at http://localhost:${PORT}/api`);
});