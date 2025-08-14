import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import AdminPage from "./pages/adminPage";
import Layout from "./components/layout";
import UserProfilePage from "./pages/UserPage";
import BackgroundCheckAdmin from "./components/background -verification-admin";
import { HoroscopeAdmin } from "./components/horoscope-admin";
import ProtectedRoute from "./components/protectedRoutes";
import SubscriptionPlansPage from "./pages/subplan";
import RegisterAdminPage from "./pages/registerAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route (Auth Page) */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected Routes wrapped with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/background" element={<BackgroundCheckAdmin />} />
          <Route path="/horoscope" element={<HoroscopeAdmin />} />
          <Route path="/subscription" element={<SubscriptionPlansPage />} />
          <Route path="/admin/register" element={<RegisterAdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
