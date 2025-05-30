// 'use client';

// import { signIn } from 'next-auth/react';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const result = await signIn('credentials', {
//             redirect: false,
//             email,
//             password,
//         });

//         if (result.error) {
//             setError('Sai email hoặc mật khẩu!');
//         } else {
//             router.push('/admin');
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
//             <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl w-full max-w-xl">
//                 <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Đăng nhập vào tài khoản</h1>
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
//                         {error}
//                     </div>
//                 )}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-5">
//                         <label className="block text-gray-700 font-medium mb-2">Email</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
//                     >
//                         Đăng nhập
//                     </button>
//                 </form>

//                 {/* Dòng phân cách */}
//                 <div className="my-6 text-center text-gray-500">— hoặc —</div>

//                 {/* Nút đăng nhập với Google */}
//                 <button
//                     onClick={() => signIn('google')}
//                     className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200"
//                 >
//                     Đăng nhập với Google
//                 </button>

//                 <div className="mt-6 text-center text-gray-600 text-sm">
//                     <p>
//                         Chưa có tài khoản?{' '}
//                         <a href="/register" className="text-blue-600 font-medium hover:underline">
//                             Đăng ký ngay
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })
        if (result.error) {
            setError('Sai email hoặc mật khẩu!')
        } else {
            const session = await getSession()
            if (!session?.user?.role) {
                router.push('/unauthorized')
            } else if (session.user.role === 'admin') {
                router.push('/admin')
            } else if (session.user.role === 'staff') {
                router.push('/staff')
            } else {
                router.push('/unauthorized')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl w-full max-w-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Đăng nhập vào tài khoản
                </h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Đăng nhập
                    </button>
                </form>
                <div className="my-6 text-center text-gray-500">— hoặc —</div>
                <button
                    onClick={() => signIn('google')}
                    className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Đăng nhập với Google
                </button>
                <div className="mt-6 text-center text-gray-600 text-sm">
                    <p>
                        Chưa có tài khoản?{' '}
                        <a href="/register" className="text-blue-600 font-medium hover:underline">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
