"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GameBoard } from "@/components/game-board"
import { GameStats } from "@/components/game-stats"
import { type Board, checkWinner, isBoardFull } from "@/lib/minimax"
import { Brain, RotateCcw, Trophy } from "lucide-react"

export default function TicTacToe() {

  // Two player state
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "draw">("playing")
  const [round, setRound] = useState(1)
  const [maxRounds, setMaxRounds] = useState(5)
  const [roundWins, setRoundWins] = useState<{ X: number; O: number }>({ X: 0, O: 0 })
  const [playerAssignments, setPlayerAssignments] = useState<{ X: string; O: string }>({ X: "Player 1", O: "Player 2" })
  const [isGoldenRound, setIsGoldenRound] = useState(false)
  const [matchWinner, setMatchWinner] = useState<string | null>(null)

  // Reset for a new match
  const resetMatch = useCallback(() => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setGameStatus("playing")
    setRound(1)
    setRoundWins({ X: 0, O: 0 })
    setIsGoldenRound(false)
    setMatchWinner(null)
    // Alternate assignments for next match
    setPlayerAssignments((prev) => ({ X: prev.O, O: prev.X }))
  }, [])

  // Handle a move for the current player
  const makePlayerMove = useCallback(
    (index: number) => {
      if (board[index] || gameStatus !== "playing" || matchWinner) {
        return
      }
      const newBoard = [...board]
      newBoard[index] = currentPlayer
      setBoard(newBoard)

      const winner = checkWinner(newBoard)
      if (winner) {
        setGameStatus("won")
        setRoundWins((prev) => ({ ...prev, [winner]: prev[winner] + 1 }))
        // Check for match win after a short delay
        setTimeout(() => {
          let nextRound = round + 1
          let nextIsGolden = isGoldenRound
          let nextMatchWinner = null
          let nextMaxRounds = maxRounds
          let nextRoundWins = { ...roundWins, [winner]: roundWins[winner] + 1 }
          if (!isGoldenRound) {
            // Normal rounds
            if (nextRound > maxRounds) {
              if (nextRoundWins.X > nextRoundWins.O) nextMatchWinner = playerAssignments.X
              else if (nextRoundWins.O > nextRoundWins.X) nextMatchWinner = playerAssignments.O
              else {
                nextIsGolden = true
                nextMaxRounds = nextRound // golden round starts
              }
            }
          } else {
            // Golden round: whoever wins, wins match
            nextMatchWinner = playerAssignments[winner]
          }
          setBoard(Array(9).fill(null))
          setCurrentPlayer(nextRound % 2 === 1 ? "X" : "O")
          setGameStatus("playing")
          setRound(nextRound)
          setIsGoldenRound(nextIsGolden)
          setMatchWinner(nextMatchWinner)
          setMaxRounds(nextMaxRounds)
          setRoundWins(nextRoundWins)
        }, 1000)
        return
      }
      if (isBoardFull(newBoard)) {
        setGameStatus("draw")
        setTimeout(() => {
          let nextRound = round + 1
          let nextIsGolden = isGoldenRound
          let nextMatchWinner = null
          let nextMaxRounds = maxRounds
          if (!isGoldenRound) {
            if (nextRound > maxRounds) {
              if (roundWins.X > roundWins.O) nextMatchWinner = playerAssignments.X
              else if (roundWins.O > roundWins.X) nextMatchWinner = playerAssignments.O
              else {
                nextIsGolden = true
                nextMaxRounds = nextRound
              }
            }
          }
          setBoard(Array(9).fill(null))
          setCurrentPlayer(nextRound % 2 === 1 ? "X" : "O")
          setGameStatus("playing")
          setRound(nextRound)
          setIsGoldenRound(nextIsGolden)
          setMatchWinner(nextMatchWinner)
          setMaxRounds(nextMaxRounds)
        }, 1000)
        return
      }
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    },
    [board, gameStatus, currentPlayer, matchWinner, round, isGoldenRound, maxRounds, roundWins, playerAssignments],
  )

  // No AI effect needed for two-player mode


  const getStatusMessage = () => {
    if (matchWinner) return (
      <span className="flex items-center justify-center gap-2">
        <span className="text-2xl">🏆</span>
        <span className="font-bold text-lg">{matchWinner} wins the match!</span>
        <span className="animate-dance text-3xl">💃</span>
      </span>
    )
    if (gameStatus === "won") return `🎉 ${playerAssignments[currentPlayer]} wins the round!`
    if (gameStatus === "draw") return "🤝 Round draw!"
    if (isGoldenRound) return `Golden Round: ${playerAssignments[currentPlayer]}'s turn (${currentPlayer})`
    return `Round ${round} - ${playerAssignments[currentPlayer]}'s turn (${currentPlayer})`
  }

  const getStatusColor = () => {
    if (matchWinner) return "bg-green-100 text-green-800"
    if (gameStatus === "won") return "bg-green-100 text-green-800"
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
          <p className="text-gray-600">Two Player Mode: Best of 5 Rounds</p>
        </div>

        {/* Game Status */}
        <div className="text-center">
          <Badge className={`text-lg px-4 py-2 ${getStatusColor()}`}>{getStatusMessage()}</Badge>
        </div>
        {/* Dancing animation keyframes */}
        <style jsx global>{`
        @keyframes dance {
          0% { transform: translateY(0) rotate(-10deg); }
          20% { transform: translateY(-10px) rotate(10deg); }
          40% { transform: translateY(0) rotate(-10deg); }
          60% { transform: translateY(-10px) rotate(10deg); }
          80% { transform: translateY(0) rotate(-10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-dance {
          display: inline-block;
          animation: dance 1s infinite;
        }
      `}</style>

        {/* Game Board */}
        <Card>
          <CardContent className="p-6">
            <GameBoard
              board={board}
              onCellClick={makePlayerMove}
              disabled={!!matchWinner || gameStatus !== "playing"}
            />
          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex gap-3">
          <Button onClick={resetMatch} variant="outline" className="flex-1 bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Match
          </Button>
        </div>

        {/* Game Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5" />
              Round Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{playerAssignments.X}</div>
                <div className="text-2xl font-bold text-blue-600">{roundWins.X}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{playerAssignments.O}</div>
                <div className="text-2xl font-bold text-red-600">{roundWins.O}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-blue-600">X</span>
                  <span className="text-gray-600">{playerAssignments.X}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-red-600">O</span>
                  <span className="text-gray-600">{playerAssignments.O}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Players alternate X and O each match. If tied after 5 rounds, golden round(s) decide the winner.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
