// export default function PublicLayout({ children }) {
//     return (
//         <>
//             <nav className="bg-white shadow p-4">
//                 <a href="/" className="text-xl font-bold">SMARTPARKING</a>
//             </nav>
//             <main>{children}</main>
//         </>
//     )
// }

export default function PublicLayout({ children }) {
    return (
        <>
            <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between font-medium">
                <a href="/" className="text-2xl font-bold text-black">SMARTPARKING</a>
                <div className="space-x-4">
                    <a href="/login" className="text-gray-700 hover:text-black">Đăng nhập</a>
                    <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Đăng ký</a>
                </div>
            </nav>
            <main>{children}</main>
        </>
    )
}


