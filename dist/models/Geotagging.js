"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
var _assert = _interopRequireDefault(require("assert"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PersonSchema = new _mongoose.Schema({
  Name: {
    required: true,
    type: String
  },
  Suffx: {
    type: String
  },
  Age: {
    required: true,
    type: Number,
    min: 1,
    max: 110
  },
  Occ: {
    type: String,
    maxLength: 50
  },
  ConNum: {
    type: String,
    maxLength: 13
  }
}, {
  _id: false
});
const HouseholdSchema = new _mongoose.Schema({
  Head: {
    required: true,
    type: PersonSchema
  },
  Members: {
    type: [PersonSchema],
    default: []
  }
}, {
  _id: false
});
const GeotaggingSchema = new _mongoose.Schema({
  _id: {
    type: String,
    validate: {
      validator(v) {
        return /^ADN-NAS-\d{6}$/.test(v);
      },
      message(props) {
        return `${props.value} is not a valid Household ID!`;
      }
    },
    unique: true
  },
  ID: {
    type: String,
    immutable: true
  },
  HouseID: {
    type: String,
    immutable: true
  },
  Household: {
    required: true,
    type: HouseholdSchema,
    unique: true
  },
  Latitude: {
    required: true,
    type: Number,
    set: convertToDouble
  },
  Longitude: {
    required: true,
    type: Number,
    set: convertToDouble
  },
  StreetNum: {
    type: String,
    default: '',
    maxLength: 50
  },
  District: {
    type: String,
    default: '',
    maxLength: 50
  },
  Barangay: {
    required: true,
    type: String,
    maxLength: 50
  },
  Municipality: {
    required: true,
    type: String,
    maxLength: 50
  },
  Province: {
    required: true,
    type: String,
    maxLength: 50
  },
  Region: {
    required: true,
    type: String,
    maxLength: 50
  },
  ZipCode: {
    required: true,
    type: Number,
    min: 1000,
    max: 8900
  },
  YearBlt: {
    required: true,
    type: Number,
    min: 1800,
    max: 2100
  },
  BuildType: {
    required: true,
    type: String
  },
  StrucType: {
    type: String,
    required: true
  },
  NumStor: {
    required: true,
    type: Number,
    min: 0
  },
  NumOccs: {
    required: true,
    type: String
  },
  BuildCon: {
    type: String,
    required: true
  },
  RoofMat: {
    type: String,
    required: true
  },
  BuildUse: {
    type: String,
    required: true
  },
  LandUse: {
    required: true,
    type: String
  },
  legend: {
    required: true,
    type: String
  },
  CurrentlyEvacuatedAt: {
    type: String,
    ref: 'Evacuation'
  },
  dateadded: {
    type: Date,
    get() {
      return new Date(this.createdAt);
    }
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
  strictQuery: true
});
GeotaggingSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-underscore-dangle
  if (!this._id) {
    let id;
    try {
      const lastDoc = await Geotagging.find().exec();
      const nextIndex = lastDoc.reduce((a, b) => Math.max(Number(b.ID.substring(8)) + 1, a), 1);
      _assert.default.strictEqual(nextIndex > 0, true);
      id = `ADN-NAS-${String(nextIndex).padStart(6, '0')}`;
    } catch (_) {
      id = 'ADN-NAS-000001';
    }
    // eslint-disable-next-line no-underscore-dangle
    this._id = id;
    this.ID = id;
    this.HouseID = id;
  } else {
    try {
      // eslint-disable-next-line no-underscore-dangle
      _assert.default.strictEqual(Number(this._id.substring(8)) > 0, true);
      if (!this.ID) {
        this.ID = this._id;
      }
      if (!this.HouseID) {
        this.HouseID = this._id;
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});
function convertToDouble(value) {
  try {
    return parseFloat(value).toFixed(6);
  } catch (e) {
    return Number(0).toFixed(6);
  }
}
GeotaggingSchema.set('toJSON', {
  getters: true
}); // Enable toJSON getters

const Geotagging = (0, _mongoose.model)('Geotagging', GeotaggingSchema);
var _default = exports.default = Geotagging;