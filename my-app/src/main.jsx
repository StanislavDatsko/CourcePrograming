import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import Index from "./components/HomePage.jsx";
import Shedule from "./components/Shedule.jsx";
import MyCabinet from "./components/MyCabinet.jsx";
import HomePage from "./components/HomePageMain.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/SignIn" element={<SignIn />}/>
        <Route path="/SignUp" element={<SignUp />}/>
        <Route path="/home" element={<Index />}/>
        <Route path="/shedule" element={<Shedule />} />
        <Route path="/myCabinet" element={<MyCabinet />} />
        

      </Routes>
    </Router>
    </AuthProvider>
  </React.StrictMode>
);
