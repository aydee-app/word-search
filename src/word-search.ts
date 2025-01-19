import { WordSearchOptions, Position, Direction } from './types';

export class WordSearch {
	private grid: string[][];
	private size: number;
	private words: string[];
	private placedWords: Map<string, Position[]>;
	private readonly allowDiagonal: boolean;
	private readonly fillBlanks: boolean;

	constructor(options: WordSearchOptions) {
		this.words = options.words.map((w) => w.toUpperCase());
		this.allowDiagonal = options.allowDiagonal ?? false;
		this.fillBlanks = options.fillBlanks ?? true;

		// Dynamically calculate grid size
		this.size = options.size ?? this.calculateGridSize();
		this.validateOptions();

		this.grid = this.createEmptyGrid();
		this.placedWords = new Map();
	}

	/**
	 * Generate the word search puzzle using optimal placements
	 */
	generate(): string[][] {
		this.reset();

		// Sort words by length for better placement strategy
		const sortedWords = [...this.words].sort((a, b) => b.length - a.length);

		// Try placing each word by evaluating the best position
		for (const word of sortedWords) {
			const placed = this.placeWordWithBestFit(word);
			if (!placed) {
				throw new Error(`Could not place word: ${word}`);
			}
		}

		if (this.fillBlanks) {
			this.fillEmptySpaces();
		}

		return this.grid;
	}

	/**
	 * Check if a word exists in the grid
	 */
	hasWord(word: string): boolean {
		return this.placedWords.has(word.toUpperCase());
	}

	/**
	 * Get positions of a placed word
	 */
	getWordPositions(word: string): Position[] | null {
		return this.placedWords.get(word.toUpperCase()) || null;
	}

	/**
	 * Get all placed words and their positions
	 */
	getPlacedWords(): Map<string, Position[]> {
		return new Map(this.placedWords);
	}

	/**
	 * Get the current grid state
	 */
	getGrid(): string[][] {
		return this.grid.map((row) => [...row]);
	}

	/**
	 * Print the grid to the console
	 */
	print(): void {
		console.log(this.toString());
	}

	/**
	 * Convert grid to string
	 */
	toString(): string {
		return this.grid.map((row) => row.join(' ')).join('\n');
	}

	/**
	 * Reset the grid
	 */
	private reset(): void {
		this.grid = this.createEmptyGrid();
		this.placedWords.clear();
	}

	/**
	 * Dynamically calculate the grid size based on word lengths and count
	 */
	private calculateGridSize(): number {
		const totalWordLength = this.words.reduce((acc, word) => acc + word.length, 0);
		const gridSize = Math.max(Math.ceil(totalWordLength / 5), 10); // Minimum grid size
		return gridSize;
	}

	/**
	 * Validate grid options
	 */
	private validateOptions(): void {
		if (this.size < 1) {
			throw new Error('Grid size must be positive');
		}

		if (!this.words.length) {
			throw new Error('Words array cannot be empty');
		}

		this.words.forEach((word) => {
			if (word.length > this.size) {
				throw new Error(`Word "${word}" is longer than grid size`);
			}

			if (!/^[A-Za-z]+$/.test(word)) {
				throw new Error(`Word "${word}" contains invalid characters`);
			}
		});
	}

	/**
	 * Create an empty grid of the given size
	 */
	private createEmptyGrid(): string[][] {
		return Array(this.size)
			.fill('')
			.map(() => Array(this.size).fill(''));
	}

	/**
	 * Place the word by finding the best fitting position on the grid
	 */
	private placeWordWithBestFit(word: string): boolean {
		const directions = this.getAvailableDirections();
		let bestScore = -Infinity;
		let bestPosition: Position | null = null;
		let bestDirection: Direction | null = null;

		for (const direction of directions) {
			for (let x = 0; x < this.size; x++) {
				for (let y = 0; y < this.size; y++) {
					const position: Position = { x, y };

					if (this.canPlaceWordAt(word, position, direction)) {
						const score = this.calculatePlacementScore(word, position, direction);
						if (score > bestScore) {
							bestScore = score;
							bestPosition = position;
							bestDirection = direction;
						}
					}
				}
			}
		}

		if (bestPosition && bestDirection) {
			this.insertWord(word, bestPosition, bestDirection);
			return true;
		}

		return false;
	}

	/**
	 * Calculate the score of a word placement, favoring placements that maximize space
	 */
	private calculatePlacementScore(word: string, position: Position, direction: Direction): number {
		let score = 0;

		for (let i = 0; i < word.length; i++) {
			const pos = this.getNextPosition(position, i, direction);
			if (this.isValidPosition(pos) && this.grid[pos.x][pos.y] === '') {
				score++;
			}
		}

		return score;
	}

	/**
	 * Get the available directions (horizontal, vertical, diagonal)
	 */
	private getAvailableDirections(): Direction[] {
		const directions: Direction[] = ['horizontal', 'vertical'];
		if (this.allowDiagonal) directions.push('diagonal');
		return directions;
	}

	/**
	 * Get the next position for placing a character in a given direction
	 */
	private getNextPosition(start: Position, index: number, direction: Direction): Position {
		switch (direction) {
			case 'horizontal':
				return { x: start.x, y: start.y + index };
			case 'vertical':
				return { x: start.x + index, y: start.y };
			case 'diagonal':
				return { x: start.x + index, y: start.y + index };
		}
	}

	/**
	 * Check if the word can be placed at the given position and direction
	 */
	private canPlaceWordAt(word: string, start: Position, direction: Direction): boolean {
		const positions: Position[] = [];

		for (let i = 0; i < word.length; i++) {
			const pos = this.getNextPosition(start, i, direction);

			if (!this.isValidPosition(pos)) return false;

			const currentLetter = this.grid[pos.x][pos.y];
			if (currentLetter && currentLetter !== word[i]) return false;

			positions.push(pos);
		}

		return true;
	}

	/**
	 * Insert the word at the specified position and direction
	 */
	private insertWord(word: string, start: Position, direction: Direction): void {
		const positions: Position[] = [];

		for (let i = 0; i < word.length; i++) {
			const pos = this.getNextPosition(start, i, direction);
			this.grid[pos.x][pos.y] = word[i];
			positions.push({ ...pos });
		}

		this.placedWords.set(word, positions);
	}

	/**
	 * Fill empty spaces in the grid with random letters
	 */
	private fillEmptySpaces(): void {
		const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		this.grid.forEach((row, x) => {
			row.forEach((cell, y) => {
				if (!cell) {
					this.grid[x][y] = letters[Math.floor(Math.random() * letters.length)];
				}
			});
		});
	}

	/**
	 * Check if a position is valid within the grid
	 */
	private isValidPosition(pos: Position): boolean {
		return pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size;
	}
}
