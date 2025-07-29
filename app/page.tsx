"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GameBoard } from "@/components/game-board"
import { GameStats } from "@/components/game-stats"
import { type Board, checkWinner, isBoardFull, getBestMove } from "@/lib/minimax"
import { Brain, RotateCcw, Trophy } from "lucide-react"

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "draw">("playing")
  const [isThinking, setIsThinking] = useState(false)
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 })

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setGameStatus("playing")
    setIsThinking(false)
  }, [])

  const makePlayerMove = useCallback(
    (index: number) => {
      if (board[index] || gameStatus !== "playing" || !isPlayerTurn || isThinking) {
        return
      }

      const newBoard = [...board]
      newBoard[index] = "X"
      setBoard(newBoard)
      setIsPlayerTurn(false)

      // Check if player won
      const winner = checkWinner(newBoard)
      if (winner === "X") {
        setGameStatus("won")
        setStats((prev) => ({ ...prev, wins: prev.wins + 1 }))
        return
      }

      // Check for draw
      if (isBoardFull(newBoard)) {
        setGameStatus("draw")
        setStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
        return
      }
    },
    [board, gameStatus, isPlayerTurn, isThinking],
  )

  // AI move effect
  useEffect(() => {
    if (!isPlayerTurn && gameStatus === "playing") {
      setIsThinking(true)

      // Add a small delay to show thinking state
      const timer = setTimeout(() => {
        const aiMove = getBestMove([...board])
        if (aiMove !== -1) {
          const newBoard = [...board]
          newBoard[aiMove] = "O"
          setBoard(newBoard)

          // Check if AI won
          const winner = checkWinner(newBoard)
          if (winner === "O") {
            setGameStatus("lost")
            setStats((prev) => ({ ...prev, losses: prev.losses + 1 }))
          } else if (isBoardFull(newBoard)) {
            setGameStatus("draw")
            setStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
          }
        }

        setIsPlayerTurn(true)
        setIsThinking(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameStatus, board])

  const getStatusMessage = () => {
    if (isThinking) return "AI is thinking..."
    if (gameStatus === "won") return "🎉 You won!"
    if (gameStatus === "lost") return "🤖 AI wins!"
    if (gameStatus === "draw") return "🤝 It's a draw!"
    return isPlayerTurn ? "Your turn" : "AI's turn"
  }

  const getStatusColor = () => {
    if (gameStatus === "won") return "bg-green-100 text-green-800"
    if (gameStatus === "lost") return "bg-red-100 text-red-800"
    if (gameStatus === "draw") return "bg-yellow-100 text-yellow-800"
    return "bg-blue-100 text-blue-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Tic Tac Toe</h1>
          </div>
          <p className="text-gray-600">Challenge the unbeatable AI</p>
        </div>

        {/* Game Status */}
        <div className="text-center">
          <Badge className={`text-lg px-4 py-2 ${getStatusColor()}`}>{getStatusMessage()}</Badge>
        </div>

        {/* Game Board */}
        <Card>
          <CardContent className="p-6">
            <GameBoard
              board={board}
              onCellClick={makePlayerMove}
              disabled={!isPlayerTurn || gameStatus !== "playing" || isThinking}
            />
          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex gap-3">
          <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent" disabled={isThinking}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Game Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5" />
              Game Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GameStats wins={stats.wins} losses={stats.losses} draws={stats.draws} />
          </CardContent>
        </Card>

        {/* Game Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-blue-600">X</span>
                  <span className="text-gray-600">You</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-red-600">O</span>
                  <span className="text-gray-600">AI</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">The AI uses the Minimax algorithm and is unbeatable!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
