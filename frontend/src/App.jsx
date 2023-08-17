import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SurpriseForm from "./components/SurpriseFlow/SurpriseForm";
import DefaultForm from "./components/DefaultFlow/DefaultForm";
import TripView from "./pages/TripView";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/surprise" element={<SurpriseForm />} />
        <Route path="/default" element={<DefaultForm />} />
        <Route path="/trip/:tripId/:days" element={<TripView />} />
      </Routes>
    </Router>
  );
}

export default App;
