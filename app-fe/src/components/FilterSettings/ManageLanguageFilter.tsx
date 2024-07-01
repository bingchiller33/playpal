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
} from "./ManageLanguageFilter.server";
import { WithId } from "@/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IDefaultFilter } from "@/models/defaultFiltersModel";

const ManageLanguageFilter = (props: ManageLanguageFilterProps) => {
    const [defaultLang, setDefaultLang] = useState<DropDownItem | string>();
    const langs = props.items.map((x) => ({ label: x.label, value: x._id }));
    useEffect(() => {
        if (props.defaults?.lang) {
            setDefaultLang(props.defaults?.lang.toString());
        }
    }, [props.defaults]);

    return (
        <div>
            <h2>Manage Language Filter Settings: </h2>
            <div className="d-flex align-items-center gap-1">
                <span>Default Language: </span>
                <Dropdown
                    options={langs}
                    value={defaultLang}
                    onChange={(e) => setDefaultLang(e)}
                    className="flex-grow-1"
                />
            </div>
            <p>Language Option List: </p>
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
    const [label, setLebel] = useState(item.label);

    return (
        <div className="inviteMemberSearch d-flex py-1">
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
                    const result = await updateOption(item._id, label);
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

export default ManageLanguageFilter;
