import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RentPrediction from './pages/RentPrediction';
import MarketComparisonDashboard from './pages/MarketComparisonDashboard';
import Register from './pages/Register';
import LoginPage from './pages/Login';
import RentHeatmap from './pages/RentHeatMap';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/rentPredictor" element={<RentPrediction/>}/>
        <Route path="/marketcomparison" element={<MarketComparisonDashboard/>} />
        <Route path="/rent-heatmap" element={<RentHeatmap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App