import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

passport.serializeUser((profile, done) => {
    done(null, {
        id: profile.id,
        username: profile.username,
        image: profile._json.avatar_url,
    });
});

passport.deserializeUser((profile, done) => {
    done(null, profile);
});

// Just get the GitHub user and don't store it anywhere.
export default passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'https://bot.miagaovalley.site/github/auth/callback',
        },
        function (_accessToken, _refreshToken, profile, done) {
            done(null, profile);
        }
    )
);
