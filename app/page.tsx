"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"
import IntroScreen from "@/components/intro-screen"

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  const handleStartChat = () => {
    setShowChat(true)
  }

  const handleBackToIntro = () => {
    setShowChat(false)
  }

  return (
    <main className="min-h-screen">
      {showChat ? <ChatInterface onBack={handleBackToIntro} /> : <IntroScreen onStartChat={handleStartChat} />}
    </main>
  )
}
