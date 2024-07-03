import fs from 'fs';

const folder = 'db';
const file = 'sessions.db';

try {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);

        fs.open(`${folder}/${file}`, 'w', function (err, file) {
            if (err) {
                throw err;
            }
            console.log('Saved!');
        });
    }
} catch (err) {
    console.error(err);
}
