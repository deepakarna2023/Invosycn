const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const jsonServerApp = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

jsonServerApp.use('/api', middlewares);  
jsonServerApp.use('/api', router);  

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

// Handle API requests
app.use('/api', (req, res, next) => {
  jsonServerApp.handle(req, res, next);
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
