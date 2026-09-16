"use client";

import Add from "@carbon/icons-react/es/Add";
import { Button } from "@crm/ui/components/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@crm/ui/components/field";
import { Icon } from "@crm/ui/components/icon";
import { Input } from "@crm/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@crm/ui/components/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@crm/ui/components/sheet";
import { Spinner } from "@crm/ui/components/spinner";
import { useMutation } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";
import { type ComponentProps, Suspense, useId, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/i18n";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { CreatedApiKeyDialog } from "./created-api-key-dialog";

const FORM = "create-api-key";

type ExpirationValue = "30" | "90" | "365" | "never";

type CreatedApiKey = RouterOutputs["apiKeys"]["create"];

function NewApiKeyButton(props: ComponentProps<typeof Button>) {
	const t = useTranslations();
	return (
		<Button {...props}>
			<Icon icon={Add} data-icon="inline-start" />
			{t.settings.newApiKey}
		</Button>
	);
}

export function CreateApiKeySheet() {
	return (
		<Suspense fallback={<NewApiKeyButton disabled />}>
			<CreateApiKeyForm />
		</Suspense>
	);
}

function CreateApiKeyForm() {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const t = useTranslations();

	const nameId = useId();
	const expirationId = useId();

	const [open, setOpen] = useQueryState(
		SEARCH_PARAM.dialog.create,
		parseAsBoolean.withDefault(false),
	);
	const [name, setName] = useState("");
	const [expiration, setExpiration] = useState<ExpirationValue>("90");
	const [created, setCreated] = useState<CreatedApiKey | null>(null);

	const expirationOptions = [
		{ value: "30", label: t.settings.days30 },
		{ value: "90", label: t.settings.days90 },
		{ value: "365", label: t.settings.year1 },
		{ value: "never", label: t.settings.noExpiration },
	] as const;

	const create = useMutation(
		trpc.apiKeys.create.mutationOptions({
			onSuccess: async (apiKey) => {
				await cache.apiKeys();
				await setOpen(null);
				setName("");
				setExpiration("90");
				setCreated(apiKey);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	return (
		<>
			<Sheet open={open} onOpenChange={(next) => setOpen(next || null)}>
				<SheetTrigger asChild>
					<NewApiKeyButton />
				</SheetTrigger>

				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>{t.settings.newApiKey}</SheetTitle>
						<SheetDescription>
							{t.settings.newApiKeyDesc}
						</SheetDescription>
					</SheetHeader>

					<form
						id={FORM}
						className="flex-1 overflow-y-auto px-4"
						onSubmit={(event) => {
							event.preventDefault();
							create.mutate({
								name: name.trim(),
								expiresInDays:
									expiration === "never" ? null : Number(expiration),
							});
						}}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor={nameId}>{t.common.name}</FieldLabel>
								<Input
									id={nameId}
									value={name}
									onChange={(event) => setName(event.target.value)}
									placeholder="CI pipeline"
									maxLength={64}
									autoComplete="off"
									autoCapitalize="off"
									autoCorrect="off"
									spellCheck={false}
									required
								/>
								<FieldDescription>
									{t.settings.apiKeyNameHelp}
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor={expirationId}>{t.common.expires}</FieldLabel>
								<Select
									value={expiration}
									onValueChange={(value) =>
										setExpiration(value as ExpirationValue)
									}
								>
									<SelectTrigger id={expirationId} className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{expirationOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						</FieldGroup>
					</form>

					<SheetFooter>
						<Button
							type="submit"
							form={FORM}
							disabled={!name.trim() || create.isPending}
						>
							{create.isPending ? <Spinner /> : null}
							{t.settings.createKey}
						</Button>
						<SheetClose asChild>
							<Button variant="outline">{t.common.cancel}</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			<CreatedApiKeyDialog
				apiKey={created}
				onOpenChange={(next) => {
					if (!next) setCreated(null);
				}}
			/>
		</>
	);
}
