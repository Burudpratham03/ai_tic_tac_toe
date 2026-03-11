/**
 * Tic-Tac-Toe Game Engine
 * 
 * This module contains zero UI code and handles:
 * - Board state management
 * - Move validation
 * - Win checking
 * - AI logic with unbeatable Minimax algorithm
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type GameResult = Player | 'draw' | null;
export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================================================================
// GAME ENGINE CLASS
// ============================================================================

export class TicTacToeEngine {
  private board: Board;
  private currentPlayer: Player;
  
  constructor(initialPlayer: Player = 'X') {
    this.board = Array(9).fill(null);
    this.currentPlayer = initialPlayer;
  }

  // --------------------------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------------------------

  /**
   * Attempt to make a move at the specified position
   * @returns true if move was valid and made, false otherwise
   */
  makeMove(position: number, player?: Player): boolean {
    // Validate position
    if (position < 0 || position > 8) {
      return false;
    }

    // Check if cell is already occupied
    if (this.board[position] !== null) {
      return false;
    }

    // Check if game is already over
    if (this.checkWinner() !== null) {
      return false;
    }

    // Use provided player or current player
    const movePlayer = player || this.currentPlayer;
    
    // Make the move
    this.board[position] = movePlayer;
    
    // Switch player
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    
    return true;
  }

  /**
   * Get the current board state (copy to prevent external mutation)
   */
  getBoard(): Board {
    return [...this.board];
  }

  /**
   * Get the current player
   */
  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  /**
   * Check if there's a winner or draw
   * @returns 'X', 'O', 'draw', or null (game ongoing)
   */
  checkWinner(): GameResult {
    return TicTacToeEngine.checkWinnerStatic(this.board);
  }

  /**
   * Get all available (empty) positions
   */
  getAvailableMoves(): number[] {
    return this.board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);
  }

  /**
   * Check if the board is full
   */
  isBoardFull(): boolean {
    return this.board.every(cell => cell !== null);
  }

  /**
   * Reset the game to initial state
   */
  reset(initialPlayer: Player = 'X'): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = initialPlayer;
  }

  /**
   * Get AI move based on difficulty level
   */
  getAIMove(difficulty: Difficulty, aiPlayer: Player = 'O'): number {
    const availableMoves = this.getAvailableMoves();
    
    if (availableMoves.length === 0) {
      return -1;
    }

    switch (difficulty) {
      case 'easy':
        return this.getRandomMove(availableMoves);
      
      case 'medium':
        return this.getMediumMove(aiPlayer, availableMoves);
      
      case 'hard':
        return this.getMinimaxMove(aiPlayer);
      
      default:
        return this.getRandomMove(availableMoves);
    }
  }

  // --------------------------------------------------------------------------
  // STATIC UTILITY METHODS (can be used without instance)
  // --------------------------------------------------------------------------

  /**
   * Check winner on any board (static utility)
   */
  static checkWinnerStatic(board: Board): GameResult {
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Check for winning line
    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player;
      }
    }

    // Check for draw
    if (board.every(cell => cell !== null)) {
      return 'draw';
    }

    // Game ongoing
    return null;
  }

  // --------------------------------------------------------------------------
  // PRIVATE AI LOGIC
  // --------------------------------------------------------------------------

  /**
   * Easy difficulty: Random move
   */
  private getRandomMove(availableMoves: number[]): number {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  /**
   * Medium difficulty: Try to win, block opponent, or random
   */
  private getMediumMove(aiPlayer: Player, availableMoves: number[]): number {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';

    // Try to win
    const winningMove = this.findWinningMove(aiPlayer);
    if (winningMove !== -1) {
      return winningMove;
    }

    // Block opponent's winning move
    const blockingMove = this.findWinningMove(opponent);
    if (blockingMove !== -1) {
      return blockingMove;
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Random move
    return this.getRandomMove(availableMoves);
  }

  /**
   * Find a move that would result in a win for the given player
   */
  private findWinningMove(player: Player): number {
    const availableMoves = this.getAvailableMoves();
    
    for (const move of availableMoves) {
      // Simulate the move
      const testBoard = [...this.board];
      testBoard[move] = player;
      
      // Check if it wins
      if (TicTacToeEngine.checkWinnerStatic(testBoard) === player) {
        return move;
      }
    }
    
    return -1;
  }

  /**
   * Hard difficulty: Unbeatable Minimax algorithm with alpha-beta pruning
   */
  private getMinimaxMove(aiPlayer: Player): number {
    let bestScore = -Infinity;
    let bestMove = -1;
    const availableMoves = this.getAvailableMoves();

    // Early game optimization: take center if available
    if (this.board.filter(cell => cell !== null).length <= 1 && this.board[4] === null) {
      return 4;
    }

    for (const move of availableMoves) {
      // Make the move
      this.board[move] = aiPlayer;
      
      // Evaluate the move
      const score = this.minimax(
        this.board,
        0,
        false,
        -Infinity,
        Infinity,
        aiPlayer
      );
      
      // Undo the move
      this.board[move] = null;

      // Track best move
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   * 
   * @param board - Current board state
   * @param depth - Current recursion depth
   * @param isMaximizing - True if AI's turn, false if opponent's turn
   * @param alpha - Alpha value for pruning
   * @param beta - Beta value for pruning
   * @param aiPlayer - The AI player ('X' or 'O')
   * @returns Score of the position
   */
  private minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    aiPlayer: Player
  ): number {
    const result = TicTacToeEngine.checkWinnerStatic(board);
    const opponent = aiPlayer === 'X' ? 'O' : 'X';

    // Terminal states (base cases)
    if (result === aiPlayer) {
      return 10 - depth; // AI wins (prefer faster wins)
    }
    if (result === opponent) {
      return depth - 10; // Opponent wins (prefer slower losses)
    }
    if (result === 'draw') {
      return 0; // Draw
    }

    const availableMoves = board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);

    if (isMaximizing) {
      // AI's turn - maximize score
      let maxScore = -Infinity;
      
      for (const move of availableMoves) {
        board[move] = aiPlayer;
        const score = this.minimax(board, depth + 1, false, alpha, beta, aiPlayer);
        board[move] = null;
        
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        
        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return maxScore;
    } else {
      // Opponent's turn - minimize score
      let minScore = Infinity;
      
      for (const move of availableMoves) {
        board[move] = opponent;
        const score = this.minimax(board, depth + 1, true, alpha, beta, aiPlayer);
        board[move] = null;
        
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        
        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return minScore;
    }
  }

  // --------------------------------------------------------------------------
  // DEBUGGING / UTILITY
  // --------------------------------------------------------------------------

  /**
   * Get a string representation of the board (for debugging)
   */
  toString(): string {
    const board = this.board.map(cell => cell || ' ');
    return `
 ${board[0]} | ${board[1]} | ${board[2]} 
-----------
 ${board[3]} | ${board[4]} | ${board[5]} 
-----------
 ${board[6]} | ${board[7]} | ${board[8]} 
    `.trim();
  }
}

// ============================================================================
// STANDALONE HELPER FUNCTIONS (for backward compatibility)
// ============================================================================

/**
 * Check winner without creating an engine instance
 */
export function checkWinner(board: Board): GameResult {
  return TicTacToeEngine.checkWinnerStatic(board);
}

/**
 * Get AI move without creating an engine instance
 */
export function getAIMove(board: Board, difficulty: Difficulty, aiPlayer: Player = 'O'): number {
  const engine = new TicTacToeEngine();
  // Set the board state
  board.forEach((cell, index) => {
    if (cell !== null) {
      (engine as any).board[index] = cell;
    }
  });
  return engine.getAIMove(difficulty, aiPlayer);
}
