import type * as React from "react";

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 32 32"
		fill="none"
		aria-label="CRM BR Logo"
		className={className}
		{...props}
	>
		<defs>
			<linearGradient
				id="logo-emerald-grad"
				x1="4"
				y1="3"
				x2="28"
				y2="29"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#10b981" />
				<stop offset="1" stopColor="#059669" />
			</linearGradient>
		</defs>
		<path
			d="M16 3L27.26 9.5V22.5L16 29L4.74 22.5V9.5L16 3Z"
			fill="url(#logo-emerald-grad)"
			fillOpacity="0.2"
			stroke="url(#logo-emerald-grad)"
			strokeWidth="2"
			strokeLinejoin="round"
		/>
		<path
			d="M16 3V16M27.26 9.5L16 16M4.74 9.5L16 16M16 16V29"
			stroke="url(#logo-emerald-grad)"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16 11.5L20.5 14.1V19.3L16 21.9L11.5 19.3V14.1L16 11.5Z"
			fill="url(#logo-emerald-grad)"
		/>
	</svg>
);
export default Logo;
