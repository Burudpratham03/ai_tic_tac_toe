/**
 * Basic tests for the TicTacToeEngine
 * Run with: npx ts-node tests/engine.test.ts
 */

import { TicTacToeEngine } from '../lib/engine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

// Test 1: Basic move validation
console.log('\n=== Test 1: Basic Move Validation ===');
const engine1 = new TicTacToeEngine('X');
assert(engine1.makeMove(0, 'X'), 'Should allow first move');
assert(!engine1.makeMove(0, 'O'), 'Should not allow move on occupied cell');
assert(engine1.makeMove(1, 'O'), 'Should allow second move');

// Test 2: Win detection (row)
console.log('\n=== Test 2: Win Detection (Row) ===');
const engine2 = new TicTacToeEngine('X');
engine2.makeMove(0, 'X');
engine2.makeMove(3, 'O');
engine2.makeMove(1, 'X');
engine2.makeMove(4, 'O');
engine2.makeMove(2, 'X');
assert(engine2.checkWinner() === 'X', 'Should detect X winning in a row');

// Test 3: Win detection (diagonal)
console.log('\n=== Test 3: Win Detection (Diagonal) ===');
const engine3 = new TicTacToeEngine('X');
engine3.makeMove(0, 'X');
engine3.makeMove(1, 'O');
engine3.makeMove(4, 'X');
engine3.makeMove(2, 'O');
engine3.makeMove(8, 'X');
assert(engine3.checkWinner() === 'X', 'Should detect X winning diagonally');

// Test 4: Draw detection
console.log('\n=== Test 4: Draw Detection ===');
const engine4 = new TicTacToeEngine('X');
engine4.makeMove(0, 'X');
engine4.makeMove(1, 'O');
engine4.makeMove(2, 'X');
engine4.makeMove(4, 'O');
engine4.makeMove(3, 'X');
engine4.makeMove(5, 'O');
engine4.makeMove(7, 'X');
engine4.makeMove(6, 'O');
engine4.makeMove(8, 'X');
assert(engine4.checkWinner() === 'draw', 'Should detect draw');

// Test 5: AI Move (Easy difficulty)
console.log('\n=== Test 5: AI Move (Easy) ===');
const engine5 = new TicTacToeEngine('X');
engine5.makeMove(0, 'X');
const aiMove = engine5.getAIMove('easy', 'O');
assert(aiMove >= 0 && aiMove <= 8, 'AI should return valid move index');
assert(engine5.getBoard()[aiMove] === null, 'AI should pick empty cell');

// Test 6: AI Move (Hard - should block)
console.log('\n=== Test 6: AI Move (Hard - Blocking) ===');
const engine6 = new TicTacToeEngine('X');
engine6.makeMove(0, 'X');
engine6.makeMove(3, 'O');
engine6.makeMove(1, 'X');
const blockMove = engine6.getAIMove('hard', 'O');
assert(blockMove === 2, 'Hard AI should block winning move (position 2)');

// Test 7: AI Move (Hard - should win)
console.log('\n=== Test 7: AI Move (Hard - Winning) ===');
const engine7 = new TicTacToeEngine('X');
engine7.makeMove(0, 'X');
engine7.makeMove(3, 'O');
engine7.makeMove(1, 'X');
engine7.makeMove(4, 'O');
engine7.makeMove(6, 'X');
const winMove = engine7.getAIMove('hard', 'O');
assert(winMove === 5, 'Hard AI should take winning move (position 5)');

// Test 8: Unbeatable AI test (X starts, AI is O)
console.log('\n=== Test 8: Unbeatable AI (Multiple Games) ===');
let aiLosses = 0;
const totalGames = 10;

for (let game = 0; game < totalGames; game++) {
  const engine = new TicTacToeEngine('X');
  let moveCount = 0;
  
  while (engine.checkWinner() === null && moveCount < 9) {
    const currentPlayer = engine.getCurrentPlayer();
    
    if (currentPlayer === 'O') {
      // AI's turn
      const move = engine.getAIMove('hard', 'O');
      if (move !== -1) {
        engine.makeMove(move, 'O');
      }
    } else {
      // Simulate optimal human play (also using minimax)
      const move = engine.getAIMove('hard', 'X');
      if (move !== -1) {
        engine.makeMove(move, 'X');
      }
    }
    moveCount++;
  }
  
  const result = engine.checkWinner();
  if (result === 'X') {
    aiLosses++;
  }
}

assert(aiLosses === 0, `AI should never lose (lost ${aiLosses}/${totalGames} games)`);
console.log(`   AI played ${totalGames} games against optimal opponent without losing!`);

// Test 9: Board reset
console.log('\n=== Test 9: Board Reset ===');
const engine9 = new TicTacToeEngine('X');
engine9.makeMove(0, 'X');
engine9.makeMove(1, 'O');
engine9.reset('O');
assert(engine9.getBoard().every(cell => cell === null), 'Board should be empty after reset');
assert(engine9.getCurrentPlayer() === 'O', 'Current player should be O after reset');

// Test 10: Available moves
console.log('\n=== Test 10: Available Moves ===');
const engine10 = new TicTacToeEngine('X');
assert(engine10.getAvailableMoves().length === 9, 'Should have 9 available moves initially');
engine10.makeMove(4, 'X');
assert(engine10.getAvailableMoves().length === 8, 'Should have 8 available moves after one move');
assert(!engine10.getAvailableMoves().includes(4), 'Should not include occupied cell');

console.log('\n🎉 All tests passed! The engine is working correctly.');
console.log('✨ The Minimax AI is unbeatable!\n');
