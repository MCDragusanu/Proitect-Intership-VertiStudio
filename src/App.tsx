import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./client/pages/landing_page/LandingPage";
import TransactionsPage from "./client/pages/transactions/TransactionHistoryPage";
import RegisterPage from "./client/pages/register/RegisterPage";
import LoginPage from "./client/pages/login/LoginPage";
import ProfilePage from "./client/pages/profile/ProfilePage";
import ErrorPage from "./client/pages/error_page/ErrorPage";
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/market" element={<TransactionsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:userUid" element = {<ProfilePage/>}/>
        <Route path = "/error" element = {<ErrorPage/>}/>
		<Route path = "/login" element = {<LoginPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
