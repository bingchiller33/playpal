import Image from "next/image";
import styles from "./page.module.css";
import Button from "react-bootstrap/Button";
import dbConnect from "@/lib/mongoConnect";
import Aaas from "@/models/aaaModel";
import { create, createSquad, send, sendTag, weight } from "./server";
import { Button as B2r } from "primereact/button";
import Dropdown from "@/components/Dropdown";
import Footer from "@/components/Footer";

export default async function Home() {
    await dbConnect();

    const doc = await Aaas.find({}).exec();
    const names = doc.map((aaa) => aaa.name);

    return (
        <main>
            {process.env.MONGO_URI}
            {doc.map((x, i) => (
                <p key={i}>{x.name}</p>
            ))}

            <form action={create}>
                <label>Name</label>
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            </form>
            <form action={createSquad}>
                <button type="submit">Create squad</button>
            </form>

            <form action={weight}>
                <button type="submit">Set weights</button>
            </form>

            <form action={send}>
                <button type="submit">Send</button>
            </form>

            <form action={sendTag}>
                <button type="submit">Send Tag</button>
            </form>

            <Footer />
        </main>
    );
}
