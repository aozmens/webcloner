"use client";

import { useActionState } from "react";
import { signIn } from "./actions/auth";
import { buttonClass, Field, inputClass, Notice } from "./ui";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, initialError ? { error: initialError } : null);
  return (
    <form action={action} className="mt-6 space-y-4">
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <Field label="E-posta">
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Şifre">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass.primary} w-full`}>
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
