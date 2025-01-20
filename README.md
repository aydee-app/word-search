<p align="center">
  <a href="https://github.com/aydee-app/word-search">
   <img src="https://github.com/user-attachments/assets/3e6c0717-da39-40d6-b1f0-c8bcde3c4126" alt="Logo">
  </a>

  <h2 align="center">Word Search</h2>

  <p align="center">
    A highly customizable word search puzzle generator that allows dynamic grid sizing, optimized word placements, and more.
    <br />
    <a href="https://aydee.app">Aydee</a>
  </p>
</p>


## Features

- Customizable grid size
- Dynamic word placement strategy
- Supports horizontal, vertical, and diagonal directions
- Fills blank spaces with random letters
- Handles large word lists efficiently
- Import/Export Grid

## Installation

You can install `@aydee-app/word-search` via `bun`:

```bash
bun add @aydee-app/word-search
```

Alternatively, use npm or yarn:

```bash
npm install @aydee-app/word-search
# or
yarn add @aydee-app/word-search
```

## Usage

### Basic Example

```ts
import { WordSearch } from '@aydee-app/word-search';

const wordSearch = new WordSearch({
  words: ['apple', 'banana', 'cherry', 'date'],
  size: 10,
  allowDiagonal: true,
  fillBlanks: true,
});

const grid = wordSearch.generate();
console.log(wordSearch.toString());
```

### Customizing the Grid Size

You can let the generator calculate the optimal grid size based on the words' total length or specify it manually:

```ts
const wordSearch = new WordSearch({
  words: ['apple', 'banana', 'cherry'],
  size: 15,  // Manually set grid size
  allowDiagonal: false,
  fillBlanks: false,
});

const grid = wordSearch.generate();
console.log(wordSearch.toString());
```

## API

### `WordSearch(options: WordSearchOptions)`

Constructor to initialize a WordSearch puzzle generator.

#### Parameters

- `words` (string[]): An array of words to include in the puzzle.
- `size` (number, optional): The grid size. If not specified, it will be calculated based on the word lengths.
- `allowDiagonal` (boolean, optional): Specifies whether diagonal word placement is allowed. Default is `false`.
- `fillBlanks` (boolean, optional): Specifies whether to fill empty spaces with random letters. Default is `true`.

#### Methods

- **`generate(): string[][]`**  
  Generates the word search puzzle and returns a 2D array representing the grid.

- **`hasWord(word: string): boolean`**  
  Checks if a word exists in the puzzle.

- **`getPositions(word: string): Position[] | null`**  
  Returns the positions of a word in the puzzle, or `null` if the word is not found.

- **`getGrid(): string[][]`**  
  Returns the current state of the grid.

- **`getGridSize(): number`**  
  Returns the current size of the grid.

- **`export(): { grid: string[][], positions: Map<string, Position[]>, size: number }`**  
  Exports a deep copy of the current grid along with the positions of all placed words in the puzzle. The return value is an object containing the grid and placed words.

- **`import(data: {grid: string[][], positions: Map<string, Position[]}>): void`**  
  Imports a grid and the associated placed words into the puzzle. This method allows you to restore a previous state of the grid, including the positions of the words. If the imported grid dimensions or word placements are invalid, an error will be thrown.

- **`print(): void`**  
  Prints the current grid to the console.

- **`toString(): string`**  
  Converts the grid into a string format for easier display.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Feel free to fork the repository and submit pull requests. We welcome contributions!