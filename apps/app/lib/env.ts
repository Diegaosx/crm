function ensureProtocol(url: string): string {
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("localhost") || url.startsWith("127.0.0.1")) {
		return `http://${url}`;
	}
	return `https://${url}`;
}

export function getApiUrl(): string {
	const raw =
		process.env.API_URL ??
		process.env.NEXT_PUBLIC_API_URL ??
		"http://localhost:3001";
	return ensureProtocol(raw);
}

export const API_URL = getApiUrl();

export function isMarketing(): boolean {
	return process.env.IS_MARKETING === "true";
}
