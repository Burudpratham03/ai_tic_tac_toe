# AI Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with Next.js, TypeScript, and Tailwind CSS. Challenge an unbeatable AI that uses the Minimax algorithm!

## 🎮 Features

- **Unbeatable AI**: The AI uses the Minimax algorithm with Alpha-Beta pruning, making it impossible to defeat
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Game Statistics**: Track your wins, losses, and draws
- **Real-time Feedback**: Visual indicators for game status and AI thinking
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Technologies Used

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **Minimax Algorithm** - AI game logic

## 🎯 How to Play

1. You play as **X** (blue)
2. The AI plays as **O** (red)
3. Click on any empty cell to make your move
4. The AI will respond with its move
5. Try to get three in a row to win!

## 🏆 Game Modes

- **Player vs AI**: Challenge the unbeatable AI
- **Statistics Tracking**: Monitor your performance over time
- **Quick Reset**: Start a new game anytime

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Burudpratham03/ai-tic-tac-toe.git
   cd ai-tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Project Structure

```
ai-tic-tac-toe/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main game page
├── components/             # React components
│   ├── game-board.tsx     # Game board component
│   ├── game-stats.tsx     # Statistics component
│   └── ui/                # UI components (Radix UI)
├── lib/                   # Utility functions
│   ├── minimax.ts         # AI algorithm implementation
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## 🤖 AI Algorithm

The game uses the **Minimax algorithm** with **Alpha-Beta pruning** to create an unbeatable AI:

- **Minimax**: Recursive algorithm that finds the optimal move
- **Alpha-Beta Pruning**: Optimization technique to reduce search space
- **Depth-first Search**: Explores all possible game states
- **Heuristic Evaluation**: Scores board positions for optimal decision making

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Future Enhancements

- [ ] Multiple difficulty levels
- [ ] Sound effects
- [ ] Animations for wins
- [ ] Multiplayer mode
- [ ] Tournament mode
- [ ] Leaderboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Prathamesh Burud**
- GitHub: [@Burudpratham03](https://github.com/Burudpratham03)
- LinkedIn: [Prathamesh Burud](https://linkedin.com/in/prathamesh-burud-31073128b)
- Instagram: [@me_prathm](https://instagram.com/me_prathm)

---

⭐ **Star this repository if you found it helpful!** 