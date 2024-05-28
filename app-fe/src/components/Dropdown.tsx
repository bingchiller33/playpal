"use client";

import Image from "next/image";
import {
    DropdownProps as PrimeDropdownProps,
    Dropdown as PrimeDropdown,
} from "primereact/dropdown";
import { useState } from "react";

const Dropdown = ({ className }: DropdownProps) => {
    const values = [
        {
            value: "1",
            label: "One",
            iconUrl: "/assets/games/lol/rank-badges/iron.webp",
        },
        {
            value: "2",
            label: "On2e",
            iconUrl: "/assets/games/lol/rank-badges/iron.webp",
        },
    ];

    const selectedCountryTemplate = (
        option: DropDownItem,
        props: PrimeDropdownProps
    ) => {
        if (option) {
            return (
                <div className="d-flex gap-2 align-items-center">
                    <Image
                        alt={option.label}
                        src={option.iconUrl || ""}
                        width={32}
                        height={32}
                    />
                    <div>{option.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: DropDownItem) => {
        return (
            <div className="d-flex gap-2 align-items-center">
                <Image
                    alt={option.label}
                    src={option.iconUrl || ""}
                    width={32}
                    height={32}
                />
                <div>{option.label}</div>
            </div>
        );
    };

    const [selected, setSelected] = useState<DropDownItem | null>(null);

    return (
        <PrimeDropdown
            onChange={(e) => setSelected(e.value)}
            value={selected}
            optionLabel="label"
            options={values}
            itemTemplate={countryOptionTemplate}
            valueTemplate={selectedCountryTemplate}
            placeholder="Select..."
            filterPlaceholder="Search..."
            showClear
            className={className}
            filter
        />
    );
};

export interface DropDownItem {
    value: string;
    label: string;
    iconUrl?: string;
}

export interface DropdownProps {
    options: DropDownItem[];
    value: DropDownItem;
    onChange: (value: DropDownItem) => void;
    className?: string;
}

export default Dropdown;
