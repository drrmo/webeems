#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Module dependencies.
 */
"use strict";

var _http = _interopRequireDefault(require("http"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _app = _interopRequireDefault(require("../app"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let debug = () => {};
(async () => {
  console.log(`Starting on ${process && process.env && process.env.NODE_ENV || undefined}environment`);
  const debugPkg = (process && process.env && process.env.NODE_ENV || undefined)?.startsWith('development') ? await Promise.resolve().then(() => _interopRequireWildcard(require('debug'))) : null;
  debug = (process && process.env && process.env.NODE_ENV || undefined)?.startsWith('development') ? debugPkg.default('WebEEMS') : () => {};
})().then();
if ((process && process.env && process.env.NODE_ENV || undefined)?.startsWith('development')) {
  (async () => {
    const httpsImport = await Promise.resolve().then(() => _interopRequireWildcard(require('https')));
    const https = httpsImport.default;
    // for HTTPS in development
    /**
     * Get port from environment and store in Express.
     */
    const httpsPort = normalizePort(process && process.env && process.env.HTTPS_PORT || undefined || '443');
    _app.default.set('httpsport', httpsPort);

    /**
     * Create HTTPS server.
     */

    const key = _fs.default.readFileSync(_path.default.join(__dirname, '..', '..', 'cert', 'cert.key'));
    const cert = _fs.default.readFileSync(_path.default.join(__dirname, '..', '..', 'cert', 'cert.crt'));
    const httpsOptions = {
      key,
      cert
    };
    const httpsServer = https.createServer(httpsOptions, _app.default);

    /**
     * HTTPS: Listen on provided port, on all network interfaces.
     */

    httpsServer.listen(httpsPort, '0.0.0.0',
    // comment this for both ipv4 and ipv6
    () => {
      const underline = '\x1B[4m';
      const reset = '\x1B[0m';
      console.log(`App listening on PORT ${httpsPort}`);
      console.log(`Browse: ${underline}https://localhost:${httpsPort}/${reset}`);
    });
    httpsServer.on('error', onErrorHttps);
    httpsServer.on('listening', onListeningHttps);

    /**
     * Event listener for HTTPS server "error" event.
     */

    function onErrorHttps(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }
      const bind = typeof httpsPort === 'string' ? `Pipe ${httpsPort}` : `Port ${httpsPort}`;

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
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      debug(`Listening on ${bind}`);
    }
  })().then();
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process && process.env && process.env.PORT || undefined || '3001');
_app.default.set('port', port);

/**
 * Create HTTP server.
 */

const server = _http.default.createServer(_app.default);

/**
 * HTTP: Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0',
// comment this for both ipv4 and ipv6
() => {
  const underline = '\x1B[4m';
  const reset = '\x1B[0m';
  console.log(`App listening on PORT ${port}`);
  console.log(`Browse: ${underline}http://localhost:${port}/${reset}`);
});
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
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

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
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}