import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./AdminPages/Login.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-panel" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
