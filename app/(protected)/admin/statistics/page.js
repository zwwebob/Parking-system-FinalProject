// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { FaCar, FaParking, FaChartLine, FaSignOutAlt, FaMoneyBillWave } from 'react-icons/fa';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import MainFooter from '@/components/layout/MainFooter';

// // Đăng ký các thành phần của Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function StatisticsPage() {
//     const { data: session, status } = useSession();
//     const [vehicles, setVehicles] = useState([]);
//     const router = useRouter();

//     // Trạng thái cho biểu đồ
//     const [typeChartData, setTypeChartData] = useState({ labels: [], datasets: [] });
//     const [revenueChartData, setRevenueChartData] = useState({ labels: [], datasets: [] });

//     useEffect(() => {
//         if (status === 'unauthenticated') {
//             router.push('/login');
//         }

//         if (status === 'authenticated') {
//             const fetchVehicles = async () => {
//                 try {
//                     const response = await fetch('http://localhost:5001/api/vehicles');
//                     if (!response.ok) throw new Error('Không thể tải dữ liệu');
//                     const data = await response.json();
//                     setVehicles(data);

//                     // Cập nhật biểu đồ phân bố loại xe
//                     const motorcycles = data.filter((v) => v.vehicleType === 'motorcycle').length;
//                     const cars = data.filter((v) => v.vehicleType === 'car').length;
//                     setTypeChartData({
//                         labels: ['Xe máy', 'Ô tô'],
//                         datasets: [
//                             {
//                                 label: 'Số lượng xe',
//                                 data: [motorcycles, cars],
//                                 backgroundColor: ['#4ADE80', '#3B82F6'],
//                                 borderColor: ['#22C55E', '#2563EB'],
//                                 borderWidth: 1,
//                             },
//                         ],
//                     });

//                     // Cập nhật biểu đồ doanh thu theo ngày
//                     const vehiclesWithExit = data.filter((v) => v.timeOut);
//                     const dates = [...new Set(vehiclesWithExit.map((v) => format(new Date(v.timeOut), 'dd/MM/yyyy')))];
//                     const revenueByDate = dates.map((date) =>
//                         vehiclesWithExit
//                             .filter((v) => format(new Date(v.timeOut), 'dd/MM/yyyy') === date)
//                             .reduce((sum, v) => sum + (v.fee || 0), 0)
//                     );

//                     setRevenueChartData({
//                         labels: dates,
//                         datasets: [
//                             {
//                                 label: 'Doanh thu (VNĐ)',
//                                 data: revenueByDate,
//                                 backgroundColor: '#FBBF24',
//                                 borderColor: '#F59E0B',
//                                 borderWidth: 1,
//                             },
//                         ],
//                     });
//                 } catch (error) {
//                     console.error('Error fetching vehicles:', error);
//                 }
//             };
//             fetchVehicles();
//         }
//     }, [status, router]);

//     // Tính toán số liệu thống kê
//     const totalVehicles = vehicles.length;
//     const vehiclesIn = vehicles.filter((vehicle) => !vehicle.timeOut).length;
//     const vehiclesOut = vehicles.filter((vehicle) => vehicle.timeOut).length;
//     const totalRevenue = vehicles.reduce((sum, vehicle) => sum + (vehicle.fee || 0), 0);
//     const availableSpots = 50 - vehiclesIn; // Giả lập tổng số chỗ là 50

//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: { position: 'top' },
//             title: { display: true },
//         },
//     };

//     if (status === 'loading') {
//         return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
//     }

//     return (
//         <><div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <div className="flex items-center space-x-3">
//                         <FaChartLine className="text-4xl text-blue-600" />
//                         <h1 className="text-3xl font-bold text-gray-800">Thống kê</h1>
//                         <Link
//                             href="/admin"
//                             className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
//                         >
//                             ← Quay lại
//                         </Link>
//                     </div>
//                     {/* <button
//         onClick={() => signOut({ callbackUrl: '/login' })}
//         className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//     >
//         <FaSignOutAlt />
//         <span>Đăng xuất</span>
//     </button> */}
//                 </div>

//                 {/* Thanh điều hướng */}
//                 <div className="flex space-x-4 mb-6">
//                     {/* <Link
//                         href="/admin/vehicles"
//                         className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
//                     >
//                         Quản lý xe
//                     </Link> */}
//                     <Link
//                         href="/admin/employees"
//                         className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
//                     >
//                         Quản lý nhân viên
//                     </Link>
//                     <Link
//                         href="/admin/customers"
//                         className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
//                     >
//                         Quản lý khách hàng
//                     </Link>
//                     <Link
//                         href="/admin/cards"
//                         className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
//                     >
//                         Quản lý thẻ
//                     </Link>
//                     <Link
//                         href="/admin/reports"
//                         className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
//                     >
//                         Báo cáo
//                     </Link>
//                     <Link
//                         href="/admin/statistics"
//                         className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
//                     >
//                         Thống kê
//                     </Link>
//                 </div>

//                 {/* Thống kê nhanh */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
//                         <FaCar className="text-4xl text-blue-500" />
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-700">Tổng số xe</h2>
//                             <p className="text-2xl font-bold text-blue-600">{totalVehicles}</p>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
//                         <FaParking className="text-4xl text-green-500" />
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-700">Xe đang đỗ</h2>
//                             <p className="text-2xl font-bold text-green-600">{vehiclesIn}</p>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
//                         <FaChartLine className="text-4xl text-yellow-500" />
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-700">Chỗ trống</h2>
//                             <p className="text-2xl font-bold text-yellow-600">{availableSpots}</p>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
//                         <FaMoneyBillWave className="text-4xl text-purple-500" />
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-700">Tổng doanh thu</h2>
//                             <p className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString()} VNĐ</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Biểu đồ phân bố loại xe */}
//                 <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
//                     <h2 className="text-xl font-semibold text-gray-700 mb-4">Phân bố loại xe</h2>
//                     <div className="max-w-2xl mx-auto">
//                         <Bar
//                             data={typeChartData}
//                             options={{
//                                 ...chartOptions,
//                                 plugins: {
//                                     ...chartOptions.plugins,
//                                     title: { display: true, text: 'Phân bố loại xe' },
//                                 },
//                             }} />
//                     </div>
//                 </div>

//                 {/* Biểu đồ doanh thu theo ngày */}
//                 <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
//                     <h2 className="text-xl font-semibold text-gray-700 mb-4">Doanh thu theo ngày</h2>
//                     <div className="max-w-4xl mx-auto">
//                         <Bar
//                             data={revenueChartData}
//                             options={{
//                                 ...chartOptions,
//                                 plugins: {
//                                     ...chartOptions.plugins,
//                                     title: { display: true, text: 'Doanh thu theo ngày' },
//                                 },
//                             }} />
//                     </div>
//                 </div>

//                 {/* Danh sách xe đã ra */}
//                 <div className="bg-white p-6 rounded-lg shadow-lg">
//                     <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách xe đã ra</h2>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full bg-white border">
//                             <thead>
//                                 <tr className="bg-gray-200 text-gray-700">
//                                     <th className="py-2 px-4 border">Biển số</th>
//                                     <th className="py-2 px-4 border">Loại xe</th>
//                                     <th className="py-2 px-4 border">Thời gian vào</th>
//                                     <th className="py-2 px-4 border">Thời gian ra</th>
//                                     <th className="py-2 px-4 border">Phí (VNĐ)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {vehicles
//                                     .filter((vehicle) => vehicle.timeOut)
//                                     .map((vehicle) => (
//                                         <tr key={vehicle._id} className="text-gray-600">
//                                             <td className="py-2 px-4 border">{vehicle.licensePlate}</td>
//                                             <td className="py-2 px-4 border">{vehicle.vehicleType === 'car' ? 'Ô tô' : 'Xe máy'}</td>
//                                             <td className="py-2 px-4 border">{format(new Date(vehicle.timeIn), 'dd/MM/yyyy HH:mm')}</td>
//                                             <td className="py-2 px-4 border">{format(new Date(vehicle.timeOut), 'dd/MM/yyyy HH:mm')}</td>
//                                             <td className="py-2 px-4 border">{vehicle.fee.toLocaleString()}</td>
//                                         </tr>
//                                     ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div><MainFooter></MainFooter></>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaCar, FaParking, FaChartLine, FaSignOutAlt, FaMoneyBillWave, FaSync } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MainFooter from '@/components/layout/MainFooter';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsPage() {
    const { data: session, status } = useSession();
    const [vehicles, setVehicles] = useState([]);
    const router = useRouter();

    // Trạng thái cho biểu đồ
    const [typeChartData, setTypeChartData] = useState({ labels: [], datasets: [] });
    const [revenueChartData, setRevenueChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated') {
            fetchVehicles();
        }
    }, [status, router]);

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/vehicles');
            if (!response.ok) throw new Error('Không thể tải dữ liệu');
            const data = await response.json();
            setVehicles(data);
            updateCharts(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    // Hàm cập nhật biểu đồ
    const updateCharts = (data) => {
        // Cập nhật biểu đồ phân bố loại xe
        const motorcycles = data.filter((v) => v.vehicleType === 'motorcycle').length;
        const cars = data.filter((v) => v.vehicleType === 'car').length;
        setTypeChartData({
            labels: ['Xe máy', 'Ô tô'],
            datasets: [
                {
                    label: 'Số lượng xe',
                    data: [motorcycles, cars],
                    backgroundColor: ['#4ADE80', '#3B82F6'],
                    borderColor: ['#22C55E', '#2563EB'],
                    borderWidth: 1,
                },
            ],
        });

        // Cập nhật biểu đồ doanh thu theo ngày
        const vehiclesWithExit = data.filter((v) => v.timeOut);
        const dates = [...new Set(vehiclesWithExit.map((v) => format(new Date(v.timeOut), 'dd/MM/yyyy')))];
        const revenueByDate = dates.map((date) =>
            vehiclesWithExit
                .filter((v) => format(new Date(v.timeOut), 'dd/MM/yyyy') === date)
                .reduce((sum, v) => sum + (v.fee || 0), 0)
        );

        setRevenueChartData({
            labels: dates,
            datasets: [
                {
                    label: 'Doanh thu (VNĐ)',
                    data: revenueByDate,
                    backgroundColor: '#FBBF24',
                    borderColor: '#F59E0B',
                    borderWidth: 1,
                },
            ],
        });
    };

    // Tính toán số liệu thống kê
    const totalVehicles = vehicles.length;
    const vehiclesIn = vehicles.filter((vehicle) => !vehicle.timeOut).length;
    const vehiclesOut = vehicles.filter((vehicle) => vehicle.timeOut).length;
    const totalRevenue = vehicles.reduce((sum, vehicle) => sum + (vehicle.fee || 0), 0);
    const availableSpots = 50 - vehiclesIn; // Giả lập tổng số chỗ là 50

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true },
        },
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <FaChartLine className="text-4xl text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-800">Thống kê</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchVehicles}
                                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                <FaSync />
                                <span>Làm mới</span>
                            </button>
                            <Link
                                href="/admin"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                            >
                                ← Quay lại
                            </Link>
                        </div>
                    </div>

                    {/* Thanh điều hướng */}
                    <div className="flex space-x-4 mb-6">
                        <Link
                            href="/admin/employees"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Quản lý nhân viên
                        </Link>
                        <Link
                            href="/admin/customers"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Quản lý khách hàng
                        </Link>
                        <Link
                            href="/admin/cards"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Quản lý thẻ
                        </Link>
                        <Link
                            href="/admin/reports"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Báo cáo
                        </Link>
                        <Link
                            href="/admin/statistics"
                            className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
                        >
                            Thống kê
                        </Link>
                    </div>

                    {/* Thống kê nhanh */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
                            <FaCar className="text-4xl text-blue-500" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Tổng số xe</h2>
                                <p className="text-2xl font-bold text-blue-600">{totalVehicles}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
                            <FaParking className="text-4xl text-green-500" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Xe đang đỗ</h2>
                                <p className="text-2xl font-bold text-green-600">{vehiclesIn}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
                            <FaChartLine className="text-4xl text-yellow-500" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Chỗ trống</h2>
                                <p className="text-2xl font-bold text-yellow-600">{availableSpots}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition">
                            <FaMoneyBillWave className="text-4xl text-purple-500" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Tổng doanh thu</h2>
                                <p className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString()} VNĐ</p>
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ phân bố loại xe */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Phân bố loại xe</h2>
                        <div className="max-w-2xl mx-auto">
                            <Bar
                                data={typeChartData}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: { display: true, text: 'Phân bố loại xe' },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Biểu đồ doanh thu theo ngày */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Doanh thu theo ngày</h2>
                        <div className="max-w-4xl mx-auto">
                            <Bar
                                data={revenueChartData}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: { display: true, text: 'Doanh thu theo ngày' },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Danh sách xe đã ra */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách xe đã ra</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700">
                                        <th className="py-2 px-4 border">Biển số</th>
                                        <th className="py-2 px-4 border">Loại xe</th>
                                        <th className="py-2 px-4 border">Thời gian vào</th>
                                        <th className="py-2 px-4 border">Thời gian ra</th>
                                        <th className="py-2 px-4 border">Phí (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles
                                        .filter((vehicle) => vehicle.timeOut)
                                        .map((vehicle) => (
                                            <tr key={vehicle._id} className="text-gray-600">
                                                <td className="py-2 px-4 border">{vehicle.licensePlate}</td>
                                                <td className="py-2 px-4 border">{vehicle.vehicleType === 'car' ? 'Ô tô' : 'Xe máy'}</td>
                                                <td className="py-2 px-4 border">{format(new Date(vehicle.timeIn), 'dd/MM/yyyy HH:mm')}</td>
                                                <td className="py-2 px-4 border">{format(new Date(vehicle.timeOut), 'dd/MM/yyyy HH:mm')}</td>
                                                <td className="py-2 px-4 border">{vehicle.fee.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <MainFooter></MainFooter>
        </>
    );
}