import fs from 'fs';
import path from 'path';
import commander from 'commander';
import { __basedir } from '@utils/fs';
import { validateArgs, Validators } from '@utils/validators';
import { fromRange } from '@utils/array';

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--day <name>', 'Day(s) to run', 'latest')
    .option('--year <name>', 'Year(s) to run', 'latest')
    .option('--part <name>', 'Part to run', 'both')
    .option('-t, --test', 'Run test or real input', false)
    .parse(process.argv);

validateArgs(commander, {
    year: [Validators.oneOf(['latest', Validators.inRange(2019, 2030)])],
    day: [Validators.oneOf(['latest', Validators.inRange(1, 25)])],
    part: [Validators.oneOf(['both', Validators.inRange(1, 2)])],
});

const getChallengePath = (year: number, day: number) => {
    return path.join(__basedir, year.toString(), `day${day}`, 'index.ts');
};

const getLatestYear = () =>
    fromRange(2030, 2019).find(year =>
        fs.existsSync(path.join(__basedir, year.toString()))
    );

const getLatestDay = (year: number) =>
    fromRange(25, 1).find(i => fs.existsSync(getChallengePath(year, i)));

const getYearToRun = (specifiedYear: string | number) => {
    if (!specifiedYear || specifiedYear === 'latest') {
        return getLatestYear();
    }

    const parsedYear = Number(specifiedYear);

    if (isNaN(parsedYear)) {
        throw new Error('Please pass a valid year to commander.');
    }

    return parsedYear;
};

const getDayToRun = (specifiedYear: number, specifiedDay: number | string) => {
    const year = getYearToRun(specifiedYear);

    if (!specifiedDay || specifiedDay === 'latest') {
        return getLatestDay(year);
    }

    const parsedDay = Number(specifiedDay);

    if (isNaN(parsedDay)) {
        throw new Error('Please pass a valid day to commander.');
    }

    return parsedDay;
};

const run = () => {
    const yearToRun = getYearToRun(commander.year);

    if (!fs.existsSync(getChallengePath(yearToRun, 1))) {
        console.error(
            'ERROR: Could not find any solutions for the given year.'
        );
        return;
    }

    const dayToRun = getDayToRun(yearToRun, commander.day);

    const challengePath = getChallengePath(yearToRun, dayToRun);

    if (!fs.existsSync(challengePath)) {
        console.error(
            `ERROR: Could not find a solution for Day ${dayToRun} of ${yearToRun}`
        );
        return;
    }

    const startTime = Date.now();

    const solutions = require(`../${yearToRun}/day${dayToRun}`);
    const afterSolutions = Date.now();

    const partOne = solutions.partOne();
    const afterPartOne = Date.now();

    const partTwo = solutions.partTwo();
    const afterPartTwo = Date.now();

    const partOneExecution = afterPartOne - startTime;
    const partTwoExecution =
        afterPartTwo - startTime - (afterPartOne - afterSolutions);

    console.log(`------------ DAY ${dayToRun} (${yearToRun}) ------------`);
    console.log(`Part one: ${partOneExecution}ms`);
    console.log(partOne);
    console.log('\n');
    console.log(`Part two: ${partTwoExecution}ms`);
    console.log(partTwo);
    console.log('\n\n');
};

run();
