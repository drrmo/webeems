import express from 'express';
import { session, evacuee } from '../controllers';

const router = express.Router();

router.get('/exists', session.verifiedLogin, evacuee.getEvacueeByQRExists);

router.get('/', session.verifiedLogin, evacuee.getEvacueeByQR);

router.get('/all', session.verifiedAdmin, evacuee.getAllEvacueeInfo);

router.post('/create', session.verifiedAdmin, evacuee.createEvacueeInfo);

export default router;
