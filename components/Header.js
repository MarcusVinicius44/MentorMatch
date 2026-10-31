"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Avatar from "@/components/Avatar";
import { IconHeart, IconMail, IconUser } from "@/components/icons";
import { watchMyInvites } from "@/lib/invites";

const NAV = [
  { href: "/matches", label: "Matches", Icon: IconHeart },
  { href: "/invites", label: "Convites", Icon: IconMail },
  { href: "/profile", label: "Perfil", Icon: IconUser },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
      <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
        <i className="h-2.5 w-2.5 rounded-full bg-[#4285f4]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#ea4335]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#fbbc04]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#34a853]" />
      </span>
      Mentor Match
    </Link>
  );
}

export default function Header() {
  const { user, loading, login, logout, signingIn } = useAuth();
  const pathname = usePathname();
  const [pending, setPending] = useState(0);

  // Quantos convites esperam resposta, para o selo no menu.
  useEffect(() => {
    if (!user) return;
    return watchMyInvites(
      user.uid,
      (list) => setPending(list.filter((i) => i.to === user.uid && i.status === "pending").length),
      () => {},
    );
  }, [user]);

  const badge = (href) => (href === "/invites" && pending > 0 ? pending : 0);
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Logo />

          {user ? (
            <div className="flex items-center gap-1">
              <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
                {NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(href)
                        ? "bg-primary-soft text-primary"
                        : "text-muted hover:bg-surface-2 hover:text-foreground"
                    }`}
                  >
                    {label}
                    {badge(href) > 0 && (
                      <span className="ml-1.5 rounded-full bg-danger px-1.5 py-0.5 text-[11px] font-bold text-white">
                        {badge(href)}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              <span className="ml-2 hidden md:block">
                <Avatar name={user.displayName ?? ""} src={user.photoURL ?? ""} size={32} />
              </span>
              <button onClick={logout} className="btn-ghost ml-1 !py-1.5">
                Sair
              </button>
            </div>
          ) : (
            !loading && (
              <button onClick={login} disabled={signingIn} className="btn-primary">
                {signingIn ? "Abrindo..." : "Entrar"}
              </button>
            )
          )}
        </div>
      </header>

      {user && (
        <nav
          aria-label="Principal"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                isActive(href) ? "text-primary" : "text-muted"
              }`}
            >
              <Icon />
              {label}
              {badge(href) > 0 && (
                <span className="absolute right-[28%] top-1.5 rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">
                  {badge(href)}
                </span>
              )}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
