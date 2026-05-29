import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./Pages/Login";
import Auctions from "./Pages/Auctions";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Utils/ProtectedRoute";
import CreateAuction from "./Pages/CreateAuction";
import { connection } from "./Signaler/SignalConnection";
import { getToken } from "./Utils/Auth";

export default function App() {

  useEffect(() => {
    connection.start()
      .then(() => console.log("SignalR connected globally"))
      .catch((err: any) => console.log("SignalR error:", err));
  }, []);

  const isLoggedIn = !!getToken();

  return (
    <BrowserRouter>

      
      {isLoggedIn && <Navbar />}

      <Routes>

        
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/home" />
              : <Login />
          }
        />

        <Route path="/login" element={<Login />} />

        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auctions"
          element={
            <ProtectedRoute>
              <Auctions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateAuction />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}