/* eslint-disable no-console */
import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import mongoose from 'mongoose';
import * as routes from './routes';
import sessionToken from './controllers/sessionToken';
import { session } from './controllers';

const secretToken = 'webeems-secret-token';

const app = express();

// database setup
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webeems';
const mongooseConfigs = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mongoUri, mongooseConfigs).then(() => console.log(`Connected to database server at ${mongoose.connection.host}`)).catch(err => { console.error(err); process.exit(1); });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secretToken));
app.use(sessionToken(secretToken, 1800)); // 30 minutes
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'blob:']
  },
}));
app.use(cors({
  origin: ['self','https://localhost:5173','https://localhost:5177'],
  credentials: true,
}));

app.use(compression());

app.use(session.createDefaultAdmin);

// static folder of showing the frontend
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// redirect to secure
if (process.env.NODE_ENV?.startsWith('development')) {
  app.use((req, res, next) => {
    if (!req.secure) {
      const hostname = req.headers.host.split(':')[0];
      return res.redirect(`https://${hostname}${req.url}`);
    }
    next();
  });
}



// back-end api routes
app.use('/api/users', routes.users);
app.use('/api/evacuation', routes.evacuation);
app.use('/api/evacuees', routes.evacuees);

if (process.env.NODE_ENV?.startsWith('development')) {
  app.use('/api/seed', routes.seed);
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!', status: err.status }).end();
});

app.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

module.exports = app;
