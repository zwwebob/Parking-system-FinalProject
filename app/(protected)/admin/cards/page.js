'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
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

export default function AdminCardsPage() {
    const { data: session, status } = useSession();
    const [cards, setCards] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [manualEntry, setManualEntry] = useState({
        customerId: '',
        vehicleId: '',
        pricePerDay: '',
        phoneNumber: '',
        startDate: '',
        endDate: '',
        totalPrice: '',
        ticketType: '',
        isVip: false,
        xeKhachDi: '',
        isTemporary: false,
        temporaryCustomer: {
            name: '',
            phone: '',
            licensePlate: '',
            vehicleName: '',
            vehicleType: 'motorcycle',
        },
    });
    const [manualError, setManualError] = useState('');
    const [vehicleError, setVehicleError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editCard, setEditCard] = useState(null);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [searchCustomerTerm, setSearchCustomerTerm] = useState('');
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 10;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        if (status === 'authenticated') {
            fetchCards();
            fetchEmployees();
            fetchCustomers();
            fetchVehicles();
        }
    }, [status, router]);

    const fetchCards = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/cards', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch cards');
            const data = await response.json();
            setCards(data);
        } catch (error) {
            console.error('Error fetching cards:', error);
            setManualError('Không thể tải danh sách thẻ: ' + error.message);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/customers', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/vehicles', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Không thể tải danh sách xe');
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setVehicles(data);
                setVehicleError('');
            } else {
                setVehicles([]);
                setVehicleError('Không có dữ liệu xe từ máy chủ.');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setVehicles([]);
            setVehicleError('Lỗi khi tải danh sách xe: ' + error.message);
        }
    };

    const calculateTotalPrice = () => {
        const { pricePerDay, startDate, isVip, isTemporary } = manualEntry;
        if (pricePerDay && startDate) {
            let days = isTemporary ? 1 : 30; // 1 day for temporary, 30 days for registered
            const total = isVip ? 0 : parseFloat(pricePerDay) * days;
            setManualEntry(prev => ({
                ...prev,
                totalPrice: total.toString(),
                ticketType: isTemporary ? 'Ngày' : 'Tháng' // Auto-set ticket type
            }));
        } else {
            setManualEntry(prev => ({ ...prev, totalPrice: '' }));
        }
    };

    const calculateEndDate = () => {
        const { startDate, isTemporary } = manualEntry;
        if (startDate) {
            const start = new Date(startDate);
            let endDate;
            if (isTemporary) {
                endDate = start.toISOString().split('T')[0]; // Same as startDate for temporary
            } else {
                const end = new Date(start);
                end.setDate(start.getDate() + 30); // 30 days for registered
                endDate = end.toISOString().split('T')[0];
            }
            setManualEntry(prev => ({ ...prev, endDate }));
        } else {
            setManualEntry(prev => ({ ...prev, endDate: '' }));
        }
    };

    // Thêm useEffect để tự động tính toán khi các giá trị thay đổi
    useEffect(() => {
        calculateTotalPrice();
        calculateEndDate();
    }, [manualEntry.pricePerDay, manualEntry.startDate, manualEntry.isVip, manualEntry.isTemporary]);

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        const { customerId, vehicleId, pricePerDay, startDate, endDate, totalPrice, ticketType, isVip, xeKhachDi, isTemporary, temporaryCustomer } = manualEntry;

        const parsedPricePerDay = parseFloat(pricePerDay);
        if (isNaN(parsedPricePerDay)) {
            setManualError('Giá vé/ngày phải là số hợp lệ!');
            return;
        }

        if (!vehicleId || !startDate || !endDate || !totalPrice || !ticketType) {
            setManualError('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        if (isTemporary && (!temporaryCustomer.name || !temporaryCustomer.licensePlate || !temporaryCustomer.vehicleType)) {
            setManualError('Vui lòng điền đầy đủ thông tin khách vãng lai (Tên, Biển số xe, Loại xe)!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    vehicleId: vehicleId || temporaryCustomer.licensePlate,
                    pricePerDay: parsedPricePerDay,
                    phoneNumber: manualEntry.phoneNumber || '',
                    startDate,
                    endDate,
                    totalPrice,
                    ticketType,
                    isVip,
                    xeKhachDi: xeKhachDi || '',
                    isTemporary,
                    customerName: isTemporary ? temporaryCustomer.name : '',
                    licensePlate: isTemporary ? temporaryCustomer.licensePlate : '',
                    vehicleType: isTemporary ? temporaryCustomer.vehicleType : ''
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setManualError(errorData.error || 'Lưu thẻ thất bại');
                return;
            }
            setManualError('');
            setManualEntry({
                customerId: '',
                vehicleId: '',
                pricePerDay: '',
                phoneNumber: '',
                startDate: '',
                endDate: '',
                totalPrice: '',
                ticketType: '',
                isVip: false,
                xeKhachDi: '',
                isTemporary: false,
                temporaryCustomer: { name: '', phone: '', licensePlate: '', vehicleName: '', vehicleType: 'motorcycle' },
            });
            setShowModal(false);
            fetchCards();
        } catch (error) {
            setManualError(error.message);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const { customerId, vehicleId, pricePerDay, startDate, endDate, totalPrice, ticketType, isVip, xeKhachDi, isTemporary, temporaryCustomer } = manualEntry;

        const parsedPricePerDay = parseFloat(pricePerDay);
        if (isNaN(parsedPricePerDay)) {
            setManualError('Giá vé/ngày phải là số hợp lệ!');
            return;
        }

        if (!vehicleId || !startDate || !endDate || !totalPrice || !ticketType) {
            setManualError('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        if (isTemporary && (!temporaryCustomer.name || !temporaryCustomer.licensePlate || !temporaryCustomer.vehicleType)) {
            setManualError('Vui lòng điền đầy đủ thông tin khách vãng lai (Tên, Biển số xe, Loại xe)!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/cards', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editCard.id,
                    customerId,
                    vehicleId: vehicleId || temporaryCustomer.licensePlate,
                    pricePerDay: parsedPricePerDay,
                    phoneNumber: manualEntry.phoneNumber || '',
                    startDate,
                    endDate,
                    totalPrice,
                    ticketType,
                    isVip,
                    xeKhachDi: xeKhachDi || '',
                    isTemporary,
                    customerName: isTemporary ? temporaryCustomer.name : '',
                    licensePlate: isTemporary ? temporaryCustomer.licensePlate : '',
                    vehicleType: isTemporary ? temporaryCustomer.vehicleType : ''
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setManualError(errorData.error || 'Cập nhật thất bại');
                return;
            }
            setManualError('');
            setManualEntry({
                customerId: '',
                vehicleId: '',
                pricePerDay: '',
                phoneNumber: '',
                startDate: '',
                endDate: '',
                totalPrice: '',
                ticketType: '',
                isVip: false,
                xeKhachDi: '',
                isTemporary: false,
                temporaryCustomer: { name: '', phone: '', licensePlate: '', vehicleName: '', vehicleType: 'motorcycle' },
            });
            setEditCard(null);
            setShowModal(false);
            fetchCards();
        } catch (error) {
            setManualError(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa thẻ này?')) return;
        try {
            const response = await fetch('http://localhost:5001/api/cards', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([id]),
            });
            if (!response.ok) throw new Error('Xóa thất bại');
            fetchCards();
        } catch (error) {
            console.error('Error deleting card:', error);
            setManualError('Lỗi khi xóa thẻ: ' + error.message);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/cards');
            if (!response.ok) throw new Error('Tìm kiếm thất bại');
            const data = await response.json();
            const filteredCards = data.filter(card =>
                card.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setCards(filteredCards);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error searching cards:', error);
            setManualError('Lỗi khi tìm kiếm: ' + error.message);
        }
    };

    const openAddModal = () => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        setManualEntry({
            customerId: '',
            vehicleId: '',
            pricePerDay: '5000', // Default price for motorcycle
            phoneNumber: '',
            startDate: currentDate,
            endDate: currentDate, // Default to same day
            totalPrice: '5000', // Default total
            ticketType: 'Ngày', // Default to daily
            isVip: false,
            xeKhachDi: '',
            isTemporary: true, // Default to temporary customer
            temporaryCustomer: {
                name: '',
                phone: '',
                licensePlate: '',
                vehicleName: '',
                vehicleType: 'motorcycle'
            },
        });
        setEditCard(null);
        setShowModal(true);
    };

    const openEditModal = (card) => {
        const startDate = card.startDate ? new Date(card.startDate).toISOString().split('T')[0] : '';
        let endDate = '';
        if (startDate) {
            const start = new Date(startDate);
            if (card.isTemporary) {
                endDate = startDate;
            } else {
                const end = new Date(start);
                end.setDate(start.getDate() + 30);
                endDate = end.toISOString().split('T')[0];
            }
        }

        setManualEntry({
            customerId: card.customerId || '',
            vehicleId: card.vehicleId || '',
            pricePerDay: card.pricePerDay || '',
            phoneNumber: card.phoneNumber || '',
            startDate,
            endDate,
            totalPrice: card.totalPrice || '',
            ticketType: card.isTemporary ? 'Ngày' : 'Tháng',
            isVip: card.isVip || false,
            xeKhachDi: card.xeKhachDi || '',
            isTemporary: card.isTemporary || false,
            temporaryCustomer: card.isTemporary ? {
                name: card.customerName || '',
                phone: card.phoneNumber || '',
                licensePlate: card.vehicleId.startsWith('custom_') ? card.vehicleId.replace('custom_', '') : '',
                vehicleName: card.xeKhachDi || '',
                vehicleType: card.vehicleType || 'motorcycle',
            } : { name: '', phone: '', licensePlate: '', vehicleName: '', vehicleType: 'motorcycle' },
        });
        setEditCard(card);
        setShowModal(true);
    };

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleCustomerSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/customers/search?name=${searchCustomerTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Tìm kiếm khách hàng thất bại');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error searching customers:', error);
            setManualError('Lỗi khi tìm kiếm khách hàng: ' + error.message);
        }
    };

    const selectCustomer = (customer) => {
        const vehicleType = customer.vehicleType || 'motorcycle';
        const pricePerDay = vehicleType === 'car' ? '50000' : '5000';
        const startDate = manualEntry.startDate || new Date().toISOString().split('T')[0];
        const end = new Date(startDate);
        end.setDate(end.getDate() + 30);
        const endDate = end.toISOString().split('T')[0];

        setManualEntry({
            ...manualEntry,
            customerId: customer.id,
            phoneNumber: customer.phone || '',
            vehicleId: customer.licensePlate ? 'custom_' + customer.id : '',
            xeKhachDi: customer.vehicleName || 'Không có tên xe',
            pricePerDay,
            isVip: customer.isVip || false,
            ticketType: 'Tháng',
            isTemporary: false,
            startDate,
            endDate,
            totalPrice: (customer.isVip ? 0 : parseFloat(pricePerDay) * 30).toString(),
            temporaryCustomer: { name: '', phone: '', licensePlate: '', vehicleName: '', vehicleType: 'motorcycle' },
        });
        setShowCustomerSearch(false);
        setSearchCustomerTerm('');
    };

    const selectTemporaryCustomer = () => {
        const startDate = manualEntry.startDate || new Date().toISOString().split('T')[0];
        const vehicleType = 'motorcycle'; // Default to motorcycle
        const pricePerDay = vehicleType === 'car' ? '50000' : '5000';

        setManualEntry({
            ...manualEntry,
            customerId: '',
            phoneNumber: '',
            vehicleId: '',
            xeKhachDi: '',
            pricePerDay,
            isVip: false,
            ticketType: 'Ngày',
            isTemporary: true,
            startDate,
            endDate: startDate,
            totalPrice: pricePerDay, // 1 day price
            temporaryCustomer: {
                name: '',
                phone: '',
                licensePlate: '',
                vehicleName: '',
                vehicleType: vehicleType
            },
        });
        setShowCustomerSearch(false);
        setSearchCustomerTerm('');
    };

    const handleTemporaryCustomerChange = (field, value) => {
        const updatedTempCustomer = { ...manualEntry.temporaryCustomer, [field]: value };
        const vehicleType = updatedTempCustomer.vehicleType || 'motorcycle';
        const pricePerDay = vehicleType === 'car' ? 50000 : 5000;

        setManualEntry({
            ...manualEntry,
            temporaryCustomer: updatedTempCustomer,
            pricePerDay: pricePerDay.toString(),
            phoneNumber: updatedTempCustomer.phone || '',
            vehicleId: updatedTempCustomer.licensePlate ? 'custom_temp_' + updatedTempCustomer.licensePlate : '',
            xeKhachDi: updatedTempCustomer.vehicleName || '',
            totalPrice: pricePerDay.toString(), // Update total price immediately
        });
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý thẻ</h1>
                        <Link
                            href="/admin"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                        >
                            ← Quay lại
                        </Link>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <Link href="/admin/employees" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white">Quản lý nhân viên</Link>
                        <Link href="/admin/customers" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white">Quản lý khách hàng</Link>
                        <Link href="/admin/cards" className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Quản lý thẻ</Link>
                        <Link href="/admin/reports" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white">Báo cáo</Link>
                        <Link href="/admin/statistics" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white">Thống kê</Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm thẻ mới</h2>
                        <button onClick={openAddModal} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">Thêm thẻ</button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">DANH SÁCH THẺ</h2>
                        {manualError && <p className="text-red-500 mb-4">{manualError}</p>}
                        <div className="mb-4 flex items-center space-x-4">
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm tên KH hoặc SĐT"
                                className="flex-1"
                            />
                            <Button onClick={handleSearch} className="bg-green-500 hover:bg-green-600">Tìm kiếm</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">Tên khách hàng</TableHead>
                                        <TableHead className="font-bold">Mã thẻ</TableHead>
                                        <TableHead className="font-bold">Biển số xe</TableHead>
                                        <TableHead className="font-bold">Tên xe</TableHead>
                                        <TableHead className="font-bold">Giá mỗi ngày</TableHead>
                                        <TableHead className="font-bold">Số điện thoại</TableHead>
                                        <TableHead className="font-bold">Ngày bắt đầu</TableHead>
                                        <TableHead className="font-bold">Ngày kết thúc</TableHead>
                                        <TableHead className="font-bold">Tổng giá</TableHead>
                                        <TableHead className="font-bold">Loại vé</TableHead>
                                        <TableHead className="font-bold">Khách VIP</TableHead>
                                        <TableHead className="font-bold">Sửa</TableHead>
                                        <TableHead className="font-bold">Xóa</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentCards.map((card) => (
                                        <TableRow key={card.id} className="hover:bg-gray-50">
                                            <TableCell>{card.isTemporary ? card.customerName : (customers.find(c => c.id === card.customerId)?.firstName + ' ' + customers.find(c => c.id === card.customerId)?.lastName) || '-'}</TableCell>
                                            <TableCell>{card.cardCode || '-'}</TableCell>
                                            <TableCell>{card.isTemporary ? card.vehicleId.replace('custom_temp_', '') : (customers.find(c => c.id === card.customerId)?.licensePlate) || '-'}</TableCell>
                                            <TableCell>{card.xeKhachDi || '-'}</TableCell>
                                            <TableCell>{card.pricePerDay || '-'}</TableCell>
                                            <TableCell>{card.phoneNumber || '-'}</TableCell>
                                            <TableCell>{card.startDate || '-'}</TableCell>
                                            <TableCell>{card.endDate || '-'}</TableCell>
                                            <TableCell>{card.totalPrice || '-'}</TableCell>
                                            <TableCell>{card.ticketType || '-'}</TableCell>
                                            <TableCell>{card.isVip ? 'Có' : 'Không'}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="icon" onClick={() => openEditModal(card)} className="text-blue-500 hover:text-blue-700" title="Sửa">
                                                    <FaEdit size={16} />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="icon" onClick={() => handleDelete(card.id)} className="text-red-500 hover:text-red-700" title="Xóa">
                                                    <FaTrash size={16} />
                                                </Button>
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
                                        <PaginationLink onClick={handlePreviousPage} isActive={false} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>Prev</PaginationLink>
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>{index + 1}</PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationLink onClick={handleNextPage} isActive={false} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}>Next</PaginationLink>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">{editCard ? 'Sửa vé' : 'Thêm vé'}</h2>
                                {manualError && <p className="text-red-500 mb-4">{manualError}</p>}
                                {vehicleError && <p className="text-red-500 mb-4">{vehicleError}</p>}
                                {!manualEntry.vehicleId && (
                                    <p className="text-red-500 mb-4">Không tìm thấy xe liên kết với khách hàng này.</p>
                                )}
                                <form onSubmit={editCard ? handleEditSubmit : handleManualSubmit} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label className="block text-gray-700 mb-2">Thông tin khách hàng:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.isTemporary ? manualEntry.temporaryCustomer.name : (customers.find(c => c.id === manualEntry.customerId)?.firstName + ' ' + customers.find(c => c.id === manualEntry.customerId)?.lastName) || ''}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => setShowCustomerSearch(true)}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1 rounded-md"
                                            >
                                                <FaSearch />
                                            </Button>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Số điện thoại:{manualEntry.isTemporary ? '' : <span className="text-red-500 ml-1">*</span>}</label>
                                            <input
                                                type="text"
                                                value={manualEntry.phoneNumber}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {manualEntry.isTemporary && (
                                        <div className="grid grid-cols-3 gap-4 border p-4 rounded-md bg-gray-50">
                                            <h3 className="col-span-3 text-lg font-semibold text-gray-700">Thông tin khách vãng lai</h3>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Tên khách hàng:<span className="text-red-500 ml-1">*</span></label>
                                                <input
                                                    type="text"
                                                    value={manualEntry.temporaryCustomer.name}
                                                    onChange={(e) => handleTemporaryCustomerChange('name', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Số điện thoại:</label>
                                                <input
                                                    type="text"
                                                    value={manualEntry.temporaryCustomer.phone}
                                                    onChange={(e) => handleTemporaryCustomerChange('phone', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Biển số xe:<span className="text-red-500 ml-1">*</span></label>
                                                <input
                                                    type="text"
                                                    value={manualEntry.temporaryCustomer.licensePlate}
                                                    onChange={(e) => handleTemporaryCustomerChange('licensePlate', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Tên xe:</label>
                                                <input
                                                    type="text"
                                                    value={manualEntry.temporaryCustomer.vehicleName}
                                                    onChange={(e) => handleTemporaryCustomerChange('vehicleName', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Loại xe:<span className="text-red-500 ml-1">*</span></label>
                                                <select
                                                    value={manualEntry.temporaryCustomer.vehicleType}
                                                    onChange={(e) => handleTemporaryCustomerChange('vehicleType', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="motorcycle">Xe máy</option>
                                                    <option value="car">Ô tô</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">Giá vé/ngày:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="number"
                                                value={manualEntry.pricePerDay}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Thời gian hiệu lực:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="date"
                                                value={manualEntry.startDate}
                                                onChange={(e) => setManualEntry({ ...manualEntry, startDate: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Thời gian hết hạn:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="date"
                                                value={manualEntry.endDate}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Biển số xe:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.isTemporary ? manualEntry.temporaryCustomer.licensePlate : (manualEntry.vehicleId.startsWith('custom_') ? customers.find(c => c.id === manualEntry.customerId)?.licensePlate || '' : vehicles.find(v => v._id === manualEntry.vehicleId)?.licensePlate || '')}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Tổng giá:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="number"
                                                value={manualEntry.totalPrice}
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Xe khách đi:{manualEntry.isTemporary ? '' : <span className="text-red-500 ml-1">*</span>}</label>
                                            <input
                                                type="text"
                                                value={manualEntry.xeKhachDi}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Loại vé:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.ticketType}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Khách VIP:<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                type="text"
                                                value={manualEntry.isVip ? 'Có' : 'Không'}
                                                readOnly
                                                className="w-full p-2 border rounded-md bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Quay lại</button>
                                        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Lưu thông tin</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showCustomerSearch && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Tìm kiếm thông tin khách hàng</h2>
                                <div className="mb-4 flex items-center space-x-4">
                                    <Input
                                        type="text"
                                        value={searchCustomerTerm}
                                        onChange={(e) => setSearchCustomerTerm(e.target.value)}
                                        placeholder="Nhập tên khách hàng"
                                        className="flex-1"
                                    />
                                    <Button onClick={handleCustomerSearch} className="bg-orange-500 hover:bg-orange-600">Tìm kiếm</Button>
                                </div>
                                <div className="mb-4">
                                    <Button onClick={selectTemporaryCustomer} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Thêm khách vãng lai</Button>
                                </div>
                                <div className="overflow-y-auto max-h-60">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-200 text-gray-700">
                                                <TableHead>STT</TableHead>
                                                <TableHead>Tên</TableHead>
                                                <TableHead>SDT</TableHead>
                                                <TableHead>Biển số xe</TableHead>
                                                <TableHead>Tên xe</TableHead>
                                                <TableHead>Loại xe</TableHead>
                                                <TableHead>VIP</TableHead>
                                                <TableHead>Chọn</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customers
                                                .filter(customer => customer.firstName.toLowerCase().includes(searchCustomerTerm.toLowerCase()) || customer.lastName.toLowerCase().includes(searchCustomerTerm.toLowerCase()))
                                                .map((customer, index) => (
                                                    <TableRow key={customer.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{customer.firstName + ' ' + customer.lastName}</TableCell>
                                                        <TableCell>{customer.phone}</TableCell>
                                                        <TableCell>{customer.licensePlate || '-'}</TableCell>
                                                        <TableCell>{customer.vehicleName || '-'}</TableCell>
                                                        <TableCell>{customer.vehicleType || 'motorcycle'}</TableCell>
                                                        <TableCell>{customer.isVip ? 'Có' : 'Không'}</TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => selectCustomer(customer)} className="bg-orange-500 text-white px-2 py-1 rounded-md">Chọn</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button onClick={() => setShowCustomerSearch(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Đóng</Button>
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