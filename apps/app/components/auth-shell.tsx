import Logo from "@crm/ui/components/logo";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthShader } from "@/components/auth-shader";

export function AuthShell({ children }: { children: ReactNode }) {
	return (
		<main className="dark grid min-h-svh bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
			<section className="relative hidden min-h-svh overflow-hidden bg-muted p-8 lg:flex lg:flex-col lg:justify-between xl:p-12">
				<AuthShader />

				<div className="relative flex gap-2 text-sm/5">
					<Link href="/" aria-label="CRM BR" className="flex items-center gap-3">
						<Logo className="size-8 shrink-0" />
						<span className="font-bold text-xl tracking-tight text-foreground flex items-center gap-1.5">
							<span>CRM</span>
							<span className="text-emerald-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
								BR
							</span>
						</span>
					</Link>
				</div>

				<div className="relative flex max-w-lg flex-col gap-8">
					<div className="flex flex-col gap-4">
						<p className="font-mono text-xs/4 text-emerald-500 font-semibold tracking-wider uppercase">
							CRM BR
						</p>
						<h1 className="max-w-[14ch] text-5xl/14 font-semibold text-balance">
							Every customer, one place.
						</h1>
					</div>
				</div>

				<div className="relative flex items-center justify-between font-mono text-xs/4 text-muted-foreground">
					<p>
						Made with love by{" "}
						<a
							href="https://trycomp.ai"
							target="_blank"
							rel="noreferrer"
							className="underline underline-offset-4 hover:text-foreground"
						>
							Comp AI
						</a>
					</p>
					<div className="flex gap-4">
						<Link
							href="/privacy"
							className="underline underline-offset-4 hover:text-foreground"
						>
							Privacidade
						</Link>
						<Link
							href="/terms"
							className="underline underline-offset-4 hover:text-foreground"
						>
							Termos
						</Link>
					</div>
				</div>
			</section>

			<section className="flex min-h-svh flex-col bg-background px-6 py-8 sm:px-10 lg:px-14">
				<div className="flex gap-2 text-sm/5 lg:hidden pb-4">
					<Link href="/" aria-label="CRM BR" className="flex items-center gap-2.5">
						<Logo className="size-7 shrink-0" />
						<span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
							<span>CRM</span>
							<span className="text-emerald-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
								BR
							</span>
						</span>
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-center py-12">
					<div className="flex w-full max-w-sm flex-col gap-8">{children}</div>
				</div>

				<div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4">
					<Link
						href="/privacy"
						className="underline underline-offset-4 hover:text-foreground"
					>
						Política de Privacidade
					</Link>
					<span>•</span>
					<Link
						href="/terms"
						className="underline underline-offset-4 hover:text-foreground"
					>
						Termos de Uso
					</Link>
				</div>
			</section>
		</main>
	);
}

export function AuthHeading({
	title,
	description,
}: {
	title: string;
	description: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4 text-left">
			<Link href="/" aria-label="CRM BR" className="flex items-center gap-3">
				<Logo className="size-9 shrink-0" />
				<span className="font-bold text-2xl tracking-tight text-foreground flex items-center gap-1.5">
					<span>CRM</span>
					<span className="text-emerald-500 font-extrabold text-sm px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
						BR
					</span>
				</span>
			</Link>
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl/8 font-semibold tracking-tight text-balance">
					{title}
				</h2>
				<p className="max-w-[32ch] text-sm/5 text-muted-foreground text-pretty">
					{description}
				</p>
			</div>
		</div>
	);
}
