"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RegisterScreenProps {
    onSuccess: (email: string) => void
    onBack: () => void
}

export default function RegisterScreen({ onSuccess, onBack }: RegisterScreenProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username, avatarUrl }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                onSuccess(email)
            } else {
                setError(data.error || "Đăng ký thất bại")
            }
        } catch (err) {
            setError("Lỗi kết nối server: " + (err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-4">
            <form
                onSubmit={handleRegister}
                className="max-w-md w-full text-center space-y-8 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Tạo tài khoản 💫</h1>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tên người dùng (unique)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        maxLength={20}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        maxLength={20}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Avatar URL (tùy chọn)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        value={avatarUrl}
                        onChange={e => setAvatarUrl(e.target.value)}
                    />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="w-1/3"
                    >
                        Quay lại
                    </Button>
                    <Button
                        type="submit"
                        className="w-2/3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng ký"}
                    </Button>
                </div>
            </form>
        </div>
    )
}


