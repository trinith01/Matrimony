"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserVerification({
  userId,
  userName,
  isVerified,
  onVerificationChange,
}) {
  const [verified, setVerified] = useState(isVerified);

  // Update local state when prop changes
  useEffect(() => {
    setVerified(isVerified);
  }, [isVerified]);

  const handleToggleVerification = () => {
    const newStatus = !verified;
    setVerified(newStatus);
    onVerificationChange(userId, newStatus);
  };

  return (
    <Card className="shadow-sm border-dashed border-2 border-gray-200 bg-gray-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Admin Verification Panel
        </CardTitle>
        <CardDescription>
          Only administrators can see and modify verification status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Current status for {userName}:
            </p>
            {verified ? (
              <Badge className="bg-green-100 text-green-800">
                <Check className="h-3 w-3 mr-1" /> Verified Account
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                <X className="h-3 w-3 mr-1" /> Unverified Account
              </Badge>
            )}
          </div>
          <Button
            onClick={handleToggleVerification}
            variant={verified ? "destructive" : "default"}
            className={
              verified
                ? "bg-red-600 hover:bg-red-800"
                : "bg-green-500 hover:bg-green-600"
            }
          >
            {verified ? (
              <>
                <X className="h-4 w-4 mr-1" /> Remove Verification
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" /> Verify Account
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
