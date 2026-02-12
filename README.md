# PhysAI Lab - Interactive Physics Intelligence 🚀

A modern, AI-powered web application that transforms physics word problems into interactive simulations with real-time parameter manipulation.

![PhysAI Lab](https://img.shields.io/badge/PhysAI-Lab-00D9FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF0055?style=for-the-badge)

## ✨ Features

### Core Functionality
- **🧠 AI Problem Parser**: Natural language physics problem understanding
- **🎬 Real-time Simulation**: Interactive physics animations with live parameters
- **📊 Multi-View Analysis**: Synchronized graphs, equations, and visualizations
- **🔮 What-If Scenarios**: Explore alternate physics conditions instantly
- **🎯 Step-by-Step Learning**: Detailed problem breakdown and explanation

### Supported Physics Simulations
1. **Projectile Motion** - Trajectory, velocity vectors, range calculations
2. **Vertical Motion** - Free fall, upward throw with gravity
3. **Pendulum/SHM** - Simple harmonic motion visualization
4. **Ray Optics** - Reflection, refraction, lens behavior
5. **Magnetic Fields** - Field line visualization

### UI/UX Highlights
- 🌌 **Animated Particle Background** - Physics-themed particle network
- 💎 **Glassmorphism Design** - Modern glass-like UI elements
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 🎨 **Futuristic Aesthetic** - Dark theme with cyan/blue neon accents
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Option 1: Run Directly (Fastest)

Simply open `index.html` in your web browser:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or double-click the `index.html` file.

**That's it!** The app will run immediately with all dependencies loaded via CDN.

### Option 2: Local Development Server

For better development experience with hot reload:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000

# Or using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 📖 How to Use

### 1. **Landing Page**
   - Click "Start Exploring" to begin
   - View feature cards showcasing capabilities

### 2. **Login/Signup**
   - Enter any email/password (mock authentication)
   - Beautiful glassmorphism form

### 3. **Dashboard**
   - Select "Physics" to start
   - Other subjects coming soon (Chemistry, Math, Biology)

### 4. **Problem Input**
   - Type or paste a physics problem
   - Or click one of the 4 sample problems
   - Example: "A ball is thrown vertically upward with a velocity of 25 m/s"

### 5. **Simulation & Analysis**
   - **Left Panel**: Problem explanation, parameters, What-If AI
   - **Right Panel**: Live simulation, graphs, equations
   - Adjust sliders to change velocity, angle, gravity
   - Use What-If AI: "double velocity", "moon gravity", etc.

## 🎮 Interactive Controls

### Parameter Sliders
- **Velocity**: 5-50 m/s
- **Angle**: 0-90° (for projectile motion)
- **Gravity**: 1.6-24.8 m/s² (Moon to Jupiter range)

### What-If AI Commands
Try natural language queries:
- "What if gravity was Moon gravity?"
- "Double velocity"
- "Change angle to 60"
- "Increase velocity to 30"

### Playback Controls
- **Play/Pause**: Control animation
- **Reset**: Return to initial state

## 🏗️ Project Structure

```
PhysAI-Lab/
├── index.html              # Main HTML file (standalone, ready to run)
├── physai-lab.jsx         # React components (for reference/development)
└── README.md              # This file
```

## 🔧 Technical Details

### Technologies Used
- **React 18** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Canvas API** - Physics simulations
- **ES6+** - Modern JavaScript

### Key Components
1. **AnimatedBackground** - Particle network animation
2. **LandingPage** - Hero section with features
3. **LoginPage** - Glassmorphism auth UI
4. **Dashboard** - Subject selection
5. **ProblemInputPage** - Problem entry interface
6. **SimulationPage** - Main simulation viewer
7. **SimulationCanvas** - Canvas-based physics renderer
8. **GraphView** - Real-time graphing

### Physics Engine
The simulation engine uses:
- Kinematic equations for projectile/vertical motion
- Trigonometric calculations for angles
- Canvas 2D API for rendering
- RequestAnimationFrame for smooth 60fps animations

## 🎨 Design Philosophy

**Aesthetic Direction**: Futuristic Educational Physics Lab

- **Typography**: 
  - Headlines: Orbitron (sci-fi/tech feel)
  - Body: DM Sans (clean, readable)
  - Accents: Space Grotesk (modern geometric)

- **Color Palette**:
  - Primary: Cyan (#06b6d4) & Blue (#3b82f6)
  - Accents: Violet (#8b5cf6)
  - Background: Deep slate (#0a0a1e)
  - Text: White with varying opacity

- **Visual Effects**:
  - Animated particle connections
  - Glassmorphism cards with backdrop blur
  - Glow effects on interactive elements
  - Smooth gradient transitions
  - Hover lift animations

## 📚 Physics Problems Supported

### Projectile Motion
```
"A projectile is launched at 45 degrees with initial velocity of 30 m/s"
```
- Calculates: Range, max height, time of flight
- Shows: Trajectory, velocity vectors
- Equation: y = x·tan(θ) - (g·x²)/(2·v²·cos²(θ))

### Vertical Motion
```
"A ball is thrown vertically upward with a velocity of 25 m/s"
```
- Calculates: Max height, time to peak
- Shows: Position, velocity over time
- Equation: v² = u² + 2as

### Pendulum
```
"A simple pendulum of length 2m swings with small amplitude"
```
- Shows: Oscillation, energy conversion
- Equation: T = 2π√(L/g)

### Optics
```
"A lens with focal length 15cm forms an image at 30cm"
```
- Shows: Ray paths, refraction
- Equation: n₁sin(θ₁) = n₂sin(θ₂)

### Magnetism
```
"Visualize magnetic field lines around a bar magnet"
```
- Shows: Field lines, N/S poles
- Equation: F = qvB·sin(θ)

## 🔮 Future Enhancements

Potential additions:
- [ ] More physics types (waves, thermodynamics, circuits)
- [ ] Save/load simulations
- [ ] Export animations as GIF/video
- [ ] Collaborative mode
- [ ] AR visualization
- [ ] Advanced AI explanations with GPT integration
- [ ] Voice input for problems
- [ ] Chemistry, Math, Biology subjects

## 🐛 Known Limitations

- AI parsing is rule-based (not true ML)
- Limited to basic physics concepts
- Simplified visualizations
- Browser-only (no backend persistence)

## 💡 Tips for Best Experience

1. **Use Chrome or Firefox** for best performance
2. **Full screen** recommended for immersive experience
3. **Try different gravity values** to see planetary differences
4. **Experiment with What-If AI** for creative scenarios
5. **Watch the graphs** update in real-time with sliders

## 📝 Example Problems to Try

1. **Classic Projectile**
   > "A cannon fires a ball at 50 m/s at an angle of 30 degrees. Find the range."

2. **Vertical Launch**
   > "A rocket is launched upward with initial velocity 100 m/s. When does it land?"

3. **Comparative**
   > "Compare projectile motion on Earth vs Moon (gravity 1.6 m/s²)"

4. **What-If Scenario**
   > Start with any problem, then ask: "What if velocity was doubled?"

## 🎯 Educational Use Cases

Perfect for:
- **High School Physics** - Visualize concepts
- **University Intro Physics** - Quick simulations
- **Self-Learning** - Interactive exploration
- **Tutoring** - Visual explanations
- **Homework Help** - Problem verification

## 🤝 Contributing

This is a standalone educational project. Feel free to:
- Fork and customize
- Add new physics simulations
- Improve UI/animations
- Enhance AI parsing

## 📄 License

Educational/Personal use. This is a demonstration project built with standard web technologies.

## 🌟 Credits

Built with:
- React team for the amazing framework
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Google Fonts for typography

---

**Enjoy exploring physics in a whole new way! 🚀⚛️**

For questions or issues, please refer to the code comments or physics documentation.
