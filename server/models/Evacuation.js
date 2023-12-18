import { Schema, model } from 'mongoose';
import assert from 'assert';

const EvacueeSchema = new Schema({
  ID: {
    required: true,
    type: String,
    ref: 'Geotagging',
    unique: true,
    immutable: true
  },
  OperatedBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User',
    immutable: true
  },
  EvacuatedAt: {
    type: Date,
    get() {
      return new Date(this.createdAt);
    }
  }
}, {
  timestamps: true,
  id: false,
  _id: false,
  autoIndex: false,
  strictQuery: true
});

EvacueeSchema.set('toJSON', { getters: true }); // Enable toJSON getters


const EvacueeSchemaWithPresent = new Schema({
  ID: {
    required: true,
    type: String,
    ref: 'Geotagging',
    unique: true,
    immutable: true
  },
  OperatedBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User',
    immutable: true
  },
  Present: [{
    type: String,
    unique: true
  }],
  EvacuatedAt: {
    type: Date,
    get() {
      return new Date(this.createdAt);
    }
  }
}, {
  timestamps: true,
  id: false,
  _id: false,
  autoIndex: false,
  strictQuery: true
});

EvacueeSchemaWithPresent.set('toJSON', { getters: true }); // Enable toJSON getters

const EvacuationSchema = new Schema({
  _id: {
    type: String,
    unique: true
  },
  ID: {
    type: String,
    immutable: true
  },
  BuildingName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  StreetNum: {
    type: String,
    default: '',
    maxLength: 100
  },
  District: {
    type: String,
    default: '',
    maxLength: 100
  },
  Barangay: {
    required: true,
    type: String,
    maxLength: 100
  },
  Municipality: {
    required: true,
    type: String,
    maxLength: 100
  },
  Province: {
    required: true,
    type: String,
    maxLength: 100
  },
  Region: {
    required: true,
    type: String,
    maxLength: 100
  },
  ZipCode: {
    required: true,
    type: Number,
    min: 1000,
    max: 8900
  },
  MaxCapacity: {
    required: true,
    type: Number,
    min: 1
  },
  PreEvacuation: {
    Started: {
      type: Date,
      validate: {
        validator(v) {
          return this.createdAt
            ? this.createdAt.getTime() <= v.getTime()
            : Date.now() <= v.getTime();
        },
        message(props) {
          return `Cannot start Pre-Evacuation at ${props.value}! Please Try again later.`;
        }
      }
    },
    Ended: {
      type: Date,
      validate: {
        validator(v) {
          return this.PreEvacuation.Started?.getTime() <= v.getTime();
        },
        message(props) {
          return `Cannot end Pre-Evacuation at ${props.value}! Please start the Pre-evacuation first!`;
        }
      }
    },
    Evacuated: {
      type: [EvacueeSchemaWithPresent],
      validate: {
        validator(v) {
          if (v.length === 0) {
            return true;
          }
          return (this.PreEvacuation.Started?.getTime() <= Date.now())
            && (!this.PreEvacuation.Ended || this.PreEvacuation.Ended?.getTime() > Date.now())
            && (this.MaxCapacity >= v.length)
            && (v.reduce((a, b) => Boolean(a
              && this.Assigned.map(aid => aid.toHexString())
                .includes(b.OperatedBy.toHexString())), true))
            // eslint-disable-next-line no-nested-ternary
            && (v.reduce((a, b) => (!(a instanceof Array) ? false : (!a.includes(b.ID)
              ? [...a, b.ID] : false)), []) !== false);
        }
      },
      default: [],
    }
  },
  Evacuation: {
    Started: {
      type: Date,
      validate: {
        validator(v) {
          return this.PreEvacuation.Started && this.PreEvacuation.Started.getTime() <= v.getTime();
        },
        message(props) {
          return `Failed to Start Evacation Process at ${props.value}`;
        }
      }
    },
    Ended: {
      type: Date,
      validate: {
        validator(v) {
          return this.Evacuation.Started && this.Evacuation.Started.getTime() <= v.getTime();
        },
        message(props) {
          return `Failed to end Evacuation process at ${props.value}`;
        }
      }
    },
    Distribution: {
      type: [EvacueeSchema],
      validate: {
        validator(v) {
          if (v.length === 0) {
            return true;
          }
          return (this.Evacuation.Started?.getTime() <= Date.now())
            && (!this.Evacuation.Ended || this.Evacuation.Ended?.getTime() > Date.now())
            && (this.MaxCapacity >= v.length)
            && (v.reduce((a, b) => a
              && this.PreEvacuation.Evacuated.map(ev => ev.ID)
                .includes(b.ID), true))
            && (v.reduce((a, b) => a
              && this.Assigned.map(aid => aid.toHexString())
                .includes(b.OperatedBy.toHexString()), true))
            // eslint-disable-next-line no-nested-ternary
            && (v.reduce((a, b) => (a instanceof Array
              ? (a.includes(b.ID) ? null : [...a, b.ID])
              : a), []) !== null);
        }
      }
    }
  },
  PostEvacuation: {
    Started: {
      type: Date,
      validate: {
        validator(v) {
          return this.PreEvacuation.Started && this.PreEvacuation.Started.getTime() <= v.getTime();
        },
        message(props) {
          return `Failed to Start Post-Evacation at ${props.value}`;
        }
      }
    },
    Ended: {
      type: Date,
      validate: {
        validator(v) {
          return this.PreEvacuation.Evacuated.length === this.PostEvacuation.Evacuated.length
            && this.PostEvacuation.Started && this.PostEvacuation.Started.getTime() <= v.getTime();
        },
        message(props) {
          return `Failed to end Post-Evacuation at ${props.value}`;
        }
      }
    },
    Evacuated: {
      type: [EvacueeSchema],
      validate: {
        validator(v) {
          if (v.length === 0) {
            return true;
          }
          return (this.PostEvacuation.Started?.getTime() <= Date.now())
            && (!this.PostEvacuation.Ended || this.PostEvacuation.Ended?.getTime() > Date.now())
            && (this.MaxCapacity >= v.length)
            && (v.reduce((a, b) => a
              && this.PreEvacuation.Evacuated.map(ev => ev.ID)
                .includes(b.ID), true))
            && (v.reduce((a, b) => a
              && this.Assigned.map(aid => aid.toHexString())
                .includes(b.OperatedBy.toHexString()), true))
            // eslint-disable-next-line no-nested-ternary
            && (v.reduce((a, b) => (a instanceof Array
              ? (a.includes(b.ID) ? null : [...a, b.ID])
              : a), []) !== null);
        }
      },
      default: [],
    }
  },
  Assigned: {
    type: [
      {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  CreatedBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  id: false,
  autoIndex: false,
  strictQuery: true
});

EvacuationSchema.post('save', async (doc, next) => {
  if (doc.PreEvacuation.Started
    && doc.PreEvacuation.Started.getTime() < Date.now()
    && !doc.PreEvacuation.Ended
    && doc.PreEvacuation.Evacuated.length === doc.MaxCapacity
  ) {
    const nextDoc = await Evacuation.findOneAndUpdate(doc, {
      $set: {
        'PreEvacuation.Ended': new Date(Date.now())
      }
    }, {
      returnOriginal: false,
      upsert: false
    }).exec();
    doc.set('PreEvacuation.Ended', nextDoc.PreEvacuation.Ended);
  } else if (doc.PostEvacuation.Started
    && doc.PostEvacuation.Started.getTime() < Date.now()
    && !doc.PostEvacuation.Ended
    && doc.PostEvacuation.Evacuated.length === doc.PreEvacuation.Evacuated.length
  ) {
    const nextDoc = await Evacuation.findOneAndUpdate(doc, {
      $set: {
        'PostEvacuation.Ended': new Date(Date.now())
      }
    }, {
      returnOriginal: false,
      upsert: false
    }).exec();
    doc.set('PostEvacuation.Ended', nextDoc.PostEvacuation.Ended);
  }
  next();
});

EvacuationSchema.pre('save', async function(next) {
  // eslint-disable-next-line no-underscore-dangle
  if (!this._id) {
    let id;
    try {
      const lastDoc = await Evacuation.find().exec();
      const nextIndex = lastDoc.reduce((a, b) => Math.max(Number(b.ID.substring(7)) + 1, a),
        1);
      assert.strictEqual(nextIndex > 0, true);
      id = `EVACID-${String(nextIndex).padStart(6, '0')}`;
    } catch (_) {
      id = 'EVACID-000001';
    }
    // eslint-disable-next-line no-underscore-dangle
    this._id = id;
    this.ID = id;
  } else {
    try {
      assert.strictEqual(
        // eslint-disable-next-line no-underscore-dangle
        Number(this._id.substring(7)) > 0,
        true
      );
    } catch (error) {
      next(error);
    }
  }

  next();
});

EvacuationSchema.set('toJSON', { getters: true }); // Enable toJSON getters

const Evacuation = model('Evacuation', EvacuationSchema);

export default Evacuation;
