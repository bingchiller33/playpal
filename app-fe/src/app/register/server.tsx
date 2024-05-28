"use server";

import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { revalidatePath } from "next/cache";

export async function create(formData: FormData) {
    "use server";
    await dbConnect();
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const re_password = formData.get("re-password");
    console.log(email);
    console.log(username);
    console.log(password);
    console.log(re_password);   
    await Account.create({ email, password });
    revalidatePath("/register");
}
