"use client";

import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { useTranslations } from "@/lib/i18n";

export function GeneralSettingsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.settings.generalTitle}</PageShellTitle>
			<PageShellDescription>
				{t.settings.generalDescription}
			</PageShellDescription>
		</>
	);
}

export function MembersSettingsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.settings.membersTitle}</PageShellTitle>
			<PageShellDescription>
				{t.settings.membersDescription}
			</PageShellDescription>
		</>
	);
}

export function CurrenciesSettingsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.settings.currenciesTitle}</PageShellTitle>
			<PageShellDescription>
				{t.settings.currenciesDescription}
			</PageShellDescription>
		</>
	);
}

export function ApiKeysSettingsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.settings.apiKeysTitle}</PageShellTitle>
			<PageShellDescription>
				{t.settings.apiKeysDescription}
			</PageShellDescription>
		</>
	);
}

export function SsoSettingsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.settings.ssoTitle}</PageShellTitle>
			<PageShellDescription>{t.settings.ssoDescription}</PageShellDescription>
		</>
	);
}

export function TrackingSettingsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.settings.trackingTitle}</PageShellTitle>
			<PageShellDescription>
				{t.settings.trackingDescription}
			</PageShellDescription>
		</>
	);
}
