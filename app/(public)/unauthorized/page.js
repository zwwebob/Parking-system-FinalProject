export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-5xl font-bold mb-4">403</h1>
            <p className="text-xl mb-6">Bạn không có quyền truy cập vào trang này.</p>
            <a
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Quay về đăng nhập
            </a>
        </div>
    );
}
