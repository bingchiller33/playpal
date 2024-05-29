"use server";
import { compare, hash } from 'bcryptjs';
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { revalidatePath } from "next/cache";

export async function create(formData: FormData) {
    "use server";
    await dbConnect();
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== 'string' || typeof password !== 'string' ) {
        throw new Error("Invalid form data");
    }
    console.log(email);
    console.log(password);
    
    

    const userExist = await Account.findOne({email}).exec();
    if(await compare(password, userExist.password))
        console.log(userExist.id);
    revalidatePath("/auth/login");
}
