import React, { useEffect, useState } from 'react';

const ConfettiAnimation = ({ trigger, duration = 3000 }) => {
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      createParticles();
      
      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  const createParticles = () => {
    const newParticles = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const emojis = ['🎉', '🎊', '✨', '🎈', '🎯', '🏆', '💫', '⭐', '🌟', '💎'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 20 + 10,
        opacity: 1,
        type: Math.random() > 0.5 ? 'emoji' : 'confetti'
      });
    }
    setParticles(newParticles);
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + particle.rotationSpeed,
          opacity: particle.opacity - 0.02,
          vy: particle.vy + 0.1 // gravity
        })).filter(particle => particle.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
            fontSize: particle.size,
            color: particle.color,
            transition: 'all 0.1s ease-out'
          }}
        >
          {particle.type === 'emoji' ? (
            <span className="select-none">{particle.emoji}</span>
          ) : (
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ConfettiAnimation; 