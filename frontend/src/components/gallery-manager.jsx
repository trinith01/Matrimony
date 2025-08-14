"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Eye, Trash, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// interface GalleryManagerProps {
//   /**
//    * Array of image URLs to display in the gallery
//    */
//   gallery: string[]
//   /**
//    * Callback when gallery is updated (add, delete, reorder)
//    */
//   onGalleryUpdate: (gallery: string[]) => void
//   /**
//    * Optional CSS class name for the gallery container
//    */
//   className?: string
// }

export function GalleryManager({ gallery, onGalleryUpdate, className = "" }) {
  console.log("gallery", gallery);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

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

  // Handle photo upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=a05cab1e5e57f696280d32b7225fee75`,
        formData
      );
      // const cloudUrl = response.data.url
      console.log("response", response);

      // For demo purposes, we'll use the preview URL
      const cloudUrl = response.data.data.url;

      // Add the new photo to the gallery
      const updatedGallery = [...gallery, cloudUrl];
      console.log("updated gallery", updatedGallery);
      onGalleryUpdate(updatedGallery);

      toast.success("Photo uploaded successfully");

      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(
        "Error uploading photo:",
        error.response ? error.response.data : error.message
      );

      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle photo deletion
  const handleDeletePhoto = async (index) => {
    try {
      // In a real app, you would delete from your server/storage here
      // const photoUrl = gallery[index]
      // await fetch(`/api/photos/${photoId}`, { method: 'DELETE' })

      // Update gallery
      const updatedGallery = gallery.filter((_, i) => i !== index);
      onGalleryUpdate(updatedGallery);

      toast.success("Photo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  // Handle setting profile photo (move to first position)
  const handleSetProfilePhoto = async (index) => {
    try {
      if (gallery.length === 0 || index === 0) return;

      // Reorder gallery to put selected photo first
      const updatedGallery = [...gallery];
      const selectedPhoto = updatedGallery[index];
      updatedGallery.splice(index, 1);
      updatedGallery.unshift(selectedPhoto);

      onGalleryUpdate(updatedGallery);
      setPreviewIndex(null); // Close preview

      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error setting profile photo:", error);
      toast.error("Failed to update profile photo");
    }
  };

  // Preview handlers
  const openPreview = (index) => {
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  return (
    <Card className="rounded-2xl shadow-lg border-none overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gray-50">
        <div className="mb-4 sm:mb-0">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            My Photos
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Manage your photo gallery
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-800 hover:bg-red-900 text-white rounded-lg text-sm sm:text-base">
              <Upload className="h-4 w-4 mr-2" /> Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-md rounded-2xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Upload Photo
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600">
                Add a new photo to your gallery
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="photo-upload"
                  className="text-sm sm:text-base font-medium text-gray-700"
                >
                  Select Photo
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
              </div>
              {previewUrl && (
                <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-xl border-2 border-gray-200">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Upload preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-red-800 hover:bg-red-900 text-white rounded-lg text-sm sm:text-base transition-colors duration-200"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {!gallery || gallery.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              No photos available in your gallery
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-red-800 hover:bg-red-900 text-white rounded-lg text-sm sm:text-base">
                  Upload Your First Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md rounded-2xl p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                    Upload Photo
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600">
                    Add a new photo to your gallery
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="photo-upload-empty"
                      className="text-sm sm:text-base font-medium text-gray-700"
                    >
                      Select Photo
                    </Label>
                    <Input
                      id="photo-upload-empty"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-sm"
                    />
                  </div>
                  {previewUrl && (
                    <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-xl border-2 border-gray-200">
                      <img
                        src={previewUrl}
                        alt="Upload preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="bg-red-800 hover:bg-red-900 text-white rounded-lg text-sm sm:text-base transition-colors duration-200"
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 ${className}`}
          >
            {gallery.map((photoUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square w-full overflow-hidden rounded-xl border-2 border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <img
                    src={photoUrl}
                    alt={`Gallery photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-red-800/80 rounded-full"
                    onClick={() => openPreview(index)}
                  >
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-red-800/80 rounded-full"
                    onClick={() => handleDeletePhoto(index)}
                  >
                    <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-800 text-white text-xs px-2 py-0.5 rounded-full">
                    Profile
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Photo Preview Dialog */}
        {previewIndex !== null &&
          previewIndex >= 0 &&
          previewIndex < gallery.length && (
            <Dialog open={previewIndex !== null} onOpenChange={closePreview}>
              <DialogContent className="w-[90vw] max-w-md rounded-2xl p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                    Photo Preview
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600">
                    View or manage this photo
                  </DialogDescription>
                </DialogHeader>
                <div className="relative">
                  <Button
                    className="absolute top-0 right-0 h-8 w-8 p-0 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-100"
                    variant="outline"
                    onClick={closePreview}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="mt-8 relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-xl border-2 border-gray-200">
                    <img
                      src={gallery[previewIndex]}
                      alt="Photo preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4 gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm sm:text-base border-gray-300 hover:bg-gray-100"
                    onClick={() => handleDeletePhoto(previewIndex)}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                  {previewIndex !== 0 && (
                    <Button
                      className="flex-1 text-sm sm:text-base bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors duration-200"
                      onClick={() => handleSetProfilePhoto(previewIndex)}
                    >
                      Set as Profile
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
      </CardContent>
    </Card>
  );
}
