"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Search } from "lucide-react";
import { toast } from "sonner";
import { BackgroundCheckDialog } from "./backgound-check-form";
import { Input } from "@/components/ui/input";

export default function BackgroundCheckAdmin() {
  const [requests, setRequests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/bgCheckRequests");

      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching background check requests:", error);
      toast.error("Failed to load background check requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bgCheckRequests/${id}`);
      setRequests(requests.filter((request) => request._id !== id));
      toast.success("Request deleted successfully");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request");
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleSaveDetails = async (data) => {
    if (!selectedRequest) return;

    try {
      const updatedRequest = {
        ...selectedRequest,
        ...data,
        status: "reviewed", // Always set status to reviewed when saving
      };
      const updatedData = {
        ...data,
        status: "reviewed",
      };

      console.log("updated Requests:", updatedData);

      await api.put(`/bgCheckRequests/${selectedRequest._id}`, updatedRequest);

      setRequests(
        requests.map((req) =>
          req._id === selectedRequest._id ? updatedRequest : req
        )
      );

      toast.success(
        selectedRequest.status === "reviewed"
          ? "Background check details updated successfully"
          : "Background check completed successfully"
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update background check details");
    }
  };

  const filteredRequests = requests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request._id.toLowerCase().includes(searchLower) ||
      request.status.toLowerCase().includes(searchLower) ||
      request.requesterName.toLowerCase().includes(searchLower) ||
      request.receiverName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Background Check Requests</h1>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div>
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search by name, status, or ID..."
              className="pl-10 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester Name</TableHead>
                  <TableHead>TO Check</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      {requests.length === 0
                        ? "No background check requests found"
                        : "No matching requests found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        {request.requesterId.name}
                      </TableCell>
                      <TableCell>{request.receiverId.name}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === "reviewed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(request)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {request.status === "reviewed"
                              ? "Edit Details"
                              : "Enter Details"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(request._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {selectedRequest && (
        <BackgroundCheckDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveDetails}
          initialData={{
            maritalStatus: selectedRequest.maritalStatus || "",
            criminalStatus: selectedRequest.criminalStatus || "",
            employmentCheck: selectedRequest.employmentCheck || "",
          }}
          isReviewed={selectedRequest.status === "reviewed"}
        />
      )}
    </div>
  );
}
