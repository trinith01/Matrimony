import { NavigationBar } from "@/components/nav-bar";
import AdminDashboard from "@/components/User-verification";
import { RegisterForm } from "./RejisterForm";
import React from "react";

function adminPage() {
  return (
    <div>
      <div className="p-4">
        <AdminDashboard />
      </div>
    </div>
  );
}

export default adminPage;
