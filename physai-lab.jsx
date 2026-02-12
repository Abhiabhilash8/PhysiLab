import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== UTILITIES ====================

const parsePhysicsProblem = (problemText) => {
  const text = problemText.toLowerCase();
  
  // Detect problem type
  let type = 'vertical';
  if (text.includes('projectile') || text.includes('thrown') || (text.includes('angle') && text.includes('horizontal'))) {
    type = 'projectile';
  } else if (text.includes('pendulum') || text.includes('swing')) {
    type = 'pendulum';
  } else if (text.includes('lens') || text.includes('mirror') || text.includes('refract') || text.includes('reflect')) {
    type = 'optics';
  } else if (text.includes('magnet') || text.includes('field') || text.includes('magnetic')) {
    type = 'magnetic';
  }
  
  // Extract parameters
  const extractNumber = (pattern) => {
    const match = text.match(pattern);
    return match ? parseFloat(match[1]) : null;
  };
  
  const velocity = extractNumber(/(\d+\.?\d*)\s*m\/s/) || 20;
  const angle = extractNumber(/(\d+\.?\d*)\s*degree/) || extractNumber(/angle.*?(\d+\.?\d*)/) || 45;
  const height = extractNumber(/(\d+\.?\d*)\s*m(?:eter)?(?:\s|$)/) || 0;
  const gravity = 9.8;
  
  return {
    type,
    parameters: {
      velocity,
      angle,
      height,
      gravity,
      time: 0
    },
    problem: problemText,
    explanation: generateExplanation(type, { velocity, angle, height, gravity })
  };
};

const generateExplanation = (type, params) => {
  const explanations = {
    projectile: {
      title: "Projectile Motion Analysis",
      steps: [
        `Initial velocity: ${params.velocity} m/s at ${params.angle}° angle`,
        `Horizontal component: ${(params.velocity * Math.cos(params.angle * Math.PI / 180)).toFixed(2)} m/s`,
        `Vertical component: ${(params.velocity * Math.sin(params.angle * Math.PI / 180)).toFixed(2)} m/s`,
        `Maximum height: ${((params.velocity * Math.sin(params.angle * Math.PI / 180))**2 / (2 * params.gravity)).toFixed(2)} m`,
        `Time of flight: ${(2 * params.velocity * Math.sin(params.angle * Math.PI / 180) / params.gravity).toFixed(2)} s`,
        `Range: ${((params.velocity**2 * Math.sin(2 * params.angle * Math.PI / 180)) / params.gravity).toFixed(2)} m`
      ],
      equation: "y = x·tan(θ) - (g·x²)/(2·v²·cos²(θ))"
    },
    vertical: {
      title: "Vertical Motion Analysis",
      steps: [
        `Initial velocity: ${params.velocity} m/s`,
        `Acceleration: -${params.gravity} m/s²`,
        `Maximum height: ${(params.velocity**2 / (2 * params.gravity)).toFixed(2)} m`,
        `Time to peak: ${(params.velocity / params.gravity).toFixed(2)} s`
      ],
      equation: "v² = u² + 2as"
    },
    pendulum: {
      title: "Simple Harmonic Motion",
      steps: [
        `Period depends on length and gravity`,
        `Angular displacement varies sinusoidally`,
        `Energy converts between kinetic and potential`
      ],
      equation: "T = 2π√(L/g)"
    },
    optics: {
      title: "Ray Optics Analysis",
      steps: [
        `Light travels in straight lines`,
        `Reflection: angle of incidence = angle of reflection`,
        `Refraction follows Snell's law`
      ],
      equation: "n₁sin(θ₁) = n₂sin(θ₂)"
    },
    magnetic: {
      title: "Magnetic Field Visualization",
      steps: [
        `Field lines emerge from North pole`,
        `Field lines enter South pole`,
        `Field strength decreases with distance`
      ],
      equation: "F = qvB·sin(θ)"
    }
  };
  
  return explanations[type] || explanations.vertical;
};

// ==================== ANIMATED BACKGROUND ====================

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// ==================== LANDING PAGE ====================

const LandingPage = ({ onNavigate }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  
  const features = [
    {
      icon: "🧠",
      title: "AI Problem Parser",
      desc: "Natural language physics problem understanding"
    },
    {
      icon: "🎬",
      title: "Real-time Simulation",
      desc: "Interactive physics animations with live parameters"
    },
    {
      icon: "📊",
      title: "Multi-View Analysis",
      desc: "Synchronized graphs, equations, and visualizations"
    },
    {
      icon: "🔮",
      title: "What-If Scenarios",
      desc: "Explore alternate physics conditions instantly"
    }
  ];
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950" />
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 200, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 200, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 pt-32 pb-20"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm">
                <span className="text-cyan-300 font-medium text-sm tracking-wider">
                  ⚡ INTERACTIVE PHYSICS INTELLIGENCE
                </span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent"
              style={{ fontFamily: '"Space Grotesk", "Orbitron", sans-serif' }}
            >
              PhysAI Lab
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-2xl text-blue-200/80 mb-12 leading-relaxed"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Transform physics problems into interactive simulations.
              <br />
              <span className="text-cyan-300">Manipulate. Visualize. Understand.</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex gap-6 justify-center"
            >
              <button
                onClick={() => onNavigate('login')}
                className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Start Exploring</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                className="px-10 py-5 bg-white/10 backdrop-blur-md rounded-2xl font-bold text-lg text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                View Demo
              </button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="container mx-auto px-6 py-20"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.6 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative group"
              >
                <div className={`
                  p-8 rounded-3xl bg-white/5 backdrop-blur-lg border transition-all duration-500
                  ${hoveredFeature === i 
                    ? 'border-cyan-400/50 bg-white/10 transform -translate-y-2 shadow-xl shadow-cyan-500/20' 
                    : 'border-white/10 hover:border-cyan-400/30'
                  }
                `}>
                  <div className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-blue-200/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                
                {hoveredFeature === i && (
                  <motion.div
                    layoutId="feature-glow"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ==================== LOGIN PAGE ====================

const LoginPage = ({ onNavigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate('dashboard');
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950" />
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-6"
      >
        <div className="relative">
          {/* Glassmorphism Card */}
          <div className="p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-blue-200/70">
                {isSignup ? 'Start your physics journey' : 'Continue exploring physics'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-300/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-300/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-300"
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" />
        </div>
      </motion.div>
    </div>
  );
};

// ==================== DASHBOARD ====================

const Dashboard = ({ onNavigate }) => {
  const subjects = [
    { name: 'Physics', icon: '⚛️', active: true, color: 'from-cyan-500 to-blue-600' },
    { name: 'Chemistry', icon: '🧪', active: false, color: 'from-purple-500 to-pink-600' },
    { name: 'Mathematics', icon: '📐', active: false, color: 'from-orange-500 to-red-600' },
    { name: 'Biology', icon: '🧬', active: false, color: 'from-green-500 to-emerald-600' }
  ];
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950" />
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              PhysAI Lab
            </h1>
            <button
              onClick={() => onNavigate('landing')}
              className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Choose Your Subject
            </h2>
            <p className="text-blue-200/70 text-lg">
              Select a subject to start exploring interactive simulations
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => subject.active && onNavigate('problem-input')}
                className={`
                  relative p-8 rounded-3xl cursor-pointer overflow-hidden
                  ${subject.active 
                    ? 'bg-white/10 backdrop-blur-lg border border-white/20' 
                    : 'bg-white/5 backdrop-blur-lg border border-white/10 opacity-60'
                  }
                `}
              >
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    {subject.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    {subject.name}
                  </h3>
                  <p className="text-blue-200/70">
                    {subject.active ? 'Click to start' : 'Coming soon'}
                  </p>
                </div>
                
                {subject.active && (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-20`} />
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 hover:opacity-30 transition-opacity duration-300`}
                    />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PROBLEM INPUT PAGE ====================

const ProblemInputPage = ({ onNavigate, onSubmitProblem }) => {
  const [problem, setProblem] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const sampleProblems = [
    "A ball is thrown vertically upward with a velocity of 25 m/s. What is the maximum height?",
    "A projectile is launched at 45 degrees with initial velocity of 30 m/s. Find the range.",
    "A simple pendulum of length 2m swings with small amplitude. Find its period.",
    "A lens with focal length 15cm forms an image. Find the image position if object is at 30cm."
  ];
  
  const handleSubmit = () => {
    if (problem.trim()) {
      onSubmitProblem(problem);
      onNavigate('simulation');
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950" />
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              PhysAI Lab
            </h1>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              ← Back
            </button>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Enter Physics Problem
            </h2>
            <p className="text-blue-200/70 text-lg">
              Type or paste your physics problem and watch it come to life
            </p>
          </motion.div>
          
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div
              className={`
                relative p-8 rounded-3xl bg-white/10 backdrop-blur-lg border-2 transition-all duration-300
                ${isDragging ? 'border-cyan-400 bg-white/20' : 'border-white/20'}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const text = e.dataTransfer.getData('text');
                setProblem(text);
              }}
            >
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Enter your physics problem here... (e.g., 'A ball is thrown upward with 20 m/s velocity...')"
                className="w-full h-48 bg-transparent text-white text-lg placeholder-blue-300/30 outline-none resize-none"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!problem.trim()}
                className="mt-4 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze & Simulate →
              </motion.button>
            </div>
          </motion.div>
          
          {/* Sample Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Or try a sample problem:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleProblems.map((sample, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setProblem(sample)}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-left transition-all duration-300"
                >
                  <div className="text-cyan-400 font-bold mb-2">Example {i + 1}</div>
                  <div className="text-blue-200/80 text-sm leading-relaxed">{sample}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ==================== SIMULATION ENGINE ====================

const SimulationCanvas = ({ type, parameters, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;
    
    const drawProjectile = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
      ctx.fillRect(0, 350, canvas.width, 50);
      
      // Draw trajectory
      const v0 = parameters.velocity;
      const angle = parameters.angle * Math.PI / 180;
      const g = parameters.gravity;
      
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 5) {
        const realX = x / 10;
        const y = realX * Math.tan(angle) - (g * realX * realX) / (2 * v0 * v0 * Math.cos(angle) * Math.cos(angle));
        const canvasY = 350 - y * 10;
        
        if (canvasY >= 0 && canvasY <= 350) {
          if (x === 0) ctx.moveTo(x, canvasY);
          else ctx.lineTo(x, canvasY);
        }
      }
      ctx.stroke();
      
      // Draw projectile
      const x = v0 * Math.cos(angle) * t * 10;
      const y = (v0 * Math.sin(angle) * t - 0.5 * g * t * t) * 10;
      const canvasY = 350 - y;
      
      if (canvasY <= 350 && x <= canvas.width) {
        // Projectile
        ctx.fillStyle = '#64C8FF';
        ctx.beginPath();
        ctx.arc(x, canvasY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowColor = '#64C8FF';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Velocity vector
        const vx = v0 * Math.cos(angle);
        const vy = v0 * Math.sin(angle) - g * t;
        
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, canvasY);
        ctx.lineTo(x + vx * 5, canvasY - vy * 5);
        ctx.stroke();
        
        // Arrow head
        const arrowAngle = Math.atan2(-vy, vx);
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.moveTo(x + vx * 5, canvasY - vy * 5);
        ctx.lineTo(
          x + vx * 5 - 10 * Math.cos(arrowAngle - Math.PI / 6),
          canvasY - vy * 5 + 10 * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
          x + vx * 5 - 10 * Math.cos(arrowAngle + Math.PI / 6),
          canvasY - vy * 5 + 10 * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        
        // Labels
        ctx.fillStyle = '#FFF';
        ctx.font = '14px sans-serif';
        ctx.fillText(`v = ${Math.sqrt(vx*vx + vy*vy).toFixed(1)} m/s`, x + 20, canvasY - 20);
        ctx.fillText(`t = ${t.toFixed(2)} s`, 20, 30);
      }
    };
    
    const drawVertical = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const v0 = parameters.velocity;
      const g = parameters.gravity;
      
      const y = (v0 * t - 0.5 * g * t * t) * 10;
      const canvasY = 350 - y;
      
      if (canvasY <= 350 && canvasY >= 0) {
        ctx.fillStyle = '#64C8FF';
        ctx.beginPath();
        ctx.arc(400, canvasY, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowColor = '#64C8FF';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Velocity arrow
        const v = v0 - g * t;
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(400, canvasY);
        ctx.lineTo(400, canvasY - v * 3);
        ctx.stroke();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px sans-serif';
        ctx.fillText(`v = ${v.toFixed(1)} m/s`, 420, canvasY);
        ctx.fillText(`h = ${(y/10).toFixed(1)} m`, 420, canvasY + 20);
      }
    };
    
    const drawPendulum = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const length = 150;
      const angle = 0.5 * Math.sin(2 * t);
      const x = 400 + length * Math.sin(angle);
      const y = 50 + length * Math.cos(angle);
      
      // Rope
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 50);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Pivot
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(400, 50, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Bob
      ctx.fillStyle = '#64C8FF';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowColor = '#64C8FF';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    };
    
    const drawOptics = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Lens
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(400, 100);
      ctx.lineTo(400, 300);
      ctx.stroke();
      
      // Light rays
      const rays = [
        { y: 150, color: '#FF6B6B' },
        { y: 200, color: '#64C8FF' },
        { y: 250, color: '#FFD93D' }
      ];
      
      rays.forEach(ray => {
        ctx.strokeStyle = ray.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, ray.y);
        ctx.lineTo(400, ray.y);
        ctx.lineTo(600, ray.y + (200 - ray.y) * 0.3);
        ctx.stroke();
      });
      
      ctx.fillStyle = '#FFF';
      ctx.font = '14px sans-serif';
      ctx.fillText('Converging Lens', 350, 320);
    };
    
    const drawMagnetic = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Magnet
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(350, 150, 50, 100);
      ctx.fillStyle = '#64C8FF';
      ctx.fillRect(400, 150, 50, 100);
      
      // Field lines
      const centerX = 400;
      const centerY = 200;
      
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 100 + Math.sin(t + i) * 10;
        
        ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 + Math.sin(t + i) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle - 0.3, angle + 0.3);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#FFF';
      ctx.font = '20px sans-serif';
      ctx.fillText('N', 365, 205);
      ctx.fillText('S', 415, 205);
    };
    
    const animate = () => {
      if (isPlaying) {
        timeRef.current += 0.016;
        
        switch (type) {
          case 'projectile':
            drawProjectile(timeRef.current);
            break;
          case 'vertical':
            drawVertical(timeRef.current);
            break;
          case 'pendulum':
            drawPendulum(timeRef.current);
            break;
          case 'optics':
            drawOptics();
            break;
          case 'magnetic':
            drawMagnetic(timeRef.current);
            break;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, parameters, isPlaying]);
  
  const handleReset = () => {
    timeRef.current = 0;
  };
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-auto bg-black/20 rounded-2xl border border-white/10"
        style={{ maxWidth: '800px', aspectRatio: '2/1' }}
      />
      <button
        onClick={handleReset}
        className="absolute bottom-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
      >
        Reset
      </button>
    </div>
  );
};

// ==================== GRAPH COMPONENT ====================

const GraphView = ({ type, parameters, time }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 260);
    ctx.lineTo(360, 260);
    ctx.moveTo(40, 40);
    ctx.lineTo(40, 260);
    ctx.stroke();
    
    // Draw graph based on type
    if (type === 'projectile' || type === 'vertical') {
      const v0 = parameters.velocity;
      const angle = type === 'projectile' ? parameters.angle * Math.PI / 180 : Math.PI / 2;
      const g = parameters.gravity;
      
      ctx.strokeStyle = '#64C8FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let t = 0; t <= 10; t += 0.1) {
        const y = v0 * Math.sin(angle) * t - 0.5 * g * t * t;
        const x = 40 + t * 30;
        const plotY = 260 - y * 5;
        
        if (plotY >= 40 && plotY <= 260) {
          if (t === 0) ctx.moveTo(x, plotY);
          else ctx.lineTo(x, plotY);
        }
      }
      ctx.stroke();
    }
    
    // Labels
    ctx.fillStyle = '#FFF';
    ctx.font = '12px sans-serif';
    ctx.fillText('Time (s)', 340, 280);
    ctx.fillText('Height (m)', 10, 30);
    
  }, [type, parameters, time]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto bg-black/20 rounded-xl border border-white/10"
    />
  );
};

// ==================== SIMULATION PAGE ====================

const SimulationPage = ({ onNavigate, problemData }) => {
  const [params, setParams] = useState(problemData.parameters);
  const [isPlaying, setIsPlaying] = useState(true);
  const [whatIfQuery, setWhatIfQuery] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  
  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
  };
  
  const handleWhatIf = () => {
    const query = whatIfQuery.toLowerCase();
    
    if (query.includes('double') && query.includes('velocity')) {
      setParams(prev => ({ ...prev, velocity: prev.velocity * 2 }));
    } else if (query.includes('moon') || query.includes('1.6')) {
      setParams(prev => ({ ...prev, gravity: 1.6 }));
    } else if (query.includes('angle')) {
      const angle = parseFloat(query.match(/\d+/)?.[0] || 45);
      setParams(prev => ({ ...prev, angle }));
    }
    
    setWhatIfQuery('');
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950" />
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              PhysAI Lab
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                {showCompare ? 'Single View' : 'Compare Mode'}
              </button>
              <button
                onClick={() => onNavigate('problem-input')}
                className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                New Problem
              </button>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Explanation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Problem Card */}
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Problem
                </h3>
                <p className="text-blue-200/80 leading-relaxed">
                  {problemData.problem}
                </p>
              </div>
              
              {/* Explanation Card */}
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {problemData.explanation.title}
                </h3>
                <div className="space-y-2">
                  {problemData.explanation.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-blue-200/80 text-sm leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-xl bg-black/20 border border-cyan-400/30">
                  <div className="text-cyan-300 font-mono text-center">
                    {problemData.explanation.equation}
                  </div>
                </div>
              </div>
              
              {/* Parameter Controls */}
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Parameters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-blue-200 mb-2">
                      Velocity: {params.velocity.toFixed(1)} m/s
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="0.5"
                      value={params.velocity}
                      onChange={(e) => handleParamChange('velocity', e.target.value)}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  {problemData.type === 'projectile' && (
                    <div>
                      <label className="block text-sm text-blue-200 mb-2">
                        Angle: {params.angle.toFixed(1)}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        step="1"
                        value={params.angle}
                        onChange={(e) => handleParamChange('angle', e.target.value)}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm text-blue-200 mb-2">
                      Gravity: {params.gravity.toFixed(1)} m/s²
                    </label>
                    <input
                      type="range"
                      min="1.6"
                      max="24.8"
                      step="0.1"
                      value={params.gravity}
                      onChange={(e) => handleParamChange('gravity', e.target.value)}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
              
              {/* What-If AI Panel */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-lg border border-cyan-400/30">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  💡 What-If AI
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={whatIfQuery}
                    onChange={(e) => setWhatIfQuery(e.target.value)}
                    placeholder="Try: 'What if gravity was Moon gravity?'"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-cyan-400/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleWhatIf()}
                  />
                  <button
                    onClick={handleWhatIf}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    →
                  </button>
                </div>
                <div className="mt-3 text-xs text-blue-200/60">
                  Try: "double velocity", "change angle to 60", "moon gravity"
                </div>
              </div>
            </motion.div>
            
            {/* Center/Right Panel - Simulation & Graphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Simulation Controls */}
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Live Simulation
                </h3>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-bold"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
              </div>
              
              {/* Simulation Canvas */}
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20">
                <SimulationCanvas
                  type={problemData.type}
                  parameters={params}
                  isPlaying={isPlaying}
                />
              </div>
              
              {/* Multi-View */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Graph */}
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20">
                  <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    Position vs Time
                  </h4>
                  <GraphView
                    type={problemData.type}
                    parameters={params}
                    time={params.time}
                  />
                </div>
                
                {/* Live Equations */}
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20">
                  <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    Live Calculations
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-black/20 border border-cyan-400/30">
                      <div className="text-cyan-300 font-mono text-sm">
                        v₀ = {params.velocity.toFixed(2)} m/s
                      </div>
                    </div>
                    {problemData.type === 'projectile' && (
                      <>
                        <div className="p-3 rounded-lg bg-black/20 border border-cyan-400/30">
                          <div className="text-cyan-300 font-mono text-sm">
                            vₓ = {(params.velocity * Math.cos(params.angle * Math.PI / 180)).toFixed(2)} m/s
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20 border border-cyan-400/30">
                          <div className="text-cyan-300 font-mono text-sm">
                            vᵧ = {(params.velocity * Math.sin(params.angle * Math.PI / 180)).toFixed(2)} m/s
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20 border border-cyan-400/30">
                          <div className="text-cyan-300 font-mono text-sm">
                            Range = {((params.velocity**2 * Math.sin(2 * params.angle * Math.PI / 180)) / params.gravity).toFixed(2)} m
                          </div>
                        </div>
                      </>
                    )}
                    <div className="p-3 rounded-lg bg-black/20 border border-cyan-400/30">
                      <div className="text-cyan-300 font-mono text-sm">
                        g = {params.gravity.toFixed(2)} m/s²
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

// ==================== MAIN APP ====================

export default function PhysAILab() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [problemData, setProblemData] = useState(null);
  
  const handleSubmitProblem = (problemText) => {
    const parsed = parsePhysicsProblem(problemText);
    setProblemData(parsed);
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onNavigate={setCurrentPage} />
          </motion.div>
        )}
        
        {currentPage === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoginPage onNavigate={setCurrentPage} />
          </motion.div>
        )}
        
        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard onNavigate={setCurrentPage} />
          </motion.div>
        )}
        
        {currentPage === 'problem-input' && (
          <motion.div
            key="problem-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProblemInputPage 
              onNavigate={setCurrentPage}
              onSubmitProblem={handleSubmitProblem}
            />
          </motion.div>
        )}
        
        {currentPage === 'simulation' && problemData && (
          <motion.div
            key="simulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SimulationPage 
              onNavigate={setCurrentPage}
              problemData={problemData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
