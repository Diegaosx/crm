"use client";

import { useQueryState } from "nuqs";
import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { useTranslations } from "@/lib/i18n";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { overviewParsers } from "./overview-search-params";

export function OverviewGreetingFallback() {
	return (
		<>
			<PageShellTitle>Welcome back</PageShellTitle>
			<PageShellDescription>
				What you have closed, what is still in play, and what needs you today.
			</PageShellDescription>
		</>
	);
}

export function OverviewGreeting() {
	const [scope] = useQueryState(
		SEARCH_PARAM.overview.scope,
		overviewParsers[SEARCH_PARAM.overview.scope],
	);
	const t = useTranslations();

	return (
		<>
			<PageShellTitle>{t.overview.welcomeBack}</PageShellTitle>
			<PageShellDescription>
				{scope === "me"
					? t.overview.overviewDescMe
					: t.overview.overviewDescAll}
			</PageShellDescription>
		</>
	);
}
