import { Router } from 'express';
import {
    getInviteController,
    postInviteController,
} from '../controllers/github.js';
import { param, body } from 'express-validator';
import { getInviteSanitizer, postInviteSanitizer } from '../utils/github.js';
import bodyParser from 'body-parser';

const router = Router();

// /github/invite
router.get(
    '/invite/:teamName',
    param('teamName').notEmpty().escape(),
    getInviteSanitizer,
    getInviteController
);

// ref: https://www.npmjs.com/package/body-parser#express-route-specific
// parses form data
router.use('/invite', bodyParser.urlencoded({ extended: false }));

router.post(
    '/invite',
    body('team_slug').trim().notEmpty().escape(),
    body('username').trim().notEmpty().escape(),
    body('html_url').isURL(),
    postInviteSanitizer,
    postInviteController
);

export default router;
