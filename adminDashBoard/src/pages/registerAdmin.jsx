import React from "react";
import { RegisterForm } from "./RejisterForm";

function RegisterAdminPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            Register a New Admin
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to add a new admin to the system.
          </p>
        </div>
        <div className="p-6">
          <RegisterForm
            onRegisterSuccess={() => alert("Admin registered successfully!")}
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterAdminPage;
