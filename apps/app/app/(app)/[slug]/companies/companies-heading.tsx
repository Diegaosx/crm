"use client";

import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { useTranslations } from "@/lib/i18n";

export function CompaniesHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.companies.title}</PageShellTitle>
			<PageShellDescription>{t.companies.description}</PageShellDescription>
		</>
	);
}
