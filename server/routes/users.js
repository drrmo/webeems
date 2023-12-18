import express from 'express';
import { user, session } from '../controllers';

const router = express.Router();

/* LOGIN users */
router.post('/login', user.getUserCredentials);

/* LOGOUT user */
router.post('/logout', user.logoutCredentials);

/* Get Logged In User Info */
router.get('/logininfo', session.verifiedLogin, session.updateCredentials, user.getLoginInfo);

/* Get User Info by Username */
router.get('/user/:username', session.verifiedLogin, user.getUserInfo);

/* Get user session info by ID */
router.get('/user', session.verifiedLogin, user.getUserInfoById);

/* Check user if exists by Username */
router.get('/exists/username', session.verifiedAdmin, user.getUsernameExists);

/* Check user if exists by ID */
router.get('/exists', session.verifiedAdmin, user.getUserExists);

/* Get Users Info Data with Permissions */
router.get('/permissions', session.verifiedAdmin, user.getUsersPermissions);

/* Get Users Info Data */
router.get('/', session.verifiedAdmin, user.getUsersInfo);

/* REGISTER users */
router.post('/add/user', session.verifiedLogin, session.updateCredentials, user.registerUser);

/* Update User Info */
router.put('/update/:username', session.verifiedAdmin, session.updateCredentials, user.updateUserInfo);

/* Update User Permissions */
router.put('/permissions/update/:username', session.verifiedAdmin, session.updateCredentials, user.updateUserPermissions);

/* Delete User Info */
router.delete('/delete/:username', session.verifiedAdmin, session.updateCredentials, user.deleteUserAcount);

export default router;
