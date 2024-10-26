import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WeatherDisplay from "./components/Weather";
import DailySummary from "./components/DailySummary";
import Navbar from "./components/Navbar";
import DailySummaryChart from "./components/DailySummaryChart";


function App() {
  return (
    <Router>
      <div>
      
      <Navbar />

        <Routes>
          <Route path="/" element={<WeatherDisplay />} />
          <Route path="/summary" element={<DailySummary />} />
          <Route path="/chart" element={<DailySummaryChart />} />
         
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
