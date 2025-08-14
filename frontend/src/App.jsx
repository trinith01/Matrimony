import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import NavLayout from "./Layout/navLayout";
import Landing from "./pages/Landing";
import { AuthProvider } from "./lib/context/AuthContext";
import UserProfilePage from "./pages/UserPage";

import PaymentSuccess from "./components/payment-success";
import PrivateRoute from "./components/private-route";

function App() {
  return (
    // <AuthProvider>
    //   <Router>
    //     <Routes>
    //       {/* Public Route (Landing Page) */}
    //       <Route path="/landing" element={<AuthPage />} />
    //       <Route path="/home" element={<Landing />} />

    //       {/* Protected Routes (Wrapped with PrivateRoute) */}
    //       <Route element={<PrivateRoute />}>
    //         <Route element={<NavLayout />}>
    //           <Route path="/" element={<HomePage />} />
    //           <Route path="/profile" element={<ProfilePage />} />
    //           <Route path="/user-profile" element={<UserProfilePage />} />
    //         </Route>
    //       </Route>
    //     </Routes>
    //   </Router>
    // </AuthProvider>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<NavLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
            </Route>
          </Route>

          {/* Redirect to landing if no route matches */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
