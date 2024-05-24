import { PiDotsThreeOutline } from "react-icons/pi";
import cx from "classnames";
import { COLORS } from "@/utils/constants";

const IconButton = ({
    children,
    className,
    style,
    onClick,
}: IconButtonProps) => {
    return (
        <button
            className={cx("unstyled-button", "icon-btn", className)}
            style={style}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export interface IconButtonProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default IconButton;
