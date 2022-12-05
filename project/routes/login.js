import express from 'express';

import { userLogin } from '../controllers/login.js';

const router = express.Router();

router.get('/', userLogin);

export default router;