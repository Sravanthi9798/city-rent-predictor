import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RentPrediction from './pages/RentPrediction';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RentPrediction/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App