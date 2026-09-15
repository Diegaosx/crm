"use client";

import { Badge } from "@crm/ui/components/badge";
import {
	Card,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@crm/ui/components/select";
import { toast } from "sonner";
import {
	DEFAULT_LOCALE,
	LOCALE_LABELS,
	LOCALES,
	type Locale,
	useI18n,
} from "@/lib/i18n";

export function LanguageSettings() {
	const { locale, setLocale, t } = useI18n();

	const handleLocaleChange = (nextLocale: string) => {
		setLocale(nextLocale as Locale);
		toast.success(t.settings.languageSaved);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle>{t.settings.languageTitle}</CardTitle>
					{locale === DEFAULT_LOCALE ? (
						<Badge variant="secondary">{t.settings.languageDefaultBadge}</Badge>
					) : null}
				</div>
				<CardDescription>{t.settings.languageDescription}</CardDescription>
			</CardHeader>

			<CardContent>
				<FieldGroup>
					<Field>
						<FieldLabel>{t.settings.languageTitle}</FieldLabel>
						<Select value={locale} onValueChange={handleLocaleChange}>
							<SelectTrigger className="w-full max-w-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{LOCALES.map((loc) => (
									<SelectItem key={loc} value={loc}>
										<div className="flex items-center gap-2">
											<span>{LOCALE_LABELS[loc]}</span>
											{loc === DEFAULT_LOCALE ? (
												<span className="text-muted-foreground text-xs">
													({t.settings.languageDefaultBadge})
												</span>
											) : null}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldDescription>{LOCALE_LABELS[locale]}</FieldDescription>
					</Field>
				</FieldGroup>
			</CardContent>
		</Card>
	);
}
