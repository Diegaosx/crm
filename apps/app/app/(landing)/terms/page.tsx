import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

export const metadata: Metadata = {
	title: "Termos de Uso",
	description: "Termos e condições de uso da plataforma CRM.",
};

export default function TermsPage() {
	return (
		<div className="dark flex min-h-svh w-full flex-col items-center overflow-clip bg-background font-sans text-foreground">
			<LandingNav />

			<main className="flex w-full max-w-4xl flex-1 flex-col px-6 py-12 md:py-16">
				<div className="flex flex-col gap-3 border-border border-b pb-8">
					<span className="font-mono text-xs text-muted-foreground uppercase">
						Legal & Conformidade
					</span>
					<h1 className="text-3xl font-bold tracking-tight md:text-4xl">
						Termos de Uso
					</h1>
					<p className="text-sm text-muted-foreground">
						Última atualização: 15 de setembro de 2026
					</p>
				</div>

				<article className="prose prose-invert mt-8 max-w-none space-y-8 text-sm/relaxed text-muted-foreground">
					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							1. Aceitação dos Termos
						</h2>
						<p>
							Ao acessar e utilizar esta plataforma de CRM, você concorda em
							cumprir e estar vinculado aos presentes Termos de Uso e a todas as
							leis e regulamentos aplicáveis. Se você não concordar com qualquer
							um destes termos, você não deve utilizar ou acessar este serviço.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							2. Descrição dos Serviços
						</h2>
						<p>
							Nossa plataforma oferece soluções de Customer Relationship
							Management (CRM), incluindo gerenciamento de contatos, empresas,
							pipelines de negócios, tarefas comerciais e integrações com
							ferramentas de produtividade e comunicação (como Google Workspace,
							Microsoft e Slack).
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							3. Contas e Segurança
						</h2>
						<p>
							Você é responsável por manter a confidencialidade das credenciais de
							acesso à sua conta e por todas as atividades que ocorram sob sua
							conta. Você concorda em nos notificar imediatamente sobre qualquer
							uso não autorizado ou violação de segurança.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							4. Uso Aceitável
						</h2>
						<p>Você concorda em não:</p>
						<ul className="list-disc space-y-1.5 pl-6">
							<li>Utilizar o sistema para fins ilícitos, fraudulentos ou prejudiciais a terceiros.</li>
							<li>Transmitir vírus, malwares ou qualquer código de natureza destrutiva.</li>
							<li>Tentar obter acesso não autorizado a sistemas, dados ou redes conectadas à plataforma.</li>
							<li>Interferir na integridade ou no desempenho das operações do sistema.</li>
							<li>Realizar engenharia reversa ou tentar extrair código-fonte fora dos termos de licença aplicáveis.</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							5. Propriedade Intelectual e Dados do Cliente
						</h2>
						<p>
							Todos os dados inseridos por você ou por sua organização na
							plataforma permanecem de sua exclusiva propriedade. A plataforma
							concede a você uma licença limitada, não exclusiva e revogável para
							utilizar os recursos do software de acordo com estes termos.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							6. Limitação de Responsabilidade
						</h2>
						<p>
							O serviço é fornecido &quot;no estado em que se encontra&quot; e
							&quot;conforme disponível&quot;. Na extensão máxima permitida por lei,
							não nos responsabilizamos por quaisquer danos indiretos,
							incidentais, especiais ou consequentes decorrentes do uso ou da
							impossibilidade de uso dos serviços.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							7. Modificações dos Termos
						</h2>
						<p>
							Podemos revisar estes Termos de Uso a qualquer momento. O uso
							continuado da plataforma após a publicação de alterações constituirá
							sua aceitação tácita das revisões.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							8. Contato
						</h2>
						<p>
							Dúvidas sobre estes Termos de Uso podem ser direcionadas através do
							painel de suporte e configurações do CRM.
						</p>
					</section>

					<div className="pt-6">
						<Link
							href="/sign-in"
							className="inline-flex items-center text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
						>
							← Voltar para a tela de login
						</Link>
					</div>
				</article>
			</main>

			<LandingFooter />
		</div>
	);
}
