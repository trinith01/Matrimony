"use client";

import { Heart, MapPin, Briefcase, Calendar, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/girl.jpg";
import api from "@/services/api";
import { toast } from "sonner";
import { AuthContext } from "@/lib/context/AuthContext";

export function ProfileCard({ user }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user: authUser, makeInterest, setRefetch } = useContext(AuthContext);
  const [isInterestPending, setIsInterestPending] = useState(false); // New state to track if interest is pending
  const navigate = useNavigate();

  // Fetch sent interests to check if an interest is already pending for this user
  useEffect(() => {
    const checkSentInterest = async () => {
      if (!authUser?._id) return; // Skip if user is not logged in

      try {
        const response = await api.get(`/interest/sent/${authUser._id}`);
        const sentInterests = response.data;

        // Check if there's a pending interest for the current profile card user
        const pendingInterest = sentInterests.find(
          (interest) =>
            interest.toId._id === user._id && interest.status === "pending"
        );
        setIsInterestPending(!!pendingInterest); // Set to true if a pending interest exists
      } catch (err) {
        console.error("Error fetching sent interests:", err);
      }
    };

    checkSentInterest();
  }, [authUser, user._id, setRefetch]); // Re-run when authUser, user._id, or refetch changes

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const viewProfile = async () => {
    try {
      const res = await api.put(`/users/${authUser._id}`);
      console.log(res.data.message);
      toast.success(res.data.message);
      setRefetch((prev) => !prev);
      navigate(`/user-profile`, { state: { user } });
    } catch (err) {
      console.error("Error viewing profile:", err);
      toast.error("Failed to view profile");
    }
  };

  const sendRequest = async () => {
    console.log(`Sending request to ${user.name} from ${authUser.name}`);
    const fromId = authUser._id;
    const toId = user._id;

    try {
      await makeInterest(fromId, toId);
      toast.success("Interest sent successfully");
      setIsInterestPending(true); // Disable the button after sending the interest
      setRefetch((prev) => !prev); // Trigger refetch to update sent interests
    } catch (err) {
      console.error("Error sending interest:", err);
      toast.error("Failed to send interest");
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return "N/A";

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

  return (
    // <Card className="overflow-hidden rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-[320px] mx-auto bg-white border-red-800/10">
    <Card className="overflow-hidden rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:max-w-[320px] mx-auto bg-white border-red-800/10">

      {/* Image Section */}
      <div className="relative h-[220px] sm:h-[240px] group overflow-hidden">
        <img
          src={user.profile_photo || image}
          alt={`${user.name}'s profile`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
        >
          {/* <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-800 text-red-800" : "text-red-800"
            } transition-colors duration-300`}
          /> */}
        </button>

        {/* Badges */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-red-800 text-white font-medium px-3 py-1 rounded-full shadow-md">
            {user.religion}
          </Badge>
        </div>

        {/* <div className="absolute bottom-4 left-4 flex flex-wrap gap-2"> */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
          <Badge className="bg-white/90 text-gray-800 px-3 py-1 rounded-full shadow-md font-medium">
            <Calendar className="h-3 w-3 mr-1.5" />
            {calculateAge(user.birthday)} yrs
          </Badge>
          {user.location && (
            <Badge className="bg-white/90 text-gray-800 px-3 py-1 rounded-full shadow-md font-medium">
              <MapPin className="h-3 w-3 mr-1.5" />
              {user.location.city}
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {user.name}
          </h3>
          {user.occupation && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-red-800/10 text-red-800 border-none text-xs px-3 py-1 rounded-full truncate max-w-[150px]">
                    <Briefcase className="h-3 w-3 mr-1.5" />
                    {user.occupation.length > 12
                      ? `${user.occupation.substring(0, 12)}...`
                      : user.occupation}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.occupation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-red-800 font-semibold">Language:</span>
            {/* <span className="truncate max-w-[180px] font-medium"> */}
            <span className="truncate max-w-[60%] sm:max-w-[180px] font-medium">

              {user.mother_tongue}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-800 font-semibold">Caste:</span>
            {/* <span className="truncate max-w-[180px] font-medium"> */}
            <span className="truncate max-w-[60%] sm:max-w-[180px] font-medium">

              {user.caste}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-800 font-semibold">Education:</span>
            {/* <span className="truncate max-w-[180px] font-medium"> */}
            <span className="truncate max-w-[60%] sm:max-w-[180px] font-medium">

              {user.education}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1 bg-red-800 hover:bg-red-900 text-white rounded-full py-2.5 shadow-md transition-all duration-300 hover:shadow-lg font-medium"
            onClick={viewProfile}
            disabled={
              authUser?.subscription_plan?.profile_views_per_day -
                authUser?.profile_views_today ===
              0
            }
          >
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button
            className="flex-1 bg-white border border-red-800 text-red-800 hover:bg-red-800/5 rounded-full py-2.5 shadow-md transition-all duration-300 hover:shadow-lg font-medium"
            onClick={sendRequest}
            disabled={
              isInterestPending || // Disable if interest is pending
              authUser?.subscription_plan?.interests_per_day -
                authUser?.interest_today ===
                0 // Existing condition for daily interest limit
            }
          >
            <Send className="h-4 w-4 mr-2" />
            {isInterestPending ? "Interest Sent" : "Send Interest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
