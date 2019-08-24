#!/usr/bin/env node

const WebSocketServer = require('websocket').server;
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const Commands = require('./shared/commands');

function log(message, sender=false) {
  console.log(`[${new Date()}]${sender ? '['+sender+']' : ''} ${message}`);
}

/** Serve files from ./web-player **/

const serve = serveStatic('web-player', { index: 'index.html' });

const server = http.createServer((request, response) => {
  log('Received request for ' + request.url);
  serve(request, response, finalhandler(request, response));
});

server.listen(8080, () => log('Server is listening on port 8080'));

/** Set up web sockets **/

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

wsServer.on('request', (request) => {
  const connection = request.accept('fireworks-protocol', request.origin);
  log('Connection accepted', connection.remoteAddress);

  connection.on('message', (message) => {
    if ( message.type !== 'utf8')
      return log(`Invalid request type received: ${JSON.stringify(message)}`, connection.remoteAddress);

    const command = message.utf8Data;
    if ( !Commands.isValid(command) )
      return log(`Invalid command received: ${JSON.stringify(message)}`, connection.remoteAddress);

    const code = Commands.getCode(command);
    log(`Received command '${command}', sending code ${code} to hardware`, connection.remoteAddress);

    // Obvious TODO: actually control hardware
  });

  connection.on('close', (reasonCode, description) =>
    log('Peer disconnected', connection.remoteAddress));
});
