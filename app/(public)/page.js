'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-300 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Giải pháp đỗ xe thông minh</h1>
        <p className="text-lg md:text-xl mb-6">Tìm kiếm, đặt chỗ và quản lý bãi đỗ xe dễ dàng hơn bao giờ hết</p>
        <Link href="/register">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
            Bắt đầu ngay
          </button>
        </Link>
      </section>

      {/* Về chúng tôi */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Về SMARTPARKING</h2>
        <p className="text-gray-600 text-lg">
          SMARTPARKING giúp người dùng dễ dàng tìm kiếm và đặt chỗ đỗ xe trong thành phố thông minh. Giảm tắc nghẽn,
          tiết kiệm thời gian và đảm bảo an toàn cho phương tiện của bạn.
        </p>
      </section>

      {/* Tính năng nổi bật */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Tìm kiếm nhanh chóng</h3>
            <p className="text-gray-600">Dễ dàng tìm kiếm các bãi đỗ xe gần bạn chỉ trong vài giây.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Đặt chỗ trước</h3>
            <p className="text-gray-600">Giữ chỗ đỗ xe trước khi bạn đến – không còn lo hết chỗ.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Thanh toán linh hoạt</h3>
            <p className="text-gray-600">Hỗ trợ nhiều hình thức thanh toán tiện lợi và an toàn.</p>
          </div>
        </div>
      </section>

      {/* Hướng dẫn sử dụng */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">Cách hoạt động</h2>
        <ol className="space-y-4 text-lg text-gray-700">
          <li>1. Đăng ký tài khoản hoặc đăng nhập</li>
          <li>2. Tìm kiếm bãi đỗ xe gần bạn</li>
          <li>3. Đặt chỗ và thanh toán trực tuyến</li>
          <li>4. Nhận hướng dẫn và đỗ xe an toàn</li>
        </ol>
      </section>

      {/* Đăng ký nhận tin */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Nhận thông tin mới nhất từ chúng tôi</h2>
        <p className="text-gray-700 mb-6">Đăng ký email để không bỏ lỡ bất kỳ ưu đãi hay cập nhật mới nào</p>
        <form className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
          <input type="email" placeholder="Nhập email của bạn" className="p-3 border rounded-md w-full" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            Đăng ký
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 SMARTPARKING. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/about">Giới Thiệu</Link>
            <Link href="/services">Dịch Vụ</Link>
            <Link href="/pricing">Giá Cả</Link>
            <Link href="/contact">Liên hệ</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
