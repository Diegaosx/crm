"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { CardTableEmpty } from "@crm/ui/components/card-table";
import {
	SimpleTable,
	type SimpleTableColumn,
	SimpleTableRow,
} from "@crm/ui/components/simple-table";
import { TableCell } from "@crm/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "@/lib/i18n";
import { useTRPC } from "@/lib/trpc/client";

const CELL = "px-3 py-2.5 align-middle";

export function TrafficSources() {
	const trpc = useTRPC();
	const t = useTranslations();
	const sources = useQuery(trpc.tracking.sources.queryOptions());

	const columns: SimpleTableColumn[] = [
		{ id: "source", header: t.settings.source },
		{ id: "medium", header: t.settings.colMedium, width: "w-32" },
		{ id: "views", header: t.settings.colViews, width: "w-28", align: "right" },
		{ id: "contacts", header: t.contacts.title, width: "w-24", align: "right" },
	];

	if (!sources.data) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.settings.trafficSourcesTitle}</CardTitle>
				<CardDescription>
					{t.settings.trafficSourcesDesc}
				</CardDescription>
			</CardHeader>

			{sources.data.length === 0 ? (
				<CardTableEmpty>
					{t.settings.trafficSourcesEmpty}
				</CardTableEmpty>
			) : (
				<SimpleTable columns={columns}>
					{sources.data.map((row) => (
						<SimpleTableRow key={`${row.source}-${row.medium ?? ""}`}>
							<TableCell className={CELL}>{row.source}</TableCell>
							<TableCell className={`${CELL} text-muted-foreground`}>
								{row.medium ?? "—"}
							</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>
								{row.views.toLocaleString()}
							</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>
								{row.contacts.toLocaleString()}
							</TableCell>
						</SimpleTableRow>
					))}
				</SimpleTable>
			)}
		</Card>
	);
}

