"use client";

import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { useTranslations } from "@/lib/i18n";

export function DealsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.deals.title}</PageShellTitle>
			<PageShellDescription>{t.deals.description}</PageShellDescription>
		</>
	);
}
