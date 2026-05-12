import "./App.css";
// import ApiSmokeTest from "./ApiSmokeTest";
import BrowseBikes from "./pages/BrowseBikes";

function App() {
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
      <BrowseBikes />
    </>
  );
}

export default App;
