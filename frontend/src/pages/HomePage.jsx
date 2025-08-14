import { ProfileCard } from "@/components/profile-card";
import { AdvancedSearch } from "@/components/advanced-search";
import api from "@/services/api";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";

export default function HomePage() {
  const { user: authUser } = useContext(AuthContext); // Get logged-in user
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    ageRange: [18, 70],
    religion: "",
    location: "",
    education: "",
    occupation: "",
    income: "",
  });

  // Fetch users on mount
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await api.get("/users");
        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data); // Initialize filtered users
        } else {
          console.log("Error fetching users");
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };
    getAllUsers();
  }, []);

  // Apply filters whenever filters, users, or authUser change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...users];

      // Gender filter: Show opposite gender only
      if (authUser && authUser.gender) {
        const userGender = authUser.gender.toLowerCase();
        result = result.filter((user) => {
          const targetGender = user.gender?.toLowerCase();
          // Male user sees only female users, female user sees only male users
          return (
            targetGender &&
            ((userGender === "male" && targetGender === "female") ||
              (userGender === "female" && targetGender === "male"))
          );
        });
      } else {
        // If no authUser or no gender, show no users (or adjust as needed)
        result = [];
      }

      // Age filter
      result = result.filter((user) => {
        const age = user.age || calculateAge(user.birthday);
        return age >= filters.ageRange[0] && age <= filters.ageRange[1];
      });

      // Religion filter
      if (filters.religion) {
        result = result.filter(
          (user) =>
            user.religion &&
            user.religion.toLowerCase() === filters.religion.toLowerCase()
        );
      }

      // Location filter
      if (filters.location) {
        result = result.filter(
          (user) =>
            user.location &&
            user.location.city &&
            user.location.city.toLowerCase() === filters.location.toLowerCase()
        );
      }

      // Education filter
      if (filters.education) {
        result = result.filter(
          (user) =>
            user.education &&
            user.education.toLowerCase() === filters.education.toLowerCase()
        );
      }

      // Occupation filter
      if (filters.occupation) {
        result = result.filter(
          (user) =>
            user.occupation &&
            user.occupation.toLowerCase() === filters.occupation.toLowerCase()
        );
      }

      // Income filter
      if (filters.income) {
        result = result.filter((user) => {
          const income = user.income;
          if (!income) return false;
          if (filters.income === "0-100000") return income <= 100000;
          if (filters.income === "100000-300000")
            return income > 100000 && income <= 300000;
          if (filters.income === "300000-500000")
            return income > 300000 && income <= 500000;
          if (filters.income === "500000-1000000")
            return income > 500000 && income <= 1000000;
          if (filters.income === "1000000+") return income > 1000000;
          return true;
        });
      }

      setFilteredUsers(result);
    };

    applyFilters();
  }, [filters, users, authUser]); // Added authUser to dependencies

  // Calculate age if not provided
  const calculateAge = (birthday) => {
    if (!birthday) return 0;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Handle filter changes from AdvancedSearch
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-8">
        <AdvancedSearch onFilterChange={handleFilterChange} />
      </div>

      <h1 className="text-2xl font-bold mb-6">Discover Profiles</h1>
      {filteredUsers.length === 0 ? (
        <p className="text-gray-600">No profiles match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <ProfileCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
