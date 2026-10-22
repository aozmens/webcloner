"use client";

import { useCallback, useState, useTransition } from "react";

type Result<T> = { ok: true; data?: T } | { ok: false; error: string };
export type Message = { tone: "ok" | "error"; text: string } | null;

/** Runs a server action with a pending flag and a success/error message for the panel. */
export function useAction() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<Message>(null);

  const run = useCallback(
    <T,>(call: () => Promise<Result<T>>, success?: string) =>
      new Promise<Result<T>>((resolve) => {
        setMessage(null);
        startTransition(async () => {
          let result: Result<T>;
          try {
            result = await call();
          } catch {
            result = { ok: false, error: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin." };
          }
          setMessage(result.ok ? (success ? { tone: "ok", text: success } : null) : { tone: "error", text: result.error });
          resolve(result);
        });
      }),
    [],
  );

  return { pending, message, setMessage, run };
}

/** Native confirmation dialog; works the same on phones and desktops. */
export const confirmDelete = (what: string) => window.confirm(`${what} silinsin mi? Bu işlem geri alınamaz.`);
