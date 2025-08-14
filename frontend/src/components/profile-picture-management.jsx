"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export function ProfilePicture({
  user,
  onUpdate,
  size = "md",
  showEditButton = true,
  showVipBadge = false,
  className = "",
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Size mappings
  const sizeClasses = {
    sm: "h-10 w-10 sm:h-12 sm:w-12",
    md: "h-12 w-12 sm:h-16 sm:w-16",
    lg: "h-16 w-16 sm:h-24 sm:w-24",
    xl: "h-20 w-20 sm:h-32 sm:w-32",
  };

  const editButtonSizes = {
    sm: "h-5 w-5 sm:h-6 sm:w-6 -bottom-1 -right-1",
    md: "h-6 w-6 sm:h-8 sm:w-8 -bottom-1 -right-1",
    lg: "h-7 w-7 sm:h-9 sm:w-9 -bottom-2 -right-2",
    xl: "h-8 w-8 sm:h-10 sm:w-10 -bottom-2 -right-2",
  };

  const badgePositions = {
    sm: "-top-1 -right-1",
    md: "-top-1 -right-1",
    lg: "-top-2 -right-2",
    xl: "-top-2 -right-2",
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Simulate upload delay

      const formData = new FormData();
      formData.append("image", selectedFile);

      const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
      console.log(API_KEY);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=a05cab1e5e57f696280d32b7225fee75`,
        formData
      );
      // const cloudUrl = response.data.url
      console.log("response", response);

      const profilePictureUrl = response.data.data.url;

      // If user has a gallery, update the first image (profile picture)
      const updatedUser = { ...user };

      if (updatedUser.gallery && updatedUser.gallery.length > 0) {
        // Replace the first image in the gallery (profile picture)
        updatedUser.gallery = [
          profilePictureUrl,
          ...updatedUser.gallery.slice(1),
        ];
      } else if (updatedUser.gallery) {
        // Add as the first image if gallery exists but is empty
        updatedUser.gallery = [profilePictureUrl];
      } else {
        // Create gallery if it doesn't exist
        updatedUser.gallery = [profilePictureUrl];
      }

      // Also update the profilePicture field if it exists
      updatedUser.profile_photo = profilePictureUrl;

      // Call the update callback
      onUpdate(updatedUser);

      toast.success("Profile picture updated successfully");

      // Reset state and close dialog
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  // Get the profile picture URL
  const getProfilePictureUrl = () => {
    // If user has a gallery, use the first image as profile picture
    if (user?.gallery && user.gallery.length > 0) {
      return user.gallery[0];
    }

    // If user has a profilePicture field, use that
    if (user?.profilePicture) {
      return user.profilePicture;
    }

    // Otherwise return null (will use fallback)
    return null;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar */}
      <Avatar
        className={`${sizeClasses[size]} border-4 border-white shadow-lg rounded-full transition-transform hover:scale-105 duration-300`}
      >
        <AvatarImage src={getProfilePictureUrl()} />
        <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
          {user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      {/* VIP Badge */}
      {showVipBadge && (
        <Badge
          className={`absolute ${badgePositions[size]} bg-red-800 text-white text-xs font-medium px-1.5 py-0.5 rounded-full`}
        >
          {user.subscription_plan.name||"free"}
        </Badge>
      )}

      {/* Edit Button */}
      {showEditButton && (
        <Button
          size="icon"
          variant="secondary"
          className={`absolute ${editButtonSizes[size]} rounded-full p-0 bg-white shadow-md border border-gray-200 hover:bg-red-800 hover:text-white transition-colors duration-200`}
          onClick={() => setIsDialogOpen(true)}
        >
          <Edit className="h-3/5 w-3/5" />
        </Button>
      )}

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90vw] max-w-md rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Update Profile Picture
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              Upload a new profile picture to personalize your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="profile-picture-upload"
                className="text-sm sm:text-base font-medium text-gray-700"
              >
                Select Image
              </Label>
              <Input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm"
              />
            </div>
            <div className="flex justify-center">
              {previewUrl ? (
                <div className="relative aspect-square w-32 h-32 sm:w-40 sm:h-40 overflow-hidden rounded-full border-2 border-gray-200">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-50 border-2 border-dashed border-gray-300">
                  <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
                    No image selected
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setIsDialogOpen(false);
              }}
              className="text-sm sm:text-base border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfilePicture}
              disabled={!selectedFile || isUploading}
              className="text-sm sm:text-base bg-red-800 hover:bg-red-900 text-white transition-colors duration-200"
            >
              {isUploading ? "Uploading..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
