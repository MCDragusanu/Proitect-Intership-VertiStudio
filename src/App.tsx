import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./client/pages/landing_page/LandingPage";
import TransactionsPage from "./client/pages/transactions/TransactionHistoryPage";
import RegisterPage from "./client/pages/register/RegisterPage";
import LoginPage from "./client/pages/login/LoginPage";
import ProfilePage from "./client/pages/profile/ProfilePage";

import MarketDashboard from "./client/pages/market/MarketPage";
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/marketplace" element={<MarketDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:userUid" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
