"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AutoLogout from "@/components/layout/AutoLogout";

export default function ProtectedLayout({ children }) {
    const { data: session, status } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const isLoggedIn = status === "authenticated";
    const userInfo = session?.user;

    const handleLogout = () => {
        signOut({ redirect: false }).then(() => {
            setShowDropdown(false);
            router.push("/login");
        });
    };

    const handleChangePassword = () => {
        setShowDropdown(false);
        router.push("/change-password");
    };

    const handleProfile = () => {
        setShowDropdown(false);
        router.push("/profile");
    };

    return (
        <>
            <AutoLogout timeout={3600000} />

            <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between font-medium">
                {/* Logo bên trái */}
                <Link href="/" className="text-2xl font-bold text-black">
                    SMARTPARKING
                </Link>

                {/* Nút bên phải */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn && userInfo && (
                        <p className="text-gray-700 font-semibold hidden md:block">
                            Xin chào, {userInfo.name}!
                        </p>
                    )}

                    {isLoggedIn && userInfo ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                    {userInfo.name?.charAt(0).toUpperCase() || "A"}
                                </div>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                                    <div className="p-2 border-b border-gray-200">
                                        <p className="font-semibold">{userInfo.name}</p>
                                        <p className="text-sm text-gray-600">{userInfo.email}</p>
                                    </div>
                                    <button
                                        onClick={handleProfile}
                                        className="w-full text-left p-2 hover:bg-gray-100"
                                    >
                                        Thông tin cá nhân
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        className="w-full text-left p-2 hover:bg-gray-100"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left p-2 hover:bg-gray-100 text-red-600"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="text-sm text-gray-700 hover:text-black">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link href="/register">
                                <span className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                    Đăng ký
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="bg-gray-100 min-h-screen text-gray-800 transition-colors duration-300">
                {children}
            </main>
        </>
    );
}
