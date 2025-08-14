"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatDrawer } from "./chat-drawer"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import api from "@/services/api"

export function ChatButton({ from, to }) {
  const [messagesCount, setMessagesCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${from._id}`)
        console.log("unread messages count", res.data)
        setMessagesCount(res.data)
      } catch (err) {
        console.error("Error fetching messages", err)
      }
    }
    fetchMessages()
  }, [from._id])

  const handleButtonClick = () => {
    if (from.plan_name === "Free" && messagesCount > 0) {
      console.log("Free plan user with unread messages")
      setShowUpgradeDialog(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          onClick={handleButtonClick}
          variant={from.plan_name === "Free" && messagesCount > 0 ? "secondary" : "default"}
          className={from.plan_name === "Free" && messagesCount > 0 ? "bg-gray-400 hover:bg-gray-500" : ""}
        >
          <MessageCircle className="h-6 w-6 hover:text-white" />
        </Button>

        {messagesCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {messagesCount}
          </Badge>
        )}
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Required</DialogTitle>
            <DialogDescription>
              You have {messagesCount} unread {messagesCount === 1 ? "message" : "messages"}. To view{" "}
              {messagesCount === 1 ? "it" : "them"}, please upgrade your plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => (window.location.href = "/upgrade")}>Upgrade Now</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Drawer */}
      <ChatDrawer from={from} to={to} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
