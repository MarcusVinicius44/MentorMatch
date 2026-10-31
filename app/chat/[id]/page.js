import { Suspense } from "react";
import ChatRoom from "./ChatRoom";

// useParams precisa estar dentro de um Suspense com Cache Components.
export default function ChatPage() {
  return (
    <Suspense fallback={<p>Carregando conversa...</p>}>
      <ChatRoom />
    </Suspense>
  );
}
