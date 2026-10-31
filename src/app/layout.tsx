import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { Navbar } from "@/components/Navbar";
import { AccessibilityModal } from "@/components/AccessibilityModal";
import { AccessibilityButton } from "@/components/AccessibilityButton";

export const metadata: Metadata = {
  title: "DevFest Match - Ninguém precisa ir sozinho ao DevFest",
  description: "Conecte mentores seniores e iniciantes em Next.js previamente ao DevFest. Acessível e inclusivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-blue-600 selection:text-white">
        {/* Link para pular direto ao conteúdo principal (Leitores de tela & navegação por teclado) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-9999 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-xl"
        >
          Pular para o conteúdo principal
        </a>

        <AccessibilityProvider>
          <AuthProvider>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 outline-hidden">
              {children}
            </main>
            <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
              DevFest Match &bull; &ldquo;Ninguém precisa ir sozinho ao DevFest&rdquo; &bull; Plataforma Acessível (WCAG)
            </footer>

            {/* Central de Acessibilidade Flutuante e Modal */}
            <AccessibilityButton />
            <AccessibilityModal />
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
