import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme } from "@mui/material/styles";

const DEFAULT_BRIGHT_COLORS = [
  "#FFFFFF", "#E0E0E0", 
  "#4FC3F7", "#81C784", "#FFB74D", "#BA68C8" 
];

const FallingDotsBackground = () => { 
  const numDots = 80;
  const canvasRef = useRef(null);
  const theme = useTheme();
  const animationFrameId = useRef(null);
  const dotsRef = useRef([]); 

  const getDotColors = useCallback(() => {
    const isDarkMode = theme.palette.mode === 'dark';
    const selectedColors = new Set();

    if (isDarkMode) {
      [
        theme.palette.primary?.light,
        theme.palette.secondary?.light,
        theme.palette.info?.light,
        theme.palette.success?.light,
        theme.palette.text?.secondary,
      ].filter(Boolean).forEach(color => selectedColors.add(color));
      DEFAULT_BRIGHT_COLORS.slice(0, 2).forEach(color => selectedColors.add(color));
    } else {
      [
        theme.palette.primary?.main,
        theme.palette.secondary?.main,
        theme.palette.info?.main,
        theme.palette.success?.main,
      ].filter(Boolean).forEach(color => selectedColors.add(color));
      DEFAULT_BRIGHT_COLORS.slice(2).forEach(color => selectedColors.add(color));
    }

    let finalColors = Array.from(selectedColors);

    if (finalColors.length === 0) {
      finalColors = isDarkMode ? DEFAULT_BRIGHT_COLORS.slice(0, 2) : DEFAULT_BRIGHT_COLORS;
    }
    if (finalColors.length === 0) { 
        finalColors = ["#FFFFFF"]; // Absolute fallback
    }
    return finalColors;
  }, [
    theme.palette.mode,
    theme.palette.primary,
    theme.palette.secondary,
    theme.palette.info,
    theme.palette.success,
    theme.palette.text,
  ]);

  const availableColors = useMemo(() => getDotColors(), [getDotColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    class Dot {
      constructor(canvasWidth, canvasHeight, colors) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.availableColors = colors;
        this.reset();
        this.y = Math.random() * this.canvasHeight;
      }

      reset() {
        this.x = Math.random() * this.canvasWidth;
        this.radius = Math.random() * 1.5 + 0.5; 
        this.y = -this.radius - (Math.random() * this.canvasHeight * 0.2); 
        this.speed = Math.random() * 1.0 + 0.4;  
        this.color = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
      }

      update() {
        this.y += this.speed;
        if (this.y - this.radius > this.canvasHeight) {
          this.reset();
        }
      }
    }

    const initializeDots = (canvasWidth, canvasHeight, colorsToUse) => {
      const newDots = [];
      for (let i = 0; i < numDots; i++) {
        newDots.push(new Dot(canvasWidth, canvasHeight, colorsToUse));
      }
      dotsRef.current = newDots;
    };
    
    const resizeCanvas = () => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;

      const newWidth = currentCanvas.offsetWidth;
      const newHeight = currentCanvas.offsetHeight;

      if (currentCanvas.width !== newWidth || currentCanvas.height !== newHeight) {
        currentCanvas.width = newWidth;
        currentCanvas.height = newHeight;
      }
      initializeDots(currentCanvas.width, currentCanvas.height, availableColors);
    };

    const animate = () => {
      const currentCanvas = canvasRef.current;
      const currentCtx = currentCanvas ? currentCanvas.getContext('2d') : null;

      if (!currentCanvas || !currentCtx) {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        return;
      }

      currentCtx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
      dotsRef.current.forEach((dot) => {
        dot.update();
        dot.draw(currentCtx);
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas(); 
    animate(); 

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    };

    const debouncedResizeCanvas = debounce(resizeCanvas, 250);
    window.addEventListener("resize", debouncedResizeCanvas);

    return () => {
      window.removeEventListener("resize", debouncedResizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [numDots, availableColors]);                      

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0, 
        pointerEvents: "none",
      }}
    />
  );
};

export default FallingDotsBackground;