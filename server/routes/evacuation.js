import express from 'express';
import { session, evac } from '../controllers';

const router = express.Router();

router.get('/my/assigned', session.verifiedLogin, evac.getMyAssignedEvent);

router.get('/event', session.verifiedLogin, evac.getEvacuationEvent);

router.get('/event/all', session.verifiedLogin, evac.getAllEvacuationEvents);

router.get('/event/admin', session.verifiedAdmin, evac.getAdminAssignedEvent);

router.get('/assigns', session.verifiedAdmin, evac.getAllAssigned);

router.get('/assigned', session.verifiedLogin, evac.getAssigned);

router.get('/assign/available', session.verifiedLogin, evac.getAvailableAssign);

router.get('/occupancies', session.verifiedLogin, evac.getBuildingOccupancies);

router.get('/event/available/start', session.verifiedAdmin, evac.getAvailableEventIDStart);

router.get('/event/available/scan', session.verifiedAdmin, evac.getAvailableEventIDScan);

router.get('/event/available/end', session.verifiedAdmin, evac.getAvailableEventIDEnd);

router.get('/summary', session.verifiedLogin, evac.getEvacuationSummary);

router.post('/create', session.verifiedLogin, session.updateCredentials, evac.createEvacuationEvent);

router.put('/assign/add', session.verifiedAdmin, session.updateCredentials, evac.assignUser);

router.put('/assign/remove', session.verifiedAdmin, session.updateCredentials, evac.removeAssigned);

router.put('/operations', session.verifiedLogin, session.updateCredentials, evac.operations);

export default router;
