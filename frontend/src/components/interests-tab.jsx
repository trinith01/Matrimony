"use client";

import { Clock, Check, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function InterestsTab({
  receivedInterests,
  sentInterests,
  onAcceptInterest,
  onDeclineInterest,
  onCancelInterest,
}) {
  const navigate = useNavigate();

  const viewProfile = (user) => {
    navigate(`/user-profile`, { state: { user } });
  };
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 bg-red-800/10 rounded-lg p-1 mb-4 sm:mb-6">
          <TabsTrigger
            value="received"
            className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg text-sm sm:text-base py-2"
          >
            Received ({receivedInterests.length})
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="data-[state=active]:bg-white data-[state=active]:text-red-800 rounded-lg text-sm sm:text-base py-2"
          >
            Sent ({sentInterests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-0 space-y-4">
          <Card className="rounded-xl border-none shadow-md">
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-t-xl">
              <CardTitle className="text-lg sm:text-xl font-bold">
                Interests Received
              </CardTitle>
              <CardDescription className="text-red-100">
                People who have shown interest in your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {receivedInterests.length > 0 ? (
                  receivedInterests.map((interest) => {
                    const fromUser =
                      typeof interest.fromId === "string"
                        ? {
                            name: "Unknown User",
                            occupation: "N/A",
                            education: "N/A",
                          }
                        : interest.fromId;

                    return (
                      <div
                        key={interest._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-red-800/20">
                            <AvatarImage
                              src={`/placeholder.svg?height=50&width=50&text=${fromUser.name.charAt(
                                0
                              )}`}
                              alt={fromUser.name}
                            />
                            <AvatarFallback className="bg-red-800/10 text-red-800">
                              {fromUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                              {fromUser.name}
                            </h4>
                            <div className="text-xs sm:text-sm text-gray-600">
                              <p>
                                {fromUser.occupation}, {fromUser.education}
                              </p>
                              <p className="flex items-center mt-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {new Date(
                                  interest.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3 sm:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewProfile(fromUser)}
                            className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                          >
                            View Profile
                          </Button>
                          {interest.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDeclineInterest(interest._id)}
                                className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                              >
                                <X className="h-4 w-4 mr-1" /> Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onAcceptInterest(interest._id)}
                                className="w-full sm:w-auto bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
                              >
                                <Check className="h-4 w-4 mr-1" /> Accept
                              </Button>
                            </>
                          ) : (
                            <Badge
                              className={`rounded-full ${
                                interest.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {interest.status.charAt(0).toUpperCase() +
                                interest.status.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    You haven't received any interests yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="mt-0 space-y-4">
          <Card className="rounded-xl border-none shadow-md">
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-t-xl">
              <CardTitle className="text-lg sm:text-xl font-bold">
                Interests Sent
              </CardTitle>
              <CardDescription className="text-red-100">
                Profiles you have shown interest in
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {sentInterests.length > 0 ? (
                  sentInterests.map((interest) => {
                    const toUser =
                      typeof interest.toId === "string"
                        ? {
                            name: "Unknown User",
                            occupation: "N/A",
                            education: "N/A",
                          }
                        : interest.toId;

                    return (
                      <div
                        key={interest._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-red-800/20">
                            <AvatarImage
                              src={`/placeholder.svg?height=50&width=50&text=${toUser.name.charAt(
                                0
                              )}`}
                              alt={toUser.name}
                            />
                            <AvatarFallback className="bg-red-800/10 text-red-800">
                              {toUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                              {toUser.name}
                            </h4>
                            <div className="text-xs sm:text-sm text-gray-600">
                              <p>
                                {toUser.occupation}, {toUser.education}
                              </p>
                              <p className="flex items-center mt-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {new Date(
                                  interest.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3 sm:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewProfile(toUser)}
                            className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                          >
                            View Profile
                          </Button>
                          {interest.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onCancelInterest(interest._id)}
                              className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                            >
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                          )}
                          <Badge
                            className={`rounded-full ${
                              interest.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : interest.status === "rejected"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {interest.status.charAt(0).toUpperCase() +
                              interest.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    You haven't sent any interests yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
