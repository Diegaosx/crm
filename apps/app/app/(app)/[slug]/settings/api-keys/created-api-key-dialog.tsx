"use client";

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
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@crm/ui/components/input-group";
import { useTranslations } from "@/lib/i18n";
import type { RouterOutputs } from "@/lib/trpc/types";
import { CopyValue } from "../copy-value";

type CreatedApiKey = RouterOutputs["apiKeys"]["create"];

export function CreatedApiKeyDialog({
	apiKey,
	onOpenChange,
}: {
	apiKey: CreatedApiKey | null;
	onOpenChange: (open: boolean) => void;
}) {
	const t = useTranslations();

	return (
		<Dialog open={apiKey !== null} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{apiKey?.name ?? t.settings.key} {t.settings.apiKeyCreatedTitle}
					</DialogTitle>
					<DialogDescription>
						{t.settings.apiKeyCreatedDesc}
					</DialogDescription>
				</DialogHeader>

				<InputGroup>
					<InputGroupInput
						value={apiKey?.key ?? ""}
						readOnly
						className="font-mono"
					/>
					<InputGroupAddon align="inline-end">
						<CopyValue value={apiKey?.key ?? ""} label={t.settings.key} />
					</InputGroupAddon>
				</InputGroup>

				<DialogFooter>
					<Button onClick={() => onOpenChange(false)}>{t.common.done}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
