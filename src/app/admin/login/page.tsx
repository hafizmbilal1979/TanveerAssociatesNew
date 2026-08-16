"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (!res) {
        setError("Login failed. Please try again.");
        setPending(false);
        return;
      }

      if (res.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Invalid email or password."
            : res.error
        );
        setPending(false);
        return;
      }

      // Hard navigation so the session cookie is picked up by middleware
      window.location.href = "/admin";
    } catch {
      setError("Unable to sign in right now. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--ink)] px-4 text-[var(--paper)]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-white/15 bg-[color-mix(in_oklab,var(--ink)_70%,black)] p-8"
      >
        <p className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]">Secure access</p>
        <h1 className="display mt-3 text-4xl">Admin login</h1>
        <p className="mt-2 text-sm text-white/60">
          Use your admin email and password to manage projects and content.
        </p>
        <div className="mt-8 field">
          <label htmlFor="email" className="text-white/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue="admin@tanveerassociates.com"
            className="bg-white text-[var(--ink)]"
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label htmlFor="password" className="text-white/70">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="bg-white text-[var(--ink)]"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
        <button className="btn btn-primary w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
