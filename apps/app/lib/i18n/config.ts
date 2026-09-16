import { z } from "zod";

export const LOCALES = ["en", "pt-BR", "es"] as const;

export const localeSchema = z.enum(LOCALES);

export type Locale = z.infer<typeof localeSchema>;

export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_COOKIE_NAME = "crm_locale";

export const LOCALE_LABELS = {
	en: "English",
	"pt-BR": "Português (Brasil)",
	es: "Español",
} as const satisfies Record<Locale, string>;

export function isValidLocale(
	locale: string | null | undefined,
): locale is Locale {
	return locale != null && localeSchema.safeParse(locale).success;
}
