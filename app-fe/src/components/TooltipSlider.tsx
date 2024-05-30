"use client";

import {
    Slider as PrimeSlider,
    SliderProps as PrimeSliderProps,
} from "primereact/slider";
import cx from "classnames";

const TooltipSlider = (props: PrimeSliderProps) => {
    const { value } = props;
    const low = typeof value === "number" ? value : value?.[0];
    const high = Array.isArray(value) ? value[1] : undefined;

    return (
        <PrimeSlider
            {...props}
            className={cx("p-slider-tooltips", props.className)}
            pt={{
                handle: (v) => ({ "data-val-low": low, "data-val-high": high }),
            }}
        />
    );
};

export default TooltipSlider;
