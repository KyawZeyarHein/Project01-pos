import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SalesJournal from "./pages/SalesJournal";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales-journal" element={<SalesJournal />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
