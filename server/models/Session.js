/* eslint-disable indent */
import mongoose, { Schema, model } from 'mongoose';

const SessionSchema = new Schema({
  ID: {
    type: String,
    get() {
      // eslint-disable-next-line no-underscore-dangle
      return this._id.toHexString();
    },
    set() {}
  },
  UserID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
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
    type: String,
  },
  ExpiresIn: {
    type: Date,
    default() {
      return new Date(Date.now() + (1000 * 60 * 30)) // 30 minutes
    }
  }
}, {
  timestamps: true,
  id: false,
  autoIndex: false,
  strictQuery: true
});

SessionSchema.set('toJSON', { getters: true }); // Enable toJSON getters

const Session = model('session', SessionSchema);

export default Session;
