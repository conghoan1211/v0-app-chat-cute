"use client"

import { Heart, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IntroScreenProps {
  onStartChat: () => void
}

export default function IntroScreen({ onStartChat }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Floating hearts animation */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 text-pink-400 animate-bounce">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div className="absolute -top-2 -right-6 text-purple-400 animate-pulse">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="absolute -bottom-2 left-2 text-blue-400 animate-bounce delay-300">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30">
          {/* Avatar */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Chat Yêu Thương 💕</h1>

          {/* Description */}
          <div className="space-y-3 text-gray-700 mb-8">
            <p className="text-lg">Nơi để hai trái tim kết nối</p>
            <p className="text-sm opacity-80">
              Gửi những tin nhắn ngọt ngào và cảm xúc yêu thương đến người đặc biệt của bạn
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 mb-8 text-sm">
            <div className="flex items-center justify-center space-x-2 text-pink-600">
              <Heart className="w-4 h-4 fill-current" />
              <span>Tin nhắn trái tim đặc biệt</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Hiệu ứng ngôi sao lấp lánh</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <MessageCircle className="w-4 h-4" />
              <span>Chat riêng tư và an toàn</span>
            </div>
          </div>

          {/* Start button */}
          <Button
            onClick={onStartChat}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Bắt Đầu Chat 💖
          </Button>
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center space-x-4 opacity-60">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  )
}
