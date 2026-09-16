"use client";

import Archive from "@carbon/icons-react/es/Archive";
import Undo from "@carbon/icons-react/es/Undo";
import type { DealStage } from "@crm/db/enums";
import { Button } from "@crm/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@crm/ui/components/dialog";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@crm/ui/components/dropdown-menu";
import { Field, FieldLabel } from "@crm/ui/components/field";
import { Spinner } from "@crm/ui/components/spinner";
import { Textarea } from "@crm/ui/components/textarea";
import { formatCount } from "@crm/ui/lib/format";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
	BulkActionsMenu,
	BulkDeleteDialog,
	BulkOwnerMenu,
	reportBulk,
} from "@/components/crm/bulk-actions";
import { DEAL_STAGE_OPTIONS, LOSING_STAGES } from "@/lib/deal-stage";
import { useTranslations } from "@/lib/i18n";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function DealsBulkActions({
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
	const reasonId = useId();
	const [closing, setClosing] = useState<DealStage | null>(null);
	const [reason, setReason] = useState("");
	const [confirming, setConfirming] = useState(false);

	const countStr = (count: number) =>
		formatCount(count, t.deals.colDeal, t.deals.title);

	const onError = (error: { message: string }) => toast.error(error.message);

	const assignOwner = useMutation(
		trpc.deals.bulkAssignOwner.mutationOptions({
			onSuccess: async (result) => {
				await cache.deal();
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.reassigned}`);
				onDone();
			},
			onError,
		}),
	);

	const setStage = useMutation(
		trpc.deals.bulkSetStage.mutationOptions({
			onSuccess: async (result) => {
				await cache.deal();
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.moved}`);
				setClosing(null);
				setReason("");
				onDone();
			},
			onError,
		}),
	);

	const archive = useMutation(
		trpc.deals.bulkArchive.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.removedMany({ kind: "deal", ids: variables.ids });
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.archived}`);
				onDone();
			},
			onError,
		}),
	);

	const restore = useMutation(
		trpc.deals.bulkRestore.mutationOptions({
			onSuccess: async (result) => {
				await cache.deal();
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.restored}`);
				onDone();
			},
			onError,
		}),
	);

	const purge = useMutation(
		trpc.deals.bulkPurge.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.removedMany({ kind: "deal", ids: variables.ids });
				reportBulk(result, (count) => `${countStr(count)} ${t.bulk.purged}`);
				setConfirming(false);
				onDone();
			},
			onError,
		}),
	);

	if (archived) {
		const archivedPending = restore.isPending || purge.isPending;

		return (
			<>
				<BulkActionsMenu pending={archivedPending}>
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
					description={t.bulk.deleteDealsConfirmDesc}
					onConfirm={() => purge.mutate({ ids })}
				/>
			</>
		);
	}

	const pending =
		assignOwner.isPending || setStage.isPending || archive.isPending;

	return (
		<>
			<BulkActionsMenu pending={pending}>
				<BulkOwnerMenu
					users={users.data ?? []}
					unassignedLabel={t.bulk.nobody}
					onSelect={(ownerId) =>
						ownerId && assignOwner.mutate({ ids, ownerId })
					}
				/>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>{t.bulk.changeStage}</DropdownMenuSubTrigger>
					<DropdownMenuSubContent className="max-h-72 overflow-y-auto">
						<DropdownMenuGroup>
							{DEAL_STAGE_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option.value}
									onSelect={() => {
										if (LOSING_STAGES.includes(option.value)) {
											setClosing(option.value);
											return;
										}
										setStage.mutate({ ids, stage: option.value });
									}}
								>
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={() => archive.mutate({ ids })}>
						<Archive />
						{t.bulk.archive}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</BulkActionsMenu>

			<Dialog
				open={closing !== null}
				onOpenChange={(next) => {
					if (next) return;
					setClosing(null);
					setReason("");
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{closing === "CLOSED_LOST"
								? `${t.bulk.closeAsLostTitle} (${countStr(ids.length)})`
								: `${t.bulk.markAsUnqualifiedTitle} (${countStr(ids.length)})`}
						</DialogTitle>
						<DialogDescription>
							{t.bulk.bulkReasonDesc}
						</DialogDescription>
					</DialogHeader>

					<form
						id="bulk-close-reason"
						className="px-4"
						onSubmit={(event) => {
							event.preventDefault();
							if (!closing) return;
							setStage.mutate({ ids, stage: closing, closedReason: reason });
						}}
					>
						<Field>
							<FieldLabel htmlFor={reasonId}>{t.common.reason}</FieldLabel>
							<Textarea
								id={reasonId}
								value={reason}
								onChange={(event) => setReason(event.target.value)}
								placeholder={t.bulk.reasonPlaceholder}
								rows={3}
							/>
						</Field>
					</form>

					<DialogFooter>
						<Button
							type="submit"
							form="bulk-close-reason"
							disabled={setStage.isPending || reason.trim() === ""}
						>
							{setStage.isPending ? <Spinner /> : null}
							{t.common.save}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setClosing(null);
								setReason("");
							}}
						>
							{t.common.cancel}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
