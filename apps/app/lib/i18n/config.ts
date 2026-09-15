import { z } from "zod";

export const LOCALES = ["en", "pt-BR", "es"] as const;

export const localeSchema = z.enum(LOCALES);

export type Locale = z.infer<typeof localeSchema>;

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE_NAME = "crm_locale";

export const LOCALE_LABELS = {
	en: "English",
	"pt-BR": "Português (Brasil)",
	es: "Español",
} as const satisfies Record<Locale, string>;

export function isValidLocale(locale: string | undefined): locale is Locale {
	return locale !== undefined && localeSchema.safeParse(locale).success;
}
