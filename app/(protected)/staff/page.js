// import { Car, Users } from "lucide-react";
// import MainFooter from '@/components/layout/MainFooter';

// const features = [
//     {
//         name: "Quản lý gửi xe",
//         href: "/staff/vehicles",
//         color: "bg-blue-500/90 hover:bg-blue-600/90",
//         icon: Car,
//         desc: "Quản lý thông tin xe và bãi đỗ"
//     },
//     {
//         name: "Quản lý khách hàng",
//         href: "/staff/customers",
//         color: "bg-yellow-500/90 hover:bg-yellow-600/90",
//         icon: Users,
//         desc: "Quản lý thông tin khách hàng"
//     },
// ];

// export default function StaffDashboard() {
//     return (
//         <>
//             <main className="relative p-10 min-h-screen bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white">
//                 <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-black/70 via-blue-900/70 to-transparent" />

//                 <header className="max-w-4xl mx-auto text-center mb-12">
//                     <h1 className="text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
//                         Trang Quản Trị Nhân Viên
//                     </h1>
//                     <p className="mt-4 text-lg text-blue-200 max-w-xl mx-auto">
//                         Chào mừng đến với hệ thống quản lý SmartParking. Vui lòng chọn một chức năng bên dưới.
//                     </p>
//                 </header>

//                 <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
//                     {features.map(({ name, href, color, icon: Icon }) => (
//                         <a
//                             key={name}
//                             href={href}
//                             className={`rounded-2xl p-8 shadow-lg transform transition hover:scale-105 hover:brightness-110 hover:shadow-${color.split("/")[0]} duration-300 flex flex-col items-start space-y-5 ${color} bg-opacity-90`}
//                         >
//                             <div className="transition-transform duration-300 group-hover:scale-110">
//                                 <Icon size={44} />
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-semibold drop-shadow-sm">{name}</h2>
//                                 <p className="text-md mt-2 opacity-90 drop-shadow">{`Đi đến ${name.toLowerCase()}`}</p>
//                             </div>
//                         </a>
//                     ))}
//                 </section>
//             </main>
//             <MainFooter />
//         </>
//     );
// }
import { Car, Users } from "lucide-react";
import MainFooter from '@/components/layout/MainFooter';

const features = [
    {
        name: "Quản lý gửi xe",
        href: "/staff/vehicles",
        color: "bg-blue-500/90 hover:bg-blue-600/90",
        icon: Car,
        desc: "Quản lý thông tin xe và bãi đỗ"
    },
    {
        name: "Quản lý khách hàng",
        href: "/staff/customers",
        color: "bg-yellow-500/90 hover:bg-yellow-600/90",
        icon: Users,
        desc: "Quản lý thông tin khách hàng"
    },
];

export default function StaffDashboard() {
    return (
        <>
            <main className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white">
                <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-black/70 via-blue-900/70 to-transparent" />

                <section className="flex-grow p-10 max-w-4xl mx-auto flex flex-col">
                    <header className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                            Trang Quản Trị Nhân Viên
                        </h1>
                        <p className="mt-4 text-lg text-blue-200 max-w-xl mx-auto">
                            Chào mừng đến với hệ thống quản lý SmartParking. Vui lòng chọn một chức năng bên dưới.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-grow">
                        {features.map(({ name, desc, href, color, icon: Icon }) => (
                            <a
                                key={name}
                                href={href}
                                className={`rounded-2xl h-52 w-full flex flex-col justify-center items-center text-center px-6 py-4 text-white shadow-lg transform transition hover:scale-105 hover:brightness-110 duration-300 ${color}`}
                            >
                                <Icon size={40} />
                                <h2 className="text-lg font-semibold mt-3">{name}</h2>
                                <p className="text-sm mt-1 opacity-90">{desc}</p>
                            </a>
                        ))}
                    </div>


                </section>

                <MainFooter />
            </main>
        </>
    );
}
