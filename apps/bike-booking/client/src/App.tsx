import { useState } from "react";
import "./App.css";
import BrowseBikes from "./pages/BrowseBikes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Bike Booking App</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <BrowseBikes />
    </>
  );
}

export default App;
