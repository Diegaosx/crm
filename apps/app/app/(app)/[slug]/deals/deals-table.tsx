"use client";

import Archive from "@carbon/icons-react/es/Archive";
import { Button } from "@crm/ui/components/button";
import {
	DataTable,
	type DataTableColumn,
	type DataTableFacet,
} from "@crm/ui/components/data-table";
import { EmptyCellValue } from "@crm/ui/components/empty-cell";
import { useTableSelection } from "@crm/ui/hooks/use-table-selection";
import { formatMoney } from "@crm/ui/lib/format";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { CLOSING_OPTIONS } from "@/components/crm/closing-window";
import { CompanyCell } from "@/components/crm/company-cell";
import { useFieldColumns } from "@/components/crm/fields/field-columns";
import { useFieldFacets } from "@/components/crm/fields/field-facets";
import { OwnerCell } from "@/components/crm/owner-cell";
import { usePrefetchRecord } from "@/components/crm/record-sheet/record-prefetch";
import { useOpenRecord } from "@/components/crm/record-sheet/record-stack";
import { DealStageMenu } from "@/components/crm/stage-change";
import { ListSearch } from "@/components/data-table/list-search";
import { SavedViewsMenu } from "@/components/data-table/saved-views-menu";
import { useTableQuery } from "@/components/data-table/use-table-query";
import { LocalDay, LocalRelativeTime } from "@/components/local-date-time";
import { DEAL_STAGE_OPTIONS } from "@/lib/deal-stage";
import { useTranslations } from "@/lib/i18n";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { DealsBulkActions } from "./deals-bulk-actions";
import { dealsSearchParams } from "./deals-search-params";

type DealRow = RouterOutputs["deals"]["list"]["rows"][number];

export function DealsTable() {
	const openRecord = useOpenRecord();
	const trpc = useTRPC();
	const prefetchRecord = usePrefetchRecord();
	const table = useTableQuery(dealsSearchParams);
	const { query, input, setArchived } = table;
	const t = useTranslations();

	const deals = useQuery({
		...trpc.deals.list.queryOptions(input),
		placeholderData: (previous) => previous,
	});
	const users = useQuery(trpc.users.list.queryOptions());

	const rows = deals.data?.rows ?? [];
	const selection = useTableSelection(
		useMemo(() => rows.map((row) => row.id), [rows]),
	);
	const settledIds = useMemo(() => {
		const matching = new Set(
			rows
				.filter((row) => Boolean(row.archivedAt) === input.archived)
				.map((row) => row.id),
		);
		return selection.ids.filter((id) => matching.has(id));
	}, [rows, input.archived, selection.ids]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: clearing on archived-mode change is the entire purpose of this effect.
	useEffect(() => {
		selection.clear();
	}, [input.archived]);

	const toggleArchived = (next: boolean) => {
		selection.clear();
		if (!next && query.sort === "archivedAt") query.setSort("");
		setArchived(next);
	};

	const facetCounts = deals.data?.facetCounts;
	const fieldFacets = useFieldFacets("DEAL", facetCounts);

	const facets: DataTableFacet[] = [
		{
			id: "owner",
			label: t.deals.colOwner,
			options: (users.data ?? []).flatMap((user) =>
				(facetCounts?.owner?.[user.id] ?? 0) > 0
					? [{ value: user.id, label: user.name }]
					: [],
			),
		},
		{
			id: "stage",
			label: t.deals.colStage,
			options: DEAL_STAGE_OPTIONS.filter(
				(option) => (facetCounts?.stage?.[option.value] ?? 0) > 0,
			).map((option) => ({
				value: option.value,
				label: t.stages[option.value] ?? option.label,
			})),
		},
		{
			id: "closing",
			label: t.deals.facetClosing,
			options: CLOSING_OPTIONS.flatMap((option) =>
				(facetCounts?.closing?.[option.value] ?? 0) > 0
					? [{ value: option.value, label: option.label }]
					: [],
			),
		},
		...fieldFacets,
	];

	const openValueCents = deals.data?.openValueCents;
	const reportingCurrency = deals.data?.reportingCurrency;
	const unconverted = deals.data?.unconverted;
	const uncounted = unconverted?.count ?? 0;
	const openPipelineCents = openValueCents ?? (uncounted > 0 ? 0 : null);

	const baseColumns = useMemo<DataTableColumn<DealRow>[]>(
		() => [
			{
				id: "name",
				header: t.deals.colDeal,
				sortable: true,
				hideable: false,
				width: "w-[24%]",
				cell: (row) => <span className="truncate font-medium">{row.name}</span>,
			},
			{
				id: "company",
				header: t.deals.colCompany,
				sortable: true,
				width: "w-[18%]",
				cell: (row) => <CompanyCell company={row.company} />,
			},
			{
				id: "stage",
				header: t.deals.colStage,
				sortable: true,
				width: "w-[18%]",
				cell: (row) => <DealStageMenu dealId={row.id} stage={row.stage} />,
			},
			{
				id: "amount",
				header: t.deals.colAmount,
				sortable: true,
				align: "right",
				width: "w-[12%]",
				hideBelow: "sm",
				cell: (row) =>
					row.amountCents === null ? (
						<EmptyCellValue />
					) : (
						<span className="tabular-nums">
							{formatMoney(row.amountCents, row.currency)}
						</span>
					),
			},
			{
				id: "owner",
				header: t.deals.colOwner,
				sortable: true,
				width: "w-[14%]",
				hideBelow: "md",
				cell: (row) => <OwnerCell owner={row.owner} />,
			},
			{
				id: "expectedCloseDate",
				header: t.deals.colExpectedClose,
				label: t.deals.colExpectedCloseFull,
				sortable: true,
				width: "w-[12%]",
				hideBelow: "lg",
				cell: (row) =>
					row.expectedCloseDate ? (
						<span className="text-muted-foreground">
							<LocalDay date={row.expectedCloseDate} />
						</span>
					) : (
						<EmptyCellValue />
					),
			},
			{
				id: "createdAt",
				header: t.deals.colCreated,
				label: t.deals.colCreatedFull,
				sortable: true,
				align: "right",
				width: "w-[10%]",
				defaultHidden: true,
				cell: (row) => (
					<span className="text-muted-foreground">
						<LocalRelativeTime date={row.createdAt} />
					</span>
				),
			},
			{
				id: "lastActivity",
				header: t.deals.colLastActivity,
				sortable: true,
				align: "right",
				width: "w-[12%]",
				hideBelow: "lg",
				cell: (row) => (
					<span className="text-muted-foreground">
						{row.lastActivityAt ? (
							<LocalRelativeTime date={row.lastActivityAt} />
						) : (
							<EmptyCellValue />
						)}
					</span>
				),
			},
		],
		[t],
	);

	const archivedColumn = useMemo<DataTableColumn<DealRow>>(
		() => ({
			id: "archivedAt",
			header: t.deals.colArchived,
			label: t.deals.colArchivedFull,
			sortable: true,
			align: "right",
			width: "w-[12%]",
			cell: (row) => (
				<span className="text-muted-foreground">
					{row.archivedAt ? (
						<LocalRelativeTime date={row.archivedAt} />
					) : (
						<EmptyCellValue />
					)}
				</span>
			),
		}),
		[t],
	);

	const fieldColumns = useFieldColumns<DealRow>("DEAL");
	const columns = useMemo(
		() =>
			input.archived
				? [...baseColumns, archivedColumn, ...fieldColumns]
				: [...baseColumns, ...fieldColumns],
		[baseColumns, archivedColumn, fieldColumns, input.archived],
	);

	return (
		<DataTable
			query={query}
			search={<ListSearch placeholder={t.deals.searchPlaceholder} />}
			actions={
				<div className="flex items-center gap-2">
					<SavedViewsMenu entity="DEAL" table={table} />
					<Button
						variant={input.archived ? "contrast" : "outline"}
						size="sm"
						className="justify-start sm:justify-center"
						onClick={() => toggleArchived(!input.archived)}
					>
						<Archive data-icon="inline-start" />
						{t.deals.colArchived}
					</Button>
				</div>
			}
			columns={columns}
			rows={rows}
			total={deals.data?.total ?? 0}
			facetCounts={facetCounts}
			facets={facets}
			tabs={{
				id: "status",
				allLabel: t.deals.allDeals,
				options: [
					{ value: "open", label: t.deals.open },
					{ value: "closed", label: t.deals.closed },
				],
			}}
			labels={{
				filters: t.common.filters,
				sort: t.common.sort,
				sortBy: t.common.sortBy,
				detail: t.common.detail,
				ascending: t.common.ascending,
				descending: t.common.descending,
				columns: t.common.columns,
				toggleColumns: t.common.toggleColumns,
				selected: t.common.selected,
				clear: t.common.clear,
				noResults: t.common.noResults,
				nothingMatches: t.common.nothingMatches,
				all: t.common.all,
			}}
			selection={{
				state: selection,
				actions: (
					<DealsBulkActions
						ids={settledIds}
						onDone={selection.clear}
						archived={input.archived}
					/>
				),
				rowLabel: (row) => row.name,
			}}
			getRowId={(row) => row.id}
			loading={deals.isFetching}
			onRowHover={(row) => prefetchRecord({ kind: "deal", id: row.id })}
			onRowClick={(row) => openRecord({ kind: "deal", id: row.id })}
			empty={input.archived ? t.deals.noArchivedDeals : t.deals.emptyMatch}
			meta={
				input.archived || openPipelineCents === null ? undefined : (
					<span>
						{deals.data?.total ?? 0} {t.deals.dealsCount} ·{" "}
						<span className="tabular-nums">
							{formatMoney(openPipelineCents, reportingCurrency)}
						</span>{" "}
						{t.deals.openPipeline}
						{unconverted && unconverted.count > 0 ? (
							<span className="text-muted-foreground">
								{" "}
								· {unconverted.count} {t.deals.notCounted} (
								{unconverted.currencies.join(", ")} {t.deals.noRate})
							</span>
						) : null}
					</span>
				)
			}
		/>
	);
}
