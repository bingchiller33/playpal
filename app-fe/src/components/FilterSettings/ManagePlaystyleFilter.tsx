"use client";
import { Button } from "react-bootstrap";
import {
    create,
    deleteOption,
    updateOption,
} from "./ManagePlaystyleFilter.server";
import { WithId } from "@/utils/types";
import { useState } from "react";
import { toast } from "react-toastify";

const ManagePlayStyleFilter = (props: ManageLanguageFilterProps) => {
    return (
        <div className="mt-2">
            <h2>Manage Playstyle Filter Settings: </h2>
            <p>Playstyle Option List: </p>
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
            </div>
        </div>
    );
};

export interface ManageLanguageFilterProps {
    items: WithId<any>[];
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

export default ManagePlayStyleFilter;
