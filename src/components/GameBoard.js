import React, { useRef, useEffect, useState, useCallback } from 'react';

const GameBoard = ({ functionType, showAnswer, setScore, resetTrigger }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPath, setUserPath] = useState([]);
  const [hasAttempted, setHasAttempted] = useState(false);

  const canvasWidth = 800;  // Increased from 400
  const canvasHeight = 600; // Increased from 300

  const functions = {
    linear: (x) => 0.5 * x - 1,
    quadratic: (x) => x * x,
    cubic: (x) => x * x * x,
    sin: (x) => Math.sin(x),
    cos: (x) => Math.cos(x),
    tan: (x) => Math.tan(x),
    exp: (x) => Math.exp(x),
    composite: (x) => Math.sin(x) + 0.5 * Math.cos(2 * x),
  };

  const derivatives = {
    linear: () => 0.5,
    quadratic: (x) => 2 * x,
    cubic: (x) => 3 * x * x,
    sin: (x) => Math.cos(x),
    cos: (x) => -Math.sin(x),
    tan: (x) => 1 / (Math.cos(x) * Math.cos(x)),
    exp: (x) => Math.exp(x),
    composite: (x) => Math.cos(x) - Math.sin(2 * x),
  };

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(ctx);
    drawAxes(ctx);
    drawFunction(ctx);
    setUserPath([]);
    setScore(null);
    setHasAttempted(false);
  }, [setScore, functionType]);

  useEffect(() => {
    resetCanvas();
  }, [functionType, resetTrigger, resetCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    redrawCanvas(ctx);
  }, [showAnswer, userPath]);

  const redrawCanvas = (ctx) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(ctx);
    drawAxes(ctx);
    drawFunction(ctx);
    drawUserPath(ctx);
    if (showAnswer) {
      drawDerivative(ctx);
    }
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvasWidth; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= canvasHeight; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx) => {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
  };

  const drawFunction = (ctx) => {
    const scaleX = canvasWidth / 8;
    const scaleY = canvasHeight / 8;
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvasWidth; x++) {
      const t = (x - canvasWidth / 2) / scaleX;
      const y = canvasHeight / 2 - scaleY * functions[functionType](t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const drawUserPath = (ctx) => {
    if (userPath.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(userPath[0].x, userPath[0].y);
    for (let i = 1; i < userPath.length; i++) {
      ctx.lineTo(userPath[i].x, userPath[i].y);
    }
    ctx.stroke();
  };

  const drawDerivative = (ctx) => {
    const scaleX = canvasWidth / 8;
    const scaleY = canvasHeight / 8;
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvasWidth; x++) {
      const t = (x - canvasWidth / 2) / scaleX;
      const y = canvasHeight / 2 - scaleY * derivatives[functionType](t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const startDrawing = (e) => {
    if (hasAttempted) return; // Prevent drawing if already attempted
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setUserPath([{ x: offsetX, y: offsetY }]);
  };

  const draw = (e) => {
    if (!isDrawing || hasAttempted) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setUserPath(prev => [...prev, { x: offsetX, y: offsetY }]);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(userPath[userPath.length - 1].x, userPath[userPath.length - 1].y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing || hasAttempted) return;
    setIsDrawing(false);
    setHasAttempted(true);
    calculateScore();
  };

  const calculateScore = () => {
    if (userPath.length < 2) return;
    // This is a placeholder for the score calculation logic
    // You should implement a proper scoring algorithm here
    const newScore = Math.floor(Math.random() * 100); // Random score for demonstration
    setScore(newScore);
  };

  return (
    <div className="game-board">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <div>Current Function: {functionType}</div>
    </div>
  );
};

export default GameBoard;