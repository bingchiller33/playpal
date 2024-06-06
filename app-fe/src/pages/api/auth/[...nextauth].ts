import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                await dbConnect();
                const userExist = await Account.findOne({
                    email: credentials?.email,
                }).exec();
                if (
                    !credentials?.password ||
                    typeof credentials.password !== "string"
                ) {
                    throw new Error("Invalid form data");
                }
                if (
                    userExist &&
                    (await compare(credentials.password, userExist.password))
                ) {
                    if (userExist.verified) {
                        return {
                            id: userExist._id.toString(),
                            email: userExist.email,
                            // password: userExist.password,
                            // Add any additional fields you want to include in the session
                        };
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
};

export default NextAuth(authOptions);
