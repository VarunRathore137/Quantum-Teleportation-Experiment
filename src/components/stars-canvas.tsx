'use client';
import { useEffect, useRef } from 'react';

interface StarsCanvasProps {
  transparent?: boolean;       // Background transparency
  maxStars?: number;           // Total number of stars
  hue?: number;                // Color hue for the stars
  brightness?: number;         // Overall star brightness (0–1)
  speedMultiplier?: number;    // Global animation speed multiplier
  twinkleIntensity?: number;   // How often stars twinkle
  className?: string;          // Custom class for the canvas
  paused?: boolean;            // Pause animation toggle
}

export function StarsCanvas({
  transparent = false,
  maxStars = 1200,
  hue = 217,
  brightness = 1,
  speedMultiplier = 1,
  twinkleIntensity = 20,
  className = '',
  paused = false,
}: StarsCanvasProps) {
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
    gradient.addColorStop(0.1, `hsl(${hue}, 61%, 80%)`);
    gradient.addColorStop(0.3, `hsl(${hue}, 64%, 40%)`);
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
      x: number;           // X position in 3D space
      y: number;           // Y position in 3D space
      z: number;           // Z depth (distance from camera)
      speed: number;       // Speed of movement
      baseRadius: number;  // Base size of the star
      alpha: number;       // Base opacity

      constructor() {
        // Random starting position in 3D space (centered around origin)
        this.x = random(-w * 0.5, w * 0.5);
        this.y = random(-h * 0.5, h * 0.5);
        this.z = random(100, 2000); // Start at various depths
        this.speed = random(0.5, 3) * speedMultiplier;
        this.baseRadius = random(1, 3);
        this.alpha = random(0.4, 1);
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
        const perspective = 500; // Focal length
        const scale = perspective / (perspective + this.z);
        
        // Project 3D position to 2D screen (center of screen is origin)
        const screenX = (this.x * scale) + w / 2;
        const screenY = (this.y * scale) + h / 2;
        
        // Scale star size based on distance (closer = bigger)
        const radius = this.baseRadius * scale * 5;
        
        // Calculate opacity based on distance (closer = brighter)
        const distanceAlpha = Math.min(1, (2000 - this.z) / 1000);
        ctx.globalAlpha = Math.min(1, this.alpha * distanceAlpha * brightness);

        // Twinkle effect
        const twinkle = Math.floor(random(0, twinkleIntensity));
        if (twinkle === 1 && this.alpha > 0.2) {
          this.alpha -= 0.02;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.02;
        }

        // Draw the star if it's on screen and visible
        if (screenX >= -radius && screenX <= w + radius && 
            screenY >= -radius && screenY <= h + radius && 
            radius > 0.5 && ctx.globalAlpha > 0.01) {
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
    for (let i = 0; i < maxStars; i++) {
      stars.push(new Star());
    }

    // --- Animation loop ---
    const animate = () => {
      if (paused) return; // Skip if paused

      // Clear canvas with subtle fade for trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = transparent ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.1)';
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
  }, [transparent, maxStars, hue, brightness, speedMultiplier, twinkleIntensity, paused]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
