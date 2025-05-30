// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';

// export default function RegisterPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [name, setName] = useState('');
//     const [error, setError] = useState('');
//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('/api/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password, name }),
//             });
//             if (!response.ok) throw new Error('Đăng ký thất bại');
//             router.push('/login');
//         } catch (err) {
//             setError('Đăng ký thất bại! Email có thể đã tồn tại.');
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
//             <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl w-full max-w-xl">
//                 <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tạo tài khoản</h1>
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
//                         {error}
//                     </div>
//                 )}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Họ tên:</label>
//                         <input
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Email:</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 mb-2">Mật khẩu:</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                         />
//                     </div>
//                     <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">
//                         Đăng ký
//                     </button>
//                 </form>

//                 {/* Dòng phân cách */}
//                 <div className="my-6 text-center text-gray-500">— hoặc —</div>

//                 {/* Nút đăng ký bằng Google */}
//                 <button
//                     onClick={() => signIn('google')}
//                     className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200"
//                 >
//                     Đăng ký bằng Google
//                 </button>

//                 <div className="mt-6 text-center text-gray-600 text-sm">
//                     <p>
//                         Đã có tài khoản?{' '}
//                         <a href="/login" className="text-blue-600 font-medium hover:underline">
//                             Đăng nhập
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
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, role: 'staff' }),
            })
            if (!response.ok) throw new Error()
            router.push('/login')
        } catch {
            setError('Đăng ký thất bại! Email có thể đã tồn tại.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl w-full max-w-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tạo tài khoản</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Họ tên:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Mật khẩu:</label>
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
                        Đăng ký
                    </button>
                </form>
                <div className="my-6 text-center text-gray-500">— hoặc —</div>
                <button
                    onClick={() => signIn('google')}
                    className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Đăng ký bằng Google
                </button>
                <div className="mt-6 text-center text-gray-600 text-sm">
                    <p>
                        Đã có tài khoản?{' '}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                            Đăng nhập
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
