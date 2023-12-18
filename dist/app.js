"use strict";

var _path = _interopRequireDefault(require("path"));
var _express = _interopRequireDefault(require("express"));
var _compression = _interopRequireDefault(require("compression"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _morgan = _interopRequireDefault(require("morgan"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var routes = _interopRequireWildcard(require("./routes"));
var _sessionToken = _interopRequireDefault(require("./controllers/sessionToken"));
var _controllers = require("./controllers");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-console */

const secretToken = 'webeems-secret-token';
const app = (0, _express.default)();

// database setup
const mongoUri = process && process.env && process.env.MONGODB_URI || undefined || 'mongodb://127.0.0.1:27017/webeems';
const mongooseConfigs = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
_mongoose.default.connect(mongoUri, mongooseConfigs).then(() => console.log(`Connected to database server at ${_mongoose.default.connection.host}`)).catch(err => {
  console.error(err);
  process.exit(1);
});
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)(secretToken));
app.use((0, _sessionToken.default)(secretToken, 1800)); // 30 minutes
app.use(_helmet.default.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'blob:']
  }
}));
app.use((0, _cors.default)({
  origin: ['self', 'https://localhost:5173', 'https://localhost:5177'],
  credentials: true
}));
app.use((0, _compression.default)());
app.use(_controllers.session.createDefaultAdmin);

// static folder of showing the frontend
app.use(_express.default.static(_path.default.join(__dirname, '..', 'client', 'dist')));

// redirect to secure
if ((process && process.env && process.env.NODE_ENV || undefined)?.startsWith('development')) {
  app.use((req, res, next) => {
    if (!req.secure) {
      const hostname = req.headers.host.split(':')[0];
      return res.redirect(`https://${hostname}${req.url}`);
    }
    next();
  });
}

// back-end api routes
app.use('/api/users', routes.users);
app.use('/api/evacuation', routes.evacuation);
app.use('/api/evacuees', routes.evacuees);
if ((process && process.env && process.env.NODE_ENV || undefined)?.startsWith('development')) {
  app.use('/api/seed', routes.seed);
}
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    status: err.status
  }).end();
});
app.get('*', async (req, res) => {
  res.sendFile(_path.default.join(__dirname, '..', 'client', 'dist', 'index.html'));
});
module.exports = app;