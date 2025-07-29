"use client"

import { Button } from "@/components/ui/button"
import type { Player } from "@/lib/minimax"

interface GameBoardProps {
  board: Player[]
  onCellClick: (index: number) => void
  disabled: boolean
}

export function GameBoard({ board, onCellClick, disabled }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
      {board.map((cell, index) => (
        <Button
          key={index}
          variant="outline"
          className="aspect-square text-4xl font-bold h-20 w-20 hover:bg-gray-50 disabled:opacity-100 disabled:cursor-not-allowed bg-transparent"
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
        >
          {cell && <span className={cell === "X" ? "text-blue-600" : "text-red-600"}>{cell}</span>}
        </Button>
      ))}
    </div>
  )
}
