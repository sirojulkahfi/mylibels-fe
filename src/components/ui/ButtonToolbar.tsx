import { ReactNode, CSSProperties } from "react";

type ButtonToolbarProps = {
    message: string;
    icon?: ReactNode;
    onClick?: () => void;
    enable?: boolean;
    loading?: boolean;
    danger?: boolean;
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
    [key: string]: unknown; // allow Ant Design to forward event props (Popconfirm, Tooltip, etc.)
};

export default function ButtonToolbar({
    message,
    icon,
    onClick,
    enable = true,
    loading = false,
    danger = false,
    children,
    style,
    className = "",
    ...rest
}: ButtonToolbarProps) {
    return (
        <span
            className={`${className} ${
                enable && !loading
                    ? danger 
                        ? "hover:cursor-pointer rounded hover:bg-red-500 hover:text-white"
                        : "hover:cursor-pointer rounded hover:bg-[#e0dfe1] hover:text-black"
                    : ""
            } p-1 text-xs flex flex-row items-center justify-center gap-2 ${
                !enable || loading ? "text-gray-400" : "text-white"
            }`}
            onClick={enable && !loading ? onClick : undefined}
            style={style}
            {...rest}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                icon
            )}

            <span>{message}</span>

            {children}
        </span>
    );
}