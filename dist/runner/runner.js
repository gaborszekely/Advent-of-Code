"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const validators_1 = require("../utils/validators");
const utils_1 = require("../utils/utils");
const fs_2 = require("../utils/fs");
commander_1.default
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--day <name>', 'Day(s) to run', 'latest')
    .option('--year <name>', 'Year(s) to run', 'latest')
    .option('--part <name>', 'Part to run', 'both')
    .parse(process.argv);
(0, validators_1.validateArgs)(commander_1.default, {
    year: [validators_1.Validators.oneOf(['latest', validators_1.Validators.inRange(2019, 2030)])],
    day: [validators_1.Validators.oneOf(['latest', validators_1.Validators.inRange(1, 25)])],
    part: [validators_1.Validators.oneOf(['both', validators_1.Validators.inRange(1, 2)])],
});
const getChallengePath = (year, day) => {
    return path_1.default.join(fs_2.__basedir, year.toString(), `day${day}`, 'index.js');
};
const getLatestYear = () => (0, utils_1.range)(2030, 2019).find(year => fs_1.default.existsSync(path_1.default.join(fs_2.__basedir, year.toString())));
const getLatestDay = (year) => (0, utils_1.range)(25, 1).find(i => fs_1.default.existsSync(getChallengePath(year, i)));
const getYearToRun = (specifiedYear) => {
    if (!specifiedYear || specifiedYear === 'latest') {
        return getLatestYear();
    }
    const parsedYear = Number(specifiedYear);
    if (isNaN(parsedYear)) {
        throw new Error('Please pass a valid year to commander.');
    }
    return parsedYear;
};
const getDayToRun = (specifiedYear, specifiedDay) => {
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
    const yearToRun = getYearToRun(commander_1.default.year);
    if (!fs_1.default.existsSync(getChallengePath(yearToRun, 1))) {
        console.error('ERROR: Could not find any solutions for the given year.');
        return;
    }
    const dayToRun = getDayToRun(yearToRun, commander_1.default.day);
    const challengePath = getChallengePath(yearToRun, dayToRun);
    if (!fs_1.default.existsSync(challengePath)) {
        console.error(`ERROR: Could not find a solution for Day ${dayToRun} of ${yearToRun}`);
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
    const partTwoExecution = afterPartTwo - startTime - (afterPartOne - afterSolutions);
    console.log(`------------ DAY ${dayToRun} (${yearToRun}) ------------`);
    console.log(`Part one: ${partOneExecution}ms`);
    console.log(partOne);
    console.log('\n');
    console.log(`Part two: ${partTwoExecution}ms`);
    console.log(partTwo);
    console.log('\n\n');
};
run();
//# sourceMappingURL=runner.js.map