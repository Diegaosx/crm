"use client";

import Plug from "@carbon/icons-react/es/Plug";
import DocusignLogo from "@crm/ui/components/brand-logos/docusign";
import GoogleLogo from "@crm/ui/components/brand-logos/google";
import MicrosoftLogo from "@crm/ui/components/brand-logos/microsoft";
import SlackLogo from "@crm/ui/components/brand-logos/slack";
import StripeLogo from "@crm/ui/components/brand-logos/stripe";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@crm/ui/components/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n";

export function AddConnectionDialog({
	slug,
	open,
	connected,
}: {
	slug: string;
	open: boolean;
	connected: string[];
}) {
	const router = useRouter();
	const t = useTranslations();

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) router.replace(`/${slug}/settings/connections`);
			}}
		>
			<DialogContent className="max-w-(--container-narrow) gap-0 p-0 md:left-[calc(50%+calc((56px+213px)/2))]">
				<DialogHeader className="gap-2 px-(--spacing-block-inline) pt-5 pb-4">
					<DialogTitle className="text-base">
						{t.settings.addConnectionTitle}
					</DialogTitle>
					<DialogDescription>{t.settings.addConnectionDesc}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col border-y px-2 py-2">
					{!connected.includes("Google Workspace") ? (
						<CatalogRow
							logo={GoogleLogo}
							name={t.settings.connGoogleWorkspace}
							description={t.settings.connGoogleWorkspaceDesc}
							href={`/${slug}/settings/connections/google`}
						/>
					) : null}
					{!connected.includes("Slack") ? (
						<CatalogRow
							logo={SlackLogo}
							name={t.settings.connSlack}
							description={t.settings.connSlackDesc}
							href={`/${slug}/settings/connections/slack`}
						/>
					) : null}
					{!connected.includes("Microsoft 365") ? (
						<CatalogRow
							logo={MicrosoftLogo}
							name={t.settings.connMicrosoft}
							description={t.settings.connMicrosoftDesc}
							href={`/${slug}/settings/connections/microsoft`}
						/>
					) : null}
					<CatalogRow
						logo={StripeLogo}
						name={t.settings.connStripe}
						description={t.settings.connComingSoon}
					/>
					<CatalogRow
						logo={DocusignLogo}
						name={t.settings.connDocusign}
						description={t.settings.connComingSoon}
					/>
					<CatalogRow
						logo={Plug}
						name={t.settings.connAnythingElse}
						description={t.settings.connIntakeNotAvail}
						href={`/${slug}/settings/connections/intake`}
					/>
				</div>
				<p className="px-(--spacing-block-inline) py-4 text-muted-foreground text-xs">
					{connected.length > 0
						? `${connected.join(", ")} ${t.settings.alreadyConnected}`
						: t.settings.nothingConnectedYet}
				</p>
			</DialogContent>
		</Dialog>
	);
}

function CatalogRow({
	logo: Logo,
	name,
	description,
	href,
}: {
	logo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	name: string;
	description: string;
	href?: string;
}) {
	const content = (
		<>
			<Logo className="size-5 shrink-0" />
			<div>
				<p className="font-medium text-sm">{name}</p>
				<p className="text-muted-foreground text-xs">{description}</p>
			</div>
		</>
	);
	return href ? (
		<Link
			href={href}
			className="flex items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-muted"
		>
			{content}
		</Link>
	) : (
		<div
			aria-disabled="true"
			className="flex items-center gap-3 rounded-md px-3 py-3 opacity-60"
		>
			{content}
		</div>
	);
}
