import express from 'express';
import 'dotenv/config';
import gitRouter from './routes/github.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const app = express();

const PORT = process.env.PORT || 3000;

// serve static files (css, html, etc.)
app.use(express.static('public'));

app.set('view engine', 'ejs');
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
