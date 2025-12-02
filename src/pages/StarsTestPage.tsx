import { useEffect, useRef } from 'react';

export function StarsTestPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let stars: Star[] = [];

    // --- Cached gradient texture for stars ---
    const starTexture = document.createElement('canvas');
    const ctx2 = starTexture.getContext('2d')!;
    starTexture.width = 100;
    starTexture.height = 100;
    const half = starTexture.width / 2;
    const gradient = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.4, 'rgba(200, 220, 255, 0.4)');
    gradient.addColorStop(1, 'transparent');
    ctx2.fillStyle = gradient;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    // --- Utility function ---
    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    // --- Star class with 3D forward motion ---
    class Star {
      x: number;
      y: number;
      z: number;
      speed: number;
      baseRadius: number;

      constructor() {
        // Random starting position in 3D space
        this.x = random(-w * 0.5, w * 0.5);
        this.y = random(-h * 0.5, h * 0.5);
        this.z = random(100, 2000); // Start at various depths
        this.speed = random(0.5, 3);
        this.baseRadius = random(1, 3);
      }

      update() {
        // Move star forward (toward camera, decreasing Z)
        this.z -= this.speed;

        // Reset star when it gets too close (passes camera)
        if (this.z <= 0) {
          this.x = random(-w * 0.5, w * 0.5);
          this.y = random(-h * 0.5, h * 0.5);
          this.z = 2000; // Reset to far distance
        }
      }

      draw() {
        // Perspective projection
        const perspective = 500;
        const scale = perspective / (perspective + this.z);
        
        // Project 3D position to 2D screen (center of screen is origin)
        const screenX = (this.x * scale) + w / 2;
        const screenY = (this.y * scale) + h / 2;
        
        // Scale star size based on distance (closer = bigger)
        const radius = this.baseRadius * scale * 5;
        
        // Calculate opacity based on distance (closer = brighter)
        const distanceAlpha = Math.min(1, (2000 - this.z) / 1000);
        ctx.globalAlpha = distanceAlpha * 0.8;

        // Draw the star if it's on screen
        if (screenX >= -radius && screenX <= w + radius && 
            screenY >= -radius && screenY <= h + radius && radius > 0.5) {
          ctx.drawImage(
            starTexture, 
            screenX - radius / 2, 
            screenY - radius / 2, 
            radius, 
            radius
          );
        }
      }
    }

    // Initialize stars
    for (let i = 0; i < 500; i++) {
      stars.push(new Star());
    }

    // --- Animation loop ---
    const animate = () => {
      // Clear canvas with subtle fade for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);

      // Update and draw stars
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // --- Resize handling ---
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 1 }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        color: 'white', 
        fontFamily: 'monospace',
        zIndex: 10,
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <h2>Stars Test - Forward Motion</h2>
        <p>You should see stars moving toward you (getting bigger and brighter)</p>
        <p>If you see stars, the implementation is working!</p>
      </div>
    </div>
  );
}

