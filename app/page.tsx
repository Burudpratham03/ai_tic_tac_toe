"use client"

import React, { useState, useEffect, useCallback, FC } from "react";
import { TicTacToeEngine, type Player, type Board, type GameResult, type Difficulty } from "@/lib/engine";

// --- UTILITY FUNCTIONS ---
// Helper for conditional class names, typically from a library like clsx
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// --- TYPE DEFINITIONS ---
type WinResult = GameResult; // Alias for backward compatibility
type GameMode = 'menu' | 'difficulty_select' | 'single_player' | 'two_player' | 'tournament';

interface GameState {
  mode: GameMode;
  difficulty?: Difficulty;
}

// --- SHARED UI COMPONENTS ---
const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'destructive' | 'outline' }> = ({ className, children, ...props }) => (
  <button
    className={cn(
      "w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed",
      props.variant === 'destructive' && "bg-red-600 hover:bg-red-700",
      props.variant === 'outline' && "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Cell: FC<{ value: Player | null; onClick: () => void; disabled: boolean }> = ({ value, onClick, disabled }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-24 h-24 flex items-center justify-center text-5xl font-bold border-2 rounded-lg transition-colors duration-200",
      "border-gray-300 bg-white hover:bg-gray-100",
      value === 'X' && "text-blue-500",
      value === 'O' && "text-red-500",
    )}
    disabled={disabled}
  >
    {value}
  </button>
);

const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

// --- MENU & SELECTION COMPONENTS ---
const Menu: FC<{ onModeSelect: (mode: GameMode) => void }> = ({ onModeSelect }) => (
  <div className="flex flex-col space-y-4 w-64 text-center">
    <h1 className="text-5xl font-bold mb-6 text-gray-800">Tic Tac Toe</h1>
    <Button onClick={() => onModeSelect('difficulty_select')}>Single Player</Button>
    <Button onClick={() => onModeSelect('two_player')}>Two Player (Best of 5)</Button>
    <Button onClick={() => onModeSelect('tournament')}>Tournament</Button>
  </div>
);

const DifficultySelect: FC<{ onSelect: (difficulty: Difficulty) => void; onBack: () => void }> = ({ onSelect, onBack }) => (
  <div className="flex flex-col space-y-4 w-64 text-center">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">Select Difficulty</h2>
    <Button onClick={() => onSelect('easy')}>Easy</Button>
    <Button onClick={() => onSelect('medium')}>Medium</Button>
    <Button onClick={() => onSelect('hard')}>Hard (Unbeatable)</Button>
    <Button onClick={onBack} variant="outline">Back to Menu</Button>
  </div>
);

// --- GAME MODE COMPONENTS ---
const SinglePlayerGame: FC<{ onBack: () => void; difficulty: Difficulty }> = ({ onBack, difficulty }) => {
  const [engine] = useState(() => new TicTacToeEngine('X'));
  const [board, setBoard] = useState<Board>(engine.getBoard());
  const [player, setPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<WinResult>(null);
  const [statusMessage, setStatusMessage] = useState("Your turn (X)");

  const handleMove = useCallback((index: number) => {
    if (winner || player !== 'X') return;
    
    // Make move through engine
    const success = engine.makeMove(index, 'X');
    if (!success) return;
    
    setBoard(engine.getBoard());
    setPlayer('O');
  }, [engine, winner, player]);

  useEffect(() => {
    const result = engine.checkWinner();
    if (result) {
      setWinner(result);
      setStatusMessage(result === 'draw' ? "It's a draw!" : `Player ${result} wins!`);
      setTimeout(onBack, 2000);
      return;
    }

    if (player === 'O' && !result) {
      setStatusMessage("AI's turn (O)");
      const timer = setTimeout(() => {
        // Get AI move through engine
        const aiMove = engine.getAIMove(difficulty, 'O');
        if (aiMove !== -1) {
          engine.makeMove(aiMove, 'O');
          setBoard(engine.getBoard());
          setPlayer('X');
          setStatusMessage("Your turn (X)");
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [board, player, difficulty, onBack, engine]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Single Player</h2>
      <p className="text-xl text-gray-600 h-8">{statusMessage}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <Cell key={i} value={cell} onClick={() => handleMove(i)} disabled={!!cell || !!winner || player === 'O'} />
        ))}
      </div>
      <Button onClick={onBack} variant="outline">Back to Menu</Button>
    </div>
  );
};

const TwoPlayerGame: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [playerNames, setPlayerNames] = useState({ X: '', O: '' });
  const [isNaming, setIsNaming] = useState(true);

  const [engine] = useState(() => new TicTacToeEngine('X'));
  const [board, setBoard] = useState<Board>(engine.getBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [roundStarter, setRoundStarter] = useState<Player>('X');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [roundWinner, setRoundWinner] = useState<WinResult>(null);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerNames.X && playerNames.O) setIsNaming(false);
  }

  const handleMove = useCallback((index: number) => {
    if (roundWinner || matchWinner) return;
    
    // Make move through engine
    const success = engine.makeMove(index, currentPlayer);
    if (!success) return;
    
    setBoard(engine.getBoard());

    const result = engine.checkWinner();
    if (result) {
      setRoundWinner(result);
      let currentMatchWinner = matchWinner;
      let newScores = scores;

      if (result !== 'draw') {
        newScores = { ...scores, [result]: scores[result] + 1 };
        setScores(newScores);
        if (newScores[result] >= 3) {
          setMatchWinner(result);
          currentMatchWinner = result;
        }
      }

      const newGamesPlayed = gamesPlayed + 1;
      setGamesPlayed(newGamesPlayed);

      if (newGamesPlayed >= 5 && !currentMatchWinner) {
        const finalWinner = newScores.X > newScores.O ? 'X' : newScores.O > newScores.X ? 'O' : null;
        if (finalWinner) setMatchWinner(finalWinner);
      }

      setTimeout(() => {
        if (!currentMatchWinner && newGamesPlayed < 5) {
          engine.reset();
          setBoard(engine.getBoard());
          setRoundWinner(null);
          const nextStarter = roundStarter === 'X' ? 'O' : 'X';
          engine.reset(nextStarter);
          setCurrentPlayer(nextStarter);
          setRoundStarter(nextStarter);
        }
      }, 2000);
    } else {
      setCurrentPlayer(p => p === 'X' ? 'O' : 'X');
    }
  }, [engine, currentPlayer, roundWinner, scores, gamesPlayed, matchWinner, roundStarter]);

  const statusMessage = () => {
    if (matchWinner) return `${playerNames[matchWinner]} wins the match!`;
    if (roundWinner) return roundWinner === 'draw' ? "Round is a draw!" : `${playerNames[roundWinner]} wins the round!`;
    return `${playerNames[currentPlayer]}'s turn (${currentPlayer})`;
  };

  if (isNaming) {
    return (
      <form onSubmit={handleNameSubmit} className="flex flex-col items-center space-y-4 w-full">
        <h2 className="text-3xl font-bold text-gray-800">Enter Player Names</h2>
        <Input type="text" placeholder="Player X Name" value={playerNames.X} onChange={(e) => setPlayerNames(p => ({ ...p, X: e.target.value }))} required />
        <Input type="text" placeholder="Player O Name" value={playerNames.O} onChange={(e) => setPlayerNames(p => ({ ...p, O: e.target.value }))} required />
        <Button type="submit">Start Game</Button>
        <Button onClick={onBack} variant="outline">Back to Menu</Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">Two Player (Best of 5)</h2>
      <p className="text-xl font-semibold">Score: {playerNames.X} - {scores.X} | {playerNames.O} - {scores.O}</p>
      <p className="text-lg text-gray-600">Game {Math.min(gamesPlayed + 1, 5)} of 5</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <Cell key={i} value={cell} onClick={() => handleMove(i)} disabled={!!cell || !!roundWinner || !!matchWinner} />
        ))}
      </div>
      <p className="text-xl text-gray-600 h-8">{statusMessage()}</p>
      <Button onClick={onBack} variant="outline" style={{ visibility: matchWinner ? 'visible' : 'hidden' }}>Back to Menu</Button>
    </div>
  );
};

const TournamentGame: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [matchIndex, setMatchIndex] = useState(0);
  const [nextRoundPlayers, setNextRoundPlayers] = useState<string[]>([]);

  const [engine] = useState(() => new TicTacToeEngine('X'));
  const [board, setBoard] = useState<Board>(engine.getBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [statusMessage, setStatusMessage] = useState("");

  const [isHumanEliminated, setIsHumanEliminated] = useState(false);
  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);
  const [isRematch, setIsRematch] = useState(false);

  useEffect(() => {
    const initialPlayers = ['Human', ...Array.from({ length: 15 }, (_, i) => `AI ${i + 1}`)];
    setPlayers(initialPlayers.sort(() => Math.random() - 0.5));
  }, []);

  const difficultyByRound: Difficulty[] = ['easy', 'medium', 'hard', 'hard'];

  const advanceToNextMatch = useCallback((matchWinnerName: string) => {
    const newNextRoundPlayers = [...nextRoundPlayers, matchWinnerName];
    setNextRoundPlayers(newNextRoundPlayers);

    if (newNextRoundPlayers.length * 2 === players.length || newNextRoundPlayers.length === players.length) { // End of round
      if (newNextRoundPlayers.length === 1) {
        setTournamentWinner(newNextRoundPlayers[0]);
        return;
      }
      setPlayers(newNextRoundPlayers);
      setRound(r => r + 1);
      setMatchIndex(0);
      setNextRoundPlayers([]);
    } else {
      setMatchIndex(m => m + 1);
    }

    engine.reset('X');
    setBoard(engine.getBoard());
    setCurrentPlayer('X');
  }, [engine, players.length, nextRoundPlayers]);

  useEffect(() => {
    if (players.length === 0 || tournamentWinner || isHumanEliminated) return;

    const player1 = players[matchIndex * 2];
    const player2 = players[matchIndex * 2 + 1];
    const isHumanInMatch = player1 === 'Human' || player2 === 'Human';
    const difficulty = difficultyByRound[round - 1];

    const result = engine.checkWinner();
    if (result) {
      if (result === 'draw') {
        setStatusMessage("Draw! Rematching...");
        setTimeout(() => {
          engine.reset('X');
          setBoard(engine.getBoard());
          setCurrentPlayer('X');
          setIsRematch(true);
        }, 1500);
        return;
      }

      const winnerName = (result === 'X') ? player1 : player2;
      setStatusMessage(`${winnerName} wins!`);
      if (isHumanInMatch && winnerName !== 'Human') {
        setIsHumanEliminated(true);
      } else {
        setTimeout(() => advanceToNextMatch(winnerName), 1500);
      }
      return;
    }

    setIsRematch(false);

    if (isHumanInMatch) {
      const humanIsX = player1 === 'Human';
      const humanPlayer = humanIsX ? 'X' : 'O';
      setStatusMessage(currentPlayer === humanPlayer ? "Your Turn" : "AI's Turn");
      if (currentPlayer !== humanPlayer) {
        const timer = setTimeout(() => {
          const aiMove = engine.getAIMove(difficulty, currentPlayer);
          if (aiMove !== -1) {
            engine.makeMove(aiMove, currentPlayer);
            setBoard(engine.getBoard());
            setCurrentPlayer(humanPlayer);
          }
        }, 700);
        return () => clearTimeout(timer);
      }
    } else {
      setStatusMessage(`Simulating: ${player1} vs ${player2}`);
      const timer = setTimeout(() => {
        const simEngine = new TicTacToeEngine('X');
        let simPlayer: Player = 'X';
        let winner: WinResult = null;
        while (winner === null) {
          const move = simEngine.getAIMove(difficulty, simPlayer);
          if (move === -1) { winner = 'draw'; break; }
          simEngine.makeMove(move, simPlayer);
          winner = simEngine.checkWinner();
          simPlayer = simPlayer === 'X' ? 'O' : 'X';
        }
        const winnerName = winner === 'draw' ? player1 : (winner === 'X' ? player1 : player2);
        advanceToNextMatch(winnerName);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [board, players, matchIndex, round, tournamentWinner, advanceToNextMatch, currentPlayer, isHumanEliminated, engine]);

  const handleHumanMove = (index: number) => {
    const humanIsX = players[matchIndex * 2] === 'Human';
    const humanPlayer = humanIsX ? 'X' : 'O';
    if (engine.checkWinner() || currentPlayer !== humanPlayer) return;
    
    const success = engine.makeMove(index, currentPlayer);
    if (!success) return;
    
    setBoard(engine.getBoard());
    setCurrentPlayer(humanPlayer === 'X' ? 'O' : 'X');
  };

  if (tournamentWinner) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <h2 className="text-4xl font-bold">{tournamentWinner === 'Human' ? '🏆 You Win! 🏆' : 'Tournament Over'}</h2>
        <p className="text-2xl">{tournamentWinner === 'Human' ? 'You are the champion!' : `${tournamentWinner} is the champion.`}</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </div>
    )
  }
  if (isHumanEliminated) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <h2 className="text-4xl font-bold text-red-600">You have been eliminated!</h2>
        <Button onClick={onBack}>Back to Menu</Button>
      </div>
    )
  }

  if (players.length === 0) return <p className="text-xl text-gray-600">Loading Tournament...</p>;

  const player1 = players[matchIndex * 2];
  const player2 = players[matchIndex * 2 + 1];
  const isHumanInMatch = player1 === 'Human' || player2 === 'Human';
  const roundNames = ["Round of 16", "Quarter-Finals", "Semi-Finals", "Final"];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">Tournament</h2>
      <p className="text-xl font-semibold">{roundNames[round - 1]}</p>
      <p className="text-lg text-gray-600">{player1} (X) vs {player2} (O)</p>
      <p className="text-xl text-gray-600 h-8">{!isRematch && statusMessage}</p>
      {isHumanInMatch ? (
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <Cell key={i} value={cell} onClick={() => handleHumanMove(i)} disabled={!!cell || !!engine.checkWinner()} />
          ))}
        </div>
      ) : <div className="h-80 flex items-center justify-center"><p>Simulating...</p></div>}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({ mode: 'menu' });

  const renderContent = () => {
    switch (gameState.mode) {
      case 'menu':
        return <Menu onModeSelect={(mode) => setGameState({ mode })} />;
      case 'difficulty_select':
        return <DifficultySelect
          onSelect={(difficulty) => setGameState({ mode: 'single_player', difficulty })}
          onBack={() => setGameState({ mode: 'menu' })}
        />;
      case 'single_player':
        return <SinglePlayerGame
          difficulty={gameState.difficulty!}
          onBack={() => setGameState({ mode: 'menu' })}
        />;
      case 'two_player':
        return <TwoPlayerGame onBack={() => setGameState({ mode: 'menu' })} />;
      case 'tournament':
        return <TournamentGame onBack={() => setGameState({ mode: 'menu' })} />;
      default:
        return <Menu onModeSelect={(mode) => setGameState({ mode })} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-24">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {renderContent()}
      </div>
    </main>
  );
}
