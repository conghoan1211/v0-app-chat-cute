"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface IntroScreenProps {
  onStartChat: (email: string) => void
  onShowRegister?: () => void
}

export default function IntroScreen({ onStartChat, onShowRegister }: IntroScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        onStartChat(email)
      } else if (res.status === 404) {
        setError("Tài khoản không tồn tại")
      } else {
        setError(data.error || "Đăng nhập thất bại")
      }
    } catch (err) {
      console.log(err)
      setError("Lỗi kết nối server+ " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full text-center space-y-8 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Đăng nhập đi mom  💕</h1>
        <div className="space-y-4 mb-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-5">{error}</div>}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập / Đăng ký"}
        </Button>
        <div className="text-sm text-gray-700">
          Chưa có tài khoản? {" "}
          <button
            type="button"
            className="text-pink-600 underline"
            onClick={() => onShowRegister && onShowRegister()}
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  )
}