"use client"



import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash, Upload, Video } from "lucide-react"
import { toast } from "sonner"



export function VideoGalleryManager({ videos = [], onVideosUpdate, className = "" }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview URL (in a real app, you'd generate a thumbnail)
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle video upload
  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would upload to your server/storage here
      // const formData = new FormData()
      // formData.append('video', selectedFile)
      // const response = await fetch('/api/upload-video', { method: 'POST', body: formData })
      // const cloudUrl = response.data.url

      // For demo purposes, we'll use the preview URL
      const cloudUrl = previewUrl 

      // Add the new video to the gallery
      const updatedVideos = [...videos, cloudUrl]
      onVideosUpdate(updatedVideos)

      toast.success("Video uploaded successfully")

      // Reset state
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error("Error uploading video:", error)
      toast.error("Failed to upload video")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle video deletion
  const handleDeleteVideo = async (index) => {
    try {
      // In a real app, you would delete from your server/storage here
      // const videoUrl = videos[index]
      // await fetch(`/api/videos/${videoId}`, { method: 'DELETE' })

      // Update videos
      const updatedVideos = videos.filter((_, i) => i !== index)
      onVideosUpdate(updatedVideos)

      toast.success("Video deleted successfully")
    } catch (error) {
      console.error("Error deleting video:", error)
      toast.error("Failed to delete video")
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Videos</CardTitle>
          <CardDescription>Manage your video gallery</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600">
              <Upload className="h-4 w-4 mr-1" /> Upload Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload video</DialogTitle>
              <DialogDescription>Add a new video to your gallery</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="video-upload">Select video</Label>
                <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} />
              </div>
              {previewUrl && (
                <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-md border">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Video className="h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">Video preview</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!videos || videos.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No videos available</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">Upload your first video</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload video</DialogTitle>
                  <DialogDescription>Add a new video to your gallery</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="video-upload-empty">Select video</Label>
                    <Input id="video-upload-empty" type="file" accept="video/*" onChange={handleFileChange} />
                  </div>
                  {previewUrl && (
                    <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-md border">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Video className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">Video preview</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((videoUrl, index) => (
              <div key={index} className="relative group">
                <div className="relative">
                  <img
                    src={videoUrl || "/placeholder.svg"}
                    alt={`Video thumbnail ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:text-white hover:bg-red-500/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:text-white hover:bg-red-500/20"
                    onClick={() => handleDeleteVideo(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

