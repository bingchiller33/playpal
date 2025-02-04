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
                if (userExist?.password != undefined) {
                    const isPasswordValid = await compare(
                        credentials.password,
                        userExist?.password
                    );
                    if (isPasswordValid && userExist?.verified) {
                        return {
                            id: userExist._id.toString(),
                            email: userExist.email as string,
                            // Add any additional fields you want to include in the session
                        };
                    }
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            httpOptions: {
                timeout: 10000,
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                await dbConnect();
                const existingUser = await Account.findOne({
                    email: user.email,
                });
                if (!existingUser) {
                    await Account.create({
                        email: user.email,
                        username: user.name,
                        verified: true,
                    });
                    const createdUser = await Account.findOne({
                        email: user.email,
                    });
                    user.id = createdUser?._id.toString()!;
                } else {
                    user.id = existingUser?._id.toString();
                }
            }
            return true;
        },

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
