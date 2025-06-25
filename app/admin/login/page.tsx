"use client"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { LogIn } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { findAdminUser } = await import("@/lib/db")
    const adminUser = await findAdminUser(username)

    if (adminUser && password === "adminpass") {
      localStorage.setItem("isAdminAuthenticated", "true")
      toast.success("Login successful! Redirecting...")
      router.push("/admin/dashboard")
    } else {
      setError("Invalid username or password.")
      toast.error("Invalid username or password.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">Admin Login</CardTitle>
          <CardDescription className="text-gray-600">Access the Festival Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}
            <div>
              <Label htmlFor="username" className="font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 text-lg"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
