import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ShieldCheck } from "lucide-react";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function BackgroundCheck({ contacts, authUserId }) {
  const [bgrequest, setBgRequest] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchBgRequests = async () => {
      try {
        const response = await api.get(`/bgCheckRequests/user/${authUserId}`);
        console.log("Background check requests:", response.data);
        setBgRequest(response.data);
      } catch (error) {
        console.error("Error fetching background check requests:", error);
      }
    };

    fetchBgRequests();
  }, [refetch]);

  const getRequestStatus = (contactId) => {
    const request = bgrequest.find((req) => req.receiverId._id === contactId);
    return request ? request.status : null;
  };

  const isRequested = (contactId) => {
    return bgrequest.some((request) => request.receiverId._id === contactId);
  };

  const makeRequest = async (contactId) => {
    const data = {
      requesterId: authUserId,
      receiverId: contactId,
    };

    try {
      const response = await api.post("/bgCheckRequests", data);
      setBgRequest((prev) => [...prev, response.data]);
      toast.success("Background check request sent successfully!");
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error sending background check request:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Background Verification
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {contacts.map((contact) => {
          const status = getRequestStatus(contact._id);

          return (
            <Card
              key={contact._id}
              className="rounded-xl border-none shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-red-800/20">
                      <AvatarImage
                        src={contact.profile_photo}
                        alt={contact.name}
                      />
                      <AvatarFallback className="bg-red-800/10 text-red-800">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {contact.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {contact.email}
                      </p>
                      {status === "pending" && (
                        <Badge className="mt-2" variant="outline">
                          <Clock size={16} className="mr-1" /> Pending
                        </Badge>
                      )}
                      {status === "reviewed" && (
                        <Badge className="mt-2" variant="outline">
                          <CheckCircle size={16} className="mr-1" /> Reviewed
                        </Badge>
                      )}
                    </div>
                  </div>
                  {status === "reviewed" &&
                    (() => {
                      const request = bgrequest.find(
                        (req) => req.receiverId._id === contact._id
                      );

                      return (
                        <div className="mt-3 sm:mt-0 sm:text-right">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 rounded-full mb-2"
                          >
                            Background Check Completed
                          </Badge>

                          <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                            <p>
                              <strong className="font-medium">
                                Criminal Status:
                              </strong>{" "}
                              {request?.criminalStatus ?? "Pending"}
                            </p>
                            <p>
                              <strong className="font-medium">
                                Marital Status:
                              </strong>{" "}
                              {request?.maritalStatus ?? "Pending"}
                            </p>
                            <p>
                              <strong className="font-medium">
                                Employment Check:
                              </strong>{" "}
                              {request?.employmentCheck ?? "Pending"}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                  <div className="flex flex-col sm:items-end gap-2">
                    <Button
                      disabled={isRequested(contact._id)}
                      className={`text-white ${
                        isRequested(contact._id)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700"
                      }`}
                      onClick={() =>
                        !isRequested(contact._id) && makeRequest(contact._id)
                      }
                    >
                      {isRequested(contact._id) ? (
                        <>
                          <CheckCircle size={16} className="h-4 w-4 mr-2" />{" "}
                          Requested
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} className="h-4 w-4 mr-2" />{" "}
                          Request Background Check
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
