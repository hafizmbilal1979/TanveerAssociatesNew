import { ContactForm } from "@/components/contact-form";
import { prisma } from "@/lib/prisma";
import { getSettingMap } from "@/lib/utils";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = getSettingMap(await prisma.siteSetting.findMany());
  return (
    <div className="bg-[var(--ink)] pt-24 text-[var(--paper)]">
      <section className="container-site pb-8">
        <p className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]">Contact</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.4rem)]">Begin the conversation.</h1>
      </section>
      <section className="bg-[var(--paper)] py-10 text-[var(--ink)] md:py-12">
        <div className="container-site grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Studio</p>
            <h2 className="display mt-2 text-3xl">Tanveer Ahmad Associates</h2>
            <div className="mt-4 space-y-2 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
              <p>{settings.address}</p>
              <p>Tel. {settings.phone}</p>
              <p>ISDN. {settings.isdn}</p>
              <p>{settings.email}</p>
              <p>{settings.website}</p>
            </div>
          </div>
          <div className="admin-card">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
