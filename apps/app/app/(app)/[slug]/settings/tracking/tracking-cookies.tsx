"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@crm/ui/components/field";
import { Label } from "@crm/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@crm/ui/components/select";
import { Switch } from "@crm/ui/components/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/i18n";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function TrackingCookies() {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const t = useTranslations();
	const lifetimeId = useId();

	const toggles = [
		{
			flag: "cookieSubdomains",
			label: t.settings.cookieSubdomainsLabel,
			hint: t.settings.cookieSubdomainsHint,
		},
		{
			flag: "secureCookies",
			label: t.settings.secureCookiesLabel,
			hint: t.settings.secureCookiesHint,
		},
		{
			flag: "honourDnt",
			label: t.settings.honourDntLabel,
			hint: t.settings.honourDntHint,
		},
	] as const;

	const tracking = useQuery(trpc.tracking.settings.queryOptions());

	const setFlag = useMutation(
		trpc.tracking.setFlag.mutationOptions({
			onSuccess: () => cache.tracking({ settle: "record" }),
			onError: (error) => toast.error(error.message),
		}),
	);

	const setLifetime = useMutation(
		trpc.tracking.setCookieLifetime.mutationOptions({
			onSuccess: async () => {
				await cache.tracking();
				toast.success(t.settings.cookieLifetimeSaved);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!tracking.data) return null;

	const { canManage, cookieDays, cookieLifetimes } = tracking.data;
	const busy = !canManage || setFlag.isPending || setLifetime.isPending;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.settings.cookiesTitle}</CardTitle>
				<CardDescription>
					{t.settings.cookiesDesc}
				</CardDescription>
			</CardHeader>

			<CardContent>
				{toggles.map((toggle) => (
					<div
						key={toggle.flag}
						className="flex items-center justify-between gap-6"
					>
						<Label
							htmlFor={`tracking-${toggle.flag}`}
							className="flex flex-col items-start gap-1"
						>
							<span className="text-sm">{toggle.label}</span>
							<span className="font-normal text-muted-foreground text-xs">
								{toggle.hint}
							</span>
						</Label>

						<Switch
							id={`tracking-${toggle.flag}`}
							checked={tracking.data[toggle.flag]}
							disabled={busy}
							onCheckedChange={(enabled) =>
								setFlag.mutate({ flag: toggle.flag, enabled })
							}
						/>
					</div>
				))}

				<Field>
					<FieldLabel htmlFor={lifetimeId}>{t.settings.cookieLifetime}</FieldLabel>
					<Select
						value={String(cookieDays)}
						disabled={busy}
						onValueChange={(value) =>
							setLifetime.mutate({ days: Number(value) })
						}
					>
						<SelectTrigger id={lifetimeId} className="w-full max-w-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{cookieLifetimes.map((lifetime) => (
								<SelectItem key={lifetime.days} value={String(lifetime.days)}>
									{lifetime.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldDescription>
						{t.settings.cookieLifetimeDesc}
					</FieldDescription>
				</Field>
			</CardContent>
		</Card>
	);
}

