"use client";

import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { useTranslations } from "@/lib/i18n";

export function ContactsHeading() {
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.contacts.title}</PageShellTitle>
			<PageShellDescription>{t.contacts.description}</PageShellDescription>
		</>
	);
}
