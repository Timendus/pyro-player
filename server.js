#!/usr/bin/env node

const WebSocketServer = require('websocket').server;
const http            = require('http');
const finalhandler    = require('finalhandler');
const serveStatic     = require('serve-static');
const Commands        = require('./shared/commands');
const { exec }        = require('child_process');


function log(message, sender=false) {
  console.log(`[${new Date()}]${sender ? '['+sender+']' : ''} ${message}`);
}


/** Serve files from ./web-player **/

const serve = serveStatic('web-player', { index: 'index.html' });

const server = http.createServer((request, response) => {
  log('Received request for ' + request.url);
  serve(request, response, finalhandler(request, response));
});

server.listen(80, () => log('Server is listening on port 80'));


/** Set up web sockets **/

wsServer = new WebSocketServer({
  httpServer: server,
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

    // Send code to hardware using rpi-rf. Signal repeated four times.
    // See: https://github.com/milaq/rpi-rf
    exec(`rpi-rf_send ${code} -r 4`, (err, stdout, stderr) => {
      if ( stdout ) { log(`rpi-rf_send says: ${stdout.trim()}`); }
      if ( err    ) { log(`Got an error from rpi-rf_send: ${stderr.trim()}`); }
    });
  });

  connection.on('close', (reasonCode, description) =>
    log('Peer disconnected', connection.remoteAddress));
});
