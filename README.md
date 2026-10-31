# DevFest Mentor Match

> Ninguém precisa ir sozinho ao DevFest.

Muita gente nova vai ao DevFest sem conhecer ninguém e sai sem criar contato. O **Mentor Match** conecta quem está **começando** com devs **experientes** que estão no mesmo evento, para um café de 15 minutos. O Gemini explica por que cada par combina e sugere um tema de conversa.

## Como funciona

1. **Entre com Google.** O login é feito com Firebase Authentication.
2. **Monte seu perfil.** Diga se está começando ou já tem experiência, escolha o que quer aprender e o que pode ensinar, e escreva uma bio opcional.
3. **Veja seus matches.** O app ranqueia as pessoas com assuntos complementares aos seus.
4. **Entenda o porquê.** O Gemini escreve uma explicação curta de cada par e sugere um tema para o café.

### Como o ranking funciona

O ranking é determinístico e não depende da IA (`lib/matching.js`):

- Cada assunto que **eu quero aprender** e a outra pessoa **ensina** vale **2 pontos**.
- Cada assunto que **eu ensino** e a outra pessoa **quer aprender** vale **1 ponto**.
- Pares **iniciante ↔ experiente** ganham **1 ponto de bônus** quando há ao menos um assunto que eu quero aprender.
- Quem não tem nenhum assunto em comum não aparece. Os 5 melhores são exibidos.

Se o Gemini estiver indisponível, os cards continuam mostrando os assuntos em comum. Só a explicação em texto some.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Autenticação | Firebase Authentication (Google) |
| Banco de dados | Cloud Firestore |
| IA | Gemini API (`@google/genai`), chamada somente no servidor |

## Estrutura

```
app/
  page.js               # Início e botão de login
  profile/page.js       # Formulário de perfil
  matches/page.js       # Lista de matches com explicação do Gemini
  api/match/route.js    # Rota que chama o Gemini (valida o login antes)
components/
  AuthProvider.js       # Contexto de autenticação
  Header.js             # Navegação
lib/
  firebase.js           # Inicialização do Firebase
  matching.js           # Assuntos e algoritmo de ranking
firestore.rules         # Regras de segurança do Firestore
```

## Como rodar

### Pré-requisitos

- Node.js 20 ou superior
- Um projeto no [Firebase](https://console.firebase.google.com)
- Uma chave da [Gemini API](https://aistudio.google.com/apikey)

### 1. Configure o Firebase

1. Crie um projeto e registre um **app Web** em *Configurações do projeto > Seus apps*.
2. Em **Authentication > Sign-in method**, ative o provedor **Google**.
3. Em **Firestore Database**, crie um banco.
4. Na aba de regras do Firestore, cole o conteúdo de [`firestore.rules`](firestore.rules) e publique.
5. Em **Authentication > Settings > Authorized domains**, confirme que `localhost` está na lista. Ao publicar o app, adicione também o domínio de produção.

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local`:

| Variável | Onde encontrar |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `firebaseConfig.apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `firebaseConfig.authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `firebaseConfig.projectId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `firebaseConfig.appId` |
| `GEMINI_API_KEY` | Google AI Studio |
| `GEMINI_MODEL` | Opcional. Padrão: `gemini-3.8-flash` |

> A `GEMINI_API_KEY` é secreta e nunca vai para o navegador. O arquivo `.env.local` está no `.gitignore`.

### 3. Instale e rode

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

### Testando com poucos usuários

Com uma conta só, a tela de matches fica vazia, porque o app não mostra você para você mesmo. Para ver um match, entre com uma segunda conta Google (em uma janela anônima) e crie um perfil complementar. Por exemplo, uma pessoa que quer aprender **Flutter** e outra que ensina **Flutter**.

## Segurança e privacidade

- **Regras do Firestore:** quem está logado pode ler os perfis, mas cada pessoa só escreve no próprio (`profiles/{uid}`).
- **Rota da IA protegida:** `/api/match` valida o token do Firebase antes de chamar o Gemini, para que ninguém de fora gaste a cota.
- **Chave no servidor:** a chave do Gemini só existe no servidor.
- **Dados enviados ao Gemini:** apenas nome, nível, assuntos e bio dos dois perfis comparados. Os campos são limitados em tamanho e tratados como dados no prompt, para reduzir o risco de injeção de instruções.
- **Perfis visíveis:** todo perfil salvo fica visível para os outros participantes logados. Não escreva dados sensíveis na bio.

## Próximos passos

- Agendar o café (horário e local sugeridos) e botão de "pedir match".
- Filtros por trilha do evento (Web, Mobile, Cloud, IA).
- Modo "pergunta rápida" para dúvidas pontuais.
- Resumo pós-evento com contatos e links de estudo.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Serve o build de produção |
| `npm run lint` | Verifica o código com ESLint |
