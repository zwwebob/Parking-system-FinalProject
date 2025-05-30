// import { getServerSession } from "next-auth";
// import { authOptions } from "../[...nextauth]/route";
// import { connectToDatabase } from "@/lib/mongodb";
// import bcrypt from "bcrypt";

// export async function POST(req) {
//     const session = await getServerSession(authOptions);
//     if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

//     const { currentPassword, newPassword } = await req.json();
//     const { db } = await connectToDatabase();

//     // 1. Lấy user từ database
//     const user = await db.collection("users").findOne({ email: session.user.email });
//     if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

//     // 2. Kiểm tra mật khẩu hiện tại (dùng lại logic từ authorize)
//     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isPasswordValid) return new Response(JSON.stringify({ error: "Current password is incorrect" }), { status: 400 });

//     // 3. Hash mật khẩu mới và cập nhật
//     const hashedNewPassword = await bcrypt.hash(newPassword, 12);
//     await db.collection("users").updateOne(
//         { email: session.user.email },
//         { $set: { password: hashedNewPassword } }
//     );

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
// }

import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Chỉ cho phép role staff hoặc admin đổi mật khẩu
    const allowedRoles = ["admin", "staff"];
    if (!allowedRoles.includes(session.user.role)) {
        return new Response(JSON.stringify({ error: "Forbidden: Không có quyền đổi mật khẩu" }), { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();
    const { db } = await connectToDatabase();

    // Lấy user từ database
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        return new Response(JSON.stringify({ error: "Current password is incorrect" }), { status: 400 });
    }

    // Hash và cập nhật mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db.collection("users").updateOne(
        { email: session.user.email },
        { $set: { password: hashedNewPassword } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
