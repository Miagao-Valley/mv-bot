import { matchedData, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export function getInviteSanitizer(req, res, next) {
    const result = validationResult(req);

    // there are errors
    if (!result.isEmpty()) {
        return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ error: result.array() });
    }

    const data = matchedData(req);
    req.teamName = data.teamName;

    next();
}

export function postInviteSanitizer(req, res, next) {
    const result = validationResult(req);

    // there are errors
    if (!result.isEmpty()) {
        return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ error: result.array() });
    }

    const data = matchedData(req);
    req.team_slug = data.team_slug;
    req.username = data.username;
    req.team_url = data.html_url;

    next();
}
