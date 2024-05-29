"use server";
import { hash, compare } from 'bcryptjs';
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { revalidatePath } from "next/cache";
import { sendVerificationEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function create(formData: FormData) {
    "use server";
    await dbConnect();
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const re_password = formData.get("re-password");
    const token = crypto.randomBytes(32).toString('hex');

    if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string' || typeof re_password !== 'string') {
        throw new Error("Invalid form data");
    }
    
    await sendVerificationEmail(email, token);

    const hashedPass = await hash(password,10);

    console.log(email);
    console.log(username);
    console.log(password);
    console.log(re_password);   
    console.log(hashedPass);

    await Account.create({ email, password: hashedPass, token, verified:0});
    revalidatePath("/auth/register");
}
