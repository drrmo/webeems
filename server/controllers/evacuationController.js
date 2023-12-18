/* eslint-disable no-nested-ternary */
import { Evacuation, Geotagging, User } from '../models';

export const getAvailableEventIDEnd = async (req, res) => {
  const { proc } = req.query;
  if (!proc || !(['pre', 'evac', 'post'].includes(proc))) {
    invalidAccess(res, 'Get Available Event ID for end');
  }
  let result;
  let hasErrors = false;
  try {
    if (proc === 'pre') {
      result = await Evacuation.find({
        'PreEvacuation.Started': { $exists: true },
        'PreEvacuation.Ended': { $exists: false }
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    } else if (proc === 'evac') {
      result = await Evacuation.find({
        'Evacuation.Started': { $exists: true },
        'Evacuation.Ended': { $exists: false }
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    } else if (proc === 'post') {
      result = await Evacuation.find({
        'PostEvacuation.Started': { $exists: true },
        'PostEvacuation.Ended': { $exists: false }
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    }
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Available Event ID for end'
    }).end();
    hasErrors = true;
  } finally {
    if (result) {
      res.json({
        success: result,
        name: 'Get Available Event ID for end'
      }).end();
    } else if (!hasErrors) {
      res.json({
        success: [],
        name: 'Get Available Event ID for end'
      }).end();
    }
  }
};

export const getAvailableEventIDScan = async (req, res) => {
  const { proc } = req.query;
  if (!proc || !(['pre', 'evac', 'post'].includes(proc))) {
    invalidAccess(res, 'Get Available Event ID for QR Scanning');
  }
  let result;
  let hasErrors = false;
  try {
    if (proc === 'pre') {
      result = await Evacuation.find({
        'PreEvacuation.Started': { $exists: true },
        $or: [
          { 'PreEvacuation.Ended': { $exists: false } },
          { 'PreEvacuation.Ended': { $exists: true, $gt: new Date() } }
        ]
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    } else if (proc === 'evac') {
      result = await Evacuation.find({
        'Evacuation.Started': { $exists: true },
        $or: [
          { 'Evacuation.Ended': { $exists: false } },
          { 'Evacuation.Ended': { $exists: true, $gt: new Date() } }
        ]
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    } else if (proc === 'post') {
      result = await Evacuation.find({
        'PostEvacuation.Started': { $exists: true },
        $or: [
          { 'PostEvacuation.Ended': { $exists: false } },
          { 'PostEvacuation.Ended': { $exists: true, $gt: new Date() } }
        ]
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    }
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Available Event ID for QR Scanning'
    }).end();
    hasErrors = true;
  } finally {
    if (result) {
      res.json({
        success: result,
        name: 'Get Available Event ID for QR Scanning'
      }).end();
    } else if (!hasErrors) {
      res.json({
        success: [],
        name: 'Get Available Event ID for QR Scanning'
      }).end();
    }
  }
};

export const getAdminAssignedEvent = async (req, res) => {
  const { ID } = req.query;
  if (!ID) {
    invalidAccess(res, 'Get Evacuation Event Information');
    return;
  }
  try {
    const success = await Evacuation.findOne({
      ID
    }, {
      _id: 0,
      'PreEvacuation.Evacuated': 0,
      'Evacuation.Distribution': 0,
      'PostEvacuation.Evacuated': 0
    }).populate('CreatedBy', '-_id')
      .populate('Assigned', '-_id')
      .exec();
    res.json({
      success,
      name: 'Get Admin Assigned Evacuation Event'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Admin Evacuation Event Information'
    }).end();
  }
};

export const getAvailableEventIDStart = async (req, res) => {
  const { proc } = req.query;
  if (!proc || !(['pre', 'evac', 'post'].includes(proc))) {
    invalidAccess(res, 'Get Available Event ID for start');
  }
  let result;
  let hasErrors = false;
  try {
    if (proc === 'pre') {
      result = await Evacuation.find({
        'PreEvacuation.Started': { $exists: false }
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    } else if (proc === 'evac') {
      result = await Evacuation.find({
        'Evacuation.Started': { $exists: false }
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    } else if (proc === 'post') {
      result = await Evacuation.find({
        'PostEvacuation.Started': { $exists: false }
      })
        .sort('ID')
        .select('-_id ID')
        .exec();
    }
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Available Event ID for start'
    }).end();
    hasErrors = true;
  } finally {
    if (result) {
      res.json({
        success: result,
        name: 'Get Available Event ID for start'
      }).end();
    } else if (!hasErrors) {
      res.json({
        success: [],
        name: 'Get Available Event ID for start'
      }).end();
    }
  }
};

export const getBuildingOccupancies = async (req, res) => {
  try {
    const event = await Evacuation.find({})
      .select('-_id')
      .sort({
        'PreEvacuation.Started': -1,
        'Evacuation.Started': -1,
        'PostEvacuation.Started': -1,
        updatedAt: -1,
      })
      .populate('CreatedBy', 'FirstName LastName Suffx')
      .exec();
    if (event) {
      res.json({
        success: event.map(ev => ({
          ID: ev.ID,
          EvacuationBuilding: `${ev.BuildingName}, ${ev.StreetNum} District ${ev.District} Bgry. ${ev.Barangay}, ${ev.Province}`,
          CreatedBy: `${ev.CreatedBy?.FirstName} ${ev.CreatedBy?.LastName}${
            ev.CreatedBy?.Suffx ? ` ${ev.CreatedBy.Suffx}` : ''}`,
          CreatedAt: ev.createdAt,
          OperatorsAssigned: ev.Assigned?.length,
          MaxCapacity: ev.MaxCapacity,
          TotalOccupants: ev.PreEvacuation?.Evacuated?.length || 0,
          OccupantsInside: ev.PreEvacuation?.Evacuated && ev.PreEvacuation.Started
            ? (ev.PreEvacuation.Evacuated.length - ev.PostEvacuation.Evacuated.length)
            : 0,
          OccupantsRelocated: ev.PostEvacuation?.Evacuated?.length || 0,
          PreEvacuationStarted: ev.PreEvacuation?.Started,
          PreEvacuationEnded: ev.PreEvacuation?.Ended,
          EvacuationStarted: ev.Evacuation?.Started,
          EvacuationEnded: ev.Evacuation?.Ended,
          PostEvacuationStarted: ev.PostEvacuation?.Started,
          PostEvacuationEnded: ev.PostEvacuation?.Ended,
          ReliefDistributed: ev.Evacuation?.Distribution || 0,
          ReliefAvailable: ev.Evacuation?.Started
            ? (ev.PreEvacuation.Evacuated.length - ev.Evacuation.Distribution.length)
            : 0,
        })),
        name: 'Get All Building Occupancy Information'
      });
    } else {
      res.json({
        error: 'There are no records yet.',
        name: 'Get All Building Occupancy Information'
      }).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({
        error,
        name: 'Get All Building Occupancy Information'
      })
      .end();
  }
};

export const getEvacuationEvent = async (req, res) => {
  const { ID, query } = req.query;
  if (!(ID && query)) {
    invalidAccess(res, 'Get Evacuation Event Information');
    return;
  }
  const populateEvacuees = {
    path: (query === 'pre'
      ? 'PreEvacuation.Evacuated.ID'
      : (query === 'evac'
        ? 'Evacuation.Distribution.ID'
        : (query === 'post'
          ? 'PostEvacuation.Evacuated.ID'
          : 'IT IS AN ERROR'))),
    select: '-_id HouseID Household Latitude Longitude StreetNum District Barangay'
            + ' Municipality Province Region ZipCode YearBlt BuildType StrucType Numstor'
            + ' BuildCon RoofMat BuildUse LandUse legend dateadded createdAt updatedAt'
            + ' UpdatedBy AddedBy',
  };
  const populateOperators = {
    path: (query === 'pre'
      ? 'PreEvacuation.Evacuated.OperatedBy'
      : (query === 'evac'
        ? 'Evacuation.Distribution.OperatedBy'
        : (query === 'post'
          ? 'PostEvacuation.Evacuated.OperatedBy'
          : 'IT IS AN ERROR'))),
    select: '-_id ID Username FirstName MiddleName LastName Suffx Office Position Contact Email'
  };
  try {
    const success = await Evacuation.findById(ID).select('-_id')
      .populate(populateEvacuees)
      .populate(populateOperators)
      .exec();
    res.json({
      success,
      name: 'Get Evacuation Event Information'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Evacuation Event Information'
    }).end();
  }
};

export const getAllEvacuationEvents = async (req, res) => {
  const selectForEvac = '-_id HouseID Household Latitude Longitude StreetNum District Barangay'
            + ' Municipality Province Region ZipCode YearBlt BuildType StrucType Numstor'
            + ' BuildCon RoofMat BuildUse LandUse legend dateadded createdAt updatedAt'
            + ' UpdatedBy AddedBy';
  const selectForOperators = '-_id ID Username FirstName MiddleName '
            + 'LastName Suffx Office Position Contact Email';
  try {
    const success = await Evacuation.find().select('-_id')
      .populate({ path: 'PreEvacuation.Evacuated.ID', select: selectForEvac })
      .populate({ path: 'Evacuation.Distribution.ID', select: selectForEvac })
      .populate({ path: 'PostEvacuation.Evacuated.ID', select: selectForEvac })
      .populate({ path: 'PreEvacuation.Evacuated.OperatedBy', select: selectForOperators })
      .populate({ path: 'Evacuation.Distribution.OperatedBy', select: selectForOperators })
      .populate({ path: 'PostEvacuation.Evacuated.OperatedBy', select: selectForOperators })
      .exec();
    res.json({
      success,
      name: 'Get All Evacuation Event Information'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get All Evacuation Event Information'
    }).end();
  }
};

export const getMyAssignedEvent = async (req, res) => {
  try {
    const success = await Evacuation.findOne({
      $and: [
        { Assigned: { $in: [req.session.user.ID] } },
        {
          $or: [
            { 'PreEvacuation.Ended': { $exists: false } },
            { 'PreEvacuation.Ended': { $gt: new Date() } },
            {
              $and: [
                { 'Evacuation.Started': { $exists: true } },
                {
                  $or: [
                    { 'Evacuation.Ended': { $exists: false } },
                    { 'Evacuation.Ended': { $gt: new Date() } }
                  ]
                }
              ]
            },
            { 'PostEvacuation.Ended': { $exists: false } },
            { 'PostEvacuation.Ended': { $gt: new Date() } }
          ]
        }
      ],
    }, {
      _id: 0,
      'PreEvacuation.Evacuated': 0,
      'Evacuation.Distribution': 0,
      'PostEvacuation.Evacuated': 0
    })
      .populate('CreatedBy', '-_id')
      .populate('Assigned', '-_id')
      .exec();
    res.json({
      success,
      name: 'Get Assigned Evacuation Event'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Assigned Evacuation Event'
    }).end();
  }
};

export const createEvacuationEvent = async (req, res) => {
  const data = req.body;
  if (!data) {
    invalidAccess(res, 'MDRRMO Evacuation Site Registration and Information Creation');
    return;
  }
  try {
    const success = await Evacuation.create({
      ...data,
      Assigned: !data.Assigned.includes(req.session.user.ID)
        ? [...data.Assigned, req.session.user.ID]
        : data.Assigned,
      CreatedBy: req.session.user.ID
    });
    res.json({
      success,
      name: 'MDRRMO Evacuation Site Registration and Information Creation'
    });
  } catch (error) {
    res.status(500).json({
      error,
      name: 'MDRRMO Evacuation Site Registration and Information Creation'
    });
  }
};

export const getAvailableAssign = async (req, res) => {
  try {
    const users = await User.find({ Role: 'user' }).select('-_id ID Username').exec();
    const evacuations = await Evacuation.find({
      $and: [
        { Assigned: { $in: users.map(v => v.ID) } },
        {
          $or: [
            { 'PreEvacuation.Ended': { $exists: false } },
            { 'PreEvacuation.Ended': { $gt: new Date() } },
            {
              $and: [
                { 'Evacuation.Started': { $exists: true } },
                {
                  $or: [
                    { 'Evacuation.Ended': { $exists: false } },
                    { 'Evacuation.Ended': { $gt: new Date() } }
                  ]
                }
              ]
            },
            { 'PostEvacuation.Ended': { $exists: false } },
            { 'PostEvacuation.Ended': { $gt: new Date() } }
          ]
        }
      ]
    }).select('-_id ID Assigned')
      .populate('Assigned', '-_id ID Username')
      .exec();
    const notAvailable = evacuations.reduce((a, b) => (
      b.Assigned.reduce((c, d) => (!c.map(v => v.ID).includes(d.ID)
        ? [...c, { ID: d.ID, Username: d.Username }]
        : c
      ), a)
    ), []);
    const success = users.filter(v => (
      !notAvailable.map(val => val.ID).includes(v.ID)));
    res.json({
      success,
      name: 'Get All Avaialble Users To Be Assigned For Evacuation Process'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get All Avaialble Users To Be Assigned For Evacuation Process'
    }).end();
  }
};

export const removeAssigned = async (req, res) => {
  const { ID, userID } = req.body;
  if (!(ID && userID)) {
    invalidAccess(res, 'Remove Assigned Evacuation');
    return;
  }
  try {
    const result = await Evacuation.findOneAndUpdate(
      {
        ID,
        Assigned: { $in: [userID] },
      },
      {
        $pull: { Assigned: userID }
      },
      {
        returnOriginal: false,
        upsert: false
      }
    );
    const success = result === null ? false : !result.Assigned.includes(userID);
    res.json({
      success,
      name: 'Remove Assigned Evacuation'
    }).end();
  } catch (error) {
    console.log('why error', error);
    res.status(500).json({
      error: {
        message: error.message,
        status: 500,
        statusCode: 500
      },
      name: 'Remove Assigned Evacuation'
    }).end();
  }
};

export const assignUser = async (req, res) => {
  const { ID, userID } = req.body;
  if (!(ID && userID)) {
    invalidAccess(res, 'Assign to Evacuation');
    return;
  }
  try {
    const result = await Evacuation.findOneAndUpdate(
      {
        ID,
        Assigned: { $nin: [userID] }
      },
      {
        $push: { Assigned: { $each: [userID] } }
      },
      {
        returnOriginal: false,
        upsert: false
      }
    );
    const success = result === null ? false : result.Assigned.includes(userID);
    res.json({
      success,
      name: 'Assign to Evacuation'
    }).end();
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500,
        statusCode: 500
      },
      name: 'Assign to Evacuation'
    }).end();
  }
};

export const getAllAssigned = async (req, res) => {
  try {
    const success = await Evacuation.find()
      .select('ID Assigned createdAt updatedAt CreatedBy')
      .where('PreEvacuation.Started')
      .or([
        { $exists: false }, { $and: [{ $exists: true }, { $lt: new Date() }] }])
      .where('PreEvacuation.Ended')
      .or([
        { $exists: false }, { $and: [{ $exists: true }, { $gt: new Date() }] }])
      .where('Evacuation.Started')
      .or([
        { $exists: false }, { $and: [{ $exists: true }, { $lt: new Date() }] }])
      .where('Evacuation.Ended')
      .or([
        { $exists: false }, { $and: [{ $exists: true }, { $gt: new Date() }] }])
      .where('PostEvacuation.Started')
      .or([
        { $exists: false }, { $and: [{ $exists: true }, { $lt: new Date() }] }])
      .where('PostEvacuation.Ended')
      .or([
        { $exists: false }, { $and: [{ $exists: true }, { $gt: new Date() }] }])
      .sort('-createdAt')
      .exec();
    res.json({
      success,
      name: 'Get All Evacuation Assigned'
    }).end();
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        statusCode: 500,
        message: error.message
      },
      name: 'Get All Evacuation Assigned'
    }).end();
  }
};

export const getEvacuationSummary = async (req, res) => {
  const { evacId } = req.query;
  try {
    if (!evacId) {
      invalidAccess(res, 'Get Evacuation Event Print Summary Information');
      return;
    }
    const success = await Evacuation.findById(evacId)
      .populate('PreEvacuation.Evacuated.ID')
      .populate('Evacuation.Distribution.ID')
      .populate('PostEvacuation.Evacuated.ID')
      .populate('Assigned', '-_id Username Role Office Position Barangay FirstName MiddleName LastName')
      .populate('PreEvacuation.Evacuated.ID.Household.Head')
      .populate('PreEvacuation.Evacuated.ID.Household.Members')
      .exec();
    res.json({
      name: 'Get Evacuation Event Print Summary Information',
      message: 'Retrieved',
      data: success,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        statusCode: 500,
        message: error.message
      },
      name: 'Get Evacuation Event Print Summary Information'
    }).end();
  }
};
export const getAssigned = async (req, res) => {
  const { eid, uid } = req.query;
  if (!(eid || uid)) {
    invalidAccess(res, 'Get All Evacuation Assigned');
    return;
  }
  const filter = {};
  if (eid) {
    filter.ID = eid;
  }
  if (uid) {
    filter.Assigned = {
      $in: [uid]
    };
  }
  try {
    const success = await Evacuation.findOne(filter)
      .sort({ createdAt: -1 })
      .limit(1)
      .select('-_id ID Assigned createdAt updatedAt CreatedBy')
      .exec();
    res.json({
      success,
      name: 'Get All Evacuation Assigned'
    }).end();
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        statusCode: 500,
        message: error.message
      },
      name: 'Get All Evacuation Assigned'
    }).end();
  }
};

export const operations = async (req, res) => {
  const {
    evacid, proc, evacuee, present
  } = req.body;
  if (!(evacid && proc)) {
    invalidAccess(res, 'Evacuation Event Operations');
    return;
  }
  const permissions = req.session?.user?.Permissions || [];
  const operator = req.session?.user?.ID;
  const updates = [];

  switch (proc) {
    case 'start-pre-evacuation': {
      // check if creator of the event
      const checkCreator = await Evacuation.findById(evacid)
        .select('-_id CreatedBy')
        .exec();
      if (!(permissions.includes('pre-evacuation-modify')
        || (permissions.includes('pre-evacuation-create')
          && checkCreator?.CreatedBy?.toHexString() === req.session?.user?.ID))) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('PreEvacuation.Started', new Date(Date.now()));
      break;
    }
    case 'start-evacuation':
      if (!permissions.includes('evacuation-modify')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push(
        { 'Evacuation.Distribution': [] },
        { 'Evacuation.Started': new Date(Date.now()) },
      );
      break;
    case 'start-post-evacuation':
      if (!permissions.includes('post-evacuation-modify')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('PostEvacuation.Started', new Date(Date.now()));
      break;
    case 'end-pre-evacuation':
      if (!permissions.includes('pre-evacuation-modify')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('PreEvacuation.Ended', new Date(Date.now()));
      break;
    case 'end-evacuation':
      if (!permissions.includes('evacuation-modify')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('Evacuation.Ended', new Date(Date.now()));
      break;
    case 'end-post-evacuation':
      if (!permissions.includes('post-evacuation-modify')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('PostEvacuation.Ended', new Date(Date.now()));
      break;
    case 'pre-evacuation':
      if (!permissions.includes('pre-evacuation-scan')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('PreEvacuation.Evacuated', {
        ID: evacuee,
        OperatedBy: operator,
        Present: present
      });
      break;
    case 'evacuation':
      if (!permissions.includes('evacuation-scan')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('Evacuation.Distribution', {
        ID: evacuee,
        OperatedBy: operator
      });
      break;
    case 'post-evacuation':
      if (!permissions.includes('post-evacuation-scan')) {
        invalidAccess(res, 'Evacuation Operations');
        return;
      }
      updates.push('PostEvacuation.Evacuated', {
        ID: evacuee,
        OperatedBy: operator
      });
      break;
    default:
      invalidAccess(res, 'Evacuation Operations');
      return;
  }
  try {
    const success = await Evacuation.findById(evacid);
    const evacueeData = await Geotagging.findById(evacuee).populate('CurrentlyEvacuatedAt', 'ID StreetNum District Barangay Municipality Province Region ZipCode').exec();

    if (proc === 'pre-evacuation' && evacueeData?.CurrentlyEvacuatedAt) {
      res.json({
        error: `Household ID ${evacuee} is currently evacuated @ District ${evacueeData.CurrentlyEvacuatedAt.District} ${evacueeData.CurrentlyEvacuatedAt.StreenNum}, ${evacueeData.CurrentlyEvacuatedAt.Barangay}, ${evacueeData.CurrentlyEvacuatedAt.Municipality}, ${evacueeData.CurrentlyEvacuatedAt.Province}, ${evacueeData.CurrentlyEvacuatedAt.Region} ${evacueeData.CurrentlyEvacuatedAt.ZipCode}`,
        name: 'Evacuation Event Operations'
      }).end();
      return;
    }

    if (proc === 'pre-evacuation'
      || proc === 'post-evacuation'
      || proc === 'evacuation') {
      const forUpdate = updates.shift()
        .split('.')
        .reduce((a, b) => (a === null ? success[b] : a[b]), null);
      forUpdate.push(updates.pop());
    } else if (proc === 'start-evacuation') {
      updates.forEach(keys => {
        const key = Object.keys(keys).shift();
        const value = Object.values(keys).shift();
        success.set(key, value);
      });
    } else if (success?.Assigned.includes(operator)) {
      success.set(updates.shift(), updates.pop());
    }
    await success.save({ validateModifiedOnly: true, validateBeforeSave: true });
    if (proc === 'pre-evacuation') {
      if (success?.MaxCapacity
          === success?.PreEvacuation?.Evacuated?.length
        && !success?.PreEvacuation?.Ended
      ) {
        success.set('PreEvacuation.Ended', new Date(Date.now()));
        await success.save({ validateModifiedOnly: true, validateBeforeSave: true });
      }
    } else if (proc === 'evacuation') {
      if (success?.PreEvacuation?.Ended
        && (success?.PreEvacuation?.Evacuated.length
            === success?.Evacuation?.Distribution?.length)
        && !success?.Evacuation?.Ended
      ) {
        success.set('Evacuation.Ended', new Date(Date.now()));
        await success.save({ validateModifiedOnly: true, validateBeforeSave: true });
      }
    } else if (proc === 'post-evacuation') {
      if (success?.PreEvacuation?.Ended
        && (success?.PreEvacuation?.Evacuated?.length
            === success?.Evacuation?.Evacuated?.length)
        && !success?.PostEvacuation?.Ended
      ) {
        success.set('Evacuation.Ended', new Date(Date.now()));
        await success.save({ validateModifiedOnly: true, validateBeforeSave: true });
      }
    }
    if ((proc === 'pre-evacuation' || proc === 'post-evacuation') && success && evacueeData) {
      await Geotagging.findOneAndUpdate(
        { _id: evacueeData.ID },
        proc === 'pre-evacuation'
          ? ({ CurrentlyEvacuatedAt: success.ID })
          : ({ $unset: { CurrentlyEvacuatedAt: 1 } }),
        {
          returnOriginal: false,
          upsert: false
        }
      );
    }

    res.json({
      success,
      name: 'Evacuation Event Operations'
    }).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      name: 'Evacuation Event Operations'
    }).end();
  }
};

function invalidAccess(response, name) {
  response.status(401).json({
    error: {
      status: 404,
      statusCode: 404,
      message: 'Unauthorized Access'
    },
    name
  }).end();
}
