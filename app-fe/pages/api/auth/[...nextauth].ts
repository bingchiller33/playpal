import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let message = ""
        await dbConnect();
        const userExist = await Account.findOne({email:credentials?.email}).exec();
        if(userExist == null){
            message = "Email hasn't registered"
        }
        if (typeof credentials?.password != 'string') {
            throw new Error("Invalid form data");
        }
        if(await compare(credentials?.password, userExist.password)){
            if(userExist.verified){
                return{
                    id: userExist.id,
                    message: message
                }
            }
        }
        return null;
      },
    }),
  ],
};

export default NextAuth(options);
