import React from "react";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeColor?: string;
    fillColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
    size = 24,
    className = "",
    strokeColor,
    fillColor,
    stroke,
    fill,
    ...props
}) => {
    const activeStroke = strokeColor || stroke || "currentColor";
    const activeFill = fillColor || fill || "currentColor";

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            width={props.width ?? size}
            height={props.height ?? size}
            fill="none"
            className={className}
            aria-label="One Mind AI Logo"
            {...props}
        >
            <title>One Mind AI</title>
            <g
                stroke={activeStroke}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Hexagonal neural lattice outer structure */}
                <path d="m64 12 20 11.5V40l14 8v24l-14 8v16.5L64 108 44 96.5V80l-14-8V48l14-8V23.5Zm0 0v22m-20 6 10 6m30-6-10 6m-44 2 21 12m47-12L77 60M44 80l10-6m30 6-10-6m-10 34V86" />
                
                {/* Inner perspective core cube */}
                <path d="m64 34 13 7.5v25L64 74l-13-7.5v-25Zm0 0v11m0 29v12" />
                
                {/* Neural node points */}
                <g fill={activeFill} stroke="none">
                    <circle cx={64} cy={12} r={3.5} />
                    <circle cx={30} cy={48} r={3.5} />
                    <circle cx={98} cy={48} r={3.5} />
                    <circle cx={30} cy={72} r={3.5} />
                    <circle cx={98} cy={72} r={3.5} />
                    <circle cx={64} cy={108} r={3.5} />
                    <circle cx={64} cy={54} r={5} />
                </g>
            </g>
        </svg>
    );
};

export default Logo;

