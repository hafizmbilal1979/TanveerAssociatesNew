"use client";

import { useState } from "react";
import { submitContact } from "@/lib/actions";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setStatus("idle");
    try {
      await submitContact(formData);
      setStatus("ok");
      (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
    } catch {
      setStatus("err");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="contact-form" action={onSubmit} className="grid gap-1">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required maxLength={160} />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" maxLength={40} />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required minLength={10} maxLength={4000} />
      </div>
      {/* Honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button className="btn btn-primary mt-2" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
      {status === "ok" && <p className="mt-3 text-sm text-emerald-800">Thank you — your message has been received.</p>}
      {status === "err" && <p className="mt-3 text-sm text-red-700">Please check the form and try again.</p>}
    </form>
  );
}
