// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import CryptoJS from 'crypto-js';
import cookieParser from 'cookie-parser';
import { Session, User } from '../models';

function encryptPayload(req, payload = {}) {
  return new Promise((resolve, reject) => {
    try {
      resolve(CryptoJS.AES.encrypt(JSON.stringify(payload), req.secretKey.secret)
        .toString());
    } catch (e) {
      reject(e);
    }
  });
}

function decryptPayload(req, encryptedPayload = '') {
  return new Promise((resolve, reject) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPayload, req.secretKey.secret);
      resolve(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
    } catch (e) {
      reject(e);
    }
  });
}

export async function updateCredentials(req, res, next) {
  if (req.session?.user && req.session?.exp > (Date.now() / 1000)) {
    try {
      const { ID } = req.session.user;
      await req.saveSession(req, res, ID);
    } catch (error) {
      console.log("UPDATE ERROR!!", error);
    }
  }
  next();
}

export async function createDefaultAdmin(req, res, next) {
  try {
    const currentCount = await User.count();
    const results = [];
    if (currentCount === 0) {
      results.push(await User.create({
        Username: 'admin',
        Password_hash: await getPasswordHash('password'),
        Role: 'admin',
        Office: 'MDRRMO',
        Position: 'IT Administrator',
        Barangay: '7',
        FirstName: getRandomName({
          first: true,
          seed: getRandomCount(251, Date.now())
        }),
        MiddleName: getRandomName({
          middle: true,
          seed: getRandomCount(252, Date.now())
        }),
        LastName: getRandomName({
          last: true,
          seed: getRandomCount(251, Date.now())
        }),
        Suffx: getRandom({ dictionary: ['', 'Jr.', 'Sr.', 'I', '', ''] }),
        Contact: getRandomContact(),
        Email: getRandomEmail({
          domain: 'webeemsmdrrmo.com',
          seed: getRandomCount(253, Date.now())
        }),
        Permissions: [
          'user-add', 'user-update', 'user-delete', 'admin-create', 'admin-update', 'admin-delete', 'permissions-modify',
          'pre-evacuation-create', 'pre-evacuation-scan', 'pre-evacuation-modify', 'pre-evacuation-delete',
          'evacuation-scan', 'evacuation-modify', 'post-evacuation-scan', 'post-evacuation-modify', 'post-evacuation-print',
          'view-info'
        ]
      }));
    }
  } catch (error) {
    return;
  } finally {
    next();
  }
}

// eslint-disable-next-line consistent-return
export async function verifiedLogin(req, res, next) {
  if (!req.session) {
    return res.status(401).json({
      error: {
        statusCode: 401,
        status: 401,
        message: 'Unauthorized Access'
      },
      name: 'Unauthorized Access'
    });
  }
  next();
}

// eslint-disable-next-line consistent-return
export async function verifiedAdmin(req, res, next) {
  if (!req.session) {
    return res.status(401).json({
      error: {
        statusCode: 401,
        status: 401,
        message: 'Unauthorized Access'
      },
      name: 'Unauthorized Access'
    });
  }
  if (req.session.user.Role !== 'admin') {
    return res.status(401).json({
      error: {
        statusCode: 401,
        status: 401,
        message: 'Unauthorized Access'
      },
      name: 'Unauthorized Access'
    });
  }
  next();
}

async function removeSession(req, res) {
  const Payload = req.signedCookies?.token;
  const { IPAddress, UserAgent } = req.locals;
  if (!Payload) {
    const token = await jwt.sign(
      { }, req.secretKey.secret, { expiresIn: 0 }
    );
    const Payload2 = await encryptPayload(req, { token });
    try {
      // look for online session in this device / web browser
      const result = await Session.updateMany(
        {
          IPAddress,
          UserAgent,
          ExpiresIn: { $gte: Date.now() }
        },
        {
          Payload: Payload2,
          ExpiresIn: new Date(Date.now() - 1)
        }
      );

      const success = result.acknowledged && result.matchedCount > 0 && result.modifiedCount > 0;
      if (success) {
        res.clearCookie('token');
      }
    } catch (error) {
      return false;
    }
  }
  const { user, exp } = req.session;
  if (exp && exp > (Date.now() / 1000)) {
    const ExpiresIn = new Date(Date.now() - 1000);
    try {
      // look for online session in this device / web browser
      await Session.findOneAndUpdate(
        {
          UserID: user?.ID,
          IPAddress,
          UserAgent,
          Payload,
          ExpiresIn: { $gte: Date.now() }
        },
        { ExpiresIn },
        {
          returnOriginal: false,
          upsert: false
        }
      );
      res.clearCookie('token');
      req.session = {};
      return true;
    } catch (error) {
      return false;
    }
  }
  res.clearCookie('token');
  return true;
}

async function saveSession(req, res, ID) {
  const { IPAddress, UserAgent } = req.locals;
  let user = null;
  try {
    user = await User.findById(ID).select(
      '-_id ID Username Role Office Position Barangay Email Contact'
      + ' FirstName MiddleName LastName Suffx Permissions createdAt updatedAt CreatedBy UpdatedBy'
    ).exec();
  } catch (error) {
    console.log("have error on adding session", error);
  }
  if (user) {
    const UserID = user.ID;
    const token = await jwt.sign(
      { user }, req.secretKey.secret, { expiresIn: req.secretKey.expiresIn }
    );
    try {
      req.session = await jwt.verify(token, req.secretKey.secret);
      req.session.token = token;
      const ExpiresIn = new Date(req.session.exp * 1000);
      const Payload = await encryptPayload(req, { token });
      const docSaved = await Session.findOneAndUpdate(
        {
          IPAddress,
          UserAgent,
          UserID
        },
        {
          UserID,
          IPAddress,
          UserAgent,
          Payload,
          ExpiresIn
        },
        {
          returnOriginal: false,
          upsert: true
        }
      );
      if (docSaved) {
        res.clearCookie('token');
        res.cookie(
          'token',
          cookieParser.signedCookie(
            docSaved.Payload,
            req.secretKey.value
          ),
          {
            secure: true,
            signed: true,
            expires: new Date(ExpiresIn)
          }
        );
      }
      return user;
    } catch (error) {
      console.log("have an error on updatting session", error);
      return null;
    }
  }
  return null;
}

// eslint-disable-next-line consistent-return
export default (secret = 'webeems', expiresIn = (60 * 24 * 7)) => async (req, res, next) => {
  req.secretKey = {
    secret,
    expiresIn
  };
  req.saveSession = saveSession;
  req.removeSession = removeSession;
  req.locals = {
    IPAddress: req.socket.remoteAddress,
    UserAgent: req.headers ? req.headers['user-agent'] : undefined
  };

  try {
    const payload = req.signedCookies?.token;
    if (!payload) {
      return next();
    }
    // then the cookie
    const { token } = await decryptPayload(req, payload);
    if (token) {
      req.session = await jwt.verify(token, req.secretKey.secret);
      req.session.token = token;
    }
  } catch (error) {
    res.clearCookie('token');
  }
  next();
};
