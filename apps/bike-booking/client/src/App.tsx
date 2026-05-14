import { useState } from "react";
import "./App.css";
// import ApiSmokeTest from "./ApiSmokeTest";
import BikeList from "./pages/BikeList";

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
      {/* ignore smoke test component - for dev purposes */}
      {/* <ApiSmokeTest>  */}
      <BikeList />
    </>
  );
}

export default App;
