import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationBar } from "@/components/navigation-bar";
import { Toaster } from "@/components/ui/sonner"
const currentUserStats = {
    _id: "67d2c0a894d5fc8d2f1a4611",
    consultant_id: "c1",
    interests_today: 0,
    plan: "VIP",
    profile_boosts_this_month: 0,
    profile_views_today: 0,
    user_id: 1,
    matches: [
      {
        from_id: 1,
        to_id: 2,
        status: "pending",
      },
    ],
    remaining_profile_views: 15,
    pending_requests: 3,
  }
function NavLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main className=" mx-1 py-3 px-3 ">
        <Outlet />
        <Toaster/>
      </main>
    </div>
  );
}

export default NavLayout;
