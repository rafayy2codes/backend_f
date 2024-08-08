import express from 'express';
import {

    postProject,
    postBid,
    completeProject


} from '../controller/project.controller.js';
import isAuthenticated from '../middleware/IsAuthenticated.js';

const router = express.Router();

router.post('/postproject', isAuthenticated, postProject);

router.post('/postbid', isAuthenticated, postBid);
router.post('/markproject', isAuthenticated, completeProject);
export default router;
