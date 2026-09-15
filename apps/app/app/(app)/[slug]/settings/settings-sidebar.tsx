"use client";

import { Button } from "@crm/ui/components/button";
import { cn } from "@crm/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useTranslations } from "@/lib/i18n";
import { useWorkspaceUrl } from "@/lib/use-workspace-url";

type SettingsNavKey =
	| "sidebarGeneral"
	| "sidebarTracking"
	| "sidebarConnections"
	| "sidebarCurrencies"
	| "sidebarMembers"
	| "sidebarApiKeys"
	| "sidebarSso";

type SettingsNavItemDef = {
	key: SettingsNavKey;
	href: string;
};

type SettingsNavItem = {
	title: string;
	href: string;
};

const ROOT = "/settings";

const ITEMS_DEF: SettingsNavItemDef[] = [
	{ key: "sidebarGeneral", href: ROOT },
	{ key: "sidebarTracking", href: `${ROOT}/tracking` },
	{ key: "sidebarConnections", href: `${ROOT}/connections` },
	{ key: "sidebarCurrencies", href: `${ROOT}/currencies` },
	{ key: "sidebarMembers", href: `${ROOT}/members` },
	{ key: "sidebarApiKeys", href: `${ROOT}/api-keys` },
	{ key: "sidebarSso", href: `${ROOT}/sso` },
];

function isActive(href: string, root: string, pathname: string): boolean {
	return href === root ? pathname === href : pathname.startsWith(href);
}

function NavLink({
	item,
	active,
	className,
}: {
	item: SettingsNavItem;
	active: boolean;
	className: string;
}) {
	return (
		<Button
			asChild
			variant="ghost"
			className={cn(
				"justify-start font-normal text-muted-foreground",
				active &&
					"bg-muted text-foreground hover:bg-muted hover:text-foreground",
				className,
			)}
		>
			<Link
				href={item.href}
				prefetch
				aria-current={active ? "page" : undefined}
				transitionTypes={["nav-lateral"]}
			>
				{item.title}
			</Link>
		</Button>
	);
}

export function SettingsSidebarFallback() {
	return (
		<>
			<aside className="hidden w-56 shrink-0 border-r md:block [view-transition-name:settings-sidebar]">
				<nav
					aria-label="Workspace settings"
					aria-busy="true"
					className="flex flex-col gap-0.5 p-3"
				>
					{ITEMS_DEF.map((item) => (
						<Button
							key={item.href}
							variant="ghost"
							disabled
							className="w-full justify-start px-3 font-normal text-muted-foreground"
						>
							{item.key}
						</Button>
					))}
				</nav>
			</aside>

			<nav
				aria-label="Workspace settings"
				aria-busy="true"
				className="flex gap-1 overflow-x-auto border-b p-2 md:hidden [view-transition-name:settings-sidebar]"
			>
				{ITEMS_DEF.map((item) => (
					<Button
						key={item.href}
						variant="ghost"
						disabled
						className="shrink-0 justify-start px-3 font-normal text-muted-foreground"
					>
						{item.key}
					</Button>
				))}
			</nav>
		</>
	);
}

export function SettingsSidebar() {
	const pathname = usePathname();
	const workspaceUrl = useWorkspaceUrl();
	const t = useTranslations();

	const root = workspaceUrl(ROOT);
	const items = useMemo(
		() =>
			ITEMS_DEF.map((item) => ({
				title: t.settings[item.key],
				href: workspaceUrl(item.href),
			})),
		[workspaceUrl, t.settings],
	);

	return (
		<>
			<aside className="hidden w-56 shrink-0 border-r md:block [view-transition-name:settings-sidebar]">
				<nav
					aria-label="Workspace settings"
					className="flex flex-col gap-0.5 p-3"
				>
					{items.map((item) => (
						<NavLink
							key={item.href}
							item={item}
							active={isActive(item.href, root, pathname)}
							className="w-full px-3"
						/>
					))}
				</nav>
			</aside>

			<nav
				aria-label="Workspace settings"
				className="flex gap-1 overflow-x-auto border-b p-2 md:hidden [view-transition-name:settings-sidebar]"
			>
				{items.map((item) => (
					<NavLink
						key={item.href}
						item={item}
						active={isActive(item.href, root, pathname)}
						className="shrink-0 px-3"
					/>
				))}
			</nav>
		</>
	);
}
