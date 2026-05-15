import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import Login from "./pages/Login.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage.jsx";
import ErrorBoundary from "./components/UI/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-panel" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
