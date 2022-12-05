import express from 'express';

import { confirmEmail } from '../controllers/confirm.js';

const router = express.Router();

router.get('/:email_token', confirmEmail);

export default router;