"use client";

import TrashCan from "@carbon/icons-react/es/TrashCan";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@crm/ui/components/alert-dialog";
import { Button } from "@crm/ui/components/button";
import { DataTable, type DataTableColumn } from "@crm/ui/components/data-table";
import { Icon } from "@crm/ui/components/icon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListSearch } from "@/components/data-table/list-search";
import { useTableQuery } from "@/components/data-table/use-table-query";
import { useTranslations } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { CopyValue } from "../copy-value";
import { ssoSearchParams } from "./sso-search-params";

type ProviderRow = RouterOutputs["sso"]["list"]["rows"][number];

function columns(
	canConfigure: boolean,
	onRemove: (provider: ProviderRow) => void,
	pending: boolean,
	t: Dictionary,
): DataTableColumn<ProviderRow>[] {
	return [
		{
			id: "providerId",
			header: t.settings.provider,
			sortable: true,
			hideable: false,
			width: "w-[30%]",
			cell: (row) => (
				<span className="flex min-w-0 flex-col">
					<span className="truncate font-medium">{row.name}</span>
					<span className="truncate text-muted-foreground text-xs">
						{row.type === "saml" ? "SAML" : "OpenID Connect"}
						{row.clientIdLastFour ? ` · client …${row.clientIdLastFour}` : ""}
					</span>
				</span>
			),
		},
		{
			id: "domain",
			header: t.settings.emailDomain,
			sortable: true,
			width: "w-[22%]",
			hideBelow: "sm",
			cell: (row) => (
				<span className="truncate text-muted-foreground">
					{row.domains.join(", ")}
				</span>
			),
		},
		{
			id: "issuer",
			header: t.settings.issuer,
			sortable: true,
			width: "w-[22%]",
			hideBelow: "md",
			cell: (row) => (
				<span className="truncate text-muted-foreground">{row.issuer}</span>
			),
		},
		{
			id: "callbackURL",
			header: t.settings.redirectUri,
			width: "w-[20%]",
			hideBelow: "lg",
			cell: (row) => (
				<span className="flex min-w-0 items-center gap-1 text-muted-foreground">
					<span className="truncate">{row.callbackURL}</span>
					<CopyValue value={row.callbackURL} label={t.settings.redirectUri} />
				</span>
			),
		},
		{
			id: "actions",
			header: <span className="sr-only">{t.common.actions}</span>,
			label: t.common.actions,
			hideable: false,
			align: "right",
			width: "w-[6%]",
			cell: (row) =>
				canConfigure ? (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="ghost" size="icon" disabled={pending}>
								<Icon icon={TrashCan} />
								<span className="sr-only">
									{t.settings.remove} {row.name}
								</span>
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									{t.settings.remove} {row.name}?
								</AlertDialogTitle>
								<AlertDialogDescription>
									{t.settings.ssoRemoveConfirmDesc}
								</AlertDialogDescription>
							</AlertDialogHeader>

						<AlertDialogFooter>
							<AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								onClick={() => onRemove(row)}
							>
								{t.settings.remove}
							</AlertDialogAction>
						</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				) : null,
		},
	];
}

export function SsoTable() {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const t = useTranslations();
	const { query, input } = useTableQuery(ssoSearchParams);

	const settings = useQuery(trpc.sso.settings.queryOptions());
	const providers = useQuery({
		...trpc.sso.list.queryOptions(input),
		placeholderData: (previous) => previous,
	});

	const remove = useMutation(
		trpc.sso.remove.mutationOptions({
			onSuccess: async () => {
				await cache.sso();
				toast.success(t.settings.providerRemoved);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	return (
		<DataTable
			query={query}
			search={<ListSearch placeholder={t.settings.ssoSearchPlaceholder} />}
			columns={columns(
				settings.data?.canConfigure ?? false,
				(provider) => remove.mutate({ providerId: provider.providerId }),
				remove.isPending,
				t,
			)}
			rows={providers.data?.rows ?? []}
			total={providers.data?.total ?? 0}
			getRowId={(row) => row.providerId}
			loading={providers.isFetching}
			empty={t.settings.noProviders}
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
		/>
	);
}
