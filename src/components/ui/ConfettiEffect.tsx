// File: components/ui/ConfettiEffect.tsx
import { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
  duration?: number;
}

export function ConfettiEffect({ duration = 3000 }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      velocityX: number;
      velocityY: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
      });
    }

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      if (elapsed >= duration) {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.rotation += particle.rotationSpeed;

        ctx?.save();
        ctx?.translate(particle.x, particle.y);
        ctx?.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx?.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx?.restore();
      });

      requestAnimationFrame(animate);
    }

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
}