import cx from "classnames";

const IconButton = ({
    children,
    className,
    style,
    onClick,
}: IconButtonProps) => {
    return (
        <button
            type="submit"
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
