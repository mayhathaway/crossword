import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [grid, setGrid] = useState(null); // placeholder for puzzle grid

  useEffect(() => {
    socket.on("puzzle", (puzzle) => {
      setGrid(puzzle);
    });

    return () => socket.disconnect();
  }, []);

  const handleJoin = () => {
    socket.emit("join_queue");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Crossword Racer</h1>
      <button onClick={handleJoin} className="mt-4 bg-blue-500 px-4 py-2 text-white rounded">
        Join Match
      </button>
      {grid && (
        <div className="mt-6">
          <pre>{JSON.stringify(grid, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
