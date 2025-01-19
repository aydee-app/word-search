export interface WordSearchOptions {
	size?: number;
	words: string[];
	allowDiagonal?: boolean;
	fillBlanks?: boolean;
}

export type Position = {
	x: number;
	y: number;
};

export type Direction = 'horizontal' | 'vertical' | 'diagonal';
