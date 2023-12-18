"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEvacueeByQRExists = exports.getEvacueeByQR = exports.getAllEvacueeInfo = exports.createEvacueeInfo = void 0;
var _models = require("../models");
const createEvacueeInfo = async (req, res) => {
  const data = req.body;
  if (!data) {
    invalidAccess(res, 'Add Evacuee Information Profile');
  }
  try {
    const success = await _models.Geotagging.create(data);
    res.json({
      success,
      name: 'Add Evacuee Information Profile'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Add Evacuee Information Profile'
    }).end();
  }
};
exports.createEvacueeInfo = createEvacueeInfo;
const getAllEvacueeInfo = async (req, res) => {
  try {
    const success = await _models.Geotagging.find({}, {
      _id: 0,
      ID: 0
    });
    res.json({
      success,
      name: 'Get all Evacuation Information'
    }).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      name: 'Get all Evacuation Information'
    }).end();
  }
};
exports.getAllEvacueeInfo = getAllEvacueeInfo;
const getEvacueeByQRExists = async (req, res) => {
  const {
    evacId
  } = req.query;
  if (!evacId) {
    invalidAccess(res, 'Get Evacuees Info by QR ID');
    return;
  }
  const validPermissions = ['pre-evacuation-scan', 'pre-evacuation-modify', 'evacuation-scan', 'evacuation-modify', 'post-evacuation-scan', 'post-evacuation-modify'];
  if (!validPermissions.reduce((a, b) => a || req.session?.user?.Permissions.includes(b), false)) {
    invalidAccess(res, 'Check Evacuee ID Exists');
    return;
  }
  try {
    const evac = await _models.Geotagging.findById(evacId).populate('CurrentlyEvacuatedAt', 'ID StreetNum District Barangay Municipality Province Region ZipCode').exec();
    const CurrentlyEvacuatedAt = evac?.CurrentlyEvacuatedAt;
    res.json({
      success: evac !== null,
      CurrentlyEvacuatedAt,
      name: 'Check Evacuee ID Exists'
    }).end();
    return;
  } catch (error) {/* empty */}
  res.json({
    success: false,
    name: 'Check Evacuee ID Exists'
  }).end();
};
exports.getEvacueeByQRExists = getEvacueeByQRExists;
const getEvacueeByQR = async (req, res) => {
  const {
    evacId
  } = req.query;
  if (!evacId) {
    invalidAccess(res, 'Get Evacuees Info by QR ID');
    return;
  }
  const validPermissions = ['pre-evacuation-scan', 'pre-evacuation-modify', 'evacuation-scan', 'evacuation-modify', 'post-evacuation-scan', 'post-evacuation-modify'];
  if (!validPermissions.reduce((a, b) => a || req.session?.user?.Permissions.includes(b), false)) {
    invalidAccess(res, 'Get Evacuees Info by QR ID');
    return;
  }
  try {
    const success = await _models.Geotagging.findById(evacId).select('-_id -ID').populate('CurrentlyEvacuatedAt', 'ID StreetNum District Barangay Municipality Province Region ZipCode').exec();
    res.json({
      success,
      name: 'Get Evacuees Info by QR ID'
    }).end();
  } catch (error) {
    res.status(500).json({
      error,
      name: 'Get Evacuees Info by QR ID'
    }).end();
  }
};
exports.getEvacueeByQR = getEvacueeByQR;
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