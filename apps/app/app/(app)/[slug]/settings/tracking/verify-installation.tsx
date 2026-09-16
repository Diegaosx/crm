"use client";

import CheckmarkFilled from "@carbon/icons-react/es/CheckmarkFilled";
import Warning from "@carbon/icons-react/es/Warning";
import { Alert, AlertDescription, AlertTitle } from "@crm/ui/components/alert";
import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@crm/ui/components/field";
import { Icon } from "@crm/ui/components/icon";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@crm/ui/components/input-group";
import { Spinner } from "@crm/ui/components/spinner";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/i18n";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";

type Result = RouterOutputs["tracking"]["verify"];

export function VerifyInstallation() {
	const trpc = useTRPC();
	const t = useTranslations();
	const urlId = useId();

	const [url, setUrl] = useState("");
	const [result, setResult] = useState<Result | null>(null);

	const tracking = useQuery(trpc.tracking.settings.queryOptions());

	const verify = useMutation(
		trpc.tracking.verify.mutationOptions({
			onSuccess: (outcome) => setResult(outcome),
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!tracking.data) return null;

	const { canManage, siteId } = tracking.data;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						{t.settings.verifyInstallationTitle}
						{result ? <Indicator result={result} /> : null}
					</div>
				</CardTitle>
				<CardDescription>
					{t.settings.verifyInstallationDesc}
				</CardDescription>

				<CardAction>
					<Button
						size="sm"
						type="submit"
						form="verify-tracking"
						disabled={!canManage || verify.isPending || url.trim() === ""}
					>
						{verify.isPending ? <Spinner data-icon="inline-start" /> : null}
						{t.settings.checkNow}
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<form
					id="verify-tracking"
					onSubmit={(event) => {
						event.preventDefault();
						setResult(null);
						verify.mutate({ url: url.trim() });
					}}
				>
					<Field>
						<FieldLabel htmlFor={urlId}>{t.settings.pageToCheck}</FieldLabel>
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>https://</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								id={urlId}
								value={url}
								onChange={(event) => {
									setUrl(event.target.value);
									setResult(null);
								}}
								placeholder="acme.com/pricing"
								autoComplete="off"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck={false}
								inputMode="url"
								disabled={!canManage || verify.isPending}
							/>
						</InputGroup>
						<FieldDescription>
							{t.settings.pageToCheckHelp}
						</FieldDescription>
					</Field>
				</form>

				{result && siteId ? <Outcome result={result} siteId={siteId} /> : null}
			</CardContent>
		</Card>
	);
}

function Indicator({ result }: { result: Result }) {
	const t = useTranslations();

	if (result.status === "found" && result.pageView) {
		return (
			<StatusIndicator size="sm" tone="success" label={t.settings.verifiedJustNow} />
		);
	}

	if (result.status === "found" && result.container?.carriesSiteId === false) {
		return (
			<StatusIndicator
				size="sm"
				tone="warning"
				label={t.settings.tagManagerNeedsFix}
			/>
		);
	}

	return (
		<StatusIndicator
			size="sm"
			tone="warning"
			label={result.status === "found" ? t.settings.noViewsYet : t.settings.notDetected}
		/>
	);
}

function Outcome({ result, siteId }: { result: Result; siteId: string }) {
	const t = useTranslations();

	if (result.status === "unreachable") {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>{t.settings.couldNotOpen} {result.host}</AlertTitle>
				<AlertDescription>
					{result.detail} {t.settings.couldNotOpenDesc}
				</AlertDescription>
			</Alert>
		);
	}

	if (result.status === "missing") {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>{t.settings.noScriptOn} {result.host}</AlertTitle>
				<AlertDescription>
					{t.settings.noScriptDesc1} {result.responseMs} {t.settings.noScriptDesc2}
					{result.containers.length > 0
						? ` (${result.containers.join(", ")})`
						: ""}
				</AlertDescription>
			</Alert>
		);
	}

	if (result.container && !result.container.carriesSiteId) {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>{t.settings.tagManagerDropSiteId}</AlertTitle>
				<AlertDescription>
					Contêiner {result.container.id} {t.settings.tagManagerDropDesc}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Alert>
			<Icon icon={CheckmarkFilled} className="text-success" />
			<AlertTitle>
				{result.container
					? `${t.settings.scriptFoundInContainer} ${result.container.id}`
					: `${t.settings.scriptFoundOn} ${result.host}`}
			</AlertTitle>
			<AlertDescription>
				{t.settings.scriptFoundDesc1} {result.responseMs} {t.settings.scriptFoundDesc2} {siteId} {t.settings.scriptFoundDesc3} {result.allowed ? t.settings.scriptFoundOnList : t.settings.scriptFoundNotOnList} {t.settings.scriptFoundDesc4}
				{result.container
					? ` ${t.settings.tagNotInHtmlNote}`
					: ""}
				{result.pageView
					? ` ${t.settings.pageViewArrived}`
					: ` ${t.settings.noPageViewArrived}`}
			</AlertDescription>
		</Alert>
	);
}

