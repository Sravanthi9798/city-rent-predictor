import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RentPrediction from './pages/RentPrediction';
import MarketComparisonDashboard from './pages/MarketComparisonDashboard';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RentPrediction/>} />
        <Route path="/marketcomparison" element={<MarketComparisonDashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App