import express from 'express';
import 'dotenv/config';
import gitRouter from './routes/github.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import session from 'express-session';
import sqlite3 from 'connect-sqlite3';
import passport from 'passport';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;
const SQLiteStore = sqlite3(session);

const app = express();

// serve static files (css, html, etc.)
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({ db: 'sessions.db', dir: './db' }),
        cookie: {
            // 3 hours max
            maxAge: 60000 * 60 * 3,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/github', gitRouter);

// Guard route
app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        error: ReasonPhrases.NOT_FOUND,
    });
});

app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
