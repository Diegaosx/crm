import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

export const metadata: Metadata = {
	title: "Política de Privacidade",
	description: "Política de privacidade e proteção de dados do CRM.",
};

export default function PrivacyPage() {
	return (
		<div className="dark flex min-h-svh w-full flex-col items-center overflow-clip bg-background font-sans text-foreground">
			<LandingNav />

			<main className="flex w-full max-w-4xl flex-1 flex-col px-6 py-12 md:py-16">
				<div className="flex flex-col gap-3 border-border border-b pb-8">
					<span className="font-mono text-xs text-muted-foreground uppercase">
						Legal & Conformidade
					</span>
					<h1 className="text-3xl font-bold tracking-tight md:text-4xl">
						Política de Privacidade
					</h1>
					<p className="text-sm text-muted-foreground">
						Última atualização: 15 de setembro de 2026
					</p>
				</div>

				<article className="prose prose-invert mt-8 max-w-none space-y-8 text-sm/relaxed text-muted-foreground">
					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							1. Informações Gerais
						</h2>
						<p>
							Esta Política de Privacidade descreve como coletamos, usamos,
							armazenamos e protegemos os seus dados pessoais ao utilizar nossa
							plataforma de CRM. Nosso compromisso é respeitar a sua privacidade
							e cumprir as legislações aplicáveis de proteção de dados,
							incluindo a Lei Geral de Proteção de Dados (LGPD) e o Regulamento
							Geral sobre a Proteção de Dados (GDPR).
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							2. Dados que Coletamos
						</h2>
						<p>Podemos coletar as seguintes categorias de dados:</p>
						<ul className="list-disc space-y-1.5 pl-6">
							<li>
								<strong className="text-foreground">
									Dados de Autenticação e Conta:
								</strong>{" "}
								Nome, endereço de e-mail, foto de perfil e identificadores de
								conta fornecidos durante o login via provedores de identidade
								como Google OAuth e Microsoft SSO.
							</li>
							<li>
								<strong className="text-foreground">
									Dados de CRM e Relacionamento:
								</strong>{" "}
								Contatos, empresas, notas de reuniões, histórico de negociações
								e atividades comerciais cadastradas por sua organização.
							</li>
							<li>
								<strong className="text-foreground">
									Dados Técnicos e de Navegação:
								</strong>{" "}
								Endereço IP, tipo de navegador, identificador de dispositivo,
								páginas acessadas e registros de logs operacionais.
							</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							3. Uso e Divulgação de Dados das APIs do Google (Google OAuth)
						</h2>
						<p>
							Quando você opta por autenticar ou integrar sua conta do Google ao
							nosso CRM, o aplicativo solicita acesso apenas às informações
							estritamente necessárias para viabilizar a experiência de gestão
							de relacionamento.
						</p>
						<div className="rounded-lg border border-border/80 bg-muted/40 p-4">
							<p className="font-medium text-foreground">
								Conformidade com a Política de Dados do Usuário do Google:
							</p>
							<p className="mt-2 text-xs/relaxed text-muted-foreground">
								O uso e a transferência para qualquer outro aplicativo de
								informações recebidas das APIs do Google cumprirão a{" "}
								<a
									href="https://developers.google.com/terms/api-services-user-data-policy"
									target="_blank"
									rel="noreferrer"
									className="text-foreground underline underline-offset-4 hover:text-primary"
								>
									Google API Services User Data Policy
								</a>
								, incluindo os requisitos de Uso Limitado (Limited Use
								requirements).
							</p>
						</div>
						<ul className="list-disc space-y-1.5 pl-6">
							<li>
								Nenhum dado recebido através de escopos do Google é vendido,
								alugado ou compartilhado com terceiros para fins de publicidade.
							</li>
							<li>
								Os dados de e-mail e perfil são usados exclusivamente para
								identificar você no sistema e permitir a gestão colaborativa de
								clientes.
							</li>
							<li>
								Nenhum modelo de inteligência artificial ou machine learning
								generalista é treinado com os seus dados privados de e-mail ou
								contatos sem autorização explícita.
							</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							4. Finalidade do Tratamento de Dados
						</h2>
						<p>Utilizamos os dados coletados para:</p>
						<ul className="list-disc space-y-1.5 pl-6">
							<li>
								Prestar, operar e manter as funcionalidades da plataforma de
								CRM.
							</li>
							<li>
								Autenticar e autorizar o acesso de usuários aos seus respectivos
								espaços de trabalho.
							</li>
							<li>
								Organizar informações de vendas, empresas, pipelines e negócios.
							</li>
							<li>
								Garantir a segurança, prevenção a fraudes e integridade do
								sistema.
							</li>
							<li>Cumprir obrigações legais e regulatórias.</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							5. Compartilhamento e Armazenamento
						</h2>
						<p>
							Seus dados são armazenados em infraestrutura de banco de dados
							segura com criptografia em trânsito (TLS/SSL) e em repouso. Não
							comercializamos dados pessoais. O compartilhamento ocorre apenas
							com provedores de infraestrutura essenciais para a operação da
							plataforma (como hospedagem e banco de dados) ou mediante
							exigência legal.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							6. Seus Direitos e Exclusão de Dados
						</h2>
						<p>
							Você tem o direito de acessar, corrigir, exportar ou solicitar a
							exclusão completa de seus dados pessoais a qualquer momento. Caso
							deseje revogar o acesso concedido via Google ou excluir sua conta
							e dados vinculados, basta solicitar através dos canais de suporte
							ou remover a autorização diretamente em sua conta Google.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-foreground">
							7. Contato
						</h2>
						<p>
							Para dúvidas, solicitações ou esclarecimentos sobre esta Política
							de Privacidade ou sobre o tratamento de seus dados pessoais, entre
							em contato conosco através do e-mail de suporte da sua organização
							ou diretamente pelo painel do CRM.
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
