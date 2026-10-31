import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevFest Mentor Match",
  description: "Conecte iniciantes e devs experientes no DevFest.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {/* usePathname no Header exige Suspense em rotas dinâmicas como /chat/[id]. */}
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-6 md:pb-10 md:pt-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
