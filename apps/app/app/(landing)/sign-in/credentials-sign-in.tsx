"use client";

import { signIn, signUp } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Input } from "@crm/ui/components/input";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import { useState } from "react";
import { toast } from "sonner";

export function CredentialsSignIn() {
	const [mode, setMode] = useState<"signin" | "signup">("signin");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setPending(true);

		try {
			if (mode === "signup") {
				const { error } = await signUp.email({
					name: name.trim() || email.split("@")[0] || "Admin",
					email: email.trim(),
					password,
					callbackURL: window.location.origin,
				});

				if (error) {
					toast.error(error.message || "Erro ao criar conta.");
					setPending(false);
					return;
				}

				toast.success("Conta criada com sucesso! Entrando...");
				window.location.href = "/";
			} else {
				const { error } = await signIn.email({
					email: email.trim(),
					password,
					callbackURL: window.location.origin,
				});

				if (error) {
					toast.error(error.message || "E-mail ou senha incorretos.");
					setPending(false);
					return;
				}

				toast.success("Autenticado com sucesso!");
				window.location.href = "/";
			}
		} catch {
			toast.error("Não foi possível conectar ao servidor.");
			setPending(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="flex rounded-lg border border-border p-1 bg-muted/30">
				<button
					type="button"
					onClick={() => setMode("signin")}
					className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
						mode === "signin"
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					Entrar com Senha
				</button>
				<button
					type="button"
					onClick={() => setMode("signup")}
					className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
						mode === "signup"
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					Criar Conta
				</button>
			</div>

			{mode === "signup" && (
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="name">Nome completo</Label>
					<Input
						id="name"
						type="text"
						required
						placeholder="Ex: Administrador"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={pending}
					/>
				</div>
			)}

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="email">E-mail</Label>
				<Input
					id="email"
					type="email"
					required
					placeholder="admin@crm.br"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={pending}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="password">Senha</Label>
				<Input
					id="password"
					type="password"
					required
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={pending}
				/>
			</div>

			<Button type="submit" className="w-full mt-1" disabled={pending}>
				{pending ? (
					<Spinner data-icon="inline-start" />
				) : mode === "signup" ? (
					"Criar conta e acessar"
				) : (
					"Entrar no CRM"
				)}
			</Button>
		</form>
	);
}
