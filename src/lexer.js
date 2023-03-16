import Token from './token.js';

export const tokens = new Map([
	['regex', [{ pattern: new RegExp(String.raw`\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/`) }]],
	['comment', [{ pattern: String.raw`\/\/(.*)` }, { pattern: String.raw`\/\*(.*)\*\/.?` }]],
	['whitespace', [{ pattern: String.raw`\s+` }]],
	['identifier', [{ pattern: String.raw`[\w_]+`, flags: 'i' }]],
	['newline', [{ pattern: String.raw`\n` }]],
	['operator', [{ pattern: ``}]]
]);

export async function tokenize(str) {
	let cursor = 0,
		i = 0;

	const matchedTokens = [];
	while (cursor < str.length && i < 200) {
		i++;
		let matchs = [];
		const sliced = str.slice(cursor);
		for (let [id, patterns] of tokens) {
			for (let re of patterns) {
				const match = re.exec(sliced);
				if (match) {
					matchs.push({ id, match });
					break;
				}
			}
		}

		const { match, id } = matchs.reduce((current, incoming) => (current.match.index < incoming.match.index ? current : incoming), { match: { index: Infinity } });

		if (id) {
			const lineno = [...str.slice(0, cursor).matchAll('\n')].length + 1;
			const colno = cursor - str.lastIndexOf('\n', cursor);
			cursor += match[0].length;
			matchedTokens.push(new Token(id, match, lineno, colno));
		} else {
			cursor++;
		}
	}

	return matchedTokens;
}
