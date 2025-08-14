"use client";

import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavigationBar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "User Management", path: "/admin" },
    { name: "Subscription", path: "/subscription" },
    { name: "Background-verfication", path: "/background" },
    { name: "Horoscope Management", path: "/horoscope" },
    { name: "Register Admin", path: "/admin/register" }, // Added new section
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    console.log("stored User", storedUser);

    if (!storedUser) {
      navigate("/");
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("parsed User", parsedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user:", err);
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Main Navigation */}
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center">
                <div className="w-40 h-10 relative">
                  <img
                    src="https://i.ibb.co/qT3yPq4/MM-FINAL-LOGO.png"
                    alt="MatriManda Logo"
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <span className="mr-2 hidden md:inline-block">{`Welcome ${user?.name}`}</span>

              <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                  handleLogout();
                }}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex w-full">
            <div className="flex overflow-x-auto no-scrollbar">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-5 py-3 font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${
                      isActive
                        ? "text-red-800 border-red-800"
                        : "text-gray-600 border-transparent hover:text-red-700 hover:border-red-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden w-full">
              <div className="flex flex-col bg-white py-2 shadow-md">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                  <span className="text-sm">{`Welcome ${user?.name}`}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span>Logout</span>
                  </Button>
                </div>

                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 border-l-4 transition-all duration-200 ${
                        isActive
                          ? "text-red-800 border-red-800 bg-red-50"
                          : "text-gray-600 border-transparent hover:text-red-700 hover:border-red-300 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
