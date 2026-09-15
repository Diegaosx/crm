import type { MailboxProviderId } from "@crm/auth/scopes";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { getSession } from "@/lib/session";
import { getServerQueryClient, getServerTrpc } from "@/lib/trpc/server";
import { CredentialsSignIn } from "./credentials-sign-in";
import { SocialSignIn } from "./social-sign-in";
import { type SsoProvider, SsoSignIn } from "./sso-sign-in";

export const metadata: Metadata = {
	title: "Sign in",
};

type SignInOptions = {
	google: boolean;
	microsoft: boolean;
	providers: SsoProvider[];
};

async function signInOptions(): Promise<SignInOptions | null> {
	try {
		return await getServerQueryClient().fetchQuery(
			getServerTrpc().sso.signInOptions.queryOptions(),
		);
	} catch (error) {
		unstable_rethrow(error);
		console.error("Sign-in: could not read the sign-in options.", error);
		return null;
	}
}

async function currentSession() {
	try {
		return await getSession();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Sign-in: could not read the session.", error);
		return null;
	}
}

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
	return (
		<AuthShell>
			<Suspense
				fallback={
					<AuthHeading
						title="Bem-vindo de volta"
						description="Entre com seu e-mail e senha ou provedor social para continuar."
					/>
				}
			>
				<SignIn searchParams={searchParams} />
			</Suspense>
		</AuthShell>
	);
}

async function SignIn({
	searchParams,
}: Pick<PageProps<"/sign-in">, "searchParams">) {
	const [session, options, { method }] = await Promise.all([
		currentSession(),
		signInOptions(),
		searchParams,
	]);

	if (session) {
		redirect("/");
	}

	const configured: MailboxProviderId[] = [];
	if (options?.google ?? true) configured.push("google");
	if (options?.microsoft ?? false) configured.push("microsoft");

	const providers = options?.providers ?? [];

	const insisted = configured.find((provider) => provider === method);
	const showSso = providers.length > 0 && insisted === undefined;
	const social =
		insisted !== undefined
			? [insisted]
			: providers.length === 0
				? configured
				: [];

	const hasSocialOrSso = showSso || social.length > 0;

	return (
		<>
			<AuthHeading
				title="Acesse o CRM BR"
				description="Entre com seu e-mail e senha de administrador ou conecte sua conta Google."
			/>

			<CredentialsSignIn />

			{hasSocialOrSso && (
				<>
					<div className="relative flex items-center justify-center my-1">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<span className="relative bg-background px-3 text-[11px] text-muted-foreground uppercase">
							ou continue com
						</span>
					</div>

					{showSso ? <SsoSignIn providers={providers} /> : null}
					{social.map((provider) => (
						<SocialSignIn key={provider} provider={provider} />
					))}
				</>
			)}

			<p className="text-center text-xs text-muted-foreground pt-1">
				Ao continuar, você concorda com nossos{" "}
				<Link
					href="/terms"
					className="underline underline-offset-4 hover:text-foreground"
				>
					Termos de Uso
				</Link>{" "}
				e{" "}
				<Link
					href="/privacy"
					className="underline underline-offset-4 hover:text-foreground"
				>
					Política de Privacidade
				</Link>
				.
			</p>
		</>
	);
}
