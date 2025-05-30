import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';
import { BrowserRouter , Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Buy from './Pages/Buy/buy';
import Info from './Pages/Info/info';
import LoginPage from './Pages/Login/login';
import RegisterPage from './Pages/Login/Register';
import ProfilePage from './Pages/profile/profile';
import OwnerDashboard from './Pages/Owner/owner';

// import Contact from "./Pages/Contact/contact";

function Layout() {
  const location = useLocation();
  const isOwnerDashboard = location.pathname === '/owner-dashboard';

  return (
    <>
      {!isOwnerDashboard && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Buy" element={<Buy />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        {/* Add other routes here */}
      </Routes>
      {!isOwnerDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
