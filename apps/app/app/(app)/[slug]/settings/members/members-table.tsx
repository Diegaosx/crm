"use client";

import OverflowMenuHorizontal from "@carbon/icons-react/es/OverflowMenuHorizontal";
import { Button } from "@crm/ui/components/button";
import {
	DataTable,
	type DataTableColumn,
	type DataTableFacet,
} from "@crm/ui/components/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@crm/ui/components/dropdown-menu";
import { Icon } from "@crm/ui/components/icon";
import { PersonAvatar } from "@crm/ui/components/person-avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { ListSearch } from "@/components/data-table/list-search";
import { useTableQuery } from "@/components/data-table/use-table-query";
import { LocalRelativeTime } from "@/components/local-date-time";
import { useTranslations } from "@/lib/i18n";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { membersSearchParams } from "./members-search-params";

type Role = "owner" | "admin" | "member";

type MemberRow = RouterOutputs["workspace"]["members"]["rows"][number];

export function MembersTable() {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const t = useTranslations();
	const { query, input } = useTableQuery(membersSearchParams);

	const roleLabels: Record<Role, string> = useMemo(
		() => ({
			owner: t.settings.roleOwner,
			admin: t.settings.roleAdmin,
			member: t.settings.roleMember,
		}),
		[t],
	);

	const workspace = useQuery(trpc.workspace.get.queryOptions());
	const members = useQuery({
		...trpc.workspace.members.queryOptions(input),
		placeholderData: (previous) => previous,
	});

	const setRole = useMutation(
		trpc.workspace.setMemberRole.mutationOptions({
			onSuccess: async () => {
				await cache.workspace();
				toast.success(t.settings.roleChanged);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	const facetCounts = members.data?.facetCounts;

	const facets: DataTableFacet[] = [
		{
			id: "role",
			label: t.settings.colRole,
			options: (Object.keys(roleLabels) as Role[]).flatMap((role) =>
				(facetCounts?.role?.[role] ?? 0) > 0
					? [{ value: role, label: roleLabels[role] }]
					: [],
			),
		},
	];

	const columns = useMemo<DataTableColumn<MemberRow>[]>(
		() => [
			{
				id: "name",
				header: t.settings.colName,
				sortable: true,
				hideable: false,
				width: "w-[34%]",
				cell: (row) => (
					<span className="flex min-w-0 items-center gap-2">
						<PersonAvatar
							size="sm"
							src={row.image}
							name={row.name}
							email={row.email}
						/>
						<span className="truncate font-medium">{row.name}</span>
						{row.isViewer ? (
							<span className="text-muted-foreground text-xs">
								{t.settings.roleYou}
							</span>
						) : null}
					</span>
				),
			},
			{
				id: "email",
				header: t.settings.colEmail,
				sortable: true,
				width: "w-[32%]",
				hideBelow: "md",
				cell: (row) => (
					<span className="truncate text-muted-foreground">{row.email}</span>
				),
			},
			{
				id: "role",
				header: t.settings.colRole,
				sortable: true,
				width: "w-[14%]",
				cell: (row) => (
					<span className="text-muted-foreground">
						{roleLabels[row.role as Role] ?? row.role}
					</span>
				),
			},
			{
				id: "joinedAt",
				header: t.settings.colJoined,
				label: t.settings.colJoinedDate,
				sortable: true,
				align: "right",
				width: "w-[14%]",
				hideBelow: "sm",
				cell: (row) => (
					<span className="text-muted-foreground">
						<LocalRelativeTime date={row.joinedAt} />
					</span>
				),
			},
			{
				id: "actions",
				header: <span className="sr-only">{t.settings.colActions}</span>,
				label: t.settings.colActions,
				hideable: false,
				align: "right",
				width: "w-[6%]",
				cell: (row) =>
					workspace.data?.canChangeRoles ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									disabled={setRole.isPending}
								>
									<Icon icon={OverflowMenuHorizontal} />
									<span className="sr-only">{t.settings.changeRole}</span>
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								{(Object.keys(roleLabels) as Role[]).map((role) => (
									<DropdownMenuItem
										key={role}
										data-checked={row.role === role}
										onSelect={() => {
											if (row.role === role) return;
											setRole.mutate({ memberId: row.id, role });
										}}
									>
										{roleLabels[role]}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					) : null,
			},
		],
		[t, roleLabels, workspace.data?.canChangeRoles, setRole],
	);

	return (
		<DataTable
			query={query}
			search={<ListSearch placeholder={t.settings.membersSearchPlaceholder} />}
			columns={columns}
			rows={members.data?.rows ?? []}
			total={members.data?.total ?? 0}
			facetCounts={facetCounts}
			facets={facets}
			getRowId={(row) => row.id}
			loading={members.isFetching}
			empty={t.settings.membersEmpty}
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
