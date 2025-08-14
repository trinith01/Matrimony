import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function VerificationButton({ user, onToggleVerification }) {
  // Safety check to ensure user is defined before accessing properties
  if (!user) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant={user.verified ? "destructive" : "default"}
      onClick={() => onToggleVerification(user._id)}
      className={
        user.verified
          ? "bg-red-600 hover:bg-red-800"
          : "bg-green-500 hover:bg-green-600"
      }
    >
      {user.verified ? (
        <>
          <X className="h-3.5 w-3.5 mr-1" /> Unverify
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5 mr-1" /> Verify
        </>
      )}
    </Button>
  );
}
