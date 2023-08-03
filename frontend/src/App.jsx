import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PreferenceForm from "./components/SurpriseFlow/PreferenceForm";
import ItineraryView from "./components/ItineraryView"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/creation" element={<PreferenceForm />} />
        <Route path="/trip/:tripId/:days" element={<ItineraryView />} />
      </Routes>
    </Router>
  );
}

export default App;
