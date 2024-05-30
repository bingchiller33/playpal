"use client";

import Image from "next/image";
import {
    DropdownProps as PrimeDropdownProps,
    Dropdown as PrimeDropdown,
} from "primereact/dropdown";
import { useState } from "react";

const Dropdown = ({
    className,
    options,
    onChange,
    value,
    disabled,
}: DropdownProps) => {
    const selectedCountryTemplate = (
        option: DropDownItem,
        props: PrimeDropdownProps
    ) => {
        if (option) {
            return (
                <div className="d-flex gap-2 align-items-center">
                    {option.iconUrl && (
                        <Image
                            alt={option.label}
                            src={option.iconUrl || ""}
                            width={32}
                            height={32}
                        />
                    )}

                    <div>{option.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: DropDownItem) => {
        return (
            <div className="d-flex gap-2 align-items-center">
                {option.iconUrl && (
                    <Image
                        alt={option.label}
                        src={option.iconUrl || ""}
                        width={32}
                        height={32}
                    />
                )}

                <div>{option.label}</div>
            </div>
        );
    };

    return (
        <PrimeDropdown
            onChange={(e) => onChange(e.value)}
            value={value}
            optionLabel="label"
            options={options}
            itemTemplate={countryOptionTemplate}
            valueTemplate={selectedCountryTemplate}
            placeholder="Select..."
            filterPlaceholder="Search..."
            className={className}
            disabled={disabled}
            filter
        />
    );
};

export interface DropDownItem {
    value: any;
    label: string;
    iconUrl?: string;
}

export interface DropdownProps {
    options: DropDownItem[];
    value: any;
    onChange: (value: DropDownItem) => void;
    className?: string;
    disabled?: boolean;
}

export default Dropdown;
