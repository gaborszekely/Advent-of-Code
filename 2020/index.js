const { range } = require('../utils');
const fs = require('fs');
const commander = require('commander');

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--day <name>', 'Days to run', 'latest')
    .parse(process.argv);

const logResult = (partOne, partTwo, day) => {
    // console.clear();
    console.log(`------------ DAY ${day} ------------`);
    console.log('Part one: ');
    console.log(partOne);
    console.log('\n');
    console.log('Part two: ');
    console.log(partTwo);
    console.log('\n\n');
};

const daysToRun = commander.day;

if (daysToRun === 'all') {
    const results = range(1, 25)
        .map(
            i =>
                fs.existsSync(`${__dirname}/day${i}/index.js`) &&
                require(`./day${i}`)
        )
        .filter(Boolean);

    results.reverse().forEach(({ partOne, partTwo }, i) => {
        logResult(partOne, partTwo, results.length - i);
    });
}

if (daysToRun === 'latest') {
    const resultIndex = range(25, 1).find(i =>
        fs.existsSync(`${__dirname}/day${i}/index.js`)
    );

    if (resultIndex >= 0) {
        const { partOne, partTwo } = require(`./day${resultIndex}`);
        logResult(partOne, partTwo, resultIndex);
    }
}
