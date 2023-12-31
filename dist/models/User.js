"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable indent */
// eslint-disable-next-line import/no-named-default

const UserSchema = new _mongoose.Schema({
  ID: {
    type: String,
    immutable: true
  },
  Username: {
    required: true,
    type: String,
    minLength: 4,
    maxLength: 50,
    unique: true,
    index: true,
    immutable: true
  },
  Password_hash: {
    required: true,
    type: String
  },
  Role: {
    required: true,
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  Office: {
    required: true,
    type: String,
    maxLength: 100
  },
  Position: {
    required: true,
    type: String,
    maxLength: 100
  },
  Barangay: {
    type: String,
    required: true,
    maxLength: 100
  },
  FirstName: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 50
  },
  MiddleName: {
    type: String,
    default: '',
    maxLength: 50
  },
  LastName: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 50
  },
  Suffx: {
    type: String,
    maxLength: 50
  },
  Contact: {
    type: String,
    default: '',
    maxLength: 13
  },
  Email: {
    type: String,
    default: '',
    maxLength: 100
  },
  Permissions: {
    type: [{
      type: String,
      required: true,
      enum: ['user-add', 'user-update', 'user-delete', 'admin-create', 'admin-update', 'admin-delete', 'permissions-modify', 'pre-evacuation-create', 'pre-evacuation-scan', 'pre-evacuation-modify', 'pre-evacuation-delete', 'evacuation-scan', 'evacuation-modify', 'post-evacuation-scan', 'post-evacuation-modify', 'post-evacuation-print', 'view-info'],
      default: 'view-info'
    }],
    required: true,
    default: ['view-info']
  },
  UpdatedBy: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  AddedBy: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  id: false,
  autoIndex: false,
  strictQuery: true,
  excludeIndexes: true
});
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-underscore-dangle
  if (!this._id) {
    // eslint-disable-next-line no-underscore-dangle
    this._id = new _mongoose.default.Types.ObjectId();
  }
  // eslint-disable-next-line no-underscore-dangle
  this.ID = this._id instanceof _mongoose.Schema.Types.ObjectId
  // eslint-disable-next-line no-underscore-dangle
  ? this._id.toHexString()
  // eslint-disable-next-line no-underscore-dangle
  : this._id;
  next();
});
UserSchema.set('toJSON', {
  getters: true
}); // Enable toJSON getters

const User = (0, _mongoose.model)('User', UserSchema);
var _default = exports.default = User;