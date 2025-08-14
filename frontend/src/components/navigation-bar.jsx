import { Bell, Heart, User, LogOut, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../lib/context/AuthContext";
import image from "../assets/girl.jpg";
import api from "@/services/api";

export function NavigationBar() {
  const {
    logout,
    user: authUser,
    refetch,
    setUser: setGlobalUser,
  } = useContext(AuthContext);

  

  const [user, setUser] = useState(authUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  // Toggle hamburger menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Ensure user is authenticated and fetch updated data
  useEffect(() => {
    if (authUser && authUser._id) {
      const getUserWithId = async () => {
        try {
          const res = await api.get(`/users/${authUser._id}`);
          setUser(res.data);
          setGlobalUser(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/chat/${authUser._id}`)
          console.log("unread messages count", res.data)
          setMessagesCount(res.data)
        } catch (err) {
          console.error("Error fetching messages", err)
        }
      }
      getUserWithId();
      fetchMessages();

    }

    const getUserWithId = async () => {
      try {
        const res = await api.get(`/users/${user._id}`);
        setUser(res.data);
        setGlobalUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUserWithId();
  }, [refetch]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-52 h-14 relative">
                <img
                  src="https://i.ibb.co/qT3yPq4/MM-FINAL-LOGO.png"
                  alt="MatriManda Logo"
                  className="object-contain h-full w-full"
                />
              </div>
            </Link>
          </div>

          {/* Hamburger Menu Button (Mobile Only) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-red-800 hover:text-red-900 hover:bg-red-50 p-2 rounded-full"
              aria-label="Main menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Navigation Items */}
          {user && (
            <div
              className={`${
                isMenuOpen ? "flex" : "hidden"
              } md:flex flex-col md:flex-row items-center gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none p-6 md:p-0 transition-all duration-300 z-30 border-t md:border-t-0 border-gray-100`}
            >
              {/* Views and Interests Section */}
              {user?.subscription_plan && (
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="flex items-center justify-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                    <User className="h-5 w-5 text-red-700" />
                    <div className="text-center">
                      <span className="text-sm font-medium text-red-700 block md:inline">
                        Views Left
                      </span>
                      <Badge className="mt-1 md:ml-2 md:mt-0 bg-red-700 text-white text-xs px-2.5 py-1 rounded-full">
                        {user.subscription_plan.name.toLowerCase() === "vip" ||
                        user.subscription_plan.name.toLowerCase() === "premium"
                          ? "Unlimited"
                          : user.subscription_plan.profile_views_per_day -
                            user.profile_views_today}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                    <Bell className="h-5 w-5 text-red-700" />
                    <div className="text-center">
                      <span className="text-sm font-medium text-red-700 block md:inline">
                        Interests Left
                      </span>
                      <Badge className="mt-1 md:ml-2 md:mt-0 bg-red-700 text-white text-xs px-2.5 py-1 rounded-full">
                        {user.subscription_plan.name.toLowerCase() === "vip" ||
                        user.subscription_plan.name.toLowerCase() === "premium"
                          ? "Unlimited"
                          : user.subscription_plan.interests_per_day -
                            user.interest_today}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                    <MessageCircle className="h-5 w-5 text-red-700" />
                    <div className="text-center">
                      <span className="text-sm font-medium text-red-700 block md:inline">
                        Chat
                      </span>
                      <Badge className="mt-1 md:ml-2 md:mt-0 bg-red-700 text-white text-xs px-2.5 py-1 rounded-full">
                        {messagesCount}
                        
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Section - Separator line */}
              <div className="hidden md:block w-px h-10 bg-gray-200 mx-2"></div>

              {/* Actions Section */}
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                {/* <Link to="/favorites" className="w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg px-4 py-2 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">Favorites</span>
                  </Button>
                </Link> */}

                <Link to="/profile" className="w-full md:w-auto">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
                  >
                    <span className="font-medium truncate max-w-[120px]">
                      {user?.name}
                    </span>
                    <img
                      src={user?.profile_photo || image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full md:w-auto text-red-700 hover:text-red-900 hover:bg-red-50 rounded-full p-2 h-10 w-10 flex items-center justify-center"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
