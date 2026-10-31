# DevFest Match 🤝
> **"Ninguém precisa ir sozinho ao DevFest."**

Aplicação completa em **Next.js (App Router)** e **Firebase (Cloud Firestore & Hosting)** para conectar **mentores seniores** e **iniciantes** previamente ao **DevFest**, com perfis detalhados, minigame de nivelamento, fotos, redes sociais, projetos e acessibilidade (Alto Contraste WCAG AAA, Modo TDAH, Dislexia e Text-to-Speech).

---

## 🌐 URLs Oficiais em Produção

- **Link Principal (Personalizado):** **[https://devfest-match.web.app](https://devfest-match.web.app)**
- **Link Alternativo:** [https://devfest-match.firebaseapp.com](https://devfest-match.firebaseapp.com)
- **Firebase Console:** [Console do Projeto mentormatch-be61f](https://console.firebase.google.com/project/mentormatch-be61f/overview)

---

## 🌟 Funcionalidades

1. **Feed do DevFest com Filtros e Agenda:**
   - Calendário com as datas dos próximos eventos e maratonas.
   - Filtros por papel (Mentores vs Iniciantes) e tags de tecnologias (`#Next.js`, `#TypeScript`, `#Cloud`, `#IA`).
2. **Minigame de Nivelamento de Experiência:**
   - 3 perguntas práticas de mercado que calibram e sugerem automaticamente o papel e senioridade antes de publicar o perfil.
3. **Mini Perfil Completo:**
   - Foto/avatar com preview em tempo real.
   - Redes sociais (WhatsApp/Telegram, LinkedIn, GitHub, Portfólio).
   - Lista dinâmica de links de projetos.
4. **Fluxo de Conexão Pré-Evento ("Bora no DevFest!"):**
   - Convites com mensagem personalizada e contato direto.
   - Histórico em `/requests` com aceite de conexões.
5. **Central de Acessibilidade:**
   - **Alto Contraste WCAG AAA** (preto e amarelo com bordas reforçadas).
   - **Modo TDAH** (foco cognitivo, baixa sobrecarga sensorial).
   - **Régua Guia de Leitura** interativa que acompanha o cursor do mouse.
   - **Fonte para Dislexia** e controle de tamanho de texto.
   - **Leitor de Texto por Voz (Text-to-Speech)** em cada card de perfil.

---

## 🚀 Como Fazer Novo Deploy

```bash
# 1. Gerar build estático
npm run build

# 2. Publicar no Firebase Hosting
npx firebase-tools deploy --only hosting
```
