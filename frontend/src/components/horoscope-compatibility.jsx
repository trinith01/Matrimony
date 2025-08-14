"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Upload,
  FileText,
  Star,
  Check,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import ContactCardGrid from "./contactCardGrid";
import axios from "axios";
import api from "@/services/api";

// interface Contact {
//   _id: string
//   name: string
//   profile_photo: string
//   email: string
// }

// interface HoroscopeRequest {
//   _id: string
//   requesterId: string
//   receiverId: string
//   requesterHoroscope: any
//   receiverHoroscope: any
//   matchingScore: number | null
//   status: "pending" | "accepted" | "rejected" | "completed"
//   createdAt: string
// }

// interface HoroscopeData {
//   userId: string
//   sunSign?: string
//   moonSign?: string
//   risingSign?: string
//   planetaryPlacements?: any
//   houses?: any
//   aspects?: any
//   lunarNodes?: any
//   chiromAstroids?: any
//   transists?: any
//   progressions?: any
//   solarLunarReturns?: any
//   eclipses?: any
//   elementalAnalysis?: any
//   planetaryDignities?: any
//   venusMars?: any
//   saturnReturn?: any
//   astrologicalTiming?: any
//   vimshottariDasham?: any
//   navamsaChart?: string
//   arudhaLagna?: any
//   status: "pending" | "incomplete" | "complete"
//   horoscopePDF?: string
// }

// interface HoroscopeCompatibilityProps {
//   authUser: {
//     _id: string
//     name: string
//     email: string
//   }
//   contacts: Contact[]
// }

export function HoroscopeCompatibility({ authUser, contacts = [] }) {
  console.log("contact from horoscope", contacts);
  const [selectedContact, setSelectedContact] = useState(contacts[0] || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("compatibility");
  const [userHoroscope, setUserHoroscope] = useState(null);
  const [horoscopeRequests, setHoroscopeRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [horoscopeIds, setHoroscopeIds] = useState([]);

  // Fetch horoscope data and requests
  useEffect(() => {
    const getHoroscopeDetails = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/horoscope/user/${authUser._id}`);

        console.log("Horoscope details:", res.data);

        setUserHoroscope(res.data);
        console.log("userhorocope", res.data);
      } catch (error) {
        console.error("Error fetching horoscope details:", error);
        setUserHoroscope(null);
      } finally {
        setIsLoading(false);
      }
    };
    const getHorsocopeIds = async () => {
      try {
        const respond = await api.get(`/hid`);
        setHoroscopeIds(respond.data);
        console.log("horocopeIds", respond.data);
      } catch (err) {
        console.error("Error fetching horoscopeIds:", err);
        setHoroscopeIds([]);
      }
    };
    const getHoroscopeRequests = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/horoscopeRequest/${authUser._id}`);
        console.log("horoscope requests", res.data);

        setHoroscopeRequests(res.data);
      } catch (error) {
        console.error("Error fetching horoscope requests:", error);
        setHoroscopeRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    getHoroscopeDetails();
    getHorsocopeIds();
    getHoroscopeRequests();
  }, [authUser._id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      // Upload file to image hosting service
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=a05cab1e5e57f696280d32b7225fee75`,
        formData
      );

      // Store the URL in your backend
      const cloudUrl = response.data.data.url;
      console.log("cloude url", cloudUrl);
      console.log("authUser._id", authUser._id);
      const res = await api.post("/horoscope", {
        userId: authUser._id,
        horoscopePDF: cloudUrl,
      });

      toast(res.data.message);

      // Update local state
      setUserHoroscope({
        ...userHoroscope,
        horoscopePDF: cloudUrl,
        status: "pending",
      });

      setSelectedFile(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error uploading horoscope:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const startPayment = async (receiverId) => {
    try {
      // Request payment data from the backend
      const res = await api.post("http://localhost:5000/api/payment-data", {
        requesterId: authUser._id,
        receiverId: receiverId,
      });

      // Create the form element for submitting to CyberSource
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://testsecureacceptance.cybersource.com/pay"; // CyberSource payment endpoint
      const additionalFields = {
        bill_to_forename: "John",
        bill_to_surname: "Doe",
        bill_to_email: "johndoe@example.com",
        bill_to_phone: "+1234567890",
      };

      // Loop through the response data to create hidden form fields
      for (const key in res.data) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = res.data[key];
        form.appendChild(input);
      }

      // Add the form to the document and submit it
      document.body.appendChild(form);
      form.submit(); // Submit the form to CyberSource
    } catch (error) {
      console.error("Error starting the payment process:", error);
      // You can display an error message to the user here
    }
  };

  const sendMatchRequest = async (contactId) => {
    if (!userHoroscope || userHoroscope.status !== "reviewed") {
      toast("Please upload your horoscope first.");

      return;
    }

    try {
      setIsLoading(true);

      await api.post("/horoscopeRequest", {
        requesterId: authUser._id,
        receiverId: contactId,
      });

      toast.success("match request made sucessfully");

      // Refresh requests
    } catch (err) {
      console.error("Error sending match request:", err.message);
      alert("the is an error");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render match score with visual indicator
  const renderMatchScore = (score) => {
    if (score === null) return null;

    let color = "bg-gray-200";
    if (score >= 80) color = "bg-green-500";
    else if (score >= 60) color = "bg-yellow-500";
    else if (score >= 40) color = "bg-orange-500";
    else color = "bg-red-500";

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">
            Match Score
          </span>
          <span className="text-sm font-bold text-gray-900">{score}%</span>
        </div>
        <Progress value={score} className={`h-2 ${color} rounded-full`} />
      </div>
    );
  };

  // Get request status for a contact
  const getRequestStatus = (contactId) => {
    const request = horoscopeRequests.find(
      (req) =>
        (req.receiverId === contactId && req.requesterId === authUser._id) ||
        (req.requesterId === contactId && req.receiverId === authUser._id)
    );

    return request || null;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 gap-2 bg-red-800/10 rounded-lg p-1 mb-4 sm:mb-6">
          <TabsTrigger
            value="compatibility"
            className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg text-sm sm:text-base py-2"
          >
            Compatibility
          </TabsTrigger>
          <TabsTrigger
            value="myHoroscope"
            className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg text-sm sm:text-base py-2"
          >
            My Horoscope
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compatibility" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Compatibility Matching
            </h2>
          </div>

          {!userHoroscope || userHoroscope.status !== "reviewed" ? (
            <Alert
              variant="warning"
              className="bg-yellow-50 border-yellow-200 rounded-lg"
            >
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-800 font-semibold">
                Incomplete Horoscope
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                Please complete your horoscope details to use compatibility
                matching.
                {!userHoroscope?.horoscopePDF && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Horoscope
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ) : null}

          <>
            <ContactCardGrid
              contacts={contacts}
              horoscopeRequests={horoscopeRequests}
              userHoroscope={userHoroscope}
              horoscopeIds={horoscopeIds}
              authUser={authUser}
              sendMatchRequest={sendMatchRequest}
            />
          </>
        </TabsContent>

        <TabsContent value="myHoroscope" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Horoscope
            </h2>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              disabled={isLoading}
              className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              {userHoroscope?.horoscopePDF
                ? "Update Horoscope"
                : "Upload Horoscope"}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-800 border-t-transparent"></div>
            </div>
          ) : !userHoroscope ? (
            <Alert className="bg-gray-50 border-gray-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <AlertTitle className="text-gray-800 font-semibold">
                No Horoscope Data
              </AlertTitle>
              <AlertDescription className="text-gray-600">
                Upload your horoscope to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <Card className="rounded-xl border-none shadow-md">
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-t-xl">
                <CardTitle className="text-lg sm:text-xl font-bold">
                  Horoscope Details
                </CardTitle>
                <CardDescription className="text-red-100 flex items-center gap-2">
                  Status:{" "}
                  <Badge
                    variant={
                      userHoroscope.status === "reviewed"
                        ? "default"
                        : userHoroscope.status === "pending"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {userHoroscope.status === "pending" && "Pending Review"}
                    {userHoroscope.status === "incomplete" && "Incomplete"}
                    {userHoroscope.status === "reviewed" && "Complete"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {userHoroscope.horoscopePDF && (
                  <div className="flex items-center gap-3 p-3 bg-red-800/5 rounded-lg">
                    <FileText className="h-5 w-5 text-red-800" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Horoscope Image
                      </p>
                      <p className="text-xs text-gray-600">
                        Uploaded and pending review
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-red-800 hover:bg-red-800/10"
                    >
                      <a
                        href={userHoroscope.horoscopePDF}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                )}

                {userHoroscope.status === "reviewed" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { label: "Sun Sign", value: userHoroscope.sunSign },
                      { label: "Moon Sign", value: userHoroscope.moonSign },
                      { label: "Rising Sign", value: userHoroscope.risingSign },
                      {
                        label: "Arudha Lagna",
                        value: userHoroscope.arudhaLagna,
                      },
                      { label: "Aspects", value: userHoroscope.aspects },
                      {
                        label: "Astrological Timing",
                        value: userHoroscope.astrologicalTiming,
                      },
                      {
                        label: "Chiron Asteroids",
                        value: userHoroscope.chironAsteroids,
                      },
                      { label: "Eclipses", value: userHoroscope.eclipses },
                      {
                        label: "Elemental Analysis",
                        value: userHoroscope.elementalAnalysis,
                      },
                      { label: "Houses", value: userHoroscope.houses },
                      { label: "Lunar Nodes", value: userHoroscope.lunarNodes },
                      {
                        label: "Planetary Dignities",
                        value: userHoroscope.planetaryDignities,
                      },
                      {
                        label: "Progressions",
                        value: userHoroscope.progressions,
                      },
                      {
                        label: "Saturn Return",
                        value: userHoroscope.saturnReturn,
                      },
                      {
                        label: "Solar/Lunar Returns",
                        value: userHoroscope.solarLunarReturns,
                      },
                      { label: "Transits", value: userHoroscope.transits },
                      { label: "Venus-Mars", value: userHoroscope.venusMars },
                      {
                        label: "Vimshottari Dasha",
                        value: userHoroscope.vimshottariDasha,
                      },
                    ].map(
                      ({ label, value }) =>
                        value && (
                          <div key={label} className="space-y-1">
                            <p className="text-xs font-semibold text-gray-600 uppercase">
                              {label}
                            </p>
                            <p className="text-sm text-gray-900">{value}</p>
                          </div>
                        )
                    )}
                    {userHoroscope.horoscopePDF && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Horoscope Image
                        </p>
                        <a
                          href={userHoroscope.horoscopePDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-800 underline"
                        >
                          View Image
                        </a>
                      </div>
                    )}
                    {userHoroscope.navamsaChart && (
                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Navamsa Chart
                        </p>
                        <img
                          src={userHoroscope.navamsaChart}
                          alt="Navamsa Chart"
                          className="rounded-lg border shadow-sm max-w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )}

                {userHoroscope.status === "pending" && (
                  <Alert className="bg-yellow-50 border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <AlertTitle className="text-yellow-800 font-semibold">
                      Under Review
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Your horoscope is currently being reviewed by our admin
                      team. This process may take 1-2 business days.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl bg-white shadow-xl p-0">
          <DialogHeader className="bg-gradient-to-r from-red-800 to-red-600 p-4 sm:p-5 text-white rounded-t-xl">
            <DialogTitle className="text-lg sm:text-xl font-bold">
              Upload Horoscope
            </DialogTitle>
            <DialogDescription className="text-sm text-red-100">
              Upload a JPEG, JPG, or PNG file for review. PDFs are not
              supported.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 sm:p-6 space-y-4">
            <Input
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
              className="border-gray-300 focus:border-red-800 focus:ring-red-800 rounded-lg"
            />
            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-red-800/5 rounded-lg">
                <FileText className="h-5 w-5 text-red-800" />
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {selectedFile.name}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="p-4 sm:p-6 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Uploading...
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
