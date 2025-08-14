"use client";

import { Star, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ContactCardGrid({
  contacts = [],
  horoscopeRequests = [],
  userHoroscope,
  horoscopeIds = [],
  authUser = { _id: "" },
  sendMatchRequest,
  isLoading = false,
}) {
  // Function to get request status for a contact
  const getRequestStatus = (contactId) => {
    // Find any request involving this contact (either as requester or receiver)
    return horoscopeRequests.find(
      (req) =>
        req.receiverId._id === contactId || req.requesterId._id === contactId
    );
  };
  console.log("horoscopeIds from card Grid", horoscopeIds);
  console.log("contacts from card grid", contacts);
  console.log("userHoroscope from card grid", userHoroscope);
  console.log("horocorpe reqest from card grid", horoscopeRequests);
  console.log("authUser from card grid", authUser);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {contacts.map((contact) => {
        const request = getRequestStatus(contact._id);
        const userIsRequester =
          request && request.requesterId._id === authUser._id;

        return (
          <Card
            key={contact._id}
            className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="p-4 sm:p-5 bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={contact.profile_photo} alt={contact.name} />
                  <AvatarFallback className="bg-red-800/10 text-red-800 font-semibold">
                    {contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 truncate">
                    {contact.name}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-600 truncate">
                    {contact.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {request ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        request.status === "completed"
                          ? "default"
                          : request.status === "accepted"
                          ? "success"
                          : request.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {request.status === "pending" && "Pending"}
                      {request.status === "reviewed" && "Reviewed"}
                    </Badge>

                    {userIsRequester && (
                      <span className="text-xs sm:text-sm text-gray-500">
                        You requested
                      </span>
                    )}
                  </div>

                  {request.status === "reviewed" && (
                    <div className="mt-2 p-3 bg-red-800/10 rounded-lg">
                      <p className="text-sm sm:text-base font-medium text-red-800">
                        Match Score: {request.matchingScore || 0}%
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  No compatibility request yet
                </p>
              )}
            </CardContent>
            <CardFooter>
              <div className="p-4 sm:p-5 bg-white flex flex-col items-center">
                {!request && (
                  <>
                    <Button
                      className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg text-sm sm:text-base transition-all duration-200 shadow-md"
                      size="sm"
                      disabled={
                        !userHoroscope ||
                        userHoroscope.status !== "reviewed" ||
                        isLoading ||
                        !horoscopeIds.includes(contact._id)
                      }
                      onClick={() => sendMatchRequest(contact._id)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Request Compatibility
                    </Button>

                    {!horoscopeIds.includes(contact._id) && (
                      <div className="w-full mt-3 p-2 bg-red-800/10 border border-red-800/20 text-red-800 rounded-lg text-xs sm:text-sm text-center">
                        This user hasn't submitted their horoscope yet.
                      </div>
                    )}
                  </>
                )}

                {request && request.status === "pending" && userIsRequester && (
                  <div className="w-full p-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-xs sm:text-sm text-center">
                    You sent a request and it is currently in pending status
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}

      {contacts.length === 0 && (
        <Alert className="col-span-full rounded-lg border-gray-200">
          <AlertCircle className="h-5 w-5 text-red-800" />
          <AlertTitle className="text-red-800 font-semibold text-sm sm:text-base">
            No contacts found
          </AlertTitle>
          <AlertDescription className="text-gray-600 text-xs sm:text-sm">
            You don't have any contacts to match with yet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
