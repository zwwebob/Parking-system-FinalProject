import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { db } = await connectToDatabase();
                const user = await db.collection('users').findOne({ email: credentials.email });

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    return { id: user._id, name: user.name, email: user.email, role: user.role };
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: '/login',
    },

    callbacks: {
        async signIn({ user, account }) {
            // Nếu user login bằng Google
            if (account.provider === 'google') {
                const { db } = await connectToDatabase();
                const existingUser = await db.collection('users').findOne({ email: user.email });

                if (!existingUser) {
                    // 👇 Nếu user chưa tồn tại, tạo mới với role mặc định là 'user'
                    await db.collection('users').insertOne({
                        name: user.name,
                        email: user.email,
                        role: 'user', // hoặc 'admin' nếu bạn muốn
                        createdAt: new Date(),
                    });
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            const { db } = await connectToDatabase();
            const userInDb = await db.collection('users').findOne({ email: session.user.email });

            if (userInDb) {
                session.user.role = userInDb.role; // gán role vào session
                session.user._id = userInDb._id;
            }

            return session;
        },

        async redirect({ url, baseUrl }) {
            return baseUrl + '/';
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
