"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users, User, MessageCircle } from "lucide-react"
import { debounce } from "lodash"

interface Account {
  email: string,
  username: string,
  avatarUrl?: string,
  status?: "online" | "offline"
}

interface ChatInfo {
  id: string
  name: string
  partnerEmail: string
}

interface ChatListProps {
  onSelectChat: (chatInfo: ChatInfo) => void
  onBack: () => void
  userEmail: string
}

const AccountCard: React.FC<{
  account: Account
  onSelect: (email: string) => void
}> = ({ account, onSelect }) => (
  <Card
    className="glass-effect p-4 cursor-pointer hover:bg-white/30 transition-all duration-200"
    onClick={() => onSelect(account.email)}
  >
    <div className="flex items-center gap-3">
      <Avatar className="w-12 h-12 ring-2 ring-primary/30 relative">
        <AvatarImage src={account.avatarUrl} alt={account.username} />
        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
          {account.email.charAt(0).toUpperCase()}
        </AvatarFallback>
        {account.status === "online" && (
          <span className="absolute -bottom-0 -right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-primary truncate">{account.username}</h3>
        <p className="text-sm text-muted-foreground">Nhấn để bắt đầu trò chuyện</p>
      </div>
      <div className="text-primary">
        <MessageCircle className="w-5 h-5" />
      </div>
    </div>
  </Card>
)

const EmptyState: React.FC = () => (
  <div className="text-center text-muted-foreground py-8">
    <Users className="w-12 h-12 mx-auto mb-4 text-pink-400" />
    <p>Không tìm thấy tài khoản nào</p>
    <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
  </div>
)

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-primary">Đang tải danh sách tài khoản...</p>
    </div>
  </div>
)

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
    <div className="text-center">
      <Users className="w-12 h-12 mx-auto mb-4 text-red-400" />
      <p className="text-red-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Thử lại
      </Button>
    </div>
  </div>
)

export default function ChatList({ onSelectChat, onBack, userEmail }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/accounts?currentUserEmail=${encodeURIComponent(userEmail)}&search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data.success) {
        setAccounts(data.accounts)
        setError("")
      } else {
        setError(data.error || "Không thể tải danh sách tài khoản")
      }
    } catch (err) {
      setError(`Lỗi kết nối server: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [userEmail, searchQuery])

  const handleCreateChat = useCallback(

    async (targetEmail: string) => {
      try {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: targetEmail,
            avatar: "/placeholder-user.jpg",
            participants: [userEmail, targetEmail],
            createdBy: userEmail,
            chatType: "private",
          }),
        })
        const data = await res.json()
        if (data.success) {
          // Mở chat với người dùng được chọn
          const chatInfo: ChatInfo = {
            id: data.chat.id,
            name: data.chat.name,
            partnerEmail: targetEmail
          }
          onSelectChat(chatInfo)
        } else {
          setError(data.error || "Không thể tạo hội thoại mới")
        }
      } catch (err) {
        setError(`Lỗi kết nối server: ${(err as Error).message}`)
      }
    },
    [userEmail, onSelectChat]
  )

  // Debounced search
  const debouncedFetchAccounts = useCallback(
    debounce(() => {
      fetchAccounts()
    }, 300),
    [fetchAccounts]
  )

  useEffect(() => {
    debouncedFetchAccounts()
    return () => debouncedFetchAccounts.cancel()
  }, [debouncedFetchAccounts])

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={fetchAccounts} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      {/* Header */}
      <div className="glass-effect rounded-b-3xl p-4 mb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-primary/10 rounded-full"
            >
              <Users className="w-5 h-5 text-primary" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">Danh sách tài khoản</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài khoản theo email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70 border-white/50 rounded-full"
          />
        </div>
      </div>

      {/* Account List */}
      <div className="px-4 pb-4 space-y-2">
        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          accounts.map((account) => (
            <AccountCard
              key={account.email}
              account={account}
              onSelect={handleCreateChat}
            />
          ))
        )}
      </div>

      {/* Info */}
      <div className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg">
        <div className="text-center text-xs text-primary">
          <User className="w-4 h-4 mx-auto mb-1" />
          <p>{accounts.length} tài khoản</p>
        </div>
      </div>
    </div>
  )
}