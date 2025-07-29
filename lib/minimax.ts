export type Player = "X" | "O" | null
export type Board = Player[]

export function checkWinner(board: Board): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null)
}

export function getAvailableMoves(board: Board): number[] {
  return board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1)
}

export function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha = Number.NEGATIVE_INFINITY,
  beta: number = Number.POSITIVE_INFINITY,
): number {
  const winner = checkWinner(board)

  // Terminal states
  if (winner === "O") return 10 - depth // AI wins
  if (winner === "X") return depth - 10 // Human wins
  if (isBoardFull(board)) return 0 // Draw

  const availableMoves = getAvailableMoves(board)

  if (isMaximizing) {
    let maxEval = Number.NEGATIVE_INFINITY
    for (const move of availableMoves) {
      board[move] = "O"
      const moveValue = minimax(board, depth + 1, false, alpha, beta)
      board[move] = null
      maxEval = Math.max(maxEval, moveValue)
      alpha = Math.max(alpha, moveValue)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return maxEval
  } else {
    let minEval = Number.POSITIVE_INFINITY
    for (const move of availableMoves) {
      board[move] = "X"
      const moveValue = minimax(board, depth + 1, true, alpha, beta)
      board[move] = null
      minEval = Math.min(minEval, moveValue)
      beta = Math.min(beta, moveValue)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return minEval
  }
}

export function getBestMove(board: Board): number {
  let bestMove = -1
  let bestValue = Number.NEGATIVE_INFINITY
  const availableMoves = getAvailableMoves(board)

  for (const move of availableMoves) {
    board[move] = "O"
    const moveValue = minimax(board, 0, false)
    board[move] = null

    if (moveValue > bestValue) {
      bestValue = moveValue
      bestMove = move
    }
  }

  return bestMove
}
