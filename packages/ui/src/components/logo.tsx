import type * as React from "react";

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 32 32"
		fill="none"
		aria-label="CRM Logo"
		{...props}
	>
		<path
			d="M16 3L27.26 9.5V22.5L16 29L4.74 22.5V9.5L16 3Z"
			fill="currentColor"
			fillOpacity="0.15"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinejoin="round"
		/>
		<path
			d="M16 3V16M27.26 9.5L16 16M4.74 9.5L16 16M16 16V29"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16 12L20 14.3V18.9L16 21.2L12 18.9V14.3L16 12Z"
			fill="currentColor"
		/>
	</svg>
);
export default Logo;
