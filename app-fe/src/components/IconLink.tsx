import cx from "classnames";
import Link from "next/link";

const IconLink = ({ children, className, style, href }: IconLinkProps) => {
    return (
        <Link
            href={href}
            className={cx(
                "unstyled-button",
                "icon-btn text-decoration-none",
                className
            )}
            style={style}
        >
            {children}
        </Link>
    );
};

export interface IconLinkProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    href: string;
}

export default IconLink;
