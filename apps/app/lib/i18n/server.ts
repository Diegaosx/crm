import "server-only";
import { cookies } from "next/headers";
import {
	DEFAULT_LOCALE,
	isValidLocale,
	LOCALE_COOKIE_NAME,
	type Locale,
} from "./config";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import ptBR from "./dictionaries/pt-br";
import type { Dictionary } from "./types";

const dictionaries = {
	en,
	"pt-BR": ptBR,
	es,
} satisfies Record<Locale, Dictionary>;

export async function getServerLocale(): Promise<Locale> {
	const cookieStore = await cookies();
	const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
	if (isValidLocale(value)) {
		return value;
	}
	return DEFAULT_LOCALE;
}

export async function getServerTranslations(): Promise<{
	locale: Locale;
	t: Dictionary;
}> {
	const locale = await getServerLocale();
	const t = dictionaries[locale] ?? dictionaries.en;
	return { locale, t };
}
