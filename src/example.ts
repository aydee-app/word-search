import { WordSearch } from './word-search';

const wordSearch = new WordSearch({
	words: [
		'xxxxx',
		'yyyyy',
		'zzzz',
		'ffff',
		'oooo',
		'iiii',
		'llll',
		'ddddd',
		'lululu',
		'bububu',
		'fafafafa',
	],
	size: 12,
	allowDiagonal: true,
	fillBlanks: true,
});

const grid = wordSearch.generate();
console.log(wordSearch.toString());
