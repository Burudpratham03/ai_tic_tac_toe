# AI Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with Next.js, TypeScript, and Tailwind CSS. Challenge an unbeatable AI that uses the Minimax algorithm!
You can test the game here by clicking this link below! 
([https://ai-tic-tac-toe-sable.vercel.app/](https://ai-tic-tac-3jyy1ufru-burudprathamesh03-gmailcoms-projects.vercel.app/))
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
- **Vitest** - Modern testing framework with 29 unit tests

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
   git clone https://github.com/Burudpratham03/ai_tic_tac_toe.git
   cd ai_tic_tac_toe
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Run tests (optional)**
   ```bash
   npm test
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Project Structure

```
ai_tic_tac_toe/
├── .github/
│   └── workflows/
│       └── test.yml       # GitHub Actions CI/CD
├── app/                   # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main game page
├── components/            # React components
│   ├── game-board.tsx     # Game board component
│   ├── game-stats.tsx     # Statistics component
│   └── ui/                # UI components (Radix UI)
├── lib/                   # Utility functions
│   ├── minimax.ts         # AI algorithm implementation
│   ├── minimax.test.ts    # Comprehensive test suite (29 tests)
│   └── utils.ts           # Helper functions
├── public/                # Static assets
└── vitest.config.ts       # Test configuration
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

## 🧪 Testing & Quality Assurance

This project includes a comprehensive test suite with **29 unit tests** covering all critical game functionality:

### Test Coverage

1. **Horizontal Win Detection** (4 tests)
   - Tests all three rows for win conditions
   - Validates incomplete rows don't trigger false wins

2. **Vertical Win Detection** (4 tests)
   - Tests all three columns for win conditions
   - Ensures partial columns don't register as wins

3. **Diagonal Win Detection** (4 tests)
   - Tests both diagonal win patterns
   - Validates mixed diagonals don't create false positives

4. **Draw Detection** (4 tests)
   - Detects full board scenarios with no winner
   - Correctly identifies when game is still in progress

5. **Occupied Square Prevention** (4 tests)
   - Ensures players can't overwrite occupied cells
   - Validates available moves calculation

6. **Bonus: AI Logic Tests** (5 tests)
   - Verifies AI blocks opponent wins
   - Confirms AI takes winning moves
   - Tests strategic positioning (center, corners)
   - Validates fork prevention

7. **Edge Cases** (4 tests)
   - Tests already-won scenarios
   - Single move remaining situations
   - Board state preservation during calculations

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Continuous Integration

Every push triggers automated tests via **GitHub Actions**:
- Tests run on Node.js 18.x and 20.x
- Automatic coverage reports generated
- Results visible in PR checks

![Tests](https://img.shields.io/badge/tests-29%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

## 🎯 Future Enhancements

- [x] Comprehensive test suite (29 unit tests)
- [x] GitHub Actions CI/CD pipeline
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
