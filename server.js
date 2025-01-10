const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create()
const router = jsonServer.router('mock-api/db.json')
const middlewares = jsonServer.defaults()

server.use('/api', middlewares);  
server.use('/api', router);  

server.use(express.static(path.join(__dirname, 'build')));

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
