import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getTeamByName, inviteUserToTeam } from '../services/github.js';

export async function getInviteController(req, res) {
    const teamName = req.teamName;

    try {
        const team = await getTeamByName(teamName);
        res.render('github/invite/form', { team: team });
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
    const team_slug = req.team_slug;
    const username = req.username;
    const team_url = req.team_url;

    try {
        await inviteUserToTeam(team_slug, username);

        res.render('github/invite/result', {
            redirect_url: team_url,
            success: true,
            error_status: '',
            error_message: '',
        });
    } catch (error) {
        console.error(error);

        res.render('github/invite/success', {
            success: false,
            error_status: error.status || '',
            error_message: error.message || '',
        });
    }
}
