import { Router } from 'express';
import {
    authCallbackController,
    failAuthController,
    getInviteController,
    logoutController,
    postInviteController,
} from '../controllers/github.js';
import { param, body } from 'express-validator';
import { getInviteSanitizer, postInviteSanitizer } from '../utils/github.js';
import bodyParser from 'body-parser';
import '../strategies/github-strategy.js';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';

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
    body('html_url').isURL(),
    postInviteSanitizer,
    postInviteController
);

// Auth Routes
router.get('/auth', passport.authenticate('github'));

router.get(
    '/auth/callback',
    passport.authenticate('github', {
        failureRedirect: '/github/auth/fail',
    }),
    authCallbackController
);

router.get('/auth/fail', failAuthController);

router.get('/auth/logout', logoutController);

export default router;
