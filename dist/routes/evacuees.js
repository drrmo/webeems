"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _controllers = require("../controllers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.get('/exists', _controllers.session.verifiedLogin, _controllers.evacuee.getEvacueeByQRExists);
router.get('/', _controllers.session.verifiedLogin, _controllers.evacuee.getEvacueeByQR);
router.get('/all', _controllers.session.verifiedAdmin, _controllers.evacuee.getAllEvacueeInfo);
router.post('/create', _controllers.session.verifiedAdmin, _controllers.evacuee.createEvacueeInfo);
var _default = exports.default = router;