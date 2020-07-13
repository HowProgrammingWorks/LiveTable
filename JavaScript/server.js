'use strict';

const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const index = fs.readFileSync('./index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});

server.listen(8000, () => {
  console.log('Listen port 8000');
});

const ws = new WebSocket.Server({ server });

const clients = [];

ws.on('connection', (connection, req) => {
  clients.push(connection);
  const ip = req.socket.remoteAddress;
  console.log(`Connected ${ip}`);
  connection.on('message', message => {
    console.log('Received: ' + message);
    for (const client of clients) {
      if (connection !== client) {
        client.send(message);
      }
    }
  });
  connection.on('close', () => {
    console.log(`Disconnected ${ip}`);
  });
});
