const { range } = require('../utils')
const fs = require('fs')

const results = range(1, 25)
    .map(
        i =>
            fs.existsSync(`${__dirname}/day${i}/index.js`) &&
            require(`./day${i}`)
    )
    .filter(Boolean)

results.reverse().forEach(({ partOne, partTwo }, i) => {
    console.log(`------------ DAY ${results.length - i} ------------`)
    console.log('Part one: ')
    console.log(partOne)
    console.log('\n')
    console.log('Part two: ')
    console.log(partTwo)
    console.log('\n\n')
})
