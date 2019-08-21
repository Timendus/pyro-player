#!/usr/bin/env node

const WebSocketServer = require('websocket').server;
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const serve = serveStatic("web-player", { index: 'index.html' });

const server = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url);
  serve(request, response, finalhandler(request, response));
});

server.listen(8080, () => console.log((new Date()) + ' Server is listening on port 8080'));

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept('fireworks-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', (reasonCode, description) => console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.'));
});
