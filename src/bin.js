import * as fs from 'fs';
import * as hammer from './index.js';

const flags = process.argv
	.filter((a) => a.startsWith('-'))
	.map((f) => f.replace(/^-+/, ' ').trimStart());

const args = process.argv.slice(1).filter((a) => !a.startsWith('-'));

if (!args[1]) {
	console.log(`Error: no input file specified`);
	process.exit();
}

if (!fs.existsSync(args[1])) {
	console.log(`Error: couldn't find file: ${args[1]}`);
	process.exit();
}

if (flags.includes('t')) {
	try {
		const content = fs.readFileSync(args[1], { encoding: 'utf8' });
		const tokens = await hammer.tokenize(content);
		for (let token of tokens) {
			console.log(token.toString());
		}
	} catch (err) {
		console.log(`Failed to tokenize: ${err}`);
	}
}
