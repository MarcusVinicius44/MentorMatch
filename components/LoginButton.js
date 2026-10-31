"use client";

import { useAuth } from "@/components/AuthProvider";
import { GoogleLogo } from "@/components/icons";

export default function LoginButton({ className = "" }) {
  const { login, signingIn, loginError } = useAuth();

  return (
    <div className={className}>
      <button onClick={login} disabled={signingIn} className="btn-primary btn-lg">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white">
          <GoogleLogo width={16} height={16} />
        </span>
        {signingIn ? "Abrindo o Google..." : "Entrar com Google"}
      </button>
      {loginError && (
        <p role="alert" className="mt-3 max-w-md rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
          {loginError}
        </p>
      )}
    </div>
  );
}
