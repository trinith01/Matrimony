"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  CheckCircle,
  FileText,
  Download,
  Eye,
  Search,
} from "lucide-react";
import axios from "axios";
import api from "@/services/api";
import { toast } from "sonner";
import { MatchMakerDialog } from "./MatchReport";

export function HoroscopeAdmin() {
  // State for data
  const [horoscopeUploads, setHoroscopeUploads] = useState([]);
  const [compatibilityRequests, setCompatibilityRequests] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for UI controls
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDetailsFormOpen, setIsDetailsFormOpen] = useState(false);
  const [matchScore, setMatchScore] = useState(75);
  const [activeTab, setActiveTab] = useState("uploads");
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [navamsaFile, setNavamsaFile] = useState(null);
  const [refetch, setRefetch] = useState(false);

  // Form state for horoscope details
  const [horoscopeDetails, setHoroscopeDetails] = useState({
    sunSign: "",
    moonSign: "",
    risingSign: "",
    planetaryPlacements: "",
    houses: "",
    aspects: "",
    lunarNodes: "",
    chironAsteroids: "",
    transits: "",
    progressions: "",
    solarLunarReturns: "",
    eclipses: "",
    elementalAnalysis: "",
    planetaryDignities: "",
    venusMars: "",
    saturnReturn: "",
    astrologicalTiming: "",
    vimshottariDasha: "",
    navamsaChart: "",
    arudhaLagna: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch horoscope uploads
        const uploadsResponse = await api.get("/horoscope");
        setHoroscopeUploads(uploadsResponse.data);
        setFilteredUploads(uploadsResponse.data);

        // Fetch compatibility requests
        //const requestsResponse = await api.get("/admin/compatibility-requests")
        //setCompatibilityRequests(requestsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    const getHoroscopeRequests = async () => {
      try {
        const res = await api.get("/horoscopeRequest");
        setCompatibilityRequests(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
    getHoroscopeRequests();
  }, [refetch]);

  // Filter uploads based on search query and subscription plan
  useEffect(() => {
    let filtered = [...horoscopeUploads];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((upload) =>
        upload.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subscription plan
    if (selectedPlan !== "all") {
      filtered = filtered.filter(
        (upload) => upload.user.subscriptionPlan === selectedPlan
      );
    }

    setFilteredUploads(filtered);
  }, [searchQuery, selectedPlan, horoscopeUploads]);

  // Status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            Processing
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Reviewed
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Status icon component
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "processing":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "reviewed":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  // Handle opening a request dialog
  const handleOpenRequest = (requestId, receiverId) => {};

  // Handle opening an upload dialog
  const handleOpenUpload = (upload) => {
    setSelectedUpload(upload);
    setIsUploadDialogOpen(true);
  };

  // Handle opening the PDF viewer
  const handleViewPdf = (url) => {
    setCurrentPdfUrl(url);
    setPdfViewerOpen(true);
  };

  // Handle opening the details form
  const handleOpenDetailsForm = (upload) => {
    setSelectedUpload(upload);

    // Pre-fill form with existing data if available
    setHoroscopeDetails({
      sunSign: upload.sunSign || "",
      moonSign: upload.moonSign || "",
      risingSign: upload.risingSign || "",
      planetaryPlacements: upload.planetaryPlacements || "",
      houses: upload.houses || "",
      aspects: upload.aspects || "",
      lunarNodes: upload.lunarNodes || "",
      chironAsteroids: upload.chironAsteroids || "",
      transits: upload.transits || "",
      progressions: upload.progressions || "",
      solarLunarReturns: upload.solarLunarReturns || "",
      eclipses: upload.eclipses || "",
      elementalAnalysis: upload.elementalAnalysis || "",
      planetaryDignities: upload.planetaryDignities || "",
      venusMars: upload.venusMars || "",
      saturnReturn: upload.saturnReturn || "",
      astrologicalTiming: upload.astrologicalTiming || "",
      vimshottariDasha: upload.vimshottariDasha || "",
      navamsaChart: upload.navamsaChart || "",
      arudhaLagna: upload.arudhaLagna || "",
    });

    setIsDetailsFormOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHoroscopeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle navamsa chart file upload
  const handleNavamsaFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setNavamsaFile(e.target.files[0]);
    }
  };

  // Handle status change
  const handleStatusChange = async (uploadId, newStatus) => {
    try {
      setIsLoading(true);
      await api.put(`/horoscope/${uploadId}`, {
        status: newStatus,
      });

      // Update local state

      setHoroscopeUploads((prev) =>
        prev.map((upload) =>
          upload._id === uploadId ? { ...upload, status: newStatus } : upload
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving horoscope details
  const handleSaveDetails = async () => {
    if (!selectedUpload) return;

    try {
      setIsLoading(true);

      // Upload navamsa chart if provided
      let navamsaChartUrl = horoscopeDetails.navamsaChart;
      if (navamsaFile) {
        const formData = new FormData();
        formData.append("image", navamsaFile);
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=a05cab1e5e57f696280d32b7225fee75`,
          formData
        );
        navamsaChartUrl = response.data.data.url;
        console.log("Navamsa chart uploaded:", navamsaChartUrl);
      }

      // Save all horoscope details
      await api.put(`/horoscope/${selectedUpload._id}`, {
        ...horoscopeDetails,
        navamsaChart: navamsaChartUrl,
        status: "reviewed",
      });

      // Update local state
      setHoroscopeUploads((prev) =>
        prev.map((upload) =>
          upload._id === selectedUpload._id
            ? {
                ...upload,
                ...horoscopeDetails,
                navamsaChart: navamsaChartUrl,
                status: "reviewed",
              }
            : upload
        )
      );

      toast.success("Horoscope details saved successfully");

      setIsDetailsFormOpen(false);
    } catch (error) {
      console.error("Error saving details:", error);
      toast({
        title: "Error",
        description: "Failed to save horoscope details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle completing a compatibility request
  const handleCompleteRequest = async () => {
    if (!selectedRequest) return;

    try {
      setIsLoading(true);
      await api.patch(`/admin/compatibility-requests/${selectedRequest._id}`, {
        status: "completed",
        matchScore,
      });

      // Update local state
      setCompatibilityRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? { ...req, status: "completed", matchScore }
            : req
        )
      );

      toast({
        title: "Success",
        description: "Compatibility request completed successfully",
      });

      setIsRequestDialogOpen(false);
    } catch (error) {
      console.error("Error completing request:", error);
      toast({
        title: "Error",
        description: "Failed to complete compatibility request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horoscope Admin Dashboard</CardTitle>
          <CardDescription>
            Manage horoscope uploads and compatibility requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="uploads">Horoscope Uploads</TabsTrigger>
              <TabsTrigger value="requests">Compatibility Requests</TabsTrigger>
            </TabsList>

            {/* Horoscope Uploads Tab */}
            <TabsContent value="uploads" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUploads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No horoscope uploads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUploads.map((upload) => (
                        <TableRow key={upload._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    upload.userId.profile_photo ||
                                    "https://ibb.co/TMVLCQgp"
                                  }
                                />
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {upload.userId.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {upload.userId.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {upload.userId?.subscription_plan?.name?.trim() ||
                                "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(upload.status)}
                              {getStatusBadge(upload.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(upload.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewPdf(upload.horoscopePDF)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDetailsForm(upload)}
                              >
                                {upload.sunSign
                                  ? "Edit Details"
                                  : "Enter Details"}
                              </Button>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`status-${upload._id}`}
                                  checked={
                                    upload.status === "reviewed" ||
                                    upload.status === "completed"
                                  }
                                  onCheckedChange={(checked) =>
                                    handleStatusChange(
                                      upload._id,
                                      checked ? "reviewed" : "processing"
                                    )
                                  }
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Compatibility Requests Tab */}
            <TabsContent value="requests" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requester</TableHead>
                      <TableHead>Receiver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : compatibilityRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No compatibility requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      compatibilityRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={request.requesterId?.profile_photo}
                                  alt={request.requesterId.name}
                                />
                                <AvatarFallback>
                                  {request.requesterId.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {request.requesterId.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {request.requesterId.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={request.receiverId?.profile_photo}
                                  alt={request.receiverId.name}
                                />
                                <AvatarFallback>
                                  {request.receiverId.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {request.receiverId.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {request.receiverId.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              {getStatusBadge(request.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {request.matchingScore || "not add yet"}
                          </TableCell>
                          <TableCell className="text-right">
                            <MatchMakerDialog
                              receiverId={request.receiverId._id}
                              requesterId={request.requesterId._id}
                              requestId={request._id}
                              setRefetch={setRefetch}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Compatibility Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Process Compatibility Request</DialogTitle>
            <DialogDescription>
              Review and complete the compatibility analysis between users.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Requester</Label>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedRequest.requester.profile_photo}
                        alt={selectedRequest.requester.name}
                      />
                      <AvatarFallback>
                        {selectedRequest.requester.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedRequest.requester.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRequest.requester.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Receiver</Label>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedRequest.receiver.profile_photo}
                        alt={selectedRequest.receiver.name}
                      />
                      <AvatarFallback>
                        {selectedRequest.receiver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedRequest.receiver.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRequest.receiver.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Compatibility Score ({matchScore}%)</Label>
                <Slider
                  value={[matchScore]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setMatchScore(value[0])}
                />
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      matchScore >= 80
                        ? "bg-green-500"
                        : matchScore >= 60
                        ? "bg-yellow-500"
                        : matchScore >= 40
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${matchScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add compatibility notes here..."
                  value={selectedRequest.notes || ""}
                  onChange={(e) =>
                    setSelectedRequest({
                      ...selectedRequest,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRequestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCompleteRequest} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                "Complete Analysis"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Horoscope Details Form Dialog */}
      <Dialog open={isDetailsFormOpen} onOpenChange={setIsDetailsFormOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
          <DialogHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <DialogTitle>Enter Horoscope Details</DialogTitle>
              <DialogDescription>
                Review the PDF and enter the horoscope details for this user.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDetails}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Save Details"
                )}
              </Button>
            </div>
          </DialogHeader>

          {selectedUpload && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-hidden h-full">
              {/* PDF Viewer Side */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Horoscope PDF</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewPdf(selectedUpload.horoscopePDF)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Screen
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden h-[500px]">
                  <img
                    src={selectedUpload.horoscopePDF || "/placeholder.svg"}
                    className="w-full h-full object-contain"
                    alt="Horoscope PDF"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedUpload.userId.profile_photo}
                      alt={selectedUpload.userId.name}
                    />
                    <AvatarFallback>
                      {selectedUpload.userId.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUpload.userId.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUpload.userId.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="relative">
                <ScrollArea className="h-[500px] pr-2 overflow-visible">
                  <div className="space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sunSign">Sun Sign</Label>
                        <Input
                          id="sunSign"
                          name="sunSign"
                          value={horoscopeDetails.sunSign}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moonSign">Moon Sign</Label>
                        <Input
                          id="moonSign"
                          name="moonSign"
                          value={horoscopeDetails.moonSign}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="risingSign">Rising Sign</Label>
                      <Input
                        id="risingSign"
                        name="risingSign"
                        value={horoscopeDetails.risingSign}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="planetaryPlacements">
                        Planetary Placements
                      </Label>
                      <Textarea
                        id="planetaryPlacements"
                        name="planetaryPlacements"
                        value={horoscopeDetails.planetaryPlacements}
                        onChange={handleInputChange}
                        className="max-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="houses">Houses</Label>
                      <Textarea
                        id="houses"
                        name="houses"
                        value={horoscopeDetails.houses}
                        onChange={handleInputChange}
                        className="max-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aspects">Aspects</Label>
                      <Textarea
                        id="aspects"
                        name="aspects"
                        value={horoscopeDetails.aspects}
                        onChange={handleInputChange}
                        className="max-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lunarNodes">Lunar Nodes</Label>
                      <Input
                        id="lunarNodes"
                        name="lunarNodes"
                        value={horoscopeDetails.lunarNodes}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chironAsteroids">Chiron Asteroids</Label>
                      <Input
                        id="chironAsteroids"
                        name="chironAsteroids"
                        value={horoscopeDetails.chironAsteroids}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transits">Transits</Label>
                      <Input
                        id="transits"
                        name="transits"
                        value={horoscopeDetails.transits}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="progressions">Progressions</Label>
                      <Input
                        id="progressions"
                        name="progressions"
                        value={horoscopeDetails.progressions}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="solarLunarReturns">
                        Solar/Lunar Returns
                      </Label>
                      <Input
                        id="solarLunarReturns"
                        name="solarLunarReturns"
                        value={horoscopeDetails.solarLunarReturns}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eclipses">Eclipses</Label>
                      <Input
                        id="eclipses"
                        name="eclipses"
                        value={horoscopeDetails.eclipses}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="elementalAnalysis">
                        Elemental Analysis
                      </Label>
                      <Textarea
                        id="elementalAnalysis"
                        name="elementalAnalysis"
                        value={horoscopeDetails.elementalAnalysis}
                        onChange={handleInputChange}
                        className="max-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="planetaryDignities">
                        Planetary Dignities
                      </Label>
                      <Input
                        id="planetaryDignities"
                        name="planetaryDignities"
                        value={horoscopeDetails.planetaryDignities}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venusMars">Venus/Mars</Label>
                      <Input
                        id="venusMars"
                        name="venusMars"
                        value={horoscopeDetails.venusMars}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="saturnReturn">Saturn Return</Label>
                      <Input
                        id="saturnReturn"
                        name="saturnReturn"
                        value={horoscopeDetails.saturnReturn}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="astrologicalTiming">
                        Astrological Timing
                      </Label>
                      <Input
                        id="astrologicalTiming"
                        name="astrologicalTiming"
                        value={horoscopeDetails.astrologicalTiming}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vimshottariDasha">
                        Vimshottari Dasha
                      </Label>
                      <Input
                        id="vimshottariDasha"
                        name="vimshottariDasha"
                        value={horoscopeDetails.vimshottariDasha}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arudhaLagna">Arudha Lagna</Label>
                      <Input
                        id="arudhaLagna"
                        name="arudhaLagna"
                        value={horoscopeDetails.arudhaLagna}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="navamsaChart">Navamsa Chart</Label>
                      <div className="flex items-center gap-2">
                        {horoscopeDetails.navamsaChart && (
                          <div className="relative w-16 h-16 rounded border overflow-hidden">
                            <img
                              src={
                                horoscopeDetails.navamsaChart ||
                                "/placeholder.svg"
                              }
                              alt="Navamsa Chart"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <Input
                          id="navamsaChart"
                          type="file"
                          accept="image/*"
                          onChange={handleNavamsaFileChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Horoscope PDF</DialogTitle>
            <DialogDescription>
              <Button variant="outline" size="sm" asChild className="mt-2">
                <a
                  href={currentPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-[70vh]">
            <iframe
              src={currentPdfUrl}
              className="w-full h-full border rounded"
              title="Horoscope PDF Viewer"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setPdfViewerOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
