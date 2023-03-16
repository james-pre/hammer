export default class Token {
	type;
	match;
	lineno;
	colno;
	constructor(type, match, lineno, colno) {
		Object.assign(this, { type, match, lineno, colno });
	}

	get value() {
		return this.match[0].match;
	}

	toString() {
		return `${this.type} at ${this.lineno}:${this.colno}: ${JSON.stringify(this.match[0])}`.replaceAll('\t', '');
	}
}
