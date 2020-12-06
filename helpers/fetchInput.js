const fetch = require('node-fetch');
const commander = require('commander');
const { range } = require('../utils');
const fs = require('fs');
const path = require('path');

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--year <name>', 'Year to fetch', '2020')
    .option('--session <name>', 'Session token', '')
    .parse(process.argv);

console.log('');

const getFolderPath = day =>
    path.join(__dirname, '../', commander.year, `day${day}`);

if (!commander.session) {
    throw new Error('Please include a valid session token.');
}

(async () => {
    const latestDay = range(25, 1).find(day =>
        fs.existsSync(getFolderPath(day))
    );

    if (!latestDay) {
        throw new Error('Could not find latest day');
    }

    try {
        const response = await (
            await fetch(
                `https://adventofcode.com/2020/day/${latestDay}/input`,
                {
                    headers: {
                        cookie: `session=${commander.session}`,
                    },
                }
            )
        ).text();

        if (
            response.startsWith(
                `Please don't repeatedly request this endpoint before it unlocks!`
            )
        ) {
            throw new Error('File has not been unlocked yet.');
        }

        if (response.startsWith('Puzzle inputs differ by user.')) {
            throw new Error('Session token invalid.');
        }

        fs.writeFileSync(`${getFolderPath(latestDay)}/input.txt`, response);

        console.log('SUCCESS!');
    } catch (err) {
        console.error('ERROR:');
        console.error(err.message);
    }

    console.log('');
})();
