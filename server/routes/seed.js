import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  uniqueNamesGenerator, adjectives, colors, animals, names
} from 'unique-names-generator';
// eslint-disable-next-line import/no-extraneous-dependencies
import seedrandom from 'seedrandom';
import { Geotagging, User } from '../models';
import { getPasswordHash } from '../controllers/userController';
import { verifiedAdmin, createDefaultAdmin } from '../controllers/sessionToken';
import Evacuation from '../models/Evacuation';

const router = express.Router();

function getRandomName({
  first, middle, last, style = 'capital', seed = Date.now()
}) {
  const firstname = first ? Array.from({ length: (getRandomCount(3) % 3) + 1 }).fill(true) : [false];
  const ln = [...firstname, middle, last].filter(v => v === true).length;
  const length = ln === 0 ? 3 : ln;
  const dictionaries = Array.from({ length }).map(() => names);
  return uniqueNamesGenerator({
    dictionaries,
    separator: ' ',
    length,
    style,
    seed,
  });
}

function getRandomUsername({
  length = (Math.floor(Math.random() * 90) % 3) + 1,
  style = 'lower',
  seed = Date.now()
}) {
  return uniqueNamesGenerator({
    dictionaries: [animals, adjectives, colors, names],
    separator: ['-', '.', '_'][Math.floor(Math.random() * 90) % 3],
    length,
    style,
    seed,
  });
}

function getRandomEmail({
  domain = 'test.com',
  length = (Math.floor(Math.random() * 90) % 3) + 1,
  style = 'lower',
  seed = Date.now()
}) {
  return `${uniqueNamesGenerator({
    dictionaries: [animals, adjectives, colors, names],
    separator: ['-', '.', '_'][Math.floor(Math.random() * 90) % 3],
    length,
    style,
    seed,
  })}@${domain}`;
}

function getRandomOccupation({
  dictionary = [
    'Student',
    'Customer Support Representative',
    'Administrative Assistant',
    'Content Writer',
    'Sales Representative',
    'Marketing Coordinator',
    'IT Support Specialist',
    'Account Manager',
    'Receptionist',
    'Data Entry Operator',
    'Social Media Specialist',
    'Project Coordinator',
    'Event Coordinator',
    'Research Assistant',
    'Virtual Assistant',
    'Technical Support Engineer',
    'Quality Assurance Tester',
    'Business Analyst',
    'Community Manager',
    'SEO Specialist',
    'Online Tutor',
  ],
  additionalDictionary = [],
  style = 'capital',
  seed = Date.now(),
}) {
  const dictionaries = [...dictionary, ...additionalDictionary];
  const rand = seedrandom(seed);
  return mapDictionaryRandom(dictionaries, style, rand);
}

function mapDictionaryRandom(dictionaries, style, rand) {
  // eslint-disable-next-line no-nested-ternary
  return [dictionaries[Math.floor(rand() * dictionaries.length)]].map(v => (style === 'capital'
    ? v.split(' ')
      .map(val => `${val[0].toUpperCase()}${val.substring(1)
        .toLowerCase()}`)
      .join(' ')
    // eslint-disable-next-line no-nested-ternary
    : (style === 'upperCase'
      ? v.toUpperCase()
      : (style === 'lowerCase'
        ? v.toLowerCase()
        : v)
    ))).join();
}

function getRandom({
  dictionary = [names],
  style,
  seed = Date.now(),
}) {
  const rand = seedrandom(seed);
  const dictionaries = dictionary.reduce((a, b) => (b instanceof Array
    ? [...a, ...b]
    : (b instanceof Object
      ? [...a, b]
      : [...a, b.toString()])), []);
  // eslint-disable-next-line no-nested-ternary
  return mapDictionaryRandom(dictionaries, style, rand);
}

function getRandomContact() {
  return `+639${Math.floor(
    (10 ** 8) + Math.random() * 9 * (10 ** 8)
  )}`;
}

const getRandomCount = (random = 1, start = 0) => start + Math.floor(Math.random() * random);

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'shuffle', {
  value() {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
  }
});

router.get('/', createDefaultAdmin, (req, res) => {
  res.json({"message": "Default Admin has been created."}).end();
});

router.get('/add/geotagging', verifiedAdmin, async (req, res, next) => {
  async function getResult() {
    const headAge = getRandomCount(60, 25);
    const memberCount = getRandomCount(10);
    const memberNames = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < memberCount; i++) {
      memberNames.push({
        Name: getRandomName({
          first: true,
          middle: getRandomCount(2) % 2 === 0,
          last: true,
          seed: getRandomCount(10000, Date.now())
        }),
        Suffx: [undefined, 'Jr.', 'Sr.', 'I', 'II', 'MIT'][getRandomCount(6)],
        Age: headAge + Math.floor(Math.random() * (85 - headAge)),
        Occ: getRandomOccupation({ seed: getRandomCount(5000, Date.now()) }),
        ConNum: getRandomContact()
      });
    }
    const Household = {
      Head: {
        Name: getRandomName({
          first: true,
          middle: getRandomCount(2) % 2 === 0,
          last: true,
          seed: getRandomCount(10000, Date.now())
        }),
        Suffx: [undefined, 'Jr.', 'Sr.', 'I', 'II', 'MIT'][getRandomCount(6)],
        Age: headAge,
        Occ: getRandomOccupation({ seed: getRandomCount(4300, Date.now()) }),
        ConNum: getRandomContact()
      },
      Members: memberNames
    };
    try {
      return await Geotagging.create({
        Household,
        Latitude: Math.random() * 1000 * [-1, 1][getRandomCount(2)],
        Longitude: Math.random() * 1000 * [-1, 1][getRandomCount(2)],
        District: (getRandomCount(15)).toString(),
        Barangay: getRandomName({
          last: true,
          seed: getRandomCount(Math.random() * 10500, Date.now())
        }),
        Municipality: 'Nasipit',
        Province: 'Agusan del Norte',
        Region: 'XIII',
        ZipCode: '8602',
        YearBlt: getRandomCount(123, 1901),
        BuildType:
          ['duplex', 'single', 'apartment', 'squatters', 'hotel'][getRandomCount(5)],
        StrucType: getRandomName({
          first: true,
          seed: getRandomCount(2200, Date.now())
        }),
        NumStor: getRandomCount(5),
        NumOccs: getRandomCount(20),
        BuildCon: getRandomName({
          first: true,
          seed: getRandomCount(2202, Date.now())
        }),
        RoofMat: getRandomName({
          first: true,
          seed: getRandomCount(2203, Date.now())
        }),
        BuildUse: getRandomName({
          first: true,
          seed: getRandomCount(2204, Date.now())
        }),
        LandUse: getRandomName({
          first: true,
          seed: getRandomCount(2205, Date.now())
        }),
        legend: `${getRandomCount(4)} storey`,
      });
    } catch (error) {
      return getResult();
    }
  }
  const cnt = req.query.count ? Math.min(500, Math.max(1, Number(req.query.count))) : 1;
  const results = await Promise.all(Array.from({ length: cnt }).map(() => getResult()));
  res.json(results.map((data, i) => ({ number: i + 1, data })));
});

router.get('/add/user', verifiedAdmin, async (req, res, next) => {
  const cnt = req.query.count ? Math.min(500, Math.max(1, Number(req.query.count))) : 1;
  const results = [];
  let currentCount;
  try {
    currentCount = await User.count().exec();
    if (currentCount === 0 || await User.findOne({ Username: 'admin' }).count().exec() === 0) {
      results.push(await User.create({
        Username: 'admin',
        Password_hash: await getPasswordHash('password'),
        Role: 'admin',
        Office: 'MDRRMO Nasipit',
        Position: req.query.position || 'IT Administrator',
        Barangay: req.query.barangay || 'Punta',
        FirstName: req.query.firstname || getRandomName({
          first: true,
          seed: getRandomCount(251, Date.now())
        }),
        MiddleName: req.query.middlename || getRandomName({
          middle: true,
          seed: getRandomCount(252, Date.now())
        }),
        LastName: req.query.lastname || getRandomName({
          last: true,
          seed: getRandomCount(251, Date.now())
        }),
        Suffx: req.query.suffx || getRandom({ dictionary: ['', 'Jr.', 'Sr.', 'I', '', ''] }),
        Contact: req.query.contact || getRandomContact(),
        Email: req.query.email || getRandomEmail({
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
      if (cnt === 1) {
        res.json(results.map((data, i) => ({
          number: i + 1,
          data
        }))).end();
        return;
      }
    }
  } catch (error) {
    console.log('WHAT IS THE ERROR', error);
    res.status(500).json({
      error
    }).end();
    return;
  }

  async function getResult() {
    try {
      const adminCount = await User.find({ Role: 'admin' }).count();
      const AddedBy = (await User.find({ Role: 'admin' }))[getRandomCount(adminCount)].id;
      const permissionCount = getRandomCount(17) + 1;
      return await User.create({
        Username: getRandomUsername({ seed: getRandomCount(251, Date.now()) }),
        Password_hash: await getPasswordHash('password'),
        Role: 'user',
        Office: getRandom({
          dictionary: ['Barangay', 'MDRRMO'],
          style: 'capital',
          seed: getRandomCount(2523, Date.now())
        }),
        Position: getRandom({
          dictionary: [
            'Barangay Captain',
            'Barangay Kagawad',
            'Purok Leader',
            'Barangay SK Chairman',
            'Barangay SK Kagawad',
            'IT Support'
          ],
          style: 'capital',
          seed: getRandomCount(2523, Date.now())
        }),
        Barangay: getRandom({
          dictionary: ['1', '2', '3', '4', '5', '6', '7', 'Punta', 'Talisay'],
          seed: getRandomCount(21521, Date.now())
        }),
        FirstName: getRandomName({
          first: true,
          seed: getRandomCount(2551, Date.now())
        }),
        MiddleName: getRandomName({
          middle: true,
          seed: getRandomCount(2552, Date.now())
        }),
        LastName: getRandomName({
          last: true,
          seed: getRandomCount(2551, Date.now())
        }),
        Suffx: getRandom({ dictionary: ['', 'Jr.', 'Sr.', 'I', '', ''] }),
        Contact: getRandomContact(),
        Email: getRandomEmail({
          domain: getRandom({
            dictionary: ['webeemsmdrrmo.com', 'gmail.com', 'test.com', 'hotmail.com'],
            seed: getRandomCount(2161, Date.now())
          }),
          seed: getRandomCount(2553, Date.now())
        }),
        Permissions: [
          'pre-evacuation-create', 'pre-evacuation-modify', 'pre-evacuation-delete',
          'evacuation-modify', 'post-evacuation-modify', 'post-evacuation-print',
          'pre-evacuation-scan', 'evacuation-scan', 'post-evacuation-scan'
        ].shuffle().reduce((aa, bb, ii) => (ii < permissionCount ? [...aa, bb] : aa),
          ['view-info']),
        AddedBy,
      });
    } catch (error) {
      return getResult();
    }
  }
  results.push(
    ...(await Promise.all(
      Array.from({ length: cnt - (currentCount === 0 ? 1 : 0) })
        .map(() => getResult())
    ))
  );
  res.json(results.map((data, i) => ({ number: i + 1, data }))).end();
});

router.get('/add/evacuation', verifiedAdmin, async (req, res, next) => {
  let assigns;
  let createdBy;
  try {
    createdBy = await User.findOne({ Role: 'admin' }).select('ID').exec();
    assigns = await User.find().exec();
  } catch (error) {
    console.log('OMG ERROR:', error);
  }
  const randomData = {
    StreetNum: `${getRandomCount(30)}`,
    District: `${getRandomCount(30)}`,
    Barangay: `${getRandomCount(30)}`,
    Municipality: 'Nasipit',
    Province: 'Agusan del Norte',
    Region: 'CARAGA',
    ZipCode: 8600,
    MaxCapacity: getRandomCount(25, 5),
    PreEvacuation: {
      Started: new Date(Date.now() + (1000 * 60)),
    },
    PostEvacuation: {
      Started: new Date(Date.now() + (1000 * 60 * 3)),
    },
    Assigned: Array.from({ length: getRandomCount(5, 1) }).map(() => getRandom({
      dictionary: assigns.map(v => v.ID),
      style: 'lowerCase',
      seed: getRandomCount(1952, Date.now())
    })),
    CreatedBy: createdBy.ID
  };
  try {
    const created = await Evacuation.create(randomData);
    const retrieved = await Evacuation.findById(created.ID).populate('Assigned')
      .populate('PreEvacuation.Evacuated.ID').populate('PreEvacuation.Evacuated.OperatedBy')
      .populate('PostEvacuation.Evacuated.ID')
      .populate('PostEvacuation.Evacuated.OperatedBy')
      .exec();
    res.json({
      created,
      retrieved
    }).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    }).end();
  }
});

router.post('/test/evacuation', verifiedAdmin, async (req, res, next) => {
  const {
    evacid, proc, operator, evacuee, opname
  } = req.body;
  const updates = [];
  switch (proc) {
    case 'start-pre-evacuation':
      updates.push('PreEvacuation.Started', new Date(Date.now()));
      break;
    case 'end-pre-evacuation':
      updates.push('PreEvacuation.Ended', new Date(Date.now()));
      break;
    case 'end-evacuation':
      updates.push('Evacuation.Ended', new Date(Date.now()));
      break;
    case 'start-post-evacuation':
      updates.push('PostEvacuation.Started', new Date(Date.now()));
      break;
    case 'end-post-evacuation':
      updates.push('PostEvacuation.Ended', new Date(Date.now()));
      break;
    case 'pre-evacuation':
      updates.push('PreEvacuation.Evacuated', {
        ID: evacuee,
        OperatedBy: operator
      });
      break;
    case 'start-evacuation':
      updates.push(
        { 'Evacuation.OperationName': opname },
        { 'Evacuation.Started': new Date(Date.now()) }
      );
      break;
    case 'evacuation':
      updates.push('Evacuation.Distribution', {
        ID: evacuee,
        OperatedBy: operator
      });
      break;
    case 'post-evacuation':
      updates.push('PostEvacuation.Evacuated', {
        ID: evacuee,
        OperatedBy: operator
      });
      break;
    default:
      res.status(401).json({
        error: {
          message: 'Unauthorized Access',
          status: 401,
          statusCode: 401
        }
      }).end();
      return;
  }
  try {
    const success = await Evacuation.findById(evacid).exec();
    if (proc === 'pre-evacuation' || proc === 'post-evacuation' || proc === 'evacuation') {
      const array = updates.shift()
        .split('.')
        .reduce((a, b) => (a === null ? success[b] : a[b]), null);
      array.push(updates.pop());
    } else if (proc === 'start-evacuation') {
      updates.forEach(keys => {
        const key = Object.keys(keys).shift();
        const value = Object.values(keys).shift();
        success.set(key, value);
      });
    } else if (success.Assigned.includes(operator)) {
      success.set(updates.shift(), updates.pop());
    }
    await success.save({ validateModifiedOnly: true, validateBeforeSave: true });
    res.json({
      success
    }).end();
  } catch (error) {
    console.log('Error', error);
    res.json({
      error
    }).end();
  }
});

export default router;
