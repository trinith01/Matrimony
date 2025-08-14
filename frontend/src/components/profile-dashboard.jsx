"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Girl from "../assets/girl.jpg";
import {
  Heart,
  ImageIcon,
  MapPin,
  MessageSquare,
  Settings,
  User,
  Zap,
  Star,
  Check,
  Calendar,
  UserMinus,
  Edit,
  Trash,
  BadgePercent,
} from "lucide-react";
import api from "@/services/api";
import { useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import InterestsTab from "./interests-tab";
import { toast } from "sonner";
import { FullEditProfileDialog } from "./edit-profile-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { GalleryManager } from "./gallery-manager";
import { VideoGalleryManager } from "./video-manager";
import { ProfilePicture } from "./profile-picture-management";
import { HoroscopeCompatibility } from "./horoscope-compatibility";
import { BackgroundCheck } from "./background-check";
import { ChatButton } from "./chat-button";
export function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [activeTabService, setActiveTabService] = useState("horoscope");

  const { user: authUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(authUser);

  console.log("authUser", authUser);
  console.log("userData", userData);

  // Calculate age from birthday
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

  useEffect(() => {
    const getSentInterest = async () => {
      try {
        const res = await api.get(`/interest/sent/${authUser?._id}`);
        setSentInterests(res.data);
        console.log("sentIntereset", res.data);
      } catch (error) {
        console.error("Error fetching sent interests:", error);
      }
    };

    const getReceivedInterest = async () => {
      try {
        const res = await api.get(`/interest/received/${authUser._id}`);
        setReceivedInterests(res.data);
      } catch (error) {
        console.error("Error fetching received interests:", error);
      }
    };

    if (authUser?._id) {
      getSentInterest();
      getReceivedInterest();
    }
    setUserData(authUser);
  }, [authUser?._id]);

  // Handle gallery updates
  const handleGalleryUpdate = async (updatedGallery) => {
    try {
      //updatre the back edn with new gallery links
      await api.put(`/users/updateProfile/${authUser._id}`, {
        gallery: updatedGallery,
      });

      // Update local state
      setUserData((prev) => ({
        ...prev,
        gallery: updatedGallery,
      }));
    } catch (error) {
      console.error("Error updating gallery:", error);
      toast.error("Failed to update gallery");
    }
  };

  // Handle videos updates

  // Handle interest actions
  const handleAcceptInterest = async (interestId) => {
    try {
      await api.put(`/interest/${interestId}`);
      toast.success("Interest accepted!");
      // Update local state for immediate UI feedback
      setReceivedInterests(
        (prevInterests) =>
          prevInterests.filter((interest) => interest._id !== interestId) // Remove the declined interest
      );
    } catch (error) {
      console.error("Error accepting interest:", error);
    }
  };

  const handleDeclineInterest = async (interestId) => {
    try {
      await api.delete(`/interest/${interestId}`);
      toast.success("Interest declined!");
      // Update local state for immediate UI feedback
      setReceivedInterests((prevInterests) =>
        prevInterests.filter((interest) => interest._id !== interestId)
      ); // Remove the declined interest
    } catch (error) {
      console.error("Error declining interest:", error);
    }
  };
  const handleCancelInterest = async (interestId) => {
    try {
      await api.delete(`/interest/${interestId}`);
      toast.success("Interest cancelled!");
      // Update local state for immediate UI feedback
      setSentInterests((prevInterests) =>
        prevInterests.filter((interest) => interest._id !== interestId)
      );
    } catch (error) {
      console.error("Error cancelling interest:", error);
    } // Remove the cancelled interest
  };

  // Handle user data update
  const handleUserUpdate = async (updatedUser) => {
    console.log("updated user data", updatedUser);

    try {
      const res = await api.put(
        `/users/updateProfile/${authUser._id}`,
        updatedUser
      );
      console.log("res", res.data.message);
      toast.success(res.data.message);
      setUserData(updatedUser);
    } catch (err) {
      console.log(err);
    }

    setUserData(updatedUser);
  };

  const handleUnfriend = async (contactId) => {
    try {
      const newContactList = authUser.contacts.filter(
        (contact) => contact._id !== contactId
      );
      console.log("newContactList", newContactList);

      //Update the backend with the new contact list
      const res = await api.put(`/users/updateProfile/${authUser._id}`, {
        contacts: newContactList,
      });
      console.log("res", res.data.message);

      // In a real app, you would update the user's contacts in your backend
      // await api.delete(`/users/contacts/${authUser._id}/${contactId}`);

      // Update local state

      setUserData((prev) => ({
        ...prev,
        contacts: prev.contacts.filter((contact) => contact._id !== contactId),
      }));
      toast.success("Contact removed!");
    } catch (error) {
      console.error("Error removing contact:", error);
      toast.error("Failed to remove contact");
    }
  };
  const handelUserVisibilty = async (visibility) => {
    console.log("visibility", visibility);
    const res = await api.put(`/users/updateProfile/${authUser._id}`, {
      visibility: visibility,
    });
    toast.success(res.data.message);
    setUserData((prev) => ({
      ...prev,
      visibility: visibility,
    }));
  };
  const handleUserProfile = async (updatedUser) => {
    console.log("updated user data", updatedUser);
    try {
      const res = await api.put(
        `/users/updateProfile/${authUser._id}`,
        updatedUser
      );
      toast.success(res.data.message);
      setUserData(updatedUser);
    } catch (err) {
      console.log(err);
    }

    setUserData(updatedUser);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Profile Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Manage your profile, connections, and subscription
          </p>
        </div>
        <FullEditProfileDialog user={userData} onUpdate={handleUserUpdate} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 rounded-2xl border-none shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center border-b border-gray-200 pb-4 sm:pb-6">
              <ProfilePicture
                user={userData}
                onUpdate={handleUserUpdate}
                size="lg"
                showVipBadge={true}
              />
              <h2 className="mt-3 text-lg sm:text-xl font-semibold text-gray-900">
                {userData?.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {userData.location?.city}, {userData.location?.country}
              </p>
              <div className="flex items-center mt-2 gap-2">
                <Badge className="bg-red-800/10 text-red-800 text-xs sm:text-sm px-2 py-0.5 rounded-full">
                  {userData.religion}
                </Badge>
                <Badge className="bg-red-800/10 text-red-800 text-xs sm:text-sm px-2 py-0.5 rounded-full">
                  {calculateAge(userData.birthday)} yrs
                </Badge>
              </div>
            </div>

            <div className="pt-4">
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Profile Completion
                </p>
                <Progress
                  value={85}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-red-800"
                />
              </div>

              <nav className="space-y-1">
                {[
                  { tab: "overview", icon: User, label: "Overview" },
                  {
                    tab: "requests",
                    icon: Heart,
                    label: "Requests",
                    count:
                      receivedInterests.filter((i) => i.status === "pending")
                        .length + sentInterests.length,
                  },
                  {
                    tab: "contacts",
                    icon: MessageSquare,
                    label: "Contacts",
                    count: userData.contacts.length,
                  },
                  { tab: "gallery", icon: ImageIcon, label: "Gallery" },
                  { tab: "subscription", icon: Zap, label: "Subscription" },
                  { tab: "service", icon: BadgePercent, label: "Service" },
                  { tab: "settings", icon: Settings, label: "Settings" },
                ].map(({ tab, icon: Icon, label, count }) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    className={`w-full justify-start text-sm sm:text-base py-2 rounded-lg ${
                      activeTab === tab
                        ? "bg-red-800/10 text-red-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                    {count > 0 && (
                      <Badge className="ml-auto bg-red-800 text-white text-xs px-2 py-0.5 rounded-full">
                        {count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </nav>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "overview" && (
            <Card className="rounded-2xl border-none shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Profile Summary
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Your profile information and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {[
                    {
                      icon: Heart,
                      label: "Interests Received",
                      value: receivedInterests.length,
                    },
                    { icon: User, label: "Profile Views", value: 124 },
                    {
                      icon: MessageSquare,
                      label: "Active Contacts",
                      value: userData.contacts.length,
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="relative bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden"
                    >
                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-800/5 to-transparent opacity-50 pointer-events-none" />

                      <div className="flex items-center space-x-4">
                        {/* Icon Container */}
                        <div className="flex-shrink-0 bg-red-800/10 p-2 sm:p-3 rounded-full border border-red-800/20 shadow-sm">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-800" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-600 font-medium tracking-tight uppercase">
                            {label}
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                            {value}
                          </p>
                        </div>
                      </div>

                      {/* Decorative Line */}
                      <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-red-800 rounded-r-full" />
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                    About Me
                  </h3>
                  <Separator className="bg-gray-200 h-[2px] rounded-full" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {[
                      {
                        title: "Personal Details",
                        data: [
                          { label: "Name", value: userData.name || "name01" },
                          {
                            label: "Age",
                            value: `${calculateAge(userData.birthday)} years`,
                          },
                          { label: "Gender", value: userData.gender || "N/A" },
                          { label: "Religion", value: userData.religion },
                          { label: "Caste", value: userData.caste },
                          {
                            label: "Mother Tongue",
                            value: userData.mother_tongue,
                          },
                        ],
                      },
                      {
                        title: "Professional Details",
                        data: [
                          { label: "Education", value: userData.education },
                          { label: "Occupation", value: userData.occupation },
                          {
                            label: "Income",
                            value: `${userData.income.toLocaleString()} LKR`,
                          },
                          { label: "City", value: userData.location?.city },
                          {
                            label: "Country",
                            value: userData.location?.country,
                          },
                        ],
                      },
                    ].map(({ title, data }) => (
                      <div
                        key={title}
                        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 border-b border-red-800/20 pb-2">
                          {title}
                        </h3>
                        <dl className="space-y-3">
                          {data.map(({ label, value }) => (
                            <div
                              key={label}
                              className="flex justify-between items-center"
                            >
                              <dt className="text-sm sm:text-base text-gray-600 font-medium">
                                {label}
                              </dt>
                              <dd className="text-sm sm:text-base text-gray-900 font-semibold bg-red-800/5 px-3 py-1 rounded-full truncate max-w-[150px] sm:max-w-[200px]">
                                {value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "requests" && (
            <InterestsTab
              receivedInterests={receivedInterests}
              sentInterests={sentInterests}
              onAcceptInterest={handleAcceptInterest}
              onDeclineInterest={handleDeclineInterest}
              onCancelInterest={handleCancelInterest}
            />
          )}

          {activeTab === "contacts" && (
            <Card className="rounded-2xl border-none shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  My Contacts
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  People you can communicate with
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {userData.contacts && userData.contacts.length > 0 ? (
                    userData.contacts.map((contact) => (
                      <Card
                        key={contact._id}
                        className="rounded-lg border-none shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                            <div className="flex  items-center flex-1 gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={
                                    contact?.profile_photo || "/placeholder.svg"
                                  }
                                  alt={contact?.name || "User"}
                                />
                                <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                                  {contact?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {contact.name}
                            </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              {contact.email}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {contact.phone}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ChatButton
                              from={{
                                name: authUser.name,
                                _id: authUser._id,
                                profile_photo: authUser.profile_photo,
                                plan_name:authUser.subscription_plan.name
                              }}
                              to={{
                                name: contact.name,
                                _id: contact._id,
                                profile_photo: contact.profile_photo,
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnfriend(contact._id)}
                              className="text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Unfriend
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-gray-50 rounded-lg">
                      <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                        <div className="rounded-full bg-red-800/10 p-3 mb-3">
                          <User className="h-6 w-6 sm:h-8 sm:w-8 text-red-800" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          No contacts yet
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4">
                          Your contact list is currently empty.
                        </p>
                        <Button
                          asChild
                          className="bg-red-800 hover:bg-red-900 text-white rounded-lg"
                        >
                          <Link to="/home">Add your first contact</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "gallery" && (
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="bg-red-800/10 w-full justify-start mb-4 rounded-lg">
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg"
                >
                  Photos
                </TabsTrigger>
              </TabsList>
              <TabsContent value="photos" className="mt-0">
                <GalleryManager
                  gallery={userData.gallery || []}
                  onGalleryUpdate={handleGalleryUpdate}
                />
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "subscription" && (
            <Card className="rounded-2xl border-none shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Current Plan
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Your subscription details and benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-lg p-4 sm:p-6 text-white mb-6 shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold flex items-center">
                        <Star className="h-5 w-5 mr-2 fill-white" /> VIP Plan
                      </h3>
                      <p className="text-sm opacity-90 mt-1">
                        Premium features for serious relationships
                      </p>
                    </div>
                    <Badge className="bg-white text-red-800 text-xs sm:text-sm px-2 py-0.5 rounded-full">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      "Unlimited Profile Views",
                      "Priority in Search Results",
                      "Advanced Filters",
                      "Video Calling",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center text-sm">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="text-xs sm:text-sm opacity-90">
                        Expires on
                      </p>
                      <p className="font-medium flex items-center text-sm sm:text-base">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(
                          userData.subscription_expires
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <Button className="w-full sm:w-auto bg-white text-red-800 hover:bg-gray-100 rounded-lg">
                      Renew Plan
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Upgrade Your Experience
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Profile Boost",
                      icon: Zap,
                      desc: "Get 10x more profile views for 24 hours",
                      price: "$5.99",
                    },
                    {
                      title: "Premium Plan",
                      icon: Star,
                      desc: "All features for serious relationships",
                      price: "$19.99",
                      popular: true,
                    },
                    {
                      title: "Contact Pack",
                      icon: MessageSquare,
                      desc: "50 additional contact requests",
                      price: "$9.99",
                    },
                  ].map(({ title, icon: Icon, desc, price, popular }) => (
                    <Card
                      key={title}
                      className={`rounded-lg border-2 ${
                        popular
                          ? "border-red-800"
                          : "border-transparent hover:border-red-800/20"
                      } transition-colors relative`}
                    >
                      {popular && (
                        <Badge className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-800 text-white text-xs px-2 py-0.5 rounded-full">
                          Most Popular
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-center text-base sm:text-lg font-semibold text-gray-900">
                          {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center pb-4">
                        <div className="bg-red-800/10 rounded-full p-3 w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center">
                          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-red-800" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                          {desc}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                          {price}
                          {title === "Premium Plan" && (
                            <span className="text-sm font-normal text-gray-600">
                              /month
                            </span>
                          )}
                        </p>
                        <Button className="w-full bg-red-800 hover:bg-red-900 text-white rounded-lg">
                          Buy Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card className="rounded-2xl border-none shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Account Settings
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Privacy Settings
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <Label
                        htmlFor="profile-visibility"
                        className="text-sm sm:text-base font-medium text-gray-700"
                      >
                        Profile Visibility
                      </Label>
                      <Select
                        defaultValue={userData.visibility}
                        onValueChange={handelUserVisibilty}
                      >
                        <SelectTrigger className="w-full sm:w-[180px] rounded-lg border-gray-300">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Everyone</SelectItem>
                          <SelectItem value="private">Only Me</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Security
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg text-sm sm:text-base"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Account Actions
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg text-sm sm:text-base"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "service" && (
            <div className="w-full">
              <Tabs
                value={activeTabService}
                onValueChange={setActiveTabService}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 bg-red-800/10 rounded-lg p-1">
                  <TabsTrigger
                    value="horoscope"
                    className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg text-sm sm:text-base"
                  >
                    Horoscope
                  </TabsTrigger>
                  <TabsTrigger
                    value="background"
                    className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg text-sm sm:text-base"
                  >
                    Background Check
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="horoscope">
                  <HoroscopeCompatibility
                    authUser={authUser}
                    contacts={authUser.contacts}
                  />
                </TabsContent>
                <TabsContent value="background">
                  <BackgroundCheck
                    contacts={authUser.contacts}
                    authUserId={authUser._id}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
