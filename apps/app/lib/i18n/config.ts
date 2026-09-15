export const LOCALES = ["en", "pt-BR", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE_NAME = "crm_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
	en: "English",
	"pt-BR": "Português (Brasil)",
	es: "Español",
};

export function isValidLocale(locale: unknown): locale is Locale {
	return typeof locale === "string" && LOCALES.includes(locale as Locale);
}
