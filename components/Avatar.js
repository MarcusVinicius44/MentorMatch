"use client";

import { useState } from "react";

// Foto do Google quando existir; caso contrário, iniciais sobre uma cor derivada do nome.
export default function Avatar({ name = "", src = "", size = 44 }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={style}
        className="shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    );
  }

  const initials =
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
  const hue = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0);

  return (
    <span
      aria-hidden="true"
      style={{ ...style, background: `hsl(${hue} 55% 42%)` }}
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
    >
      {initials}
    </span>
  );
}
