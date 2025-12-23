import { motion } from 'framer-motion';
import './Loading.css';

const Loading = () => {
  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-content">
        {/* Animated logo with multiple elements */}
        <div className="loading-logo-container">
          <motion.div 
            className="loading-logo"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="logo-text">MR</span>
          </motion.div>
          
          {/* Floating particles around the logo */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="loading-particle"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
              }}
              style={{
                position: 'absolute',
                left: `${50 + 25 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                top: `${50 + 25 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                x: '-50%',
                y: '-50%',
              }}
            />
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="loading-title"
        >
          MegaReality
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="loading-subtitle"
        >
          Finding your dream home
        </motion.p>

        {/* Enhanced loading bar with multiple animated elements */}
        <div className="loading-progress-container">
          <div className="loading-bar-background">
            <motion.div 
              className="loading-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="loading-bar-pulse"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Animated dots */}
        <div className="loading-dots">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="loading-dot"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Floating background elements */}
        <div className="floating-background">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-element"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                position: 'absolute',
                width: `${30 + i * 10}px`,
                height: `${30 + i * 10}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;