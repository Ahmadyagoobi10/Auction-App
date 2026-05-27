import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./Pages/Login";
import Auctions from "./Pages/Auctions";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Utils/ProtectedRoute";
import { connection } from "./Signaler/SignalConnection";



export default function App() {

  useEffect(() => {
    connection.start()
      .then(() => console.log("SignalR connected globally"))
      .catch((err: any) => console.log("SignalR error:", err));
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/auctions"
          element={
            <ProtectedRoute>
              <Auctions />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}