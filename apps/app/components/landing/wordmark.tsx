import Logo from "@crm/ui/components/logo";
import { cn } from "@crm/ui/lib/utils";

export function Wordmark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex shrink-0 select-none items-center gap-2.5",
				className,
			)}
		>
			<Logo className="size-6 shrink-0 text-foreground" />
			<span className="font-bold text-lg tracking-tight flex items-center gap-1.5">
				<span>CRM</span>
				<span className="text-emerald-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
					BR
				</span>
			</span>
		</span>
	);
}
