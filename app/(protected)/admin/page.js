import {
    Users,
    CreditCard,
    FileBarChart2,
    BarChart3,
    UserCog,
} from "lucide-react";
import MainFooter from "@/components/layout/MainFooter";

const features = [
    {
        name: "Quản lý nhân viên",
        href: "/admin/employees",
        color: "bg-green-500/90 hover:bg-green-600/90",
        icon: UserCog,
        desc: "Quản lý tài khoản nhân viên",
    },
    {
        name: "Quản lý khách hàng",
        href: "/admin/customers",
        color: "bg-yellow-500/90 hover:bg-yellow-600/90",
        icon: Users,
        desc: "Quản lý thông tin khách hàng",
    },
    {
        name: "Quản lý thẻ",
        href: "/admin/cards",
        color: "bg-indigo-500/90 hover:bg-indigo-600/90",
        icon: CreditCard,
        desc: "Quản lý thẻ gửi xe và thanh toán",
    },
    {
        name: "Báo cáo",
        href: "/admin/reports",
        color: "bg-red-500/90 hover:bg-red-600/90",
        icon: FileBarChart2,
        desc: "Xem và xuất báo cáo hệ thống",
    },
    {
        name: "Thống kê",
        href: "/admin/statistics",
        color: "bg-purple-500/90 hover:bg-purple-600/90",
        icon: BarChart3,
        desc: "Phân tích dữ liệu hệ thống",
    },
];

export default function AdminDashboard() {
    return (
        <>
            <main className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white">
                <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-black/70 via-blue-900/70 to-transparent" />

                <section className="flex-grow p-10 max-w-4xl mx-auto flex flex-col">
                    <header className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                            Trang Quản Trị Admin
                        </h1>
                        <p className="mt-4 text-lg text-blue-200 max-w-xl mx-auto">
                            Chào mừng đến với hệ thống quản lý SmartParking. Vui lòng chọn một chức năng bên dưới.
                        </p>
                    </header>

                    <div className="flex flex-wrap justify-center gap-6">
                        {features.map(({ name, desc, href, color, icon: Icon }) => (
                            <a
                                key={name}
                                href={href}
                                className={`flex flex-col items-center justify-center text-center rounded-2xl w-48 h-52 px-4 py-6 text-white shadow-lg transform transition hover:scale-105 hover:brightness-110 duration-300 ${color}`}
                            >
                                <Icon size={36} />
                                <h2 className="mt-3 text-lg font-semibold">{name}</h2>
                                <p className="mt-1 text-sm opacity-90">{desc}</p>
                            </a>
                        ))}
                    </div>

                </section>

                <MainFooter />
            </main>

        </>
    );
}
