import fetch from 'node-fetch';
import commander from 'commander';
import { range } from '../utils';
import fs from 'fs';
import path from 'path';

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--year <name>', 'Year to fetch', '2022')
    .option('--session <name>', 'Session token', '')
    .parse(process.argv);

const getFolderPath = (day: number) =>
    path.join(__dirname, '../../src', commander.year, `day${day}`);

console.log(commander);

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
