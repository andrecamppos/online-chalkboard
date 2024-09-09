import React, { useRef, useState, useEffect } from 'react';
import './Chalkboard.css';

const Chalkboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [ctx, setCtx] = useState(null);
  const [chalkColor, setChalkColor] = useState('rgba(255,255,255,0.5)'); // Default white color
  const brushDiameter = 7;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Set canvas background color to a darker shade
    context.fillStyle = '#040506';
    context.fillRect(0, 0, canvas.width, canvas.height);

  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { clientX: mouseX, clientY: mouseY } = e;
    setLastPosition({ x: mouseX, y: mouseY });
    draw(e);
  };

  const handleTouchStart = (e) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    const { pageX: x, pageY: y } = touch;
    setLastPosition({ x, y });
    draw(x, y);
  }

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx.closePath();
  };

  const drawing = (e) => {
    const { clientX: x, clientY: y } = e;
    draw(x, y);
  }

  const touchDrawing = (e) => {
    const touch = e.touches[0];
    const { pageX: x, pageY: y } = touch;
    draw(x, y);
  }

  const draw = (x, y) => {
    if (!isDrawing) return;
    // Create chalk effect by using a randomized opacity and slight offsets
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = chalkColor

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Chalk Effect
    const length = Math.round(
      Math.sqrt(Math.pow(x - lastPosition.x, 2) + Math.pow(y - lastPosition.y, 2)) / (5 / brushDiameter)
    );
    const xUnit = (x - lastPosition.x) / length;
    const yUnit = (y - lastPosition.y) / length;
    for (let i = 0; i < length; i++) {
      const xCurrent = lastPosition.x + i * xUnit;
      const yCurrent = lastPosition.y + i * yUnit;
      const xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      const yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }

    setLastPosition({ x, y });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#040506';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'chalkboard_drawing.png';
    link.click();
  };

  return (
    <div>
      <div className="header">
        <h1>CHALKBOARD</h1>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={drawing}
        onTouchStart={handleTouchStart}
        onTouchEnd={stopDrawing}
        onTouchMove={touchDrawing}
        style={{ touchAction: 'none' }}
      />
      <div className="top-bar">
        <div className="color-palette">
          {[
            '#F9F9F9', // Light Gray
            '#F28B82', // Light Red
            '#F7C6C7', // Soft Pink
            '#F6BF26', // Light Yellow
            '#AECBFA', // Soft Blue
            '#CCFF90', // Soft Green
            '#B39DDB', // Light Purple
          ].map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() =>
                setChalkColor(`rgba(${parseInt(color.substring(1, 3), 16)},${parseInt(color.substring(3, 5), 16)},${parseInt(color.substring(5, 7), 16)},0.5)`)
              }
              className="color-button"
            />
          ))}
        </div>
        <button className="download-button" onClick={downloadImage}>
          DOWNLOAD
        </button>
        <button className="clear-button" onClick={clearCanvas}>
          CLEAR BOARD
        </button>
      </div>
    </div>
  );
};

export default Chalkboard;
