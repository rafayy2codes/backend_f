import express from 'express';
import {

    registerUser,
    login,
    updateFreelancerDetails,
    logout,
    updateClientDetails


} from '../controller/register.controller.js';
import isAuthenticated from '../middleware/IsAuthenticated.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/freelancer', isAuthenticated, updateFreelancerDetails);

router.route("/login").post(login);
router.route("/logout").get(logout);
router.post('/updateClientDetails', isAuthenticated, updateClientDetails);


export default router;
