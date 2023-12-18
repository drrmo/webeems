"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _controllers = require("../controllers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();

/* LOGIN users */
router.post('/login', _controllers.user.getUserCredentials);

/* LOGOUT user */
router.post('/logout', _controllers.user.logoutCredentials);

/* Get Logged In User Info */
router.get('/logininfo', _controllers.session.verifiedLogin, _controllers.session.updateCredentials, _controllers.user.getLoginInfo);

/* Get User Info by Username */
router.get('/user/:username', _controllers.session.verifiedLogin, _controllers.user.getUserInfo);

/* Get user session info by ID */
router.get('/user', _controllers.session.verifiedLogin, _controllers.user.getUserInfoById);

/* Check user if exists by Username */
router.get('/exists/username', _controllers.session.verifiedAdmin, _controllers.user.getUsernameExists);

/* Check user if exists by ID */
router.get('/exists', _controllers.session.verifiedAdmin, _controllers.user.getUserExists);

/* Get Users Info Data with Permissions */
router.get('/permissions', _controllers.session.verifiedAdmin, _controllers.user.getUsersPermissions);

/* Get Users Info Data */
router.get('/', _controllers.session.verifiedAdmin, _controllers.user.getUsersInfo);

/* REGISTER users */
router.post('/add/user', _controllers.session.verifiedLogin, _controllers.session.updateCredentials, _controllers.user.registerUser);

/* Update User Info */
router.put('/update/:username', _controllers.session.verifiedAdmin, _controllers.session.updateCredentials, _controllers.user.updateUserInfo);

/* Update User Permissions */
router.put('/permissions/update/:username', _controllers.session.verifiedAdmin, _controllers.session.updateCredentials, _controllers.user.updateUserPermissions);

/* Delete User Info */
router.delete('/delete/:username', _controllers.session.verifiedAdmin, _controllers.session.updateCredentials, _controllers.user.deleteUserAcount);
var _default = exports.default = router;