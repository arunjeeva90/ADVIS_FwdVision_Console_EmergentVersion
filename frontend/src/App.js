import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cockpit from "@/pages/Cockpit";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cockpit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
