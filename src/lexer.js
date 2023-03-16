import Token from './token.js';

export const tokens = new Map([
	['regex', /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\//],
	['comment', /\/\/(.*)|\/\*(.*)\*\/.?/],
	['whitespace', /\s+/],
	['identifier', /[\w_]+|\$/i],
	['newline', /\n/],
	['assignment', /=/],
	['or', /\|/],
	['end_of_line', /;/],
	['function_lambda', /->/],
	['optional', /\?/],
	['group_start', /\[/],
	['group_end', /\]/],
	['block_start', /{/],
	['block_end', /}/],
]);

export async function tokenize(str) {
	let cursor = 0;

	const matchedTokens = [];
	while (cursor < str.length) {
		let matchs = [];
		const sliced = str.slice(cursor);
		for (let [id, re] of tokens) {
			const match = re.exec(sliced);
			if (match) {
				matchs.push({ id, match });
			}
		}

		const { match, id } = matchs.reduce((current, incoming) => (current.match.index < incoming.match.index ? current : incoming), { match: { index: Infinity } });

		if (id) {
			const lineno = [...str.slice(0, cursor).matchAll('\n')].length + 1;
			const colno = cursor - str.lastIndexOf('\n', cursor - 1);
			cursor += match.index + match[0].length;
			matchedTokens.push(new Token(id, match, lineno, colno));
		} else {
			cursor++;
		}
	}

	return matchedTokens;
}
