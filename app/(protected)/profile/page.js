'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession, update } from "next-auth/react"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (status === "authenticated") {
            setName(session.user.name || "")
            setEmail(session.user.email || "")
            setPhone(session.user.phone || "")
        }
    }, [session, status])

    const handleBack = () => {
        const role = session?.user?.role
        if (role === "admin") router.push("/admin")
        else if (role === "staff") router.push("/staff")
        else router.push("/")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            })

            if (res.ok) {
                await update() // cập nhật session
                alert("Cập nhật thành công!")
            } else {
                const { error } = await res.json()
                alert("Cập nhật thất bại: " + error)
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err)
            alert("Có lỗi xảy ra!")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
                <button
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Họ và tên</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded mt-1 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Số điện thoại</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
            </form>
        </div>
    )
}
