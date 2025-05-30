// "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function ChangePasswordPage() {
//     const { data: session } = useSession();
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });
//     const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         // Basic validation
//         if (formData.newPassword !== formData.confirmPassword) {
//             setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
//             return;
//         }

//         if (formData.newPassword.length < 6) {
//             setError("Mật khẩu mới phải có ít nhất 6 ký tự");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // Gọi API để đổi mật khẩu
//             const response = await fetch("/api/auth/change-password", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     currentPassword: formData.currentPassword,
//                     newPassword: formData.newPassword,
//                     email: session?.user?.email,
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Đổi mật khẩu thất bại");
//             }

//             setSuccess("Đổi mật khẩu thành công!");
//             setFormData({
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             });
//         } catch (err) {
//             setError(err.message || "Có lỗi xảy ra khi đổi mật khẩu");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-md">
//                 <div className="flex justify-center">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
//                         <Lock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
//                     </div>
//                 </div>
//                 <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//                     Đổi mật khẩu
//                 </h2>
//                 <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
//                     Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
//                 </p>
//             </div>

//             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//                 <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
//                     <Link href="/admin" className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6">
//                         <ArrowLeft className="h-4 w-4 mr-1" />
//                         Quay lại trang chủ
//                     </Link>

//                     {error && (
//                         <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded">
//                             {error}
//                         </div>
//                     )}

//                     {success && (
//                         <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 px-4 py-3 rounded">
//                             {success}
//                         </div>
//                     )}

//                     <form className="space-y-6" onSubmit={handleSubmit}>
//                         <div>
//                             <label
//                                 htmlFor="currentPassword"
//                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//                             >
//                                 Mật khẩu hiện tại
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                                 <input
//                                     id="currentPassword"
//                                     name="currentPassword"
//                                     type={showCurrentPassword ? "text" : "password"}
//                                     required
//                                     value={formData.currentPassword}
//                                     onChange={handleChange}
//                                     className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                                 >
//                                     {showCurrentPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         <div>
//                             <label
//                                 htmlFor="newPassword"
//                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//                             >
//                                 Mật khẩu mới
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                                 <input
//                                     id="newPassword"
//                                     name="newPassword"
//                                     type={showNewPassword ? "text" : "password"}
//                                     required
//                                     value={formData.newPassword}
//                                     onChange={handleChange}
//                                     className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     onClick={() => setShowNewPassword(!showNewPassword)}
//                                 >
//                                     {showNewPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         <div>
//                             <label
//                                 htmlFor="confirmPassword"
//                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//                             >
//                                 Xác nhận mật khẩu mới
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                                 <input
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     required
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 >
//                                     {showConfirmPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         <div>
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isAdmin = session?.user?.role === 'admin';
    const isStaff = session?.user?.role === 'staff';

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && !isAdmin && !isStaff) {
            setError('Bạn không có quyền truy cập trang này.');
        }
    }, [status, session, router, isAdmin, isStaff]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isAdmin && !isStaff) {
            setError('Bạn không có quyền đổi mật khẩu.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới và xác nhận không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    email: session?.user?.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đổi mật khẩu thất bại');
            }

            setSuccess('Đổi mật khẩu thành công!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Đổi mật khẩu
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Link href={isAdmin ? "/admin" : "/staff"} className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Quay lại trang chủ
                    </Link>

                    {error && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mật khẩu hiện tại
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    required
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mật khẩu mới
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    required
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
