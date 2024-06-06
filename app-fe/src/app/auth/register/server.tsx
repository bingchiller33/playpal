"use server";
import { hash, compare } from 'bcryptjs';
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { revalidatePath } from "next/cache";
import { sendVerificationEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function create(formData: FormData) {
    "use server";
    await dbConnect()
    let response = "Sucessfully, please check your email";
    let status = 1;
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const re_password = formData.get("re-password");
    const token = crypto.randomBytes(32).toString('hex');
    const regex = new RegExp("\\S{8,}")


    if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string' || typeof re_password !== 'string') {
        throw new Error("Invalid form data");
    }
    if(await Account.findOne({email})){
        response = "There's an account created with this email previously";
        status = 0;
        return {response, status}
    }
    if(!regex.test(password)){
        response = "Password must be more than 8 characters and no white spaces";
        status = 0;
        console.log(password);
        
        console.log(regex.test(password));
        
        return {response, status}
    }
    if(password !== re_password){
        response = "Password's not matching";
        status = 0;
        return {response, status}
    }

    const hashedPass = await hash(password,10);
    if(status == 1){
        await Account.create({ email, password: hashedPass, token, verified:0});
        await sendVerificationEmail(email, token);
    }
    return {response, status}
}
