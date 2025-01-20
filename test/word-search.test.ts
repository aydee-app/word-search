import { describe, test, expect, beforeEach } from 'bun:test';
import { WordSearch, type Position } from '../src/index';

describe('WordSearch', () => {
	describe('Constructor Validation', () => {
		test('throws error on invalid grid size', () => {
			expect(() => new WordSearch({ size: 0, words: ['TEST'] })).toThrow(
				'Grid size must be positive'
			);
		});

		test('throws error when word is longer than grid', () => {
			expect(() => new WordSearch({ size: 3, words: ['TOOLONG'] })).toThrow(
				'Word "TOOLONG" is longer than grid size'
			);
		});

		test('throws error on invalid characters', () => {
			expect(() => new WordSearch({ size: 10, words: ['HELLO!'] })).toThrow(
				'Word "HELLO!" contains invalid characters'
			);
		});
	});

	describe('Grid Generation', () => {
		let wordSearch: WordSearch;

		beforeEach(() => {
			wordSearch = new WordSearch({
				size: 10,
				words: ['HELLO', 'WORLD'],
				allowDiagonal: true,
				fillBlanks: true,
			});
		});

		test('throws error on generation when words array is empty', () => {
			expect(() => {
				new WordSearch({ size: 10, words: [] }).generate();
			}).toThrow('Words array cannot be empty');
		});

		test('generates grid of correct size', () => {
			const grid = wordSearch.generate();
			expect(grid.length).toBe(10);
			grid.forEach((row) => {
				expect(row.length).toBe(10);
			});
		});

		test('fills all cells', () => {
			const grid = wordSearch.generate();
			grid.forEach((row) => {
				row.forEach((cell) => {
					expect(cell).toMatch(/^[A-Z]$/);
				});
			});
		});

		test('places all words', () => {
			wordSearch.generate();
			const positions = wordSearch.getPositions();
			expect(positions.size).toBe(2);
			expect(positions.has('HELLO')).toBe(true);
			expect(positions.has('WORLD')).toBe(true);
		});

		test('generates valid grids across multiple generations', () => {
			const wordSearch = new WordSearch({
				size: 10,
				words: ['HELLO', 'WORLD'],
				allowDiagonal: true,
				fillBlanks: true,
			});

			const firstGrid = wordSearch.generate();
			const firstHelloPos = wordSearch.getWordPositions('HELLO');
			const firstWorldPos = wordSearch.getWordPositions('WORLD');

			expect(firstHelloPos).not.toBeNull();
			expect(firstWorldPos).not.toBeNull();
			const firstHello = firstHelloPos?.map((pos) => firstGrid[pos.x][pos.y]).join('');
			const firstWorld = firstWorldPos?.map((pos) => firstGrid[pos.x][pos.y]).join('');
			expect(firstHello).toBe('HELLO');
			expect(firstWorld).toBe('WORLD');

			const secondGrid = wordSearch.generate();
			const secondHelloPos = wordSearch.getWordPositions('HELLO');
			const secondWorldPos = wordSearch.getWordPositions('WORLD');

			expect(secondHelloPos).not.toBeNull();
			expect(secondWorldPos).not.toBeNull();
			const secondHello = secondHelloPos?.map((pos) => secondGrid[pos.x][pos.y]).join('');
			const secondWorld = secondWorldPos?.map((pos) => secondGrid[pos.x][pos.y]).join('');
			expect(secondHello).toBe('HELLO');
			expect(secondWorld).toBe('WORLD');

			firstGrid.forEach((row) => row.forEach((cell) => expect(cell).toMatch(/^[A-Z]$/)));
			secondGrid.forEach((row) => row.forEach((cell) => expect(cell).toMatch(/^[A-Z]$/)));

			const isValidSequence = (positions: Position[]) => {
				return positions.every((pos, i) => {
					if (i === 0) return true;
					const prev = positions[i - 1];
					const deltaX = Math.abs(pos.x - prev.x);
					const deltaY = Math.abs(pos.y - prev.y);
					// Check if positions are adjacent (including diagonal)
					return deltaX <= 1 && deltaY <= 1 && !(deltaX === 0 && deltaY === 0);
				});
			};

			expect(isValidSequence(firstHelloPos!)).toBe(true);
			expect(isValidSequence(firstWorldPos!)).toBe(true);
			expect(isValidSequence(secondHelloPos!)).toBe(true);
			expect(isValidSequence(secondWorldPos!)).toBe(true);
		});

		test('can place overlapping words', () => {
			const overlappingSearch = new WordSearch({
				size: 5,
				words: ['CAT', 'RAT'], // Share 'AT'
				allowDiagonal: false,
				fillBlanks: false,
			});

			const grid = overlappingSearch.generate();
			const catPositions = overlappingSearch.getWordPositions('CAT');
			const ratPositions = overlappingSearch.getWordPositions('RAT');

			expect(catPositions).toBeTruthy();
			expect(ratPositions).toBeTruthy();

			const catWord = catPositions?.map((pos) => grid[pos.x][pos.y]).join('');
			const ratWord = ratPositions?.map((pos) => grid[pos.x][pos.y]).join('');
			expect(catWord).toBe('CAT');
			expect(ratWord).toBe('RAT');

			// Check if 'AT' positions are shared in either word
			const atInCat = catPositions
				?.slice(1)
				.map((pos) => grid[pos.x][pos.y])
				.join('');
			const atInRat = ratPositions
				?.slice(1)
				.map((pos) => grid[pos.x][pos.y])
				.join('');
			expect(atInCat).toBe('AT');
			expect(atInRat).toBe('AT');
		});

		test('handles large word list with a small grid', () => {
			const words = [
				'CAT',
				'DOG',
				'BIRD',
				'FISH',
				'LION',
				'TIGER',
				'BEAR',
				'HORSE',
				'MOUSE',
				'SNAKE',
				'APPLE',
				'ORANGE',
				'BANANA',
				'GRAPE',
				'PEACH',
				'PLUM',
				'PEAR',
				'KIWI',
				'MANGO',
				'LEMON',
				'HOUSE',
				'CHAIR',
				'TABLE',
				'LAMP',
				'COUCH',
				'DOOR',
				'FLOOR',
				'WALL',
				'WINDOW',
				'CEILING',
				'OCEAN',
				'RIVER',
				'LAKE',
				'POND',
				'WATERFALL',
				'SPRING',
				'STREAM',
				'WAVE',
				'TIDE',
				'CURRENT',
				'EARTH',
				'MOON',
				'SUN',
				'STAR',
				'PLANET',
				'COMET',
				'ASTEROID',
				'GALAXY',
				'UNIVERSE',
				'BLACKHOLE',
				'SCHOOL',
				'TEACHER',
				'STUDENT',
				'CLASS',
				'HOMEWORK',
				'BOOK',
				'PENCIL',
				'PAPER',
				'DESK',
				'BOARD',
			];

			const wordSearch = new WordSearch({
				words,
				allowDiagonal: true,
				fillBlanks: true,
			});

			const grid = wordSearch.generate();

			expect(grid.length).toBe(62);
			grid.forEach((row) => {
				expect(row.length).toBe(62);
			});

			const positions = wordSearch.getPositions();
			words.forEach((word) => {
				expect(positions.has(word)).toBe(true);
			});

			grid.forEach((row) => {
				row.forEach((cell) => {
					expect(cell).toMatch(/^[A-Z]$/);
				});
			});
		});
	});

	describe('Direction Handling', () => {
		test('places words in valid directions when diagonal disabled', () => {
			const horizontalOnly = new WordSearch({
				size: 5,
				words: ['TEST'],
				allowDiagonal: false,
				fillBlanks: false,
			});

			const grid = horizontalOnly.generate();
			const positions = horizontalOnly.getWordPositions('TEST');
			expect(positions).toBeTruthy();

			// Get the direction by checking adjacent positions
			const isHorizontal = positions?.every(
				(pos, i) => i === 0 || (pos.x === positions[i - 1].x && pos.y === positions[i - 1].y + 1)
			);
			const isVertical = positions?.every(
				(pos, i) => i === 0 || (pos.x === positions[i - 1].x + 1 && pos.y === positions[i - 1].y)
			);

			expect(isHorizontal || isVertical).toBe(true);

			const word = positions?.map((pos) => grid[pos.x][pos.y]).join('');
			expect(word).toBe('TEST');
		});
	});

	describe('Word Search Utilities', () => {
		let wordSearch: WordSearch;

		beforeEach(() => {
			wordSearch = new WordSearch({
				size: 10,
				words: ['HELLO', 'WORLD', 'TEST'],
				allowDiagonal: true,
			});
		});

		test('returns null for non-existent word positions', () => {
			wordSearch.generate();
			expect(wordSearch.getWordPositions('NOTFOUND')).toBeNull();
		});

		test('hasWord is case insensitive', () => {
			wordSearch.generate();
			expect(wordSearch.hasWord('hello')).toBe(true);
			expect(wordSearch.hasWord('HELLO')).toBe(true);
			expect(wordSearch.hasWord('Hello')).toBe(true);
		});

		test('toString produces valid grid representation', () => {
			wordSearch.generate();
			const str = wordSearch.toString();
			const lines = str.split('\n');

			expect(lines.length).toBe(10);
			lines.forEach((line) => {
				const cells = line.split(' ');
				expect(cells.length).toBe(10);
				cells.forEach((cell) => {
					expect(cell).toMatch(/^[A-Z]$/);
				});
			});
		});

		test('getGrid returns deep copy of grid', () => {
			const originalGrid = wordSearch.generate();
			const gridCopy = wordSearch.getGrid();

			gridCopy[0][0] = '👹';

			expect(originalGrid[0][0]).not.toBe('👹');
		});

		test('verifies word placement is correct', () => {
			const grid = wordSearch.generate();
			const positions = wordSearch.getWordPositions('HELLO');
			expect(positions).toBeTruthy();

			const word = positions?.map((pos) => grid[pos.x][pos.y]).join('');
			expect(word).toBe('HELLO');

			// Verify positions are adjacent
			positions?.forEach((pos, i) => {
				if (i > 0) {
					const prevPos = positions[i - 1];
					const distance = Math.abs(pos.x - prevPos.x) + Math.abs(pos.y - prevPos.y);
					// Distance should be 1 for horizontal/vertical, or 2 for diagonal
					expect(distance === 1 || distance === 2).toBe(true);
				}
			});
		});
	});

	describe('Grid Export/Import', () => {
		let wordSearch: WordSearch;

		beforeEach(() => {
			wordSearch = new WordSearch({
				size: 10,
				words: ['HELLO', 'WORLD', 'TEST'],
				allowDiagonal: true,
			});
		});

		test('should export the grid correctly', () => {
			wordSearch.generate();
			const exportedData = wordSearch.export(); // Export both grid and placed words

			expect(exportedData.grid).toBeInstanceOf(Array);
			expect(exportedData.grid.length).toBe(wordSearch.getGridSize());
			expect(exportedData.grid[0].length).toBe(wordSearch.getGridSize());
			expect(exportedData.grid[0]).toBeInstanceOf(Array);
			expect(exportedData.positions.size).toBeGreaterThan(0); // Ensure words were placed
		});

		test('should import the grid correctly and reset word placements', () => {
			wordSearch.generate();
			const exportedData = wordSearch.export(); // Export both grid and placed words

			const newWordSearch = new WordSearch({
				words: ['HELLO', 'WORLD', 'TEST'], // Import words so we expect placements
				allowDiagonal: true,
			});

			newWordSearch.import(exportedData.grid, exportedData.positions); // Import both grid and placed words

			expect(newWordSearch.getGrid()).toEqual(exportedData.grid);
			expect(newWordSearch.getPositions()).toEqual(exportedData.positions);
		});

		test('should throw an error if the imported grid has incorrect dimensions', () => {
			wordSearch.generate();
			const exportedData = wordSearch.export();

			const newWordSearch = new WordSearch({
				words: ['HELLO', 'WORLD', 'TEST'],
				allowDiagonal: true,
			});

			const invalidGrid = exportedData.grid.map((row) => row.slice(0, row.length - 1)); // Modify grid to make it invalid

			expect(() => newWordSearch.import(invalidGrid, exportedData.positions)).toThrowError(
				'Invalid grid dimensions'
			);
		});

		test('should throw an error if the imported grid contains mismatched word placements', () => {
			wordSearch.generate();
			const exportedData = wordSearch.export();

			const newWordSearch = new WordSearch({
				words: ['HELLO', 'WORLD', 'TEST'],
				allowDiagonal: true,
			});

			const modifiedGrid = exportedData.grid.map((row) => row.slice());
			for (let x = 0; x < modifiedGrid.length; x++) {
				for (let y = 0; y < modifiedGrid[x].length; y++) {
					if (modifiedGrid[x][y] === 'H') {
						// Replace the "H" of HELLO
						modifiedGrid[x][y] = '👹';
					}
				}
			}

			expect(() => newWordSearch.import(modifiedGrid, exportedData.positions)).toThrowError(
				'Grid contains mismatched word placements'
			);
		});
	});
});
