import { createContext, useState, useEffect } from "react";
import api from "@/services/api";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("authToken");

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // Set axios default header
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Function to login user
  const login = (userData, token) => {
    if (!userData || !token) return; // Prevent empty values
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", token);
    // Set axios default header
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Function to logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    // Remove axios default header
    delete api.defaults.headers.common["Authorization"];
  };

  // Example function using token
  const makeInterest = async (fromId, toId) => {
    try {
      const res = await api.post("/interest", {
        fromId,
        toId,
      });
      console.log("Interest made");

      setRefetch((pre) => !pre);
    } catch (err) {
      console.log(err);
    }
  };
  console.log("AuthProvider is rendering...");
  console.log("User from auth provide:", user);
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        makeInterest,
        refetch,
        setRefetch,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
