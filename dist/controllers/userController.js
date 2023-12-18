"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoginInfo = exports.deleteUserAcount = void 0;
exports.getPasswordHash = getPasswordHash;
exports.updateUserPermissions = exports.updateUserInfo = exports.registerUser = exports.logoutCredentials = exports.getUsersPermissions = exports.getUsersInfo = exports.getUsernameExists = exports.getUserInfoById = exports.getUserInfo = exports.getUserExists = exports.getUserCredentials = void 0;
var _bcryptjs = require("bcryptjs");
var _models = require("../models");
// eslint-disable-next-line consistent-return
const updateUserPermissions = async (req, res) => {
  const {
    username
  } = req.params;
  const {
    role
  } = req.query;
  const data = req.body || [];
  try {
    const success = await _models.User.findOneAndUpdate({
      Username: username,
      Role: role
    }, {
      Permissions: [...data],
      // eslint-disable-next-line
      UpdatedBy: req.session.user.ID
    }, {
      returnOriginal: false,
      upsert: false
    }).select('-_id Username Role Permissions').exec();
    return res.json({
      success,
      name: 'Update User Permissions'
    }).end();
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        statusCode: 500,
        message: error.message || 'Failed to Update User Permissions'
      },
      name: 'Update User Permissions'
    }).end();
  }
};
exports.updateUserPermissions = updateUserPermissions;
const getUsersPermissions = async (req, res) => {
  const {
    username
  } = req.query;
  try {
    const success = username ? await _models.User.findOne({
      Username: username
    }).select('-_id ID Username Role Permissions').exec() : await _models.User.find().select('-_id ID Username Role Permissions').exec();
    res.json({
      success,
      name: 'Get All Users Permissions'
    });
    return;
  } catch (error) {/* empty */}
  res.status(500).json({
    error: {
      message: 'Something went wrong.',
      status: 500,
      statusCode: 500
    },
    name: 'Get All Users Permissions'
  });
};
exports.getUsersPermissions = getUsersPermissions;
async function getPasswordHash(pwd) {
  const salt = await (0, _bcryptjs.genSalt)(10);
  return (0, _bcryptjs.hash)(pwd, salt);
}
const registerUser = async (req, res) => {
  const formBody = req.body;
  if (!formBody || !formBody?.Password) {
    invalidAccess(res, 'Register User/Admin Account');
    return;
  }
  // eslint-disable-next-line camelcase
  const Password_hash = await getPasswordHash(formBody.Password);
  // eslint-disable-next-line
  const AddedBy = req.session.user?.ID.toString();
  const Permissions = formBody.Role === 'admin' ? ['user-add', 'user-update', 'user-delete', 'admin-create', 'admin-update', 'admin-delete', 'permissions-modify', 'pre-evacuation-create', 'pre-evacuation-scan', 'pre-evacuation-modify', 'pre-evacuation-delete', 'evacuation-scan', 'evacuation-modify', 'post-evacuation-scan', 'post-evacuation-modify', 'post-evacuation-print', 'view-info'] : ['view-info', 'pre-evacuation-scan', 'evacuation-scan', 'post-evacuation-scan'];
  const formFinal = Object.keys(formBody).reduce((a, b) => b === 'Password' || b === 'PasswordRepeat' ? a : {
    ...a,
    [b]: formBody[b]
  }, {});
  try {
    const success = await _models.User.create({
      ...formFinal,
      Password_hash,
      AddedBy,
      Permissions
    });
    res.json({
      success,
      name: 'Register User/Admin Account'
    }).end();
    return;
  } catch (error) {
    console.log(error);
  }
  res.status(500).json({
    error: {
      status: 500,
      statusCode: 500,
      message: 'Failed to Register New User/Admin Account'
    },
    name: 'Register User/Admin Account'
  }).end();
};

// eslint-disable-next-line consistent-return
exports.registerUser = registerUser;
const deleteUserAcount = async (req, res) => {
  const {
    username
  } = req.params;
  const {
    role
  } = req.query;
  if (!(username && role)) {
    return res.status(400).json({
      error: {
        message: 'Invalid Request!',
        status: 400,
        statusCode: 400
      },
      name: 'Delete User Account'
    });
  }
  try {
    const success = await _models.User.findOneAndDelete({
      Username: username,
      Role: role
    });
    return res.json({
      success,
      name: 'Delete User Account'
    });
  } catch (error) {/* empty */}
  res.status(500).json({
    error: {
      message: 'Failed to Remove Account!',
      status: 500,
      statusCode: 500
    },
    name: 'Delete User Account'
  });
};
exports.deleteUserAcount = deleteUserAcount;
const getUsersInfo = async (req, res) => {
  const {
    role,
    populate
  } = req.query;
  const toBePopulated = populate ? populate.split(',') : [];
  const filter = role ? {
    Role: role
  } : {};
  try {
    const findUser = toBePopulated.reduce((a, b) => a.populate(b, '-_id ID Username'), _models.User.find(filter).select('-_id ID Username Office Position Barangay FirstName MiddleName LastName Suffx Contact Email createdAt updatedAt UpdatedBy AddedBy'));
    const user = await findUser.exec();
    return res.json({
      success: user,
      name: 'Get Users Info'
    }).end();
  } catch (e) {
    console.log(e);
  }
  return res.status(500).json({
    error: {
      message: 'Something went wrong.',
      status: 500,
      statusCode: 500
    },
    name: 'Get Users Info'
  });
};

// eslint-disable-next-line consistent-return
exports.getUsersInfo = getUsersInfo;
const updateUserInfo = async (req, res) => {
  const {
    username
  } = req.params;
  const {
    role
  } = req.query;
  const data = req.body || {};
  if (!(username && role && data)) {
    return res.status(400).json({
      error: {
        message: 'Invalid Request!',
        status: 400,
        statusCode: 400
      },
      name: 'Update User Info'
    });
  }
  try {
    const success = await _models.User.findOneAndUpdate({
      Username: username,
      Role: role
    }, {
      ...data,
      // eslint-disable-next-line
      UpdatedBy: req.session.user.ID
    }, {
      returnOriginal: false,
      upsert: false
    }).select('Username Office Position Barangay FirstName MiddleName LastName Suffx Contact ' + 'Email Permissions createdAt updatedAt UpdatedBy AddedBy').populate('UpdatedBy', 'Username').populate('AddedBy', 'Username').exec();
    if (success) {
      return res.json({
        success,
        name: 'Update User Info'
      });
    }
  } catch (e) {/* empty */}
  res.status(404).json({
    error: {
      message: 'No User Found / Failed to Updated User',
      status: 404,
      statusCode: 404
    },
    name: 'Update User Info'
  });
};

// eslint-disable-next-line consistent-return
exports.updateUserInfo = updateUserInfo;
const getUserInfo = async (req, res) => {
  const {
    username
  } = req.params;
  const {
    role
  } = req.query;
  if (!(username && role)) {
    return res.status(404).json({
      error: {
        message: 'User not found!',
        status: 404,
        statusCode: 404
      },
      name: 'Get User Info by Username'
    });
  }
  const user = await _models.User.findOne({
    Username: username,
    Role: role
  }).select('Username Office Position Barangay FirstName MiddleName LastName Suffx Contact ' + 'Email Permissions createdAt updatedAt UpdatedBy AddedBy').populate('UpdatedBy', 'Username').populate('AddedBy', 'Username').exec();
  if (!user) {
    return res.json({
      error: {
        message: 'User not found!',
        status: 404,
        statusCode: 404
      },
      name: 'Get User Info by Username'
    });
  }
  res.json({
    success: user,
    name: 'Get User Info by Username'
  });
};
exports.getUserInfo = getUserInfo;
const getUserExists = (req, res) => {
  res.json({
    success: false
  });
};

// eslint-disable-next-line consistent-return
exports.getUserExists = getUserExists;
const getLoginInfo = (req, res) => {
  // eslint-disable-next-line no-shadow
  const User = req.session.user;
  if (!User) {
    return res.status(404).json({
      error: {
        message: 'User not logged in.',
        status: 404,
        statusCode: 404
      },
      name: 'Login Info'
    });
  }
  res.json({
    success: User,
    name: 'Login Info'
  });
};
exports.getLoginInfo = getLoginInfo;
const logoutCredentials = async (req, res) => {
  try {
    const logout = await req.removeSession(req, res);
    res.json({
      success: logout,
      name: 'Logout Session'
    });
  } catch (error) {
    res.json({
      success: true,
      name: 'Logout Session'
    });
  }
};
exports.logoutCredentials = logoutCredentials;
const getUsernameExists = async (req, res) => {
  const {
    v,
    role
  } = req.query;
  const query = role ? {
    Username: v,
    Role: role
  } : {
    Username: v
  };
  try {
    const doc = await _models.User.findOne(query);
    if (doc) {
      return res.json({
        success: true
      });
    }
  } catch (error) {/* empty */}
  return res.json({
    success: false
  });
};
exports.getUsernameExists = getUsernameExists;
const getUserCredentials = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;
    if (!username && !password) {
      res.json({
        error: {
          message: 'Username and password are required.',
          name: 'User Credentials'
        }
      });
      return;
    }
    const data = await _models.User.findOne({
      Username: username
    });
    if (data && (await (0, _bcryptjs.compare)(password, data.Password_hash))) {
      // check for online statuses
      const session = await _models.Session.find({
        // eslint-disable-next-line max-len
        UserID: data.ID,
        ExpiresIn: {
          $gte: Date.now()
        }
      });
      const sessionCount = session.length;
      if (sessionCount > 0) {
        // check if the logged in is not the same device
        const hasMySession = session.reduce((initial, value) => {
          if (value.UserIDStr === data.ID && value.IPAddress === req.locals.IPAddress && value.UserAgent === req.locals.UserAgent) {
            return true;
          }
          return initial;
        }, false);
        if (!hasMySession) {
          res.status(403).send({
            error: {
              message: 'Account Limit Reached. Account is already logged in.',
              status: 403,
              statusCode: 403
            },
            name: 'User Credentials'
          });
          return;
        }
        // else then it is the same device. proceed to login
      }
      const saved = await req.saveSession(req, res, data.ID);
      if (saved) {
        res.status(200).json({
          saved,
          name: 'User Credentials'
        });
      } else {
        throw new Error('Something went wrong! Please Try Again.');
      }
    } else {
      res.json({
        error: {
          message: 'Invalid Username and Password!'
        },
        name: 'User Credentials'
      });
    }
  } catch (err) {
    console.log('ERROR', err);
    res.status(500).json({
      error: {
        message: err.message
      },
      name: 'User credentials'
    });
  }
};
exports.getUserCredentials = getUserCredentials;
const getUserInfoById = async (req, res) => {
  try {
    const {
      ID
    } = req.query;
    const success = await _models.User.findById(ID).select('ID Username Role Office Position Barangay Email Contact FirstName MiddleName LastName Suffx Permissions');
    // eslint-disable-next-line
    String(success.ID) === token ? res.json({
      success,
      name: 'Get User Info by ID'
    }) : res.json({
      name: 'Get User Info by ID',
      error: {
        message: 'User not found',
        status: 404,
        statusCode: 404
      }
    });
  } catch (err) {
    res.status(500).json({
      name: 'Get User Info by ID',
      error: 'Opps! Something went wrong.'
    });
  }
};
exports.getUserInfoById = getUserInfoById;
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