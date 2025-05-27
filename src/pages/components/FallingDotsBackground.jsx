import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

const FallingDotsBackground = () => {
  const canvasRef = useRef(null);
  const theme = useTheme();
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let dots = [];
    const numDots = 150; 

    const getDotColors = () => {
      const isDarkMode = theme.palette.mode === 'dark';
      const colorSet = new Set();


      if (theme.palette.primary.main) colorSet.add(theme.palette.primary.main);
      if (theme.palette.secondary.main) colorSet.add(theme.palette.secondary.main);
      if (theme.palette.info.main) colorSet.add(theme.palette.info.main);
      if (theme.palette.success.main) colorSet.add(theme.palette.success.main);
      
 
      if (theme.palette.primary.light) colorSet.add(theme.palette.primary.light);
      if (theme.palette.secondary.light) colorSet.add(theme.palette.secondary.light);
      if (theme.palette.info.light) colorSet.add(theme.palette.info.light);
      if (theme.palette.success.light) colorSet.add(theme.palette.success.light);


      if (theme.palette.text.primary) colorSet.add(theme.palette.text.primary);
      if (theme.palette.text.secondary) colorSet.add(theme.palette.text.secondary);
      
    
      const defaultBrightColors = [
        "#FFFFFF", "#E0E0E0", 
        "#4FC3F7", "#81C784", "#FFB74D", "#BA68C8" 
      ];

      let finalColors = Array.from(colorSet);

      if (isDarkMode) {
  
        const lightThemeColors = [
            theme.palette.primary.light,
            theme.palette.secondary.light,
            theme.palette.info.light,
            theme.palette.success.light,
            theme.palette.text.secondary, 
        ].filter(Boolean); 
        finalColors = [...new Set([...lightThemeColors, ...defaultBrightColors.slice(0,2)])]; 
      } else {
     
         const mainThemeColors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.info.main,
         ].filter(Boolean);
         finalColors = [...new Set([...mainThemeColors, ...defaultBrightColors.slice(2)])];
      }
      

      if (finalColors.length === 0) {
        finalColors = defaultBrightColors;
      }

      return finalColors;
    };

    let availableColors = getDotColors();

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      availableColors = getDotColors(); 
      initializeDots();
    };

    class Dot {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0 - Math.random() * 70; 
        this.radius = Math.random() * 2 + 1;
        this.speed = Math.random() * 1.5 + 0.8; 
        this.color = availableColors[Math.floor(Math.random() * availableColors.length)];
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.y += this.speed;
        if (this.y - this.radius > canvas.height) {
          this.reset();
        }
      }
    }

    const initializeDots = () => {
      dots = [];
      for (let i = 0; i < numDots; i++) {
        dots.push(new Dot());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((dot) => {
        dot.update();
        dot.draw();
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme]);

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