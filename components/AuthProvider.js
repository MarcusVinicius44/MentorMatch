"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext({ user: null, loading: true });

const LOGIN_ERRORS = {
  "auth/popup-closed-by-user": "A janela do Google foi fechada antes de terminar. Tente de novo.",
  "auth/popup-blocked": "Seu navegador bloqueou a janela de login. Libere pop-ups para este site e tente de novo.",
  "auth/unauthorized-domain": "Este endereço ainda não está autorizado para login. Avise a organização.",
  "auth/network-request-failed": "Sem conexão com a internet. Verifique sua rede e tente de novo.",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function login() {
    setLoginError("");
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code === "auth/cancelled-popup-request") return;
      console.error(err);
      setLoginError(LOGIN_ERRORS[err.code] ?? "Não foi possível entrar agora. Tente de novo.");
    } finally {
      setSigningIn(false);
    }
  }

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginError, signingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
