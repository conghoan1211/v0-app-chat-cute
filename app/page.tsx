"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"
import IntroScreen from "@/components/intro-screen"
import ChatList from "@/components/chat-list"

type Screen = "intro" | "chatList" | "chat"

interface ChatInfo {
  id: string
  name: string
  partnerEmail: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro")
  const [selectedChat, setSelectedChat] = useState<ChatInfo | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")

  const handleStartChat = (email: string) => {
    setUserEmail(email)
    setCurrentScreen("chatList")
  }

  const handleBackToIntro = () => {
    setCurrentScreen("intro")
  }

  const handleBackToChatList = () => {
    setCurrentScreen("chatList")
  }

  const handleSelectChat = (chatInfo: ChatInfo) => {
    setSelectedChat(chatInfo)
    setCurrentScreen("chat")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "intro":
        return <IntroScreen onStartChat={handleStartChat} />
      case "chatList":
        return <ChatList onSelectChat={handleSelectChat} onBack={handleBackToIntro} userEmail={userEmail} />
      case "chat":
        return selectedChat ? (
          <ChatInterface
            onBack={handleBackToChatList}
            chatId={selectedChat.id}
            chatName={selectedChat.name}
            partnerEmail={selectedChat.partnerEmail}
            userEmail={userEmail}
          />
        ) : null
      default:
        return <IntroScreen onStartChat={handleStartChat} />
    }
  }

  return (
    <main className="min-h-screen">
      {renderScreen()}
    </main>
  )
}
