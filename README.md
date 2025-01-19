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

## Installation

You can install `@aydee/word-search` via `bun`:

```bash
bun add @aydee/word-search
```

Alternatively, use npm or yarn:

```bash
npm install @aydee/word-search
# or
yarn add @aydee/word-search
```

## Usage

### Basic Example

```ts
import { WordSearch } from '@aydee/word-search';

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

Constructor to initialize the WordSearch puzzle generator.

#### Parameters

- `words` (string[]): An array of words to include in the puzzle.
- `size` (number, optional): Grid size. If not specified, will calculate based on the word lengths.
- `allowDiagonal` (boolean, optional): Whether diagonal word placement is allowed. Default is `false`.
- `fillBlanks` (boolean, optional): Whether to fill empty spaces with random letters. Default is `true`.

#### `generate(): string[][]` 
Generates the word search puzzle and returns a 2D array representing the grid.

#### `hasWord(word: string): boolean` 
Checks if a word exists in the puzzle.

#### `getWordPositions(word: string): Position[] | null` 
Returns the positions of a word in the puzzle, or `null` if not found.

#### `getGrid(): string[][]` 
Returns the current grid state.

#### `print(): void` 
Prints the current grid to the console.

#### `toString(): string` 
Converts the grid into a string format for easier display.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Feel free to fork the repository and create a pull request. We welcome contributions!