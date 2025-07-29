import { Card, CardContent } from "@/components/ui/card"

interface GameStatsProps {
  wins: number
  losses: number
  draws: number
}

export function GameStats({ wins, losses, draws }: GameStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-sm mx-auto">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{wins}</div>
          <div className="text-sm text-gray-600">Wins</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{draws}</div>
          <div className="text-sm text-gray-600">Draws</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{losses}</div>
          <div className="text-sm text-gray-600">Losses</div>
        </CardContent>
      </Card>
    </div>
  )
}
