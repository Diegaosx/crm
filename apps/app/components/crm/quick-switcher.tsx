"use client";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@crm/ui/components/command";
import {
	EntityLogo,
	type EntityLogoTone,
} from "@crm/ui/components/entity-logo";
import { PersonAvatar } from "@crm/ui/components/person-avatar";
import { useQuery } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useOpenRecord } from "@/components/crm/record-sheet/record-stack";
import { useTranslations } from "@/lib/i18n";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { useTRPC } from "@/lib/trpc/client";

const KINDS = ["company", "contact", "deal"] as const;

export function QuickSwitcher() {
	const t = useTranslations();
	const openRecord = useOpenRecord();
	const trpc = useTRPC();

	const groupLabels = {
		company: t.companies.title,
		contact: t.contacts.title,
		deal: t.deals.title,
	} as const;

	const [open, setOpen] = useQueryState(
		SEARCH_PARAM.dialog.switcher,
		parseAsBoolean.withDefault(false),
	);
	const [query, setQuery] = useState("");

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				void setOpen((current) => (current ? null : true));
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [setOpen]);

	const results = useQuery({
		...trpc.search.quick.queryOptions({ q: query }),
		enabled: open && query.trim().length >= 2,
		placeholderData: (previous) => previous,
	});

	const hits = results.data?.hits ?? [];

	const go = (kind: (typeof KINDS)[number], id: string) => {
		setQuery("");
		void setOpen(null);
		openRecord({ kind, id });
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={(next) => setOpen(next || null)}
			title={t.search.searchTitle}
			description={t.search.searchDesc}
		>
			<Command shouldFilter={false}>
				<CommandInput
					placeholder={t.search.searchPlaceholder}
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					<CommandEmpty>
						{query.trim().length < 2
							? t.search.typeAtLeastTwo
							: t.search.nothingMatches}
					</CommandEmpty>

					{KINDS.map((kind) => {
						const group = hits.filter((hit) => hit.kind === kind);
						if (group.length === 0) return null;

						return (
							<CommandGroup key={kind} heading={groupLabels[kind]}>
								{group.map((hit) => (
									<CommandItem
										key={`${hit.kind}:${hit.id}`}
										value={`${hit.kind}:${hit.id}`}
										onSelect={() => go(kind, hit.id)}
									>
										{hit.kind === "contact" ? (
											<PersonAvatar
												src={hit.imageUrl}
												name={hit.label}
												size="sm"
											/>
										) : (
											<EntityLogo
												src={hit.iconUrl}
												darkSrc={hit.iconDarkUrl}
												tone={hit.iconTone as EntityLogoTone | null | undefined}
												name={hit.label}
												size="sm"
											/>
										)}
										<span className="flex min-w-0 flex-col">
											<span className="truncate">{hit.label}</span>
											{hit.detail ? (
												<span className="truncate text-muted-foreground text-xs">
													{hit.detail}
												</span>
											) : null}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						);
					})}
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
