"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { io } from "socket.io-client"
import { Message } from "./message"
import axios from "axios"
import api from "@/services/api"

const socket = io( `http://localhost:5000`) // Replace with your actual backend URL

export function ChatInterface({ from, to }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)

  // Load chat history on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        //const res = await axios.get(`http://localhost:5000/chat/${from._id}/${to._id}`)
        const res = await api.get(`/chat/${from._id}/${to._id}`)
        setMessages(res.data.messages)
      } catch (err) {
        console.error("Error fetching messages", err)
      }
    }
    


    fetchMessages()
  
  }, [from._id, to._id])

  // Socket listeners
  useEffect(() => {
    socket.emit("join_room", { userId: from._id })

    socket.on("receive_message", (message) => {
      if (
        (message.from === from._id && message.to === to._id) ||
        (message.from === to._id && message.to === from._id)
      ) {
        setMessages((prev) => [...prev, message])
      }
    })

    return () => {
      socket.off("receive_message")
    }
  }, [from._id, to._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    const newMessage = {
      from: from._id,
      to: to._id,
      text: inputValue,
    
    }

    // Emit to server
    socket.emit("send_message", newMessage)

    // Optimistic UI update
    setMessages((prev) => [...prev, { ...newMessage, timestamp:new Date(),_id: Date.now().toString() }])
    setInputValue("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4" style={{ height: "calc(100% - 70px)" }}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <Message key={msg._id} message={msg} currentUserId={from._id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-900 w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
