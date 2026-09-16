"use client";

import { useMountEffect } from "@crm/ui/hooks/use-mount-effect";
import { useRouter } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import {
	DEFAULT_LOCALE,
	isValidLocale,
	LOCALE_COOKIE_NAME,
	LOCALES,
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

type I18nContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: Dictionary;
	locales: readonly Locale[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
	children,
	initialLocale = DEFAULT_LOCALE,
}: {
	children: React.ReactNode;
	initialLocale?: Locale;
}) {
	const [locale, setLocaleState] = useState<Locale>(initialLocale);
	const router = useRouter();

	useMountEffect(() => {
		try {
			const match = document.cookie
				.split("; ")
				.find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`));
			const cookieVal = match?.split("=")[1];
			if (isValidLocale(cookieVal) && cookieVal !== locale) {
				setLocaleState(cookieVal);
			} else {
				const storageVal = localStorage.getItem(LOCALE_COOKIE_NAME);
				if (isValidLocale(storageVal) && storageVal !== locale) {
					setLocaleState(storageVal);
				}
			}
		} catch {}
	});

	const setLocale = useCallback(
		(nextLocale: Locale) => {
			setLocaleState(nextLocale);
			document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
			try {
				localStorage.setItem(LOCALE_COOKIE_NAME, nextLocale);
			} catch {}
			router.refresh();
		},
		[router],
	);

	const t = useMemo(() => dictionaries[locale] ?? dictionaries.en, [locale]);

	const value = useMemo(
		() => ({
			locale,
			setLocale,
			t,
			locales: LOCALES,
		}),
		[locale, setLocale, t],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
	const context = useContext(I18nContext);
	if (!context) {
		return {
			locale: DEFAULT_LOCALE,
			setLocale: () => {},
			t: dictionaries.en,
			locales: LOCALES,
		};
	}
	return context;
}

export function useLocale(): Locale {
	return useI18n().locale;
}

export function useTranslations(): Dictionary {
	return useI18n().t;
}
