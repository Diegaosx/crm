"use client";

import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@crm/ui/components/field";
import { Input } from "@crm/ui/components/input";
import { Spinner } from "@crm/ui/components/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/i18n";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function ArchiveRetention() {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const t = useTranslations();
	const daysId = useId();
	const [draft, setDraft] = useState("");

	const retention = useQuery(trpc.settings.archiveRetention.queryOptions());

	useEffect(() => {
		if (retention.data) setDraft(String(retention.data.days));
	}, [retention.data]);

	const save = useMutation(
		trpc.settings.setArchiveRetention.mutationOptions({
			onSuccess: async () => {
				await cache.settings();
				toast.success(t.settings.retentionSaved);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!retention.data) return null;

	const days = Number.parseInt(draft, 10);
	const unchanged = days === retention.data.days;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.settings.archivedRecords}</CardTitle>
				<CardDescription>{t.settings.archivedRecordsDesc}</CardDescription>

				<CardAction>
					<Button
						type="submit"
						form="archive-retention"
						disabled={
							save.isPending ||
							unchanged ||
							draft.trim() === "" ||
							!Number.isFinite(days)
						}
					>
						{save.isPending ? <Spinner data-icon="inline-start" /> : null}
						{t.common.save}
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<form
					id="archive-retention"
					onSubmit={(event) => {
						event.preventDefault();
						if (!Number.isFinite(days)) {
							toast.error(t.settings.enterDaysError);
							return;
						}
						save.mutate({ days });
					}}
				>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={daysId}>{t.settings.pruneAfter}</FieldLabel>
							<Input
								id={daysId}
								inputMode="numeric"
								value={draft}
								disabled={save.isPending}
								onChange={(event) => setDraft(event.target.value)}
							/>
							<FieldDescription>{t.settings.daysHelp}</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
