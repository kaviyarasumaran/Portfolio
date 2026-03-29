"use client";

import * as React from "react";

type Options = {
  words: readonly string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
};

export function useTypewriter({ words, typeSpeed = 42, deleteSpeed = 26, pauseMs = 1100 }: Options) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState("");
  const [phase, setPhase] = React.useState<"typing" | "pausing" | "deleting">("typing");

  React.useEffect(() => {
    if (words.length === 0) return;

    const current = words[index % words.length] ?? "";

    if (phase === "typing") {
      if (text === current) {
        const t = window.setTimeout(() => setPhase("pausing"), pauseMs);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      return () => window.clearTimeout(t);
    }

    if (phase === "pausing") {
      const t = window.setTimeout(() => setPhase("deleting"), pauseMs / 2);
      return () => window.clearTimeout(t);
    }

    if (text.length === 0) {
      setIndex((v) => (v + 1) % words.length);
      setPhase("typing");
      return;
    }

    const t = window.setTimeout(() => setText((v) => v.slice(0, Math.max(0, v.length - 1))), deleteSpeed);
    return () => window.clearTimeout(t);
  }, [deleteSpeed, index, pauseMs, phase, text, typeSpeed, words]);

  return text;
}
