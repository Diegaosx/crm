"use client";

import Copy from "@carbon/icons-react/es/Copy";
import { Button } from "@crm/ui/components/button";
import { Icon } from "@crm/ui/components/icon";
import { toast } from "sonner";
import { useTranslations } from "@/lib/i18n";

export function CopyValue({ value, label }: { value: string; label: string }) {
	const t = useTranslations();

	const unavailable = () =>
		toast.error(
			`${t.common.couldNotCopy} ${label.toLowerCase()}. ${t.common.selectInstead}`,
		);

	return (
		<Button
			variant="ghost"
			size="icon"
			type="button"
			onClick={() => {
				const clipboard = navigator.clipboard;

				if (!clipboard) {
					unavailable();
					return;
				}

				clipboard
					.writeText(value)
					.then(() => toast.success(`${label} ${t.common.copied}`))
					.catch(unavailable);
			}}
		>
			<Icon icon={Copy} />
			<span className="sr-only">
				{t.settings.copySnippet} {label.toLowerCase()}
			</span>
		</Button>
	);
}
