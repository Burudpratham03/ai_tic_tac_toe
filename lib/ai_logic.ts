type Board = Array<string | null>;
type Difficulty = 'easy' | 'medium' | 'hard';

export function checkWinner(board: Board): string | null {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell)) return 'draw';
    return null;
}

function getRandomMove(board: Board): number {
    const emptySquares = board.reduce<number[]>((acc, cell, idx) => {
        if (!cell) acc.push(idx);
        return acc;
    }, []);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}

function findWinningMove(board: Board, player: string): number | null {
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            const testBoard = [...board];
            testBoard[i] = player;
            if (checkWinner(testBoard) === player) {
                return i;
            }
        }
    }
    return null;
}

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
    const winner = checkWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

export function getAIMove(board: Board, difficulty: Difficulty): number {
    // Easy: Random move
    if (difficulty === 'easy') {
        return getRandomMove(board);
    }

    // Medium: Block winning moves or make winning moves, otherwise random
    if (difficulty === 'medium') {
        // Try to win
        const winningMove = findWinningMove(board, 'O');
        if (winningMove !== null) return winningMove;

        // Block opponent
        const blockingMove = findWinningMove(board, 'X');
        if (blockingMove !== null) return blockingMove;

        // Random move
        return getRandomMove(board);
    }

    // Hard: Use minimax algorithm
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}