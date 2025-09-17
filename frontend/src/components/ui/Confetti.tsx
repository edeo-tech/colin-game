'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface ConfettiProps {
  duration?: number;
  pieceCount?: number;
}

const COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
];

export default function Confetti({ duration = 3000, pieceCount = 50 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Initialize confetti pieces
    const initialPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      opacity: 1
    }));

    setPieces(initialPieces);

    // Animation loop
    let animationId: number;
    const animate = () => {
      setPieces(prevPieces => {
        const updatedPieces = prevPieces.map(piece => {
          const newY = piece.y + piece.vy;
          return {
            ...piece,
            x: piece.x + piece.vx,
            y: newY,
            rotation: piece.rotation + piece.rotationSpeed,
            vy: piece.vy + 0.1, // gravity
            opacity: newY > window.innerHeight ? 0 : piece.opacity
          };
        });
        
        // Stop animation when all pieces are transparent
        const visiblePieces = updatedPieces.filter(piece => piece.opacity > 0);
        if (visiblePieces.length === 0) {
          setIsActive(false);
        }
        
        return updatedPieces;
      });
      
      if (isActive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Auto-stop after duration
    const timeout = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeout);
    };
  }, [duration, pieceCount, isActive]);

  if (!isActive && pieces.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: '2px',
            opacity: piece.opacity
          }}
        />
      ))}
    </div>
  );
}