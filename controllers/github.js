import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getTeamByName, inviteUserToTeam } from '../services/github.js';

export async function getInviteController(req, res) {
    try {
        const teamName = req.teamName;
        res.cookie('team', teamName, { maxAge: 60000 * 60, signed: true });

        const team = await getTeamByName(teamName);
        res.render('github/invite/form', { team: team, user: req.user });
    } catch (error) {
        console.error(error.message);

        // team not found
        if (error.status == 404) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: 'Team not found.',
            });
        }

        // internal unknown error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function postInviteController(req, res) {
    if (!req.user) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    try {
        const team_slug = req.team_slug;
        const username = req.user.username;
        const team_url = req.team_url;

        await inviteUserToTeam(team_slug, username);

        res.render('github/invite/result', {
            redirect_url: team_url,
            success: true,
            error_status: '',
            error_message: '',
        });
    } catch (error) {
        console.error(error);

        res.render('github/invite/result', {
            redirect_url: team_url,
            success: false,
            error_status: error.status || '',
            error_message: error.message || '',
        });
    }
}

export function authCallbackController(req, res) {
    if (req.signedCookies?.team) {
        return res.redirect(`/github/invite/${req.signedCookies.team}`);
    }

    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
}

export function failAuthController(req, res) {
    res.render('github/auth/fail');
}

export function logoutController(req, res) {
    if (!req.user) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    req.logout((err) => {
        if (err) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
        }

        if (req.signedCookies?.team) {
            return res.redirect(`/github/invite/${req.signedCookies.team}`);
        }

        res.sendStatus(StatusCodes.OK);
    });
}
