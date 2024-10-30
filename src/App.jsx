import './App.css';
import React, { useState, useEffect } from 'react';

const SquareGrid = () => {
  const [squares, setSquares] = useState([]);

  // Random color generator
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addSquare = () => {
    let newColor = getRandomColor();

    // Create a new square with a unique ID
    const newSquare = {
      id: squares.length > 0 ? Math.max(...squares.map(square => square.id)) + 1 : 1, // Assign a unique ID
      color: newColor,
      PositionX: 0, // Default PositionX
      PositionY: 0, // Default PositionY
    };

    // Update state to include the new square
    const newSquares = [...squares, newSquare];
    setSquares(newSquares);

    // Immediately save the new square to the API
    saveSquaresToAPI(newSquare);
  };

  const fetchSquaresFromAPI = async () => {
    try {
      const response = await fetch('https://localhost:5001/api/squares');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSquares(data); // Set the fetched squares
    } catch (error) {
      console.error('Error fetching squares:', error);
    }
  };

  async function saveSquaresToAPI(square) {
    // Adjust the square structure to match your API requirements
    const squareToSave = {
      Id: square.id, // ID of the square
      Color: square.color, // Color of the square
      PositionX: square.PositionX, // X position
      PositionY: square.PositionY, // Y position
    };

    try {
      const response = await fetch("https://localhost:5001/api/squares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(squareToSave), // Ensure proper object structure
      });

      if (!response.ok) {
        // Handle error response
        const errorText = await response.text(); // Get error text for debugging
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const addedSquare = await response.json();
      console.log("Added square:", addedSquare);
    } catch (error) {
      console.error("Error saving square:", error);
    }
  };

  // Fetch saved squares on page load
  useEffect(() => {
    fetchSquaresFromAPI();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'

    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(squares.length))}, 1fr)`,
        gap: '5px',
      }}>
        {squares.map((square) => (
          <div key={square.id} style={{ width: 50, height: 50, backgroundColor: square.color }} />
        ))}
      </div>

      <button
        onClick={addSquare}
        style={{
          width: '100px',
          height: '50px',
          marginLeft: '10px',
          fontSize: '16px',
          color: 'white',
          backgroundColor: 'purple',
          borderRadius: '5px',
          border: 'black'
        }}
      >
        Add Square
      </button>
    </div>
  );
};

export default SquareGrid;