import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./client/pages/landing_page/LandingPage";
import MarketPage from "./client/pages/market_place/MarketPlacePage";
import RegisterPage from "./client/pages/register/RegisterPage";
import LoginPage from "./client/pages/login/LoginPage";
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/register" element={<RegisterPage />} />
		<Route path = "/login" element = {<LoginPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
