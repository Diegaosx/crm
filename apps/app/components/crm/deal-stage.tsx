"use client";

import type { DealStage } from "@crm/db/enums";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { dealStagePresentation } from "@/lib/deal-stage";
import { useTranslations } from "@/lib/i18n";

export function DealStageIndicator({
	stage,
	className,
}: {
	stage: DealStage;
	className?: string;
}) {
	const t = useTranslations();
	const { label, tone } = dealStagePresentation(stage);
	return (
		<StatusIndicator
			tone={tone}
			label={t.stages[stage] ?? label}
			className={className}
		/>
	);
}
