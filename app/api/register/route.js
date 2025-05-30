import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { db } = await connectToDatabase();
    const { email, password, name } = await request.json();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        email,
        password: hashedPassword,
        name,
        role: 'staff', // ✅ gán mặc định là staff
    };

    await db.collection('users').insertOne(user);

    return NextResponse.json({ message: 'Đăng ký thành công' }, { status: 201 });
}
