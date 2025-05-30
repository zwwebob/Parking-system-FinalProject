import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const { db } = await connectToDatabase();

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
}

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const { name, phone, role } = await request.json();
    const { db } = await connectToDatabase();

    await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, phone, role } }
    );

    return NextResponse.json({ message: "Admin updated user" });
}
