import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';
import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Buy from './Pages/Buy/buy';
import Info from './Pages/Info/info';
import LoginPage from './Pages/Login/login';
import RegisterPage from './Pages/Login/Register';
import ProfilePage from './Pages/profile/profile';

// import Contact from "./Pages/Contact/contact";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Buy" element={<Buy/>} />
          <Route path="/Info" element={<Info/>} />
          <Route path="/login-page" element={<LoginPage/>} />
          <Route path="/register-page" element={<RegisterPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          
          {/* <Route path="/Contact" element={<Contact/>} /> */}
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
