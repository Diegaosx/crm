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
