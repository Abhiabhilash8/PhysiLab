# PhysAI Lab - Interactive Physics Intelligence 🚀

PhysAI Lab is a modern, AI-powered web application designed to transform complex physics word problems into interactive, real-time simulations. By leveraging natural language processing (rule-based parsing) and high-performance canvas rendering, it allows students and educators to visualize abstract concepts like projectile motion, pendulum mechanics, and ray optics with ease.

![PhysAI Lab Banner](https://img.shields.io/badge/PhysAI-Lab-00D9FF?style=for-the-badge&logo=physics)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF0055?style=for-the-badge)

---

## 📖 Table of Contents
1. [Project Title](#physai-lab---interactive-physics-intelligence-)
2. [Description](#description)
3. [Tech Stack Used](#tech-stack-used)
4. [How to Run the Project](#how-to-run-the-project)
5. [Dependencies](#dependencies)
6. [Any Important Instructions](#any-important-instructions)
7. [Demo Videos & Images of MVP](#demo-videos--images-of-mvp)

---

## 📝 Description

PhysAI Lab serves as a bridge between theoretical physics and visual intuition. Users can input natural language problems (e.g., *"A ball is thrown at 30 m/s at a 45-degree angle"*), and the system instantly:
- **Parses** the key parameters (velocity, angle, gravity).
- **Calculates** kinematic results (range, max height, time of flight).
- **Renders** a 60fps interactive simulation.
- **Visualizes** real-time data through synchronized graphs and vector displays.

### Key Features:
- **🧠 AI Problem Parser**: Understands natural language physics inputs.
- **🎬 Real-time Simulation**: Interactive canvas animations with live parameter updates.
- **📊 Multi-View Analysis**: Synchronized graphs, equations, and vector visualizations.
- **🔮 What-If Scenarios**: Alter gravity or velocity mid-simulation to see planetary differences.

---

## 🛠 Tech Stack Used

- **Frontend Framework**: [React 18](https://reactjs.org/) (via CDN)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (For smooth UI transitions)
- **Physics Rendering**: [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) (High-performance 60fps rendering)
- **Compilation**: [Babel](https://babeljs.io/) (Standalone for JSX processing)
- **Typography**: [Google Fonts](https://fonts.google.com/) (Orbitron, DM Sans, Space Grotesk)

---

## 🚀 How to Run the Project

PhysAI Lab is designed to be highly portable and requires zero installation for basic use.

### Option 1: Direct Run (Easiest)
1. Navigate to the project folder.
2. Locate the `index.html` file.
3. **Right-click** and select **"Open with"** -> **Your Browser (Chrome/Firefox/Edge)**.
4. Alternatively, on Windows, you can run:
   ```powershell
   start index.html
   ```

### Option 2: Local Dev Server (Recommended)
Running through a local server ensures correct loading of all assets and consistent behavior:
- **Using Python**:
  ```bash
  python -m http.server 8000
  ```
- **Using Node.js**:
  ```bash
  npx http-server
  ```
Then visit `http://localhost:8000` in your browser.

---

## 📦 Dependencies

The project uses modern web technologies loaded via reliable CDNs. No `npm install` is required for the client-side execution:

| Dependency | Purpose | Source |
|------------|---------|--------|
| `react@18` | Core UI Logic | Unpkg CDN |
| `react-dom@18` | DOM Rendering | Unpkg CDN |
| `babel-standalone` | JSX Compilation | Unpkg CDN |
| `tailwindcss` | Rapid UI Styling | Tailwind CDN |
| `framer-motion` | Smooth Animations | Unpkg CDN |

---

## ⚠️ Any Important Instructions

1. **Browser Compatibility**: For the best experience, use **Google Chrome** or **Mozilla Firefox**. These browsers offer superior support for the Canvas API and CSS backdrop filters used in the glassmorphism UI.
2. **Full Screen Mode**: The simulation is best viewed in a maximized window to fully appreciate the particle network and detail in the graphs.
3. **Interactive Sliders**: After a simulation starts, use the **Parameter Sliders** on the left panel to change variables like **Gravity** in real-time. This is a great way to compare Earth's physics with the Moon or Jupiter.
4. **Natural Language Inputs**: When typing problems, try to be specific with units (e.g., use "m/s" for velocity and "m" for height).

---

## 🖼 Demo Videos & Images of MVP

Access all demo videos and high-resolution images of the project here:
[📁 PhysiLab MVP Assets (Google Drive)](https://drive.google.com/drive/folders/1SqR8m2dkY8TScRewyRkb9ZCOgmVoPyh0?usp=sharing)

---

**Developed with ❤️ for Physics Lovers and Educators.**
**Enjoy exploring the laws of nature in a whole new dimension! 🌌⚛️**
