import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SurpriseForm from "./components/SurpriseFlow/SurpriseForm";
// import DefaultForm from "./components/DefaultFlow/DefaultForm";
import TripView from "./pages/TripView";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/surprise" element={<SurpriseForm />} />
        <Route path="/trip/:tripId/:days" element={<TripView />} />
        <Route path="/" element={<Navigate to="/surprise" replace />} />
        {/* <Route path="/default" element={<DefaultForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
