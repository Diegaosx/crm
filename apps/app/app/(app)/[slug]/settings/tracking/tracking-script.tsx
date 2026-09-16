"use client";

import Copy from "@carbon/icons-react/es/Copy";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@crm/ui/components/accordion";
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
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Icon } from "@crm/ui/components/icon";
import { Label } from "@crm/ui/components/label";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { Switch } from "@crm/ui/components/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/i18n";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function TrackingScript() {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const t = useTranslations();
	const tracking = useQuery(trpc.tracking.settings.queryOptions());
	const [section, setSection] = useState("html");

	const setFlag = useMutation(
		trpc.tracking.setFlag.mutationOptions({
			onSuccess: async (_result, input) => {
				await cache.tracking();
				toast.success(
					input.enabled
						? t.settings.trackingPausedToast
						: t.settings.trackingResumedToast,
				);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	const rotate = useMutation(
		trpc.tracking.rotateSiteId.mutationOptions({
			onSuccess: async () => {
				await cache.tracking();
				toast.success(t.settings.siteIdRotatedToast);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!tracking.data) return null;

	const {
		siteId,
		snippet,
		tagManagerSnippet,
		scriptUrl,
		receivingSince,
		paused,
		canManage,
	} = tracking.data;

	const copy = (value: string | null) => {
		const clipboard = navigator.clipboard;

		if (!value || !clipboard) {
			toast.error(t.settings.couldNotCopyScript);
			return;
		}

		clipboard
			.writeText(value)
			.then(() => toast.success(t.settings.scriptCopied))
			.catch(() => toast.error(t.settings.couldNotCopyScript));
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						{t.settings.trackingScriptTitle}
						<StatusIndicator
							size="sm"
							tone={paused ? "warning" : receivingSince ? "success" : "neutral"}
							label={
								paused
									? t.settings.paused
									: receivingSince
										? t.settings.receivingViews
										: t.settings.noViewsYet
							}
						/>
					</div>
				</CardTitle>
				<CardDescription>
					{t.settings.trackingScriptDesc}
				</CardDescription>

				<CardAction>
					<Button
						size="sm"
						onClick={() =>
							copy(section === "gtm" ? tagManagerSnippet : snippet)
						}
						type="button"
					>
						<Icon icon={Copy} data-icon="inline-start" />
						{t.settings.copySnippet}
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<Accordion
					type="single"
					collapsible
					value={section}
					onValueChange={setSection}
				>
					<AccordionItem value="html">
						<AccordionTrigger>{t.settings.pasteHtml}</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4">
							<pre className="overflow-x-auto rounded-md border bg-muted p-4 font-mono text-code-foreground text-xs/5">
								<span className="text-code-accent">{"<script"}</span>
								{"\n  src="}
								<span className="text-code-string">{`"${scriptUrl}"`}</span>
								{"\n  data-site="}
								<span className="text-code-string">{`"${siteId}"`}</span>
								{"\n  async\n  defer\n"}
								<span className="text-code-accent">{"></script>"}</span>
							</pre>
							<p className="text-muted-foreground text-xs/relaxed">
								Site ID{" "}
								<span className="font-mono text-foreground">{siteId}</span> ·{" "}
								{t.settings.rotateSiteIdNotice}
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="gtm">
						<AccordionTrigger>
							{t.settings.gtmTitle}
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4">
							<pre className="overflow-x-auto rounded-md border bg-muted p-4 font-mono text-code-foreground text-xs/5">
								<span className="text-code-accent">{"<script"}</span>
								{"\n  src="}
								<span className="text-code-string">{`"${scriptUrl}?site=${siteId}"`}</span>
								{"\n  async\n  defer\n"}
								<span className="text-code-accent">{"></script>"}</span>
							</pre>
							<ol className="flex list-decimal flex-col gap-1 pl-4 text-muted-foreground text-xs/relaxed">
								<li>{t.settings.gtmStep1}</li>
								<li>
									{t.settings.gtmStep2}
								</li>
								<li>
									{t.settings.gtmStep3}
								</li>
							</ol>
							<p className="text-muted-foreground text-xs/relaxed">
								{t.settings.gtmNote}
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className="flex items-center justify-between gap-6">
					<Label
						htmlFor="tracking-paused"
						className="flex flex-col items-start gap-1"
					>
						<span className="text-sm">{t.settings.pauseTracking}</span>
						<span className="font-normal text-muted-foreground text-xs">
							{t.settings.pauseTrackingDesc}
						</span>
					</Label>

					<Switch
						id="tracking-paused"
						checked={paused}
						disabled={!canManage || setFlag.isPending}
						onCheckedChange={(enabled) =>
							setFlag.mutate({ flag: "paused", enabled })
						}
					/>
				</div>

				<CardFooter>
					<div className="-ml-2 flex flex-wrap items-center gap-1 text-muted-foreground">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="xs"
									disabled={!canManage || rotate.isPending}
								>
									{t.settings.rotateSiteId}
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>{t.settings.rotateSiteIdTitle}</AlertDialogTitle>
									<AlertDialogDescription>
										{t.settings.rotateSiteIdDesc}
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										onClick={() => rotate.mutate()}
									>
										{t.settings.rotateBtn}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</CardFooter>
			</CardContent>
		</Card>
	);
}

