'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
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

export default function AdminEmployeesPage() {
    const { data: session, status } = useSession();
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [manualEntry, setManualEntry] = useState({
        name: '',
        position: '',
        cccd: '',
        dateOfBirth: '',
        email: '',
        gender: 'male',
        phone: '',
        address: '',
        status: false,
    });
    const [manualError, setManualError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 10;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        if (status === 'authenticated') {
            fetchEmployees();
        }
    }, [status, router]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch employees: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setManualError('Không thể tải danh sách nhân viên: ' + error.message);
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        const { name, position, cccd, dateOfBirth, email, gender, phone, address, status } = manualEntry;

        if (!name || !position || !cccd || !dateOfBirth || !email || !gender || !phone || !address) {
            setManualError('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        if (!/^\d{9,12}$/.test(cccd)) {
            setManualError('CCCD phải có 9-12 chữ số!');
            return;
        }
        if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
            setManualError('Email không hợp lệ!');
            return;
        }
        if (!/^0\d{9,10}$/.test(phone)) {
            setManualError('Số điện thoại phải có 10-11 chữ số và bắt đầu bằng 0!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    position,
                    cccd,
                    dateOfBirth,
                    email,
                    gender,
                    phone,
                    address,
                    status,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Lưu nhân viên thất bại: ${errorData.error || 'Unknown error'}`);
            }

            setManualError('');
            setManualEntry({
                name: '',
                position: '',
                cccd: '',
                dateOfBirth: '',
                email: '',
                gender: 'male',
                phone: '',
                address: '',
                status: false,
            });
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            setManualError(error.message);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const { name, position, cccd, dateOfBirth, email, gender, phone, address, status } = manualEntry;

        if (!name || !position || !cccd || !dateOfBirth || !email || !gender || !phone || !address) {
            setManualError('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        if (!/^\d{9,12}$/.test(cccd)) {
            setManualError('CCCD phải có 9-12 chữ số!');
            return;
        }
        if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
            setManualError('Email không hợp lệ!');
            return;
        }
        if (!/^0\d{9,10}$/.test(phone)) {
            setManualError('Số điện thoại phải có 10-11 chữ số và bắt đầu bằng 0!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editEmployee.id,
                    name,
                    position,
                    cccd,
                    dateOfBirth,
                    email,
                    gender,
                    phone,
                    address,
                    status,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Cập nhật thất bại: ${errorData.error || 'Unknown error'}`);
            }

            setManualError('');
            setManualEntry({
                name: '',
                position: '',
                cccd: '',
                dateOfBirth: '',
                email: '',
                gender: 'male',
                phone: '',
                address: '',
                status: false,
            });
            setEditEmployee(null);
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            setManualError(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;

        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Xóa thất bại: ${errorData.error || 'Unknown error'}`);
            }

            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            setManualError('Lỗi khi xóa nhân viên: ' + error.message);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/employees');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Tìm kiếm thất bại: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            const filteredEmployees = data.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.cccd.includes(searchTerm)
            );
            setEmployees(filteredEmployees);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error searching employees:', error);
            setManualError('Lỗi khi tìm kiếm: ' + error.message);
        }
    };

    const openAddModal = () => {
        const now = new Date();
        const currentDate = format(now, 'yyyy-MM-dd');
        setManualEntry({
            name: '',
            position: '',
            cccd: '',
            dateOfBirth: currentDate,
            email: '',
            gender: 'male',
            phone: '',
            address: '',
            status: false,
        });
        setEditEmployee(null);
        setShowModal(true);
    };

    const openEditModal = (employee) => {
        setManualEntry({
            name: employee.name || '',
            position: employee.position || '',
            cccd: employee.cccd || '',
            dateOfBirth: employee.dateOfBirth ? format(new Date(employee.dateOfBirth), 'yyyy-MM-dd') : '',
            email: employee.email || '',
            gender: employee.gender || 'male',
            phone: employee.phone || '',
            address: employee.address || '',
            status: employee.status || false,
        });
        setEditEmployee(employee);
        setShowModal(true);
    };

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(employees.length / employeesPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý nhân viên</h1>
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
                        <Link href="/admin/employees" className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
                            Quản lý nhân viên
                        </Link>
                        <Link href="/admin/customers" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý khách hàng
                        </Link>
                        <Link href="/admin/cards" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Quản lý thẻ
                        </Link>
                        <Link href="/admin/reports" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg">
                            Báo cáo
                        </Link>
                        <Link
                            href="/admin/statistics"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Thống kê
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm nhân viên mới</h2>
                        <button
                            onClick={openAddModal}
                            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
                        >
                            Thêm nhân viên
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">DANH SÁCH NHÂN VIÊN</h2>
                        {manualError && <p className="text-red-500 mb-4">{manualError}</p>}
                        <div className="mb-4 flex items-center space-x-4">
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm theo tên hoặc CCCD"
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
                                        <TableHead className="text-center">Họ tên</TableHead>
                                        <TableHead className="text-center">Chức vụ</TableHead>
                                        <TableHead className="text-center">CCCD</TableHead>
                                        <TableHead className="text-center">Ngày sinh</TableHead>
                                        <TableHead className="text-center">Email</TableHead>
                                        <TableHead className="text-center">Giới tính</TableHead>
                                        <TableHead className="text-center">Số điện thoại</TableHead>
                                        <TableHead className="text-center">Địa chỉ</TableHead>
                                        <TableHead className="text-center">Trạng thái</TableHead>
                                        <TableHead className="text-center">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentEmployees.map((employee) => (
                                        <TableRow key={employee.id} className="hover:bg-gray-50">
                                            <TableCell>{employee.name || '-'}</TableCell>
                                            <TableCell>{employee.position || '-'}</TableCell>
                                            <TableCell>{employee.cccd || '-'}</TableCell>
                                            <TableCell>
                                                {employee.dateOfBirth ? format(new Date(employee.dateOfBirth), 'dd/MM/yyyy') : '-'}
                                            </TableCell>
                                            <TableCell>{employee.email || '-'}</TableCell>
                                            <TableCell>
                                                {employee.gender === 'male' ? 'Nam' : employee.gender === 'female' ? 'Nữ' : 'Khác'}
                                            </TableCell>
                                            <TableCell>{employee.phone || '-'}</TableCell>
                                            <TableCell>{employee.address || '-'}</TableCell>
                                            <TableCell>{employee.status ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEditModal(employee)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Sửa"
                                                    >
                                                        <FaEdit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(employee.id)}
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
                                            onClick={() => handlePreviousPage()}
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
                                            onClick={() => handleNextPage()}
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
                            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                    {editEmployee ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
                                </h2>
                                {manualError && <p className="text-red-500 mb-4">{manualError}</p>}
                                <form onSubmit={editEmployee ? handleEditSubmit : handleManualSubmit} className="space-y-4">
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Họ tên:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.name}
                                                onChange={(e) => setManualEntry({ ...manualEntry, name: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Chức vụ:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.position}
                                                onChange={(e) => setManualEntry({ ...manualEntry, position: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">CCCD:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.cccd}
                                                onChange={(e) => setManualEntry({ ...manualEntry, cccd: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Ngày sinh:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="date"
                                                value={manualEntry.dateOfBirth}
                                                onChange={(e) => setManualEntry({ ...manualEntry, dateOfBirth: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Email:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="email"
                                                value={manualEntry.email}
                                                onChange={(e) => setManualEntry({ ...manualEntry, email: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Giới tính:<span className="text-red-500 ml-1">*</span></label>
                                            <select
                                                value={manualEntry.gender}
                                                onChange={(e) => setManualEntry({ ...manualEntry, gender: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Số điện thoại:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.phone}
                                                onChange={(e) => setManualEntry({ ...manualEntry, phone: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Địa chỉ:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.address}
                                                onChange={(e) => setManualEntry({ ...manualEntry, address: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">Trạng thái:<span className="text-red-500 ml-1">*</span></label>
                                            <select
                                                value={manualEntry.status}
                                                onChange={(e) => setManualEntry({ ...manualEntry, status: e.target.value === 'true' })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            >
                                                <option value={true}>Hoạt động</option>
                                                <option value={false}>Không hoạt động</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                                        >
                                            Quay lại
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                                        >
                                            Lưu thông tin
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MainFooter />
        </>
    );
}