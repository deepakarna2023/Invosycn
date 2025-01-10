const express = require('express');
const jsonServer = require('json-server');
const path = require('path');


const app = express();
const jsonServerApp = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

// Serve static React files
app.use(express.static(path.join(__dirname, 'build')));

// Use JSON Server middleware for API requests
app.use('/api', middlewares);
app.use('/api', router);

// Handle React's index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`JSON API available at http://localhost:${PORT}/api`);
});

// const app = express();

// const jsonServerApp = jsonServer.create();
// const router = jsonServer.router('mock-api/db.json');
// const middlewares = jsonServer.defaults();

// jsonServerApp.use('/api', middlewares);  
// jsonServerApp.use('/api', router);  

// jsonServerApp.use(express.static(path.join(__dirname, 'build')));

// jsonServerApp.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const PORT = process.env.PORT || 3000;
// jsonServerApp.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
