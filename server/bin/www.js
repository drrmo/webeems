#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Module dependencies.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import app from '../app';

let debug = () => {};
(async () => {
  console.log(`Starting on ${process.env.NODE_ENV}environment`);
  const debugPkg = process.env.NODE_ENV?.startsWith('development') ? await import('debug') : null;
  debug = process.env.NODE_ENV?.startsWith('development') ? debugPkg.default('WebEEMS') : () => {};
})().then();

if (process.env.NODE_ENV?.startsWith('development')) {
  (async () => {
    const httpsImport = await import('https');
    const https = httpsImport.default;
    // for HTTPS in development
    /**
     * Get port from environment and store in Express.
     */
    const httpsPort = normalizePort(process.env.HTTPS_PORT || '443');
    app.set('httpsport', httpsPort);

    /**
     * Create HTTPS server.
     */

    const key = fs.readFileSync(path.join(__dirname, '..', '..', 'cert', 'cert.key'));
    const cert = fs.readFileSync(path.join(__dirname, '..', '..', 'cert', 'cert.crt'));

    const httpsOptions = { key, cert };

    const httpsServer = https.createServer(httpsOptions, app);

    /**
     * HTTPS: Listen on provided port, on all network interfaces.
     */

    httpsServer.listen(
      httpsPort,
      '0.0.0.0', // comment this for both ipv4 and ipv6
      () => {
        const underline = '\x1B[4m';
        const reset = '\x1B[0m';
        console.log(`App listening on PORT ${httpsPort}`);
        console.log(`Browse: ${underline}https://localhost:${httpsPort}/${reset}`);
      }
    );

    httpsServer.on('error', onErrorHttps);
    httpsServer.on('listening', onListeningHttps);

    /**
     * Event listener for HTTPS server "error" event.
     */

    function onErrorHttps(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof httpsPort === 'string'
        ? `Pipe ${httpsPort}`
        : `Port ${httpsPort}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTPS server "listening" event.
     */

    function onListeningHttps() {
      const addr = httpsServer.address();
      const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
      debug(`Listening on ${bind}`);
    }
  })().then();
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * HTTP: Listen on provided port, on all network interfaces.
 */

server.listen(
  port,
  '0.0.0.0', // comment this for both ipv4 and ipv6
  () => {
    const underline = '\x1B[4m';
    const reset = '\x1B[0m';
    console.log(`App listening on PORT ${port}`);
    console.log(`Browse: ${underline}http://localhost:${port}/${reset}`);
  }
);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const portNum = parseInt(val, 10);

  if (Number.isNaN(portNum)) {
    // named pipe
    return val;
  }

  if (portNum >= 0) {
    // port number
    return portNum;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
