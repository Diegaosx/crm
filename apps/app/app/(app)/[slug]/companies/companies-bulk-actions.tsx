"use client";

import Archive from "@carbon/icons-react/es/Archive";
import Renew from "@carbon/icons-react/es/Renew";
import Undo from "@carbon/icons-react/es/Undo";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@crm/ui/components/dropdown-menu";
import { formatCount } from "@crm/ui/lib/format";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	BulkActionsMenu,
	BulkDeleteDialog,
	BulkOwnerMenu,
	reportBulk,
} from "@/components/crm/bulk-actions";
import { useTranslations } from "@/lib/i18n";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function CompaniesBulkActions({
	ids,
	onDone,
	archived,
}: {
	ids: string[];
	onDone: () => void;
	archived: boolean;
}) {
	const t = useTranslations();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const users = useQuery(trpc.users.list.queryOptions());
	const [confirming, setConfirming] = useState(false);

	const countStr = (count: number) =>
		formatCount(count, t.companies.company, t.companies.title);

	const onError = (error: { message: string }) => toast.error(error.message);

	const assignOwner = useMutation(
		trpc.companies.bulkAssignOwner.mutationOptions({
			onSuccess: async (result) => {
				await cache.company();
				reportBulk(
					result,
					(count) => `${countStr(count)} ${t.bulk.reassigned}`,
				);
				onDone();
			},
			onError,
		}),
	);

	const enrich = useMutation(
		trpc.companies.bulkEnrich.mutationOptions({
			onSuccess: async (result) => {
				await cache.company();
				reportBulk(
					result,
					(count) =>
						`${t.bulk.lookingUp} ${countStr(count)} ${t.bulk.tableWillUpdate}`,
				);
				onDone();
			},
			onError,
		}),
	);

	const archive = useMutation(
		trpc.companies.bulkArchive.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.removedMany({ kind: "company", ids: variables.ids });
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.archived}`);
				onDone();
			},
			onError,
		}),
	);

	const restore = useMutation(
		trpc.companies.bulkRestore.mutationOptions({
			onSuccess: async (result) => {
				await cache.company();
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.restored}`);
				onDone();
			},
			onError,
		}),
	);

	const purge = useMutation(
		trpc.companies.bulkPurge.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.removedMany({ kind: "company", ids: variables.ids });
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.purged}`);
				setConfirming(false);
				onDone();
			},
			onError,
		}),
	);

	if (archived) {
		const pending = restore.isPending || purge.isPending;

		return (
			<>
				<BulkActionsMenu pending={pending}>
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => restore.mutate({ ids })}>
							<Undo />
							{t.bulk.restore}
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							variant="destructive"
							onSelect={() => setConfirming(true)}
						>
							{t.bulk.deleteForever}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</BulkActionsMenu>

				<BulkDeleteDialog
					open={confirming}
					onOpenChange={setConfirming}
					title={`${t.common.delete} ${countStr(ids.length)}?`}
					description={t.bulk.deleteCompaniesConfirmDesc}
					onConfirm={() => purge.mutate({ ids })}
				/>
			</>
		);
	}

	const pending =
		assignOwner.isPending || enrich.isPending || archive.isPending;

	return (
		<BulkActionsMenu pending={pending}>
			<BulkOwnerMenu
				users={users.data ?? []}
				unassignedLabel={t.bulk.nobody}
				onSelect={(ownerId) => assignOwner.mutate({ ids, ownerId })}
			/>
			<DropdownMenuGroup>
				<DropdownMenuItem onSelect={() => enrich.mutate({ ids })}>
					<Renew />
					{t.bulk.reEnrich}
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem onSelect={() => archive.mutate({ ids })}>
					<Archive />
					{t.bulk.archive}
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</BulkActionsMenu>
	);
}
