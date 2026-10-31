import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const DEFAULT_MESSAGE = "Oi! Vi que temos interesses em comum. Bora tomar um café?";

// O id é sempre "<quem convidou>_<quem foi convidado>"; as regras do Firestore dependem disso.
export const inviteId = (from, to) => `${from}_${to}`;

export function watchMyInvites(uid, onData, onError) {
  const q = query(collection(db, "invites"), where("participants", "array-contains", uid));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

export function sendInvite(me, other, message) {
  return setDoc(doc(db, "invites", inviteId(me.uid, other.uid)), {
    from: me.uid,
    to: other.uid,
    participants: [me.uid, other.uid],
    fromName: me.name,
    fromPhoto: me.photoURL ?? "",
    toName: other.name,
    toPhoto: other.photoURL ?? "",
    message: (message.trim() || DEFAULT_MESSAGE).slice(0, 200),
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export function respondInvite(id, status) {
  return updateDoc(doc(db, "invites", id), { status, respondedAt: serverTimestamp() });
}

export function watchMessages(id, onData, onError) {
  const q = query(collection(db, "invites", id, "messages"), orderBy("createdAt"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

export function sendMessage(id, uid, text) {
  return addDoc(collection(db, "invites", id, "messages"), {
    text: text.trim().slice(0, 500),
    senderUid: uid,
    createdAt: serverTimestamp(),
  });
}

// Quem está do outro lado do convite, do ponto de vista de `uid`.
export function otherSide(invite, uid) {
  return invite.from === uid
    ? { uid: invite.to, name: invite.toName, photoURL: invite.toPhoto }
    : { uid: invite.from, name: invite.fromName, photoURL: invite.fromPhoto };
}
