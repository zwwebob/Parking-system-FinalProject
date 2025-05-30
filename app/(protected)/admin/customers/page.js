'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import MainFooter from '@/components/layout/MainFooter';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCustomersPage() {
    const { data: session, status } = useSession();
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: '',
        gender: 'male',
        email: '',
        address: '',
        cccd: '',
        customerType: 'regular',
        vehicleType: '',
        licensePlate: '',
        vehicleName: '',
        ticketType: '',
        isVip: false,
    });
    const [editCustomer, setEditCustomer] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showVehicleInfo, setShowVehicleInfo] = useState(false);
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated') {
            fetchCustomers();
        }
    }, [status, router]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/customers', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch customers: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Không thể tải danh sách khách hàng: ' + error.message);
        }
    };

    const validateCustomer = (customer) => {
        if (!customer.firstName || !customer.lastName) return 'Vui lòng nhập họ và tên';
        if (!customer.phone || !/^0\d{9,10}$/.test(customer.phone)) return 'Số điện thoại phải có 10-11 chữ số và bắt đầu bằng 0';
        if (!customer.email || !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(customer.email)) return 'Email không hợp lệ';
        if (!customer.cccd || !/^\d{9,12}$/.test(customer.cccd)) return 'CCCD phải có 9-12 chữ số';
        if (!customer.birthDate) return 'Vui lòng chọn ngày sinh';
        if (!customer.address) return 'Vui lòng nhập địa chỉ';
        if (!['regular', 'vip'].includes(customer.customerType)) return 'Loại khách hàng không hợp lệ';
        return '';
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        const validationError = validateCustomer(newCustomer);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const customerResponse = await fetch('http://localhost:5001/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomer),
            });

            if (!customerResponse.ok) {
                const errorData = await customerResponse.json();
                throw new Error(errorData.error || 'Thêm khách hàng thất bại');
            }

            setNewCustomer({
                firstName: '',
                lastName: '',
                phone: '',
                birthDate: '',
                gender: 'male',
                email: '',
                address: '',
                cccd: '',
                customerType: 'regular',
                vehicleType: '',
                licensePlate: '',
                vehicleName: '',
                ticketType: '',
                isVip: false,
            });
            setError('');
            setShowModal(false);
            fetchCustomers();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditCustomer = async (e) => {
        e.preventDefault();
        const validationError = validateCustomer(newCustomer);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/customers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editCustomer.id, ...newCustomer }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Cập nhật khách hàng thất bại');
            }

            setNewCustomer({
                firstName: '',
                lastName: '',
                phone: '',
                birthDate: '',
                gender: 'male',
                email: '',
                address: '',
                cccd: '',
                customerType: 'regular',
                vehicleType: '',
                licensePlate: '',
                vehicleName: '',
                ticketType: '',
                isVip: false,
            });
            setEditCustomer(null);
            setError('');
            setShowModal(false);
            fetchCustomers();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteCustomer = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;

        try {
            const response = await fetch('http://localhost:5001/api/customers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Xóa khách hàng thất bại');
            }

            fetchCustomers();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/customers');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Tìm kiếm thất bại: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            const filteredCustomers = data.filter(customer =>
                (customer.firstName.toLowerCase() + ' ' + customer.lastName.toLowerCase()).includes(searchTerm.toLowerCase()) ||
                customer.cccd.includes(searchTerm) ||
                customer.phone.includes(searchTerm)
            );
            setCustomers(filteredCustomers);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error searching customers:', error);
            setError('Lỗi khi tìm kiếm: ' + error.message);
        }
    };

    const openAddModal = () => {
        const now = new Date();
        const currentDate = format(now, 'yyyy-MM-dd');
        setNewCustomer({
            firstName: '',
            lastName: '',
            phone: '',
            birthDate: currentDate,
            gender: 'male',
            email: '',
            address: '',
            cccd: '',
            customerType: 'regular',
            vehicleType: '',
            licensePlate: '',
            vehicleName: '',
            ticketType: '',
            isVip: false,
        });
        setEditCustomer(null);
        setShowModal(true);
    };

    const openEditModal = (customer) => {
        setNewCustomer({
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            phone: customer.phone || '',
            birthDate: customer.birthDate ? format(new Date(customer.birthDate), 'yyyy-MM-dd') : '',
            gender: customer.gender || 'male',
            email: customer.email || '',
            address: customer.address || '',
            cccd: customer.cccd || '',
            customerType: customer.customerType || 'regular',
            vehicleType: customer.vehicleType || '',
            licensePlate: customer.licensePlate || '',
            vehicleName: customer.vehicleName || '',
            ticketType: customer.ticketType || '',
            isVip: customer.isVip || false,
        });
        setEditCustomer(customer);
        setShowModal(true);
    };

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(customers.length / customersPerPage);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
                        <Link
                            href="/admin"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                        >
                            ← Quay lại
                        </Link>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        {/* <Link href="/admin/vehicles" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý xe
                        </Link> */}
                        <Link href="/admin/employees" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý nhân viên
                        </Link>
                        <Link href="/admin/customers" className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
                            Quản lý khách hàng
                        </Link>
                        <Link href="/admin/cards" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý thẻ
                        </Link>
                        <Link href="/admin/reports" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Báo cáo
                        </Link>
                        <Link href="/admin/statistics" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Thống kê
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm khách hàng mới</h2>
                        <Button
                            onClick={openAddModal}
                            className="bg-green-500 text-white hover:bg-green-600 transition"
                        >
                            Thêm khách hàng
                        </Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">DANH SÁCH KHÁCH HÀNG</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="mb-4 flex items-center space-x-4">
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm theo tên, CCCD hoặc SĐT"
                                className="flex-1"
                            />
                            <Button onClick={handleSearch} className="bg-green-500 hover:bg-green-600">
                                Tìm kiếm
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-200 text-gray-700">
                                        <TableHead className="text-center">Họ</TableHead>
                                        <TableHead className="text-center">Tên</TableHead>
                                        <TableHead className="text-center">Số điện thoại</TableHead>
                                        <TableHead className="text-center">Ngày sinh</TableHead>
                                        <TableHead className="text-center">Giới tính</TableHead>
                                        <TableHead className="text-center">Email</TableHead>
                                        <TableHead className="text-center">Địa chỉ</TableHead>
                                        <TableHead className="text-center">CCCD</TableHead>
                                        <TableHead className="text-center">Biển số xe</TableHead>
                                        <TableHead className="text-center">VIP</TableHead>
                                        <TableHead className="text-center">Sửa</TableHead>
                                        <TableHead className="text-center">Xóa</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="hover:bg-gray-50">
                                            <TableCell>{customer.firstName || '-'}</TableCell>
                                            <TableCell>{customer.lastName || '-'}</TableCell>
                                            <TableCell>{customer.phone || '-'}</TableCell>
                                            <TableCell>
                                                {customer.birthDate ? format(new Date(customer.birthDate), 'dd/MM/yyyy') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {customer.gender === 'male' ? 'Nam' : customer.gender === 'female' ? 'Nữ' : 'Khác'}
                                            </TableCell>
                                            <TableCell>{customer.email || '-'}</TableCell>
                                            <TableCell>{customer.address || '-'}</TableCell>
                                            <TableCell>{customer.cccd || '-'}</TableCell>
                                            <TableCell>{customer.licensePlate || '-'}</TableCell>
                                            <TableCell>{customer.isVip ? 'Có' : 'Không'}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center items-center space-x-2 ">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEditModal(customer)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Sửa"
                                                    >
                                                        <FaEdit size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDeleteCustomer(customer.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Xóa"
                                                    >
                                                        <FaTrash size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-center mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                                            isActive={false}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        >
                                            Prev
                                        </PaginationLink>
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(index + 1)}
                                                isActive={currentPage === index + 1}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                            isActive={false}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        >
                                            Next
                                        </PaginationLink>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl max-h-[70vh] overflow-y-auto">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                                    {editCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng'}
                                </h2>
                                {error && <p className="text-red-500 mb-6">{error}</p>}
                                <form onSubmit={editCustomer ? handleEditCustomer : handleAddCustomer} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Họ:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newCustomer.firstName}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Tên:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newCustomer.lastName}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Số điện thoại:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newCustomer.phone}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Ngày sinh:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={newCustomer.birthDate}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, birthDate: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Giới tính:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            value={newCustomer.gender}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Email:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={newCustomer.email}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Địa chỉ:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newCustomer.address}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            CCCD:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newCustomer.cccd}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, cccd: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Loại khách hàng:
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            value={newCustomer.customerType}
                                            onChange={(e) => {
                                                const type = e.target.value;
                                                setNewCustomer({ ...newCustomer, customerType: type, isVip: type === 'vip' });
                                            }}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="regular">Thường</option>
                                            <option value="vip">VIP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Thông tin xe:</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value="Nhấn vào icon để xem chi tiết"
                                                readOnly
                                                className="w-full p-3 border rounded-md bg-gray-100 cursor-pointer"
                                                onClick={() => setShowVehicleInfo(true)}
                                            />
                                            <span
                                                className="absolute right-3 top-3 cursor-pointer"
                                                onClick={() => setShowVehicleInfo(true)}
                                            >
                                                <FaInfoCircle size={20} className="text-blue-500" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
                                        >
                                            {editCustomer ? 'Cập nhật' : 'Thêm'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showVehicleInfo && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Thông tin xe</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Loại xe:</label>
                                        <select
                                            value={newCustomer.vehicleType}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, vehicleType: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Chọn loại xe</option>
                                            <option value="car">Ô tô</option>
                                            <option value="motorcycle">Xe máy</option>
                                            <option value="bicycle">Xe đạp</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Biển số xe:</label>
                                        <input
                                            type="text"
                                            value={newCustomer.licensePlate}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, licensePlate: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Tên xe:</label>
                                        <input
                                            type="text"
                                            value={newCustomer.vehicleName}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, vehicleName: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Loại vé:</label>
                                        <select
                                            value={newCustomer.ticketType}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, ticketType: e.target.value })}
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Chọn loại vé</option>
                                            <option value="day">Ngày</option>
                                            <option value="month">Tháng</option>
                                            {/* <option value="year">Năm</option> */}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowVehicleInfo(false)}
                                        className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MainFooter />
        </>
    );
}