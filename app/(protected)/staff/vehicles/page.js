'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseISO, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { FaSignOutAlt, FaEdit, FaTrash, FaCar } from 'react-icons/fa';
import { vi } from 'date-fns/locale';
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

export default function AdminVehiclesPage() {
    const { data: session, status } = useSession();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [manualEntry, setManualEntry] = useState({
        licensePlate: '',
        vehicleType: 'motorcycle',
        timeIn: '',
        customer_id: null,
        card_id: null,
        cardCode: '', // Thêm trường cardCode để hiển thị mã thẻ tự động
    });

    const [checkoutFile, setCheckoutFile] = useState(null);
    const [checkoutPreview, setCheckoutPreview] = useState(null);
    const [checkoutResult, setCheckoutResult] = useState(null);
    const [checkoutVehicle, setCheckoutVehicle] = useState(null);
    const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const vehiclesPerPage = 5;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        if (status === 'authenticated') {
            fetchVehicles();
            fetchCustomers();
            fetchCards();
        }
    }, [status, router]);

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/vehicles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch vehicles: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn));
            setVehicles(sortedData);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setError('Không thể tải danh sách xe: ' + error.message);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/customers');
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

    const fetchCards = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/cards');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch cards: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            setCards(data);
        } catch (error) {
            console.error('Error fetching cards:', error);
            setError('Không thể tải danh sách thẻ: ' + error.message);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            const previewUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setPreview(previewUrl);
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const handleCheckoutFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (checkoutPreview) {
                URL.revokeObjectURL(checkoutPreview);
            }
            const previewUrl = URL.createObjectURL(selectedFile);
            setCheckoutFile(selectedFile);
            setCheckoutPreview(previewUrl);
        } else {
            setCheckoutFile(null);
            setCheckoutPreview(null);
        }
    };

    const handleCheckinSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setResult({ error: 'Vui lòng chọn file ảnh!' });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5001/recognize', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API nhận diện trả về lỗi: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            const { plate, vehicleType, confidence } = data;
            const customer = customers.find(c => c.licensePlate && c.licensePlate.toLowerCase() === plate.toLowerCase());
            let card_id = null;
            let cardCode = '';
            if (customer) {
                const customerCard = cards.find(c => c.customerId === customer.id); // Sửa customer_id thành customerId để khớp với API
                if (customerCard) {
                    card_id = customerCard.id;
                    cardCode = customerCard.cardCode; // Lấy cardCode để hiển thị tự động
                }
            }
            setResult({ plate, vehicleType, confidence });
            setManualEntry({
                ...manualEntry,
                licensePlate: plate,
                vehicleType,
                customer_id: customer ? customer.id : null,
                card_id: card_id || null,
                cardCode: cardCode || 'Không có thẻ', // Gán cardCode hoặc thông báo nếu không có
            });
        } catch (error) {
            console.error('Error:', error);
            setResult({ error: error.message || 'Không nhận diện được biển số!' });
        }
    };

    const handleConfirmResult = async () => {
        const { licensePlate, vehicleType, customer_id, card_id } = manualEntry;

        if (!licensePlate || !vehicleType) {
            setError('Vui lòng điền đầy đủ thông tin (biển số, loại xe)!');
            return;
        }

        const existingVehicle = vehicles.find(
            (v) => v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && !v.timeOut
        );
        if (existingVehicle) {
            setError(`Biển số ${licensePlate} đã tồn tại trong bãi (chưa rời bãi)!`);
            return;
        }

        const now = new Date();
        const timeInISO = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'Asia/Ho_Chi_Minh' });

        try {
            const response = await fetch('http://localhost:5001/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licensePlate,
                    vehicleType,
                    timeIn: timeInISO,
                    customer_id,
                    card_id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Lưu xe thất bại: ${errorData.error || 'Unknown error'}`);
            }

            const vehicleData = await response.json();
            setError('');
            setManualEntry({ licensePlate: '', vehicleType: 'motorcycle', timeIn: '', customer_id: null, card_id: null, cardCode: '' });
            setResult(null);
            setFile(null);
            setPreview(null);
            fetchVehicles();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!checkoutFile) {
            setCheckoutResult({ error: 'Vui lòng chọn file ảnh để nhận diện xe ra!' });

            // Tự động xóa thông báo sau 5 giây
            setTimeout(() => {
                setCheckoutResult(null);
            }, 5000);
            return;
        }

        const formData = new FormData();
        formData.append('image', checkoutFile);

        try {
            const response = await fetch('http://localhost:5001/recognize', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API nhận diện trả về lỗi: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const { plate } = data;
            console.log('Biển số nhận diện:', plate);

            const responseCheck = await fetch(`http://localhost:5001/api/vehicles?licensePlate=${encodeURIComponent(plate)}`);
            if (!responseCheck.ok) {
                const errorData = await responseCheck.json();
                throw new Error(errorData.error || 'Không thể kiểm tra thông tin xe');
            }

            const dataCheck = await responseCheck.json();
            const matchedVehicle = (Array.isArray(dataCheck) ? dataCheck : dataCheck.vehicles)?.find(v => !v.timeOut);

            if (matchedVehicle) {
                setCheckoutVehicle({ ...matchedVehicle, recognizedPlate: plate });
                setShowCheckoutConfirm(true);
            } else {
                setCheckoutResult({ error: `Không tìm thấy xe với biển số ${plate} trong bãi` });
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setCheckoutResult({ error: error.message || 'Lỗi khi nhận diện xe ra!' });
        }
    };

    const confirmCheckout = async () => {
        try {
            const now = new Date();
            const response = await fetch('http://localhost:5001/api/vehicles', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: checkoutVehicle._id,
                    licensePlate: checkoutVehicle.recognizedPlate,
                    timeOut: now.toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Checkout thất bại: ${errorData.error || 'Unknown error'}`);
            }

            const updatedVehicle = await response.json();
            setCheckoutResult({
                success: `Xe ${updatedVehicle.licensePlate} đã ra bãi thành công. Phí: ${updatedVehicle.fee?.toLocaleString() || '0'} VNĐ`
            });

            // Tự động xóa thông báo sau 5 giây
            setTimeout(() => {
                setCheckoutResult(null);
            }, 5000);

            setShowCheckoutConfirm(false);
            setCheckoutVehicle(null);
            setCheckoutFile(null);
            setCheckoutPreview(null);
            fetchVehicles();
        } catch (error) {
            setCheckoutResult({ error: error.message });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const { licensePlate, vehicleType, timeIn, customer_id, card_id } = manualEntry;

        if (!licensePlate || !vehicleType || !timeIn) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const timeInDate = new Date(timeIn);
            const response = await fetch('http://localhost:5001/api/vehicles', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editVehicle._id,
                    licensePlate,
                    vehicleType,
                    timeIn: timeInDate.toISOString(),
                    customer_id,
                    card_id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Cập nhật thất bại: ${errorData.error || 'Unknown error'}`);
            }

            setError('');
            setManualEntry({ licensePlate: '', vehicleType: 'motorcycle', timeIn: '', customer_id: null, card_id: null, cardCode: '' });
            setEditVehicle(null);
            setShowModal(false);
            fetchVehicles();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) return;

        try {
            const response = await fetch('http://localhost:5001/api/vehicles', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Xóa thất bại: ${errorData.error || 'Unknown error'}`);
            }

            fetchVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            setError('Lỗi khi xóa xe: ' + error.message);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/vehicles?licensePlate=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Tìm kiếm thất bại: ${errorData.error || 'Unknown error'}`);
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn));
            setVehicles(sortedData);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error searching vehicles:', error);
            setError('Lỗi khi tìm kiếm: ' + error.message);
        }
    };

    const openEditModal = (vehicle) => {
        const timeIn = parseISO(vehicle.timeIn);
        const formattedTimeIn = format(timeIn, "yyyy-MM-dd'T'HH:mm");
        setManualEntry({
            licensePlate: vehicle.licensePlate,
            vehicleType: vehicle.vehicleType,
            timeIn: formattedTimeIn,
            customer_id: vehicle.customer_id,
            card_id: vehicle.card_id,
            cardCode: vehicle.card_id ? cards.find(c => c.id === vehicle.card_id)?.cardCode || '' : '',
        });
        setEditVehicle(vehicle);
        setShowModal(true);
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            if (checkoutPreview) {
                URL.revokeObjectURL(checkoutPreview);
            }
        };
    }, [preview, checkoutPreview]);

    const uniqueVehicles = [];
    const seenPlates = new Set();
    for (const vehicle of vehicles) {
        if (!vehicle.timeOut) {
            if (!seenPlates.has(vehicle.licensePlate.toLowerCase())) {
                seenPlates.add(vehicle.licensePlate.toLowerCase());
                uniqueVehicles.push(vehicle);
            }
        } else {
            uniqueVehicles.push(vehicle);
        }
    }

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = uniqueVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    const totalPages = Math.ceil(uniqueVehicles.length / vehiclesPerPage);

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

    const formatVNTime = (dateString) => {
        if (!dateString) return '-';
        const date = parseISO(dateString);
        const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        return format(vnDate, 'dd/MM/yyyy, HH:mm:ss', { locale: vi });
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <FaCar className="text-4xl text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-800">Quản lý gửi xe</h1>
                        </div>
                        <Link
                            href="/staff"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                        >
                            ← Quay lại
                        </Link>
                    </div>

                    <div className="flex space-x-4 mb-6 mt-4">
                        <Link
                            href="/staff/vehicles"
                            className="px-4 py-2 rounded-md bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
                        >
                            Quản lý xe
                        </Link>

                        <Link
                            href="/staff/customers"
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                        >
                            Quản lý khách hàng
                        </Link>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Nhận diện xe vào</h2>
                            <p className="text-gray-600 mb-4">
                                Vui lòng chọn ảnh rõ ràng, chính diện, và đủ sáng (độ phân giải tối thiểu 800x600).
                            </p>
                            <form onSubmit={handleCheckinSubmit} className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="p-2 border rounded-md flex-1"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
                                        Nhận diện
                                    </button>
                                </div>
                                {preview && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-700">Ảnh đã chọn:</h3>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mt-2 max-w-full h-auto rounded-md shadow-sm"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Nhận diện xe ra</h2>
                            <p className="text-gray-600 mb-4">
                                Vui lòng chọn ảnh rõ ràng, chính diện, và đủ sáng (độ phân giải tối thiểu 800x600).
                            </p>
                            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCheckoutFileChange}
                                        className="p-2 border rounded-md flex-1"
                                    />
                                    <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition">
                                        Nhận diện
                                    </button>
                                </div>
                                {checkoutPreview && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-700">Ảnh đã chọn:</h3>
                                        <img
                                            src={checkoutPreview}
                                            alt="Preview"
                                            className="mt-2 max-w-full h-auto rounded-md shadow-sm"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                )}
                            </form>

                            {checkoutResult && (
                                <div className="mt-4 p-4 rounded-md" style={{
                                    backgroundColor: checkoutResult.error ? 'rgb(254 226 226)' : 'rgb(236 253 245)',
                                    borderLeft: checkoutResult.error ? '4px solid rgb(239 68 68)' : '4px solid rgb(34 197 94)'
                                }}>
                                    {checkoutResult.error ? (
                                        <p className="text-red-600">{checkoutResult.error}</p>
                                    ) : (
                                        <p className="text-green-600">{checkoutResult.success}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {result && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Kết quả nhận diện</h2>
                            {result.error ? (
                                <p className="text-red-500 text-lg">{result.error}</p>
                            ) : (
                                <div className="text-gray-800">
                                    {error && <p className="text-red-500 mb-4 text-lg">{error}</p>}
                                    <div className="flex items-center space-x-4 mb-4">
                                        <label className="font-medium text-lg">Biển số:</label>
                                        <input
                                            type="text"
                                            value={manualEntry.licensePlate}
                                            onChange={(e) => setManualEntry({ ...manualEntry, licensePlate: e.target.value })}
                                            className="p-2 border rounded-md flex-1 text-lg"
                                        />
                                    </div>
                                    <p className="mb-4 text-lg"><strong>Loại xe:</strong> {result.vehicleType}</p>
                                    <p className="mb-4 text-lg"><strong>Độ tin cậy:</strong> {result.confidence ? `${(result.confidence * 100).toFixed(2)}%` : '-'}</p>
                                    <div className="mb-4">
                                        <label className="block font-medium text-gray-700 mb-2 text-lg">Khách hàng:</label>
                                        <input
                                            type="text"
                                            value={manualEntry.customer_id ? `${customers.find(c => c.id === manualEntry.customer_id)?.firstName || ''} ${customers.find(c => c.id === manualEntry.customer_id)?.lastName || ''} (${customers.find(c => c.id === manualEntry.customer_id)?.phone || ''})` : 'Không chọn'}
                                            readOnly
                                            className="w-full p-2 border rounded-md text-lg bg-gray-100"
                                        />
                                        {manualEntry.customer_id && (
                                            <p className="mt-2 text-lg font-medium">VIP: {customers.find(c => c.id === manualEntry.customer_id)?.isVip ? 'Có' : 'Không'}</p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2 text-lg">Mã thẻ:</label>
                                        <input
                                            type="text"
                                            value={manualEntry.cardCode}
                                            readOnly
                                            className="w-full p-2 border rounded-md text-lg bg-gray-100"
                                        />
                                    </div>
                                    <button
                                        onClick={handleConfirmResult}
                                        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition text-lg"
                                    >
                                        Xác nhận xe vào
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">DANH SÁCH XE</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="mb-4 flex items-center space-x-4">
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm biển số"
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
                                        <TableHead className="text-center">Biển số</TableHead>
                                        <TableHead className="text-center">Loại xe</TableHead>
                                        <TableHead className="text-center">Thời gian vào</TableHead>
                                        <TableHead className="text-center">Thời gian ra</TableHead>
                                        <TableHead className="text-center">Phí</TableHead>
                                        <TableHead className="text-center">Khách hàng</TableHead>
                                        <TableHead className="text-center">VIP</TableHead>
                                        <TableHead className="text-center">Thẻ</TableHead>
                                        <TableHead className="text-center">Xóa khỏi danh sách</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentVehicles.map((vehicle) => (
                                        <TableRow key={vehicle._id} className="hover:bg-gray-50">
                                            <TableCell>{vehicle.licensePlate}</TableCell>
                                            <TableCell>{vehicle.vehicleType}</TableCell>
                                            <TableCell>{formatVNTime(vehicle.timeIn)}</TableCell>
                                            <TableCell>{formatVNTime(vehicle.timeOut)}</TableCell>
                                            <TableCell>{vehicle.fee !== undefined && vehicle.fee !== null ? `${vehicle.fee.toLocaleString()} VNĐ` : '-'}</TableCell>
                                            <TableCell>{vehicle.customer ? `${vehicle.customer.firstName} ${vehicle.customer.lastName}` : '-'}</TableCell>
                                            <TableCell>{vehicle.customer ? (vehicle.customer.isVip ? 'Có' : 'Không') : '-'}</TableCell>
                                            <TableCell>{vehicle.card_id ? cards.find((c) => c.id === vehicle.card_id)?.cardCode || '-' : '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(vehicle._id)}
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

                    {showCheckoutConfirm && checkoutVehicle && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Xác nhận xe ra</h2>
                                <div className="space-y-4">
                                    <p><strong>Biển số nhận diện:</strong> {checkoutVehicle.recognizedPlate}</p>
                                    <p><strong>Biển số trong hệ thống:</strong> {checkoutVehicle.licensePlate}</p>
                                    <p><strong>Loại xe:</strong> {checkoutVehicle.vehicleType}</p>
                                    <p><strong>Thời gian vào:</strong> {formatVNTime(checkoutVehicle.timeIn)}</p>
                                    <p><strong>Khách hàng VIP:</strong> {checkoutVehicle.customer?.isVip ? 'Có' : 'Không'}</p>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowCheckoutConfirm(false);
                                                setCheckoutVehicle(null);
                                            }}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={confirmCheckout}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                        >
                                            Xác nhận xe ra
                                        </button>
                                    </div>
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