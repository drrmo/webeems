"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable indent */

const SessionSchema = new _mongoose.Schema({
  ID: {
    type: String,
    get() {
      // eslint-disable-next-line no-underscore-dangle
      return this._id.toHexString();
    },
    set() {}
  },
  UserID: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  UserIDStr: {
    type: String,
    get() {
      return this.UserID.toHexString();
    },
    set() {}
  },
  IPAddress: {
    required: true,
    type: String,
    immutable: true
  },
  UserAgent: {
    required: true,
    type: String,
    immutable: true
  },
  Payload: {
    required: true,
    type: String
  },
  ExpiresIn: {
    type: Date,
    default() {
      return new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    }
  }
}, {
  timestamps: true,
  id: false,
  autoIndex: false,
  strictQuery: true
});
SessionSchema.set('toJSON', {
  getters: true
}); // Enable toJSON getters

const Session = (0, _mongoose.model)('session', SessionSchema);
var _default = exports.default = Session;