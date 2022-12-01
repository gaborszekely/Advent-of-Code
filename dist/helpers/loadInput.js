"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const commander_1 = __importDefault(require("commander"));
const utils_1 = require("../utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
commander_1.default
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('--year <name>', 'Year to fetch', '2022')
    .option('--session <name>', 'Session token', '')
    .parse(process.argv);
const getFolderPath = (day) => path_1.default.join(__dirname, '../', commander_1.default.year, `day${day}`);
console.log(commander_1.default);
if (!commander_1.default.session) {
    throw new Error('Please include a valid session token.');
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const latestDay = (0, utils_1.range)(25, 1).find(day => fs_1.default.existsSync(getFolderPath(day)));
    if (!latestDay) {
        throw new Error('Could not find latest day');
    }
    try {
        const response = yield (yield (0, node_fetch_1.default)(`https://adventofcode.com/2020/day/${latestDay}/input`, {
            headers: {
                cookie: `session=${commander_1.default.session}`,
            },
        })).text();
        if (response.startsWith(`Please don't repeatedly request this endpoint before it unlocks!`)) {
            throw new Error('File has not been unlocked yet.');
        }
        if (response.startsWith('Puzzle inputs differ by user.')) {
            throw new Error('Session token invalid.');
        }
        fs_1.default.writeFileSync(`${getFolderPath(latestDay)}/input.txt`, response);
        console.log('SUCCESS!');
    }
    catch (err) {
        console.error('ERROR:');
        console.error(err.message);
    }
    console.log('');
}))();
//# sourceMappingURL=loadInput.js.map