"use client";

import { useState } from "react";
import UserVerification from "@/components/Admin-verification-dialog";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Send,
  MapPin,
  Briefcase,
  Check,
  Lock,
  Globe,
  MessageSquare,
  ChevronLeft,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  DollarSign,
  Building,
  Languages,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import image from "../assets/girl.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageIcon } from "lucide-react";
import api from "@/services/api";

export default function UserProfilePage() {
  const location = useLocation();
  const user_from_link = location.state?.user;
  const from = location.state?.from;
  const setRealod = location.state?.setRealod;
  console.log("User", user_from_link);
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState(user_from_link);

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) return "N/A"; // Handle undefined/null case

    const birthDate = new Date(birthday);
    if (isNaN(birthDate)) return "N/A"; // Ensure it's a valid date

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(user.birthday);
  console.log("Age", age);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const goBack = () => {
    navigate(-1);
  };
  // Handle verification status change
  const handleVerificationChange = async (userId, newStatus) => {
    console.log("User ID:", userId);
    console.log("New Status:", newStatus);
    try {
      const res = await api.put(`/users/updateProfile/${userId}`, {
        verified: newStatus,
      });
      alert(res.data.message);

      // Update local state
      setUser((prev) => ({ ...prev, verified: newStatus }));
      console.log(`User ${userId} verification status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  // Determine if user can view full gallery
  const canViewGallery = true; // Replace with actual logic

  return (
    <div className="w-full mx-auto pb-10">
      {/* Profile Header - Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Photo with Gradient Border */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-red-800 p-[3px] shadow-lg">
              <img
                src={image}
                alt={user.name}
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </div>
            {user.verified && (
              <Badge className="absolute bottom-1 right-1 bg-blue-500 border-2 border-white rounded-full p-1 shadow-lg">
                <Check className="h-3 w-3 mr-1 " /> <User className="h-3 w-3" />
              </Badge>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={
                      user.visibility === "public"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }
                  >
                    {user.visibility === "public" ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" /> Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" /> Private
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-gray-600 flex items-center justify-center md:justify-start">
                  <Briefcase className="h-4 w-4 mr-1 text-red-800" />
                  {user.occupation}
                </p>
                <p className="text-gray-600 flex items-center justify-center md:justify-start mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-red-800" />
                  {user.location.city}, {user.location.country}
                </p>
              </div>

              <div className="flex gap-2 justify-center md:justify-end">
                <Button
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => console.log("Message")}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-300"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleFavorite}>
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          isFavorite ? "fill-red-800 text-red-800" : ""
                        }`}
                      />
                      {isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Lock className="h-4 w-4 mr-2" />
                      Block profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MapPin className="h-4 w-4 mr-2" />
                      Share profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*admin verfication section*/}
      {from === "/admin" &&
        (user.subscription_plan.name === "Premium" ||
          user.subscription_plan.name === "VIP") && (
          <div className="mb-6">
            <UserVerification
              userId={user._id}
              userName={user.name}
              isVerified={user.verified}
              onVerificationChange={handleVerificationChange}
            />
          </div>
        )}

      {/* Profile Details Section */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-red-800" />
            Profile Information
          </h2>

          {/* Personal Details - Row-wise */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 text-gray-700 border-b pb-2">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">
                    {user.birthday
                      ? `${calculateAge(user.birthday)} years`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{user.gender}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-medium">{user.religion}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Caste</p>
                  <p className="font-medium">{user.caste}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Languages className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Mother Tongue</p>
                  <p className="font-medium">{user.mother_tongue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details - Row-wise */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 text-gray-700 border-b pb-2">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-medium">{user.education}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-medium">{user.occupation}</p>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="font-medium">
                    {user.income.toLocaleString()} LKR
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {user.location.city}, {user.location.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information - Row-wise */}
          <div>
            <h3 className="text-md font-medium mb-4 text-gray-700 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-red-800" />
              Photo Gallery
            </h2>

            {!canViewGallery && user.gallery.length > 0 && (
              <Button
                className="bg-gradient-to-r from-red-400 to-red-800 hover:from-red-800 hover:to-red-600"
                onClick={toggleFollow}
              >
                <Send className="h-4 w-4 mr-1" /> Follow to View
              </Button>
            )}
          </div>

          {user.gallery.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No Photos Yet
              </h3>
              <p className="text-gray-500 mt-2">
                This user hasn't uploaded any photos to their gallery.
              </p>
            </div>
          ) : (
            <div className="relative">
              {!canViewGallery && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-[8px] rounded-md">
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-red-800" />
                    <h3 className="text-lg font-semibold mb-2">
                      Private Gallery
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Follow {user.name} to view their photo gallery
                    </p>
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-600 hover:to-red-800"
                      onClick={toggleFollow}
                    >
                      <Send className="h-4 w-4 mr-1" /> Follow Now
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.gallery.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden shadow-sm relative"
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`${user.name}'s photo ${index + 1}`}
                      className={`w-full h-full object-cover transition-all ${
                        !canViewGallery ? "blur-md" : ""
                      }`}
                    />
                    {!canViewGallery && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={goBack}
          className="text-gray-500 border-gray-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to profiles
        </Button>
      </div>
    </div>
  );
}
