"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import type { ChartConfig } from "@crm/ui/components/chart";
import { DashboardRow, StatGroup } from "@crm/ui/components/dashboard";
import { StatCard, type StatDelta } from "@crm/ui/components/stat-card";
import {
	formatCount,
	formatMoney,
	formatMoneyCompact,
	formatPercent,
} from "@crm/ui/lib/format";
import Link from "next/link";
import type { ReactNode } from "react";
import { AreaTrend, DonutStat } from "@/components/dashboard-charts";
import { dealStageColor, dealStageLabel } from "@/lib/deal-stage";
import { useTranslations } from "@/lib/i18n";
import type { RouterOutputs } from "@/lib/trpc/types";
import { useWorkspaceUrl } from "@/lib/use-workspace-url";

type Summary = RouterOutputs["dashboard"]["summary"];

const TREND_CONFIG: ChartConfig = {
	won: { label: "Closed won", color: "var(--success)" },
	created: { label: "New pipeline", color: "var(--chart-1)" },
};

function changeDelta(
	current: number,
	previous: number,
	label: string,
): StatDelta | undefined {
	if (previous === 0) return undefined;
	const change = Math.round(((current - previous) / previous) * 100);
	return {
		value: `${change >= 0 ? "+" : ""}${change}%`,
		direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
		label,
	};
}

export function SalesDashboard({ summary }: { summary: Summary }) {
	const workspaceUrl = useWorkspaceUrl();
	const t = useTranslations();

	const trendConfig: ChartConfig = {
		won: { label: t.overview.closedWonTrend, color: "var(--success)" },
		created: { label: t.overview.newPipelineTrend, color: "var(--chart-1)" },
	};

	const {
		pipeline,
		wonThisMonth,
		wonPrevMonth,
		performance,
		trend,
		closingThisMonthTotal,
		reportingCurrency,
		unconverted,
	} = summary;

	const money = (cents: number) => formatMoneyCompact(cents, reportingCurrency);
	const exact = (value: number | string) =>
		formatMoney(Number(value), reportingCurrency);

	const hasTrend = trend.some((point) => point.won > 0 || point.created > 0);

	const stageSlices = pipeline.stages.flatMap((stage) =>
		stage.valueCents > 0
			? [
					{
						key: stage.stage,
						label: t.stages[stage.stage] ?? dealStageLabel(stage.stage),
						value: stage.valueCents,
						color: dealStageColor(stage.stage),
						count: stage.count,
					},
				]
			: [],
	);

	return (
		<div className="flex flex-col gap-6">
			<StatGroup>
				<StatCard
					label={t.overview.dealsWon}
					value={money(wonThisMonth.valueCents)}
					delta={changeDelta(
						wonThisMonth.valueCents,
						wonPrevMonth.valueCents,
						t.overview.vsLastMonth,
					)}
					description={`${formatCount(wonThisMonth.count, t.deals.colDeal.toLowerCase())} · ${money(wonPrevMonth.valueCents)} ${t.overview.lastMonth}`}
				/>
				<StatCard
					label={t.overview.pipeline}
					value={money(pipeline.totalCents)}
					description={`${formatCount(pipeline.totalDeals, t.deals.colDeal.toLowerCase())} ${t.overview.inProgress} · ${money(closingThisMonthTotal.valueCents)} ${t.overview.dueThisMonth}`}
				/>
				<StatCard
					label={`${t.overview.winRate} (${performance.windowDays}d)`}
					value={
						performance.winRate === null
							? "—"
							: formatPercent(performance.winRate)
					}
					description={
						performance.wins + performance.losses === 0
							? t.overview.nothingClosedYet
							: `${performance.wins} ${t.overview.dealsWon.toLowerCase()} · ${performance.losses} ${t.overview.dealsLost.toLowerCase()}`
					}
				/>
				<StatCard
					label={`${t.overview.averageDealSize} (${performance.windowDays}d)`}
					value={
						performance.avgDealCents === null
							? "—"
							: money(performance.avgDealCents)
					}
					description={
						performance.avgCycleDays === null
							? t.overview.noWinsToMeasure
							: `${performance.avgCycleDays} ${t.overview.avgCycleDays}`
					}
				/>
			</StatGroup>

			{unconverted.count > 0 ? (
				<p className="text-muted-foreground text-xs">
					{t.overview.unconvertedNote} {reportingCurrency}.{" "}
					{formatCount(unconverted.count, t.deals.colDeal.toLowerCase())} in{" "}
					{unconverted.currencies.join(", ")}{" "}
					{t.overview.notIncluded}.{" "}
					<Link
						href={workspaceUrl("/settings/currencies")}
						className="underline hover:no-underline"
					>
						{t.overview.setOne}
					</Link>
					.
				</p>
			) : null}

			<DashboardRow split="hero">
				<ChartPanel
					title={t.overview.pipelineOverTime}
					description={t.overview.pipelineOverTimeDesc}
				>
					{hasTrend ? (
						<div className="flex flex-1 flex-col justify-center py-4">
							<AreaTrend
								data={trend}
								config={trendConfig}
								xKey="month"
								height={196}
								variant="gradient"
								bloom="high"
								showLegend
								formatValue={exact}
							/>
						</div>
					) : (
						<EmptyChart label={t.overview.pipelineEmpty} />
					)}
				</ChartPanel>

				<ChartPanel
					title={t.overview.stageDistribution}
					description={t.overview.stageDistributionDesc}
				>
					{stageSlices.length > 0 ? (
						<div className="flex flex-1 flex-col justify-between gap-1 pt-4">
							<DonutStat
								data={stageSlices}
								height={168}
								centerValue={money(pipeline.totalCents)}
								centerLabel={t.deals.colDeal.toLowerCase()}
								formatValue={exact}
							/>
							<ul className="flex flex-col px-5 pb-1 md:px-6">
								{stageSlices.map((slice) => (
									<li key={slice.key} className="border-t first:border-t-0">
										<Link
											href={`${workspaceUrl("/deals")}?stage=${slice.key}`}
											className="flex items-center gap-2.5 py-2 text-xs hover:underline"
										>
											<span
												aria-hidden
												className="size-1.5 shrink-0"
												style={{ backgroundColor: slice.color }}
											/>
											<span className="min-w-0 flex-1 truncate">
												{slice.label}
											</span>
											<span className="shrink-0 text-muted-foreground tabular-nums">
												{slice.count}
											</span>
											<span className="w-14 shrink-0 text-right font-medium tabular-nums">
												{money(slice.value)}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					) : (
						<EmptyChart label={t.overview.stageDistributionEmpty} />
					)}
				</ChartPanel>
			</DashboardRow>
		</div>
	);
}

function ChartPanel({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<Card className="min-w-0">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
			</CardHeader>
			<div className="flex flex-1 flex-col border">{children}</div>
		</Card>
	);
}

function EmptyChart({ label }: { label: string }) {
	return (
		<div className="flex flex-1 items-center justify-center px-5 py-10 text-muted-foreground text-sm md:px-6">
			{label}
		</div>
	);
}
