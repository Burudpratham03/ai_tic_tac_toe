import { describe, it, expect } from 'vitest'
import { checkWinner, isBoardFull, getAvailableMoves, minimax, getBestMove } from './minimax'
import type { Board } from './minimax'

describe('Tic Tac Toe Game Engine', () => {
  describe('Test 1: Horizontal Win Detection', () => {
    it('should detect horizontal win in top row', () => {
      const board: Board = ['X', 'X', 'X', null, null, null, null, null, null]
      expect(checkWinner(board)).toBe('X')
    })

    it('should detect horizontal win in middle row', () => {
      const board: Board = [null, null, null, 'O', 'O', 'O', null, null, null]
      expect(checkWinner(board)).toBe('O')
    })

    it('should detect horizontal win in bottom row', () => {
      const board: Board = [null, null, null, null, null, null, 'X', 'X', 'X']
      expect(checkWinner(board)).toBe('X')
    })

    it('should not detect win with incomplete row', () => {
      const board: Board = ['X', 'X', null, null, null, null, null, null, null]
      expect(checkWinner(board)).toBeNull()
    })
  })

  describe('Test 2: Vertical Win Detection', () => {
    it('should detect vertical win in left column', () => {
      const board: Board = ['O', null, null, 'O', null, null, 'O', null, null]
      expect(checkWinner(board)).toBe('O')
    })

    it('should detect vertical win in middle column', () => {
      const board: Board = [null, 'X', null, null, 'X', null, null, 'X', null]
      expect(checkWinner(board)).toBe('X')
    })

    it('should detect vertical win in right column', () => {
      const board: Board = [null, null, 'O', null, null, 'O', null, null, 'O']
      expect(checkWinner(board)).toBe('O')
    })

    it('should not detect win with incomplete column', () => {
      const board: Board = ['X', null, null, 'X', null, null, null, null, null]
      expect(checkWinner(board)).toBeNull()
    })
  })

  describe('Test 3: Diagonal Win Detection', () => {
    it('should detect diagonal win from top-left to bottom-right', () => {
      const board: Board = ['X', null, null, null, 'X', null, null, null, 'X']
      expect(checkWinner(board)).toBe('X')
    })

    it('should detect diagonal win from top-right to bottom-left', () => {
      const board: Board = [null, null, 'O', null, 'O', null, 'O', null, null]
      expect(checkWinner(board)).toBe('O')
    })

    it('should not detect win with incomplete diagonal', () => {
      const board: Board = ['X', null, null, null, 'X', null, null, null, null]
      expect(checkWinner(board)).toBeNull()
    })

    it('should not detect win with mixed diagonal', () => {
      const board: Board = ['X', null, null, null, 'O', null, null, null, 'X']
      expect(checkWinner(board)).toBeNull()
    })
  })

  describe('Test 4: Draw Detection (Full Board)', () => {
    it('should detect draw when board is full with no winner', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
      expect(checkWinner(board)).toBeNull()
      expect(isBoardFull(board)).toBe(true)
    })

    it('should detect another draw scenario', () => {
      const board: Board = ['O', 'X', 'O', 'O', 'X', 'X', 'X', 'O', 'O']
      expect(checkWinner(board)).toBeNull()
      expect(isBoardFull(board)).toBe(true)
    })

    it('should not detect draw when board has empty cells', () => {
      const board: Board = ['X', 'O', 'X', null, 'O', 'O', 'O', 'X', 'X']
      expect(isBoardFull(board)).toBe(false)
    })

    it('should correctly identify game is not over when spaces remain', () => {
      const board: Board = ['X', null, 'O', null, null, null, null, null, null]
      expect(isBoardFull(board)).toBe(false)
      expect(checkWinner(board)).toBeNull()
    })
  })

  describe('Test 5: Preventing Moves on Occupied Squares', () => {
    it('should not include occupied squares in available moves', () => {
      const board: Board = ['X', null, 'O', null, 'X', null, null, 'O', null]
      const availableMoves = getAvailableMoves(board)
      expect(availableMoves).toEqual([1, 3, 5, 6, 8])
      expect(availableMoves).not.toContain(0) // X
      expect(availableMoves).not.toContain(2) // O
      expect(availableMoves).not.toContain(4) // X
      expect(availableMoves).not.toContain(7) // O
    })

    it('should return empty array when board is full', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
      const availableMoves = getAvailableMoves(board)
      expect(availableMoves).toEqual([])
      expect(availableMoves.length).toBe(0)
    })

    it('should return all positions when board is empty', () => {
      const board: Board = [null, null, null, null, null, null, null, null, null]
      const availableMoves = getAvailableMoves(board)
      expect(availableMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
      expect(availableMoves.length).toBe(9)
    })

    it('should only return valid move indices', () => {
      const board: Board = ['X', 'O', null, 'X', null, 'O', null, null, 'X']
      const availableMoves = getAvailableMoves(board)
      expect(availableMoves).toEqual([2, 4, 6, 7])
      // Verify all returned indices point to null cells
      availableMoves.forEach((index) => {
        expect(board[index]).toBeNull()
      })
    })
  })

  describe('Bonus: AI Logic and Minimax Algorithm', () => {
    it('should block opponent from winning', () => {
      // X is about to win on top row
      const board: Board = ['X', 'X', null, 'O', null, null, null, null, null]
      const bestMove = getBestMove(board)
      expect(bestMove).toBe(2) // AI should block
    })

    it('should take winning move when available', () => {
      // O can win on middle row
      const board: Board = ['X', null, 'X', 'O', 'O', null, null, null, null]
      const bestMove = getBestMove(board)
      expect(bestMove).toBe(5) // AI should win
    })

    it('should prefer center on empty board', () => {
      const board: Board = [null, null, null, null, null, null, null, null, null]
      const bestMove = getBestMove(board)
      // Center (4) or corners (0, 2, 6, 8) are optimal
      expect([0, 2, 4, 6, 8]).toContain(bestMove)
    })

    it('minimax should return 0 for draw scenario', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null]
      const score = minimax(board, 0, true)
      expect(score).toBe(0) // Only move leads to draw
    })

    it('should prevent fork scenarios', () => {
      // X has corners, O needs to prevent fork
      const board: Board = ['X', null, null, null, 'O', null, null, null, 'X']
      const bestMove = getBestMove(board)
      // AI should block edge to prevent fork (positions 1, 3, 5, or 7)
      expect([1, 3, 5, 7]).toContain(bestMove)
    })
  })

  describe('Edge Cases and Validation', () => {
    it('should handle already won game', () => {
      const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null]
      expect(checkWinner(board)).toBe('X')
      expect(getAvailableMoves(board).length).toBeGreaterThan(0)
    })

    it('should handle single move remaining', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null]
      const availableMoves = getAvailableMoves(board)
      expect(availableMoves).toEqual([8])
      expect(availableMoves.length).toBe(1)
    })

    it('should correctly evaluate all win combinations', () => {
      const winPatterns = [
        // Horizontal wins
        ['X', 'X', 'X', null, null, null, null, null, null],
        [null, null, null, 'O', 'O', 'O', null, null, null],
        [null, null, null, null, null, null, 'X', 'X', 'X'],
        // Vertical wins
        ['O', null, null, 'O', null, null, 'O', null, null],
        [null, 'X', null, null, 'X', null, null, 'X', null],
        [null, null, 'O', null, null, 'O', null, null, 'O'],
        // Diagonal wins
        ['X', null, null, null, 'X', null, null, null, 'X'],
        [null, null, 'O', null, 'O', null, 'O', null, null],
      ]

      winPatterns.forEach((pattern, index) => {
        const board = pattern as Board
        const winner = checkWinner(board)
        expect(winner).not.toBeNull()
        expect(['X', 'O']).toContain(winner!)
      })
    })

    it('should not modify original board during minimax calculation', () => {
      const originalBoard: Board = ['X', null, null, null, 'O', null, null, null, null]
      const boardCopy = [...originalBoard]
      getBestMove(originalBoard)
      expect(originalBoard).toEqual(boardCopy)
    })
  })
})
