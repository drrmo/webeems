"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _controllers = require("../controllers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.get('/my/assigned', _controllers.session.verifiedLogin, _controllers.evac.getMyAssignedEvent);
router.get('/event', _controllers.session.verifiedLogin, _controllers.evac.getEvacuationEvent);
router.get('/event/all', _controllers.session.verifiedLogin, _controllers.evac.getAllEvacuationEvents);
router.get('/event/admin', _controllers.session.verifiedAdmin, _controllers.evac.getAdminAssignedEvent);
router.get('/assigns', _controllers.session.verifiedAdmin, _controllers.evac.getAllAssigned);
router.get('/assigned', _controllers.session.verifiedLogin, _controllers.evac.getAssigned);
router.get('/assign/available', _controllers.session.verifiedLogin, _controllers.evac.getAvailableAssign);
router.get('/occupancies', _controllers.session.verifiedLogin, _controllers.evac.getBuildingOccupancies);
router.get('/event/available/start', _controllers.session.verifiedAdmin, _controllers.evac.getAvailableEventIDStart);
router.get('/event/available/scan', _controllers.session.verifiedAdmin, _controllers.evac.getAvailableEventIDScan);
router.get('/event/available/end', _controllers.session.verifiedAdmin, _controllers.evac.getAvailableEventIDEnd);
router.get('/summary', _controllers.session.verifiedLogin, _controllers.evac.getEvacuationSummary);
router.post('/create', _controllers.session.verifiedLogin, _controllers.session.updateCredentials, _controllers.evac.createEvacuationEvent);
router.put('/assign/add', _controllers.session.verifiedAdmin, _controllers.session.updateCredentials, _controllers.evac.assignUser);
router.put('/assign/remove', _controllers.session.verifiedAdmin, _controllers.session.updateCredentials, _controllers.evac.removeAssigned);
router.put('/operations', _controllers.session.verifiedLogin, _controllers.session.updateCredentials, _controllers.evac.operations);
var _default = exports.default = router;