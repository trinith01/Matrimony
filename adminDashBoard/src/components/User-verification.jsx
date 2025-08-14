"use client";

import { useState } from "react";
import api from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  X,
  Eye,
  User,
  Users,
  Crown,
  Star,
  Diamond,
  Search,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import VerificationButton from "./verification-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { toast } from "sonner";

// Available subscription plans
const subscriptionPlans = [
  { name: "Free", _id: "67cf3339fd0946d5a7299f10" },
  { name: "Basic", _id: "67cf3339fd0946d5a7299f11" },
  { name: "VIP", _id: "67cf3339fd0946d5a7299f12" },
  { name: "Premium", _id: "67cf3339fd0946d5a7299f13" },
];

export default function AdminDashboard() {
  const [reload, setReload] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    location: { city: "", country: "" },
    subscription_plan: { name: "Free", _id: "67cf3339fd0946d5a7299f10" },
  });
  const navigate = useNavigate();

  // Filter users by subscription plan
  const freeUsers = users.filter(
    (user) => user.subscription_plan.name === "Free"
  );
  const basicUsers = users.filter(
    (user) => user.subscription_plan.name === "Basic"
  );
  const vipUsers = users.filter(
    (user) => user.subscription_plan.name === "VIP"
  );
  const premiumUsers = users.filter(
    (user) => user.subscription_plan.name === "Premium"
  );

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = (userList) => {
    if (!searchTerm) return userList;
    return userList.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Navigate to user profile
  const navigateToUserProfile = (user) => {
    navigate(`/user-profile`, { state: { user, from: "/admin" } });
  };

  // Toggle user verification status
  const toggleVerification = (userId) => {
    // ===== API INTEGRATION POINT =====
    // Make an API request to update user verification status

    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, verified: !user.verified } : user
      )
    );
  };

  // Handle input change for new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewUser({
        ...newUser,
        [parent]: {
          ...newUser[parent],
          [child]: value,
        },
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value,
      });
    }
  };

  // Handle subscription plan change
  const handlePlanChange = (value) => {
    const selectedPlan = subscriptionPlans.find((plan) => plan.name === value);
    setNewUser({
      ...newUser,
      subscription_plan: selectedPlan,
    });
  };

  // Delete user
  const deleteUser = async () => {
    if (!userToDelete) return;

    // ===== API INTEGRATION POINT =====
    // Make an API request to delete a user
    try {
      console.log("user to delete", userToDelete);
      const res = await api.delete(`/users/${userToDelete._id}`);
      toast.success("User deleted successfully", {
        duration: 3000,
      });
    } catch (err) {
      console.log(err);
    }

    // Update local state
    setUsers(users.filter((user) => user._id !== userToDelete._id));
    setUserToDelete(null);
  };

  // Fetch users from API
  // ===== API INTEGRATION POINT =====
  // This would typically be in a useEffect hook

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        console.log("resposnse from admin pgae", response);
        if (response.data.success) {
          setUsers(response.data.data);
          console.log("users loaod from admin page", response.data.data);
        } else {
          console.log("error");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [reload]);

  // Render subscription plan icon
  const renderPlanIcon = (planName) => {
    switch (planName) {
      case "Free":
        return <User className="h-4 w-4 text-gray-500" />;
      case "Basic":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "VIP":
        return <Star className="h-4 w-4 text-amber-500" />;
      case "Premium":
        return <Diamond className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Render user table for a specific subscription plan
  const renderUserTable = (userList) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers(userList).length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers(userList).map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.location.city}, {user.location.country}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.verified ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <X className="h-3 w-3 mr-1" /> Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToUserProfile(user)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setUserToDelete(user)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the user account and remove their data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setUserToDelete(null)}
                            className={"bg-gray-200 hover:bg-gray-300"}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={deleteUser}
                            className={"bg-red-600 hover:bg-red-800"}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription>
                Manage all users and their subscription plans
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>All ({users.length})</span>
              </TabsTrigger>
              <TabsTrigger value="free" className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>Free ({freeUsers.length})</span>
              </TabsTrigger>
              <TabsTrigger value="basic" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Basic ({basicUsers.length})</span>
              </TabsTrigger>
              <TabsTrigger value="vip" className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span>VIP ({vipUsers.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="premium"
                className="flex items-center gap-1.5"
              >
                <Crown className="h-4 w-4" />
                <span>Premium ({premiumUsers.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderUserTable(users)}
            </TabsContent>

            <TabsContent value="free" className="mt-0">
              {renderUserTable(freeUsers)}
            </TabsContent>

            <TabsContent value="basic" className="mt-0">
              {renderUserTable(basicUsers)}
            </TabsContent>

            <TabsContent value="vip" className="mt-0">
              {renderUserTable(vipUsers)}
            </TabsContent>

            <TabsContent value="premium" className="mt-0">
              {renderUserTable(premiumUsers)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
