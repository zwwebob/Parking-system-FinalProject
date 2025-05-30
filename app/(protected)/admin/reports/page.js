// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import MainFooter from '@/components/layout/MainFooter';

// // Đăng ký các thành phần cần thiết cho Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function AdminReportsPage() {
//     const { data: session, status } = useSession();
//     const [trafficReport, setTrafficReport] = useState([]);
//     const [revenueReport, setRevenueReport] = useState([]);
//     const [period, setPeriod] = useState('day'); // day, week, month
//     const [error, setError] = useState('');
//     const router = useRouter();

//     useEffect(() => {
//         if (status === 'unauthenticated') {
//             router.push('/login');
//         }

//         if (status === 'authenticated') {
//             fetchTrafficReport();
//             fetchRevenueReport();
//         }
//     }, [status, router, period]);

//     const fetchTrafficReport = async () => {
//         try {
//             const response = await fetch(`http://localhost:5001/api/reports/traffic?period=${period}`);
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch traffic report: ${response.status} ${response.statusText}`);
//             }
//             const data = await response.json();
//             setTrafficReport(data);
//         } catch (error) {
//             console.error('Error fetching traffic report:', error);
//             setError('Không thể tải báo cáo lưu lượng: ' + error.message);
//         }
//     };

//     const fetchRevenueReport = async () => {
//         try {
//             const response = await fetch(`http://localhost:5001/api/reports/revenue?period=${period}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch revenue report');
//             }
//             const data = await response.json();
//             setRevenueReport(data);
//         } catch (error) {
//             console.error('Error fetching revenue report:', error);
//             setError('Không thể tải báo cáo doanh thu: ' + error.message);
//         }
//     };

//     // Dữ liệu và cấu hình cho biểu đồ lưu lượng xe
//     const trafficChartData = {
//         labels: trafficReport.map((entry) => entry.time),
//         datasets: [
//             {
//                 label: 'Số xe vào',
//                 data: trafficReport.map((entry) => entry.in),
//                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1,
//             },
//             {
//                 label: 'Số xe ra',
//                 data: trafficReport.map((entry) => entry.out),
//                 backgroundColor: 'rgba(255, 99, 132, 0.6)',
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };

//     // Dữ liệu và cấu hình cho biểu đồ doanh thu
//     const revenueChartData = {
//         labels: revenueReport.map((entry) => entry.time),
//         datasets: [
//             {
//                 label: 'Doanh thu (VNĐ)',
//                 data: revenueReport.map((entry) => entry.revenue),
//                 backgroundColor: 'rgba(54, 162, 235, 0.6)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: (ctx) => ctx.chart.data.datasets[0].label.includes('Doanh thu') ? 'Báo cáo doanh thu' : 'Báo cáo lưu lượng xe',
//             },
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: 'Thời gian',
//                 },
//             },
//             y: {
//                 beginAtZero: true,
//                 title: {
//                     display: true,
//                     text: 'Số lượng',
//                 },
//             },
//         },
//     };

//     if (status === 'loading') {
//         return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
//     }

//     return (
//         <><div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-5xl mx-auto">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo</h1>
//                 <Link
//                     href="/admin"
//                     className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
//                 >
//                     ← Quay lại
//                 </Link>
//                 {/* Menu điều hướng dạng tab ngang */}
//                 <div className="flex space-x-4 mb-6">
//                     {/* <Link href="/admin/vehicles" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
//                         Quản lý xe
//                     </Link> */}
//                     <Link href="/admin/employees" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
//                         Quản lý nhân viên
//                     </Link>
//                     <Link href="/admin/customers" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
//                         Quản lý khách hàng
//                     </Link>
//                     <Link href="/admin/cards" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
//                         Quản lý thẻ
//                     </Link>
//                     <Link href="/admin/reports" className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
//                         Báo cáo
//                     </Link>
//                     <Link
//                         href="/admin/statistics"
//                         className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
//                     >
//                         Thống kê
//                     </Link>
//                 </div>

//                 <div className="mb-6">
//                     <label className="block text-gray-700 mb-2">Chọn khoảng thời gian:</label>
//                     <select
//                         value={period}
//                         onChange={(e) => setPeriod(e.target.value)}
//                         className="p-2 border rounded-md"
//                     >
//                         <option value="day">Theo ngày</option>
//                         <option value="week">Theo tuần</option>
//                         <option value="month">Theo tháng</option>
//                     </select>
//                 </div>

//                 {error && <p className="text-red-500 mb-4">{error}</p>}

//                 <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//                     <h2 className="text-xl font-semibold text-gray-700 mb-4">Báo cáo lưu lượng xe</h2>
//                     {trafficReport.length > 0 ? (
//                         <Bar data={trafficChartData} options={chartOptions} />
//                     ) : (
//                         <p>Không có dữ liệu để hiển thị.</p>
//                     )}
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-xl font-semibold text-gray-700 mb-4">Báo cáo doanh thu</h2>
//                     {revenueReport.length > 0 ? (
//                         <Bar data={revenueChartData} options={chartOptions} />
//                     ) : (
//                         <p>Không có dữ liệu để hiển thị.</p>
//                     )}
//                 </div>
//             </div>
//         </div><MainFooter></MainFooter></>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MainFooter from '@/components/layout/MainFooter';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminReportsPage() {
    const { data: session, status } = useSession();
    const [trafficReport, setTrafficReport] = useState([]);
    const [revenueReport, setRevenueReport] = useState([]);
    const [period, setPeriod] = useState('day'); // day, week, month
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        if (status === 'authenticated') {
            fetchTrafficReport();
            fetchRevenueReport();
        }
    }, [status, router, period]);

    const fetchTrafficReport = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/reports/traffic?period=${period}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch traffic report: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setTrafficReport(data);
        } catch (error) {
            console.error('Error fetching traffic report:', error);
            setError('Không thể tải báo cáo lưu lượng: ' + error.message);
        }
    };

    const fetchRevenueReport = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/reports/revenue?period=${period}`);
            if (!response.ok) {
                throw new Error('Failed to fetch revenue report');
            }
            const data = await response.json();
            setRevenueReport(data);
        } catch (error) {
            console.error('Error fetching revenue report:', error);
            setError('Không thể tải báo cáo doanh thu: ' + error.message);
        }
    };

    // Dữ liệu và cấu hình cho biểu đồ lưu lượng xe
    const trafficChartData = {
        labels: trafficReport.map((entry) => entry.time),
        datasets: [
            {
                label: 'Số xe vào',
                data: trafficReport.map((entry) => entry.in),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Số xe ra',
                data: trafficReport.map((entry) => entry.out),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu và cấu hình cho biểu đồ doanh thu
    const revenueChartData = {
        labels: revenueReport.map((entry) => entry.time),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: revenueReport.map((entry) => entry.revenue),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: (ctx) => ctx.chart.data.datasets[0].label.includes('Doanh thu') ? 'Báo cáo doanh thu' : 'Báo cáo lưu lượng xe',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số lượng',
                },
            },
        },
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Thêm flex container để căn chỉnh tiêu đề và nút */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Báo cáo</h1>
                        <Link
                            href="/admin"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                        >
                            ← Quay lại
                        </Link>
                    </div>
                    {/* Menu điều hướng dạng tab ngang */}
                    <div className="flex space-x-4 mb-6">
                        <Link href="/admin/employees" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý nhân viên
                        </Link>
                        <Link href="/admin/customers" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý khách hàng
                        </Link>
                        <Link href="/admin/cards" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý thẻ
                        </Link>
                        <Link href="/admin/reports" className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
                            Báo cáo
                        </Link>
                        <Link
                            href="/admin/statistics"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Thống kê
                        </Link>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Chọn khoảng thời gian:</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="day">Theo ngày</option>
                            <option value="week">Theo tuần</option>
                            <option value="month">Theo tháng</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Báo cáo lưu lượng xe</h2>
                        {trafficReport.length > 0 ? (
                            <Bar data={trafficChartData} options={chartOptions} />
                        ) : (
                            <p>Không có dữ liệu để hiển thị.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Báo cáo doanh thu</h2>
                        {revenueReport.length > 0 ? (
                            <Bar data={revenueChartData} options={chartOptions} />
                        ) : (
                            <p>Không có dữ liệu để hiển thị.</p>
                        )}
                    </div>
                </div>
            </div>
            <MainFooter></MainFooter>
        </>
    );
}