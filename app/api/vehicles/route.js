import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const licensePlate = searchParams.get('licensePlate');

    const { db } = await connectToDatabase();
    let vehicles;

    if (licensePlate) {
        vehicles = await db.collection('vehicles').find({ licensePlate: { $regex: licensePlate, $options: 'i' } }).toArray();
    } else {
        vehicles = await db.collection('vehicles').find().toArray();
    }

    return NextResponse.json(vehicles);
}

export async function POST(request) {
    const { licensePlate, vehicleType, timeIn } = await request.json();
    const { db } = await connectToDatabase();

    // Kiểm tra xem biển số đã tồn tại và chưa có thời gian ra chưa
    const existingVehicle = await db.collection('vehicles').findOne({ licensePlate, timeOut: { $exists: false } });
    if (existingVehicle) {
        return NextResponse.json({ error: 'Biển số này đang được sử dụng và chưa có thời gian ra!' }, { status: 400 });
    }

    const vehicle = { licensePlate, vehicleType, timeIn };
    await db.collection('vehicles').insertOne(vehicle);

    return NextResponse.json({ message: 'Lưu xe thành công' }, { status: 201 });
}

export async function PUT(request) {
    const { id, licensePlate, vehicleType, timeIn, timeOut, fee } = await request.json();
    const { db } = await connectToDatabase();

    if (!id) {
        return NextResponse.json({ error: 'Thiếu ID phương tiện!' }, { status: 400 });
    }

    const updateData = {};
    if (licensePlate) updateData.licensePlate = licensePlate;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (timeIn) updateData.timeIn = timeIn;
    if (timeOut) updateData.timeOut = timeOut;
    if (fee !== undefined) updateData.fee = fee;

    // Nếu cập nhật timeOut, tính lại phí
    if (timeOut) {
        const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(id) });
        const timeInDate = new Date(vehicle.timeIn);
        const timeOutDate = new Date(timeOut);
        const hours = Math.ceil((timeOutDate - timeInDate) / (1000 * 60 * 60));
        updateData.fee = hours * 5000; // 5,000 VNĐ/giờ
    }

    await db.collection('vehicles').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );

    return NextResponse.json({ message: 'Cập nhật thành công' });
}

export async function DELETE(request) {
    const { id } = await request.json();
    const { db } = await connectToDatabase();

    if (!id) {
        return NextResponse.json({ error: 'Thiếu ID phương tiện!' }, { status: 400 });
    }

    const result = await db.collection('vehicles').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Không tìm thấy phương tiện!' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Xóa phương tiện thành công' });
}

