import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./AdminPages/Login.jsx";
import Admin from "./AdminPages/Admin.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-panel" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
