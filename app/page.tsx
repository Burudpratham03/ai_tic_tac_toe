"use client"

import React, { useState, useEffect, useCallback, FC } from "react";
import { TicTacToeEngine, type Player, type Board, type GameResult, type Difficulty } from "@/lib/engine";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

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
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm",
      props.variant === 'destructive' && "from-red-600 to-red-700 dark:from-red-500 dark:to-red-600",
      props.variant === 'outline' && "bg-transparent border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white backdrop-blur-md",
      className
    )}
    {...props}
  >
    {children}
  </motion.button>
);

const Cell: FC<{ value: Player | null; onClick: () => void; disabled: boolean; isWinning?: boolean }> = ({ value, onClick, disabled, isWinning }) => (
  <motion.button
    onClick={onClick}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ 
      scale: isWinning ? [1, 1.1, 1] : 1, 
      opacity: 1,
      boxShadow: isWinning ? [
        '0 0 0px rgba(59, 130, 246, 0)',
        '0 0 20px rgba(59, 130, 246, 0.8)',
        '0 0 0px rgba(59, 130, 246, 0)'
      ] : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    transition={{ 
      duration: 0.3,
      scale: { repeat: isWinning ? Infinity : 0, repeatDelay: 0.5 }
    }}
    className={cn(
      "w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl font-bold rounded-xl transition-all duration-300",
      "border-2 border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md",
      !disabled && !value && "hover:bg-blue-50/70 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500",
      value === 'X' && "text-blue-500 dark:text-blue-400",
      value === 'O' && "text-red-500 dark:text-red-400",
      isWinning && "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50"
    )}
    disabled={disabled}
  >
    {value && (
      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {value}
      </motion.span>
    )}
  </motion.button>
);

const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
    {...props}
  />
);

// --- MENU & SELECTION COMPONENTS ---
const Menu: FC<{ onModeSelect: (mode: GameMode) => void }> = ({ onModeSelect }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col space-y-4 w-64 text-center"
  >
    <motion.h1 
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
    >
      Tic Tac Toe
    </motion.h1>
    <Button onClick={() => onModeSelect('difficulty_select')}>Single Player</Button>
    <Button onClick={() => onModeSelect('two_player')}>Two Player (Best of 5)</Button>
    <Button onClick={() => onModeSelect('tournament')}>Tournament</Button>
  </motion.div>
);

const DifficultySelect: FC<{ onSelect: (difficulty: Difficulty) => void; onBack: () => void }> = ({ onSelect, onBack }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col space-y-4 w-64 text-center"
  >
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Select Difficulty</h2>
    <Button onClick={() => onSelect('easy')}>Easy</Button>
    <Button onClick={() => onSelect('medium')}>Medium</Button>
    <Button onClick={() => onSelect('hard')}>Hard (Unbeatable)</Button>
    <Button onClick={onBack} variant="outline">Back to Menu</Button>
  </motion.div>
);

// --- GAME MODE COMPONENTS ---
const SinglePlayerGame: FC<{ onBack: () => void; difficulty: Difficulty }> = ({ onBack, difficulty }) => {
  const [engine] = useState(() => new TicTacToeEngine('X'));
  const [board, setBoard] = useState<Board>(engine.getBoard());
  const [player, setPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<WinResult>(null);
  const [statusMessage, setStatusMessage] = useState("Your turn (X)");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

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
      setWinningLine(engine.getWinningLine());
      setStatusMessage(result === 'draw' ? "It's a draw!" : `Player ${result} wins!`);
      setTimeout(onBack, 3000);
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Single Player</h2>
      <motion.p 
        key={statusMessage}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-gray-700 dark:text-gray-300 h-8"
      >
        {statusMessage}
      </motion.p>
      <div className="grid grid-cols-3 gap-3">
        {board.map((cell, i) => (
          <Cell 
            key={i} 
            value={cell} 
            onClick={() => handleMove(i)} 
            disabled={!!cell || !!winner || player === 'O'}
            isWinning={winningLine?.includes(i)}
          />
        ))}
      </div>
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl z-10"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center"
            >
              <div className="text-6xl mb-4">
                {winner === 'draw' ? '🤝' : winner === 'X' ? '🎉' : '🤖'}
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {winner === 'draw' ? "It's a Draw!" : `${winner === 'X' ? 'You' : 'AI'} Win${winner === 'X' ? '' : 's'}!`}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button onClick={onBack} variant="outline">Back to Menu</Button>
    </motion.div>
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
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onSubmit={handleNameSubmit} 
        className="flex flex-col items-center space-y-4 w-full"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Enter Player Names</h2>
        <Input type="text" placeholder="Player X Name" value={playerNames.X} onChange={(e) => setPlayerNames(p => ({ ...p, X: e.target.value }))} required />
        <Input type="text" placeholder="Player O Name" value={playerNames.O} onChange={(e) => setPlayerNames(p => ({ ...p, O: e.target.value }))} required />
        <Button type="submit">Start Game</Button>
        <Button onClick={onBack} variant="outline">Back to Menu</Button>
      </motion.form>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-4"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Two Player (Best of 5)</h2>
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Score: {playerNames.X} - {scores.X} | {playerNames.O} - {scores.O}</p>
      <p className="text-lg text-gray-600 dark:text-gray-400">Game {Math.min(gamesPlayed + 1, 5)} of 5</p>
      <div className="grid grid-cols-3 gap-3">
        {board.map((cell, i) => (
          <Cell key={i} value={cell} onClick={() => handleMove(i)} disabled={!!cell || !!roundWinner || !!matchWinner} />
        ))}
      </div>
      <motion.p 
        key={statusMessage()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl text-gray-700 dark:text-gray-300 h-8"
      >
        {statusMessage()}
      </motion.p>
      <Button onClick={onBack} variant="outline" style={{ visibility: matchWinner ? 'visible' : 'hidden' }}>Back to Menu</Button>
    </motion.div>
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-6 text-center"
      >
        <div className="text-8xl mb-4">🏆</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {tournamentWinner === 'Human' ? 'You Win!' : 'Tournament Over'}
        </h2>
        <p className="text-2xl text-gray-700 dark:text-gray-300">
          {tournamentWinner === 'Human' ? 'You are the champion!' : `${tournamentWinner} is the champion.`}
        </p>
        <Button onClick={onBack}>Back to Menu</Button>
      </motion.div>
    )
  }
  if (isHumanEliminated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-6 text-center"
      >
        <div className="text-8xl mb-4">😔</div>
        <h2 className="text-4xl font-bold text-red-600 dark:text-red-400">You have been eliminated!</h2>
        <Button onClick={onBack}>Back to Menu</Button>
      </motion.div>
    )
  }

  if (players.length === 0) return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-gray-600 dark:text-gray-400">Loading Tournament...</motion.p>;

  const player1 = players[matchIndex * 2];
  const player2 = players[matchIndex * 2 + 1];
  const isHumanInMatch = player1 === 'Human' || player2 === 'Human';
  const roundNames = ["Round of 16", "Quarter-Finals", "Semi-Finals", "Final"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-4"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Tournament</h2>
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{roundNames[round - 1]}</p>
      <p className="text-lg text-gray-600 dark:text-gray-400">{player1} (X) vs {player2} (O)</p>
      <motion.p 
        key={statusMessage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl text-gray-700 dark:text-gray-300 h-8"
      >
        {!isRematch && statusMessage}
      </motion.p>
      {isHumanInMatch ? (
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, i) => (
            <Cell key={i} value={cell} onClick={() => handleHumanMove(i)} disabled={!!cell || !!engine.checkWinner()} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-80 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🤖
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Simulating...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({ mode: 'menu' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 p-4 sm:p-24 transition-colors duration-500">
      {/* Glassmorphic background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Dark mode toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300"
        aria-label="Toggle dark mode"
      >
        <AnimatePresence mode="wait">
          {isDarkMode ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-6 h-6 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-6 h-6 text-blue-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
