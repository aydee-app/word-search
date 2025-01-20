import { Direction, Position, WordSearchOptions } from './types';
import { shuffleArray } from './utils';

export class WordSearch {
	private size: number;
	private grid: string[][];
	private words: string[];
	private positions: Map<string, Position[]>;
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
		this.positions = new Map();
	}

	/**
	 * Generate the word search puzzle with random placements based on best fit
	 */
	generate(): string[][] {
		this.reset();

		if (this.words.length === 0) {
			throw new Error('Words array cannot be empty');
		}

		const shuffledWords = shuffleArray([...this.words]);

		for (const word of shuffledWords) {
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
		return this.positions.has(word.toUpperCase());
	}

	/**
	 * Get positions of a placed word
	 */
	getWordPositions(word: string): Position[] | null {
		return this.positions.get(word.toUpperCase()) || null;
	}

	/**
	 * Get all placed words and their positions
	 */
	getPositions(): Map<string, Position[]> {
		return new Map(this.positions);
	}

	/**
	 * Get the current grid state
	 */
	getGrid(): string[][] {
		return this.grid.map((row) => [...row]);
	}

	/**
	 * Get the current grid size
	 */
	getGridSize(): number {
		return this.grid.length;
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
	 * Export the current grid
	 */
	export() {
		return {
			size: this.getGridSize(),
			grid: this.grid.map((row) => [...row]),
			positions: new Map(this.positions),
		};
	}

	/**
	 * Import a grid into the game
	 */
	import({ grid, positions }: { grid: string[][]; positions: Map<string, Position[]> }): void {
		this.validateGrid(grid);

		positions.forEach((positions, word) => {
			positions.forEach((pos, index) => {
				if (grid[pos.x][pos.y] !== word[index]) {
					throw new Error('Grid contains mismatched word placements');
				}
			});
		});

		this.size = grid.length;
		this.grid = grid.map((row) => [...row]);
		this.positions = new Map(positions);
	}

	/**
	 * Validate the imported grid
	 */
	private validateGrid(grid: string[][]): void {
		if (!Array.isArray(grid) || grid.some((row) => !Array.isArray(row))) {
			throw new Error('Invalid grid format. Grid must be a 2D array.');
		}
		if (grid.length !== this.size || grid.some((row) => row.length !== this.size)) {
			throw new Error(`Invalid grid dimensions. Expected ${this.size}x${this.size}.`);
		}
	}
	/**
	 * Reset the grid
	 */
	private reset(): void {
		this.grid = this.createEmptyGrid();
		this.positions.clear();
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
	 * Place the word by evaluating the best possible random placement (score-based)
	 */
	private placeWordWithBestFit(word: string): boolean {
		const directions = this.getAvailableDirections();
		let bestScore = -Infinity;
		let bestPosition: Position | null = null;
		let bestDirection: Direction | null = null;

		const maxAttempts = 300; // Limit attempts to avoid infinite loops
		let attempts = 0;

		while (attempts < maxAttempts) {
			const randomDirection = directions[Math.floor(Math.random() * directions.length)];
			const randomPosition: Position = {
				x: Math.floor(Math.random() * this.size),
				y: Math.floor(Math.random() * this.size),
			};

			const score = this.calculatePlacementScore(word, randomPosition, randomDirection);
			if (score > bestScore && this.canPlaceWordAt(word, randomPosition, randomDirection)) {
				bestScore = score;
				bestPosition = randomPosition;
				bestDirection = randomDirection;
			}

			attempts++;
		}

		if (bestPosition && bestDirection) {
			this.insertWord(word, bestPosition, bestDirection);
			return true;
		}

		return false;
	}

	/**
	 * Calculate the score for a potential word placement
	 * Higher score means better fit (more available space)
	 */
	private calculatePlacementScore(word: string, position: Position, direction: Direction): number {
		let score = 0;

		for (let i = 0; i < word.length; i++) {
			const pos = this.getNextPosition(position, i, direction);

			if (this.isValidPosition(pos) && this.grid[pos.x][pos.y] === '') {
				score++; // Score increases when the position is empty and valid
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
			default:
				return start;
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

		this.positions.set(word, positions);
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
