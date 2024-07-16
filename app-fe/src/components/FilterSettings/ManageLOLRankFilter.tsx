"use client";
import AdminNavigationPanel from "@/components/AdminNavigationPanel";
import Dropdown, { DropDownItem } from "@/components/Dropdown";
import Header from "@/components/Header";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
    create,
    deleteOption,
    setDefault,
    updateOption,
} from "./ManageLOLRankFilter.server";
import { WithId } from "@/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IDefaultFilter } from "@/models/defaultFiltersModel";
import Image from "next/image";

const ManageLOLRankFilter = (props: ManageLanguageFilterProps) => {
    const [defaultLang, setDefaultLang] = useState<DropDownItem | string>();
    const langs = props.items.map((x) => ({
        label: x.name,
        value: x._id,
        iconUrl: x.iconUrl,
    }));

    useEffect(() => {
        if (props.defaults.lolServer) {
            setDefaultLang(props.defaults.lolServer.toString());
        }
    }, [props.defaults]);

    return (
        <div>
            <h2>Manage Rank Filter Settings: </h2>
            <div className="d-flex align-items-center gap-1">
                <span>Default Rank: </span>
                <Dropdown
                    options={langs}
                    value={defaultLang}
                    onChange={(e) => setDefaultLang(e)}
                    className="flex-grow-1"
                />
            </div>
            <p>Rank Option List: </p>
            <div>
                {props.items.map((item) => (
                    <Item item={item} key={item._id} />
                ))}
                <Button
                    variant="primary"
                    className="mt-2"
                    onClick={() => create()}
                >
                    Add new option
                </Button>

                <Button
                    variant="success"
                    className="mt-2 ms-2"
                    onClick={async () => {
                        const lang = defaultLang;
                        if (!lang) {
                            toast.error("Please select default language!");
                            return;
                        }
                        const res = await setDefault(lang as any);
                        if (res.success) {
                            toast.success("Update successfully!");
                        } else {
                            toast.error("Update failed!");
                        }
                    }}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export interface ManageLanguageFilterProps {
    items: WithId<any>[];
    defaults: IDefaultFilter;
}

const Item = ({ item }: { item: WithId<any> }) => {
    const [label, setLebel] = useState(item.name);
    const [img, setImg] = useState(item.iconUrl);
    const [value, setValue] = useState(item.value);
    const [order, setOrder] = useState(item.order);

    return (
        <div className="inviteMemberSearch d-flex py-1">
            <input
                className="searchForm form-control me-2"
                type="number"
                placeholder="order"
                aria-label="order"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
            />
            <input
                className="searchForm form-control me-2"
                type="text"
                placeholder="Id"
                aria-label="Id"
                disabled={true}
                value={item._id}
            />
            <input
                className="searchForm form-control me-2"
                type="text"
                placeholder="Name"
                aria-label="Name"
                value={label}
                onChange={(e) => setLebel(e.target.value)}
            />
            <input
                className="searchForm form-control me-2"
                type="number"
                placeholder="Value"
                aria-label="Value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Image alt="icon" src={img} width={50} height={50} />
            <input
                className="searchForm form-control me-2"
                type="text"
                placeholder="Name"
                aria-label="Name"
                value={img}
                onChange={(e) => setImg(e.target.value)}
            />

            <Button
                variant="outline-danger"
                className="me-2"
                onClick={async () => {
                    const result = await deleteOption(item._id);
                    if (result.message) {
                        toast.success("Update successfully!");
                    }
                }}
            >
                Delete
            </Button>
            <Button
                variant="success"
                onClick={async () => {
                    const result = await updateOption(
                        item._id,
                        label,
                        img,
                        value,
                        order
                    );
                    if (result.success) {
                        toast.success("Update successfully!");
                    }
                }}
            >
                Update
            </Button>
        </div>
    );
};

export default ManageLOLRankFilter;
