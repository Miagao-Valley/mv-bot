import { Octokit } from 'octokit';
import { orgName } from '../constants/names.js';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

// returns team schema
// ref: https://docs.github.com/en/rest/teams/teams?apiVersion=2022-11-28#get-a-team-by-name
export async function getTeamByName(teamName) {
    const team = await octokit.request(
        `GET /orgs/${orgName}/teams/${teamName}`,
        {
            org: orgName,
            team_slug: teamName,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    );

    return team.data;
}

// ref: https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#add-or-update-team-membership-for-a-user
export async function inviteUserToTeam(team_slug, username) {
    await octokit.request(
        `PUT /orgs/${orgName}/teams/${team_slug}/memberships/${username}`,
        {
            org: orgName,
            team_slug: team_slug,
            username: username,
            role: 'member',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    );
}
