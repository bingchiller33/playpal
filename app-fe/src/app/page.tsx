import Image from "next/image";
import styles from "./page.module.css";
import Button from "react-bootstrap/Button";
import dbConnect from "@/lib/mongoConnect";
import Aaas from "@/models/aaaModel";
import { create } from "./server";
import { Button as B2r } from "primereact/button";
import Dropdown from "@/components/Dropdown";

export default async function Home() {
    await dbConnect();

    const doc = await Aaas.find({}).exec();
    const names = doc.map((aaa) => aaa.name);

    return (
        <main>
            <div style={{ padding: 10 }}>
                <Dropdown />
            </div>
            {process.env.MONGO_URI}
            {doc.map((x, i) => (
                <p key={i}>{x.name}</p>
            ))}

            <form action={create}>
                <label>Name</label>
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}
