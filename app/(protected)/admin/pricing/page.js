// pricing/page.js (Bạn có thể đặt nó ở đâu đó như app/admin/pricing/page.js)
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainFooter from '@/components/layout/MainFooter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AdminPricingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [parkingRates, setParkingRates] = useState({ motorcyclePrice: 0, carPrice: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchParkingRates();
    }, []);

    const fetchParkingRates = async () => {
        try {
            const res = await fetch('/api/ticket-prices');
            const data = await res.json();
            if (res.ok) {
                setParkingRates({
                    motorcyclePrice: data.motorcyclePrice || 0,
                    carPrice: data.carPrice || 0
                });
            } else {
                setError(data.error || 'Không thể tải giá vé.');
            }
        } catch (error) {
            console.error('Error fetching parking rates:', error);
            setError('Lỗi kết nối đến máy chủ khi tải giá vé.');
        }
    };

    const handleRateChange = (e) => {
        const { name, value } = e.target;
        setParkingRates(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0 // Ensure it's a number
        }));
    };

    const saveParkingRates = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/ticket-prices', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parkingRates),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                // Re-fetch to ensure consistency (though not strictly necessary here)
                fetchParkingRates();
            } else {
                setError(data.error || 'Đã xảy ra lỗi khi lưu giá vé.');
            }
        } catch (error) {
            console.error('Saving rates error:', error);
            setError('Lỗi kết nối đến máy chủ khi lưu giá vé.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-screen text-xl">Đang tải...</div>;
    }

    if (session?.user?.role !== 'admin') {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">Bạn không có quyền truy cập trang này.</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Quản lý Giá vé</h1>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                    {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Cấu hình giá vé gửi xe</CardTitle>
                            <CardDescription>Cập nhật giá vé theo ngày cho các loại phương tiện.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="carPrice" className="block text-gray-700 mb-2">Giá vé ô tô (VNĐ):</Label>
                                    <Input
                                        id="carPrice"
                                        type="number"
                                        name="carPrice"
                                        value={parkingRates.carPrice}
                                        onChange={handleRateChange}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="motorcyclePrice" className="block text-gray-700 mb-2">Giá vé xe máy (VNĐ):</Label>
                                    <Input
                                        id="motorcyclePrice"
                                        type="number"
                                        name="motorcyclePrice"
                                        value={parkingRates.motorcyclePrice}
                                        onChange={handleRateChange}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex justify-end mt-6">
                                    <Button
                                        onClick={saveParkingRates}
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                    >
                                        {isSubmitting ? "Đang lưu..." : "Lưu giá vé"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <MainFooter />
        </>
    );
}