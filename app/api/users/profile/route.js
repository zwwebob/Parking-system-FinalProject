// app/api/users/profile/route.js
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone } = await request.json();

    if (!name || !phone) {
        return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('users').updateOne(
        { email: session.user.email },
        {
            $set: {
                name,
                phone,
            },
        }
    );

    if (result.modifiedCount === 0) {
        return NextResponse.json({ error: 'Không có thay đổi nào được thực hiện' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Cập nhật thành công' });
}
