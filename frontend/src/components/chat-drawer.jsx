"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "./chat-interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import api from "@/services/api";

export function ChatDrawer({ isOpen, onClose, from, to }) {
  const drawerRef = useRef(null);
  console.log("to" , to)
  console.log("from" , from)

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  //when drawe is open makrs the messages as read
  useEffect(() => {
    const markAsRead = async () => {
      try {
        console.log("fromId", from._id)
        console.log("toId", to._id)
        //await axios.patch(`http://localhost:5000/chat/${from._id}/${to._id}`)
        await api.patch(`/chat/${from._id}/${to._id}`)
        console.log("Marked messages as read")
      } catch (err) {
        console.error("Error marking messages as read", err)
      }
    }
    if (isOpen) {
      console.log("marking as read")
      markAsRead()
    }
  })

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center flex-1 gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={to?.profile_photo || "/placeholder.svg"} alt={to?.name || "User"} />
              <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                {to?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{to?.name || "Chat"}</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface from={from} to={to} />
        </div>
      </div>
    </div>
  );
}
