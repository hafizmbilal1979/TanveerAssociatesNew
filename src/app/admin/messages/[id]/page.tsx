import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { can } from "@/lib/permissions";
import {
  addMessageComment,
  markMessageComplete,
  reopenMessage,
} from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin("messages");
  const { id } = await params;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) notFound();

  // Trail: mark viewed (dedupe rapid reloads within 45s)
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  const recentView = await prisma.messageActivity.findFirst({
    where: {
      messageId: id,
      userId: session.user.id,
      action: "viewed",
      createdAt: { gte: new Date(Date.now() - 45_000) },
    },
  });
  if (!recentView) {
    await prisma.messageActivity.create({
      data: {
        messageId: id,
        userId: session.user.id,
        action: "viewed",
      },
    });
  }

  const message = await prisma.contactMessage.findUnique({
    where: { id },
    include: {
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      activities: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!message) notFound();

  const canReopen = can(session.user.role, "messages.reopen");

  return (
    <div>
      <Link href="/admin/messages" className="text-xs uppercase tracking-[0.14em] text-[var(--ink-soft)]">
        ← Messages
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display text-4xl">{message.name}</h1>
          <p className="mt-1 text-[var(--ink-soft)]">
            {message.email}
            {message.phone ? ` · ${message.phone}` : ""} · {message.createdAt.toLocaleString()}
          </p>
          <span className={`badge mt-3 ${message.status === "complete" ? "badge-on" : "badge-off"}`}>
            {message.status === "complete" ? "Complete" : "Open"}
          </span>
        </div>
        <div className="flex gap-2">
          {message.status !== "complete" && (
            <form
              action={async () => {
                "use server";
                await markMessageComplete(id);
              }}
            >
              <button className="btn btn-primary">Mark complete</button>
            </form>
          )}
          {message.status === "complete" && canReopen && (
            <form
              action={async () => {
                "use server";
                await reopenMessage(id);
              }}
            >
              <button className="btn btn-line">Reopen (admin)</button>
            </form>
          )}
          {message.status === "complete" && !canReopen && (
            <p className="text-xs text-[var(--ink-soft)]">Only admin can reopen completed messages.</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <section className="admin-card">
            <h2 className="display text-2xl">Message</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
          </section>

          <section className="admin-card">
            <h2 className="display text-2xl">Comments</h2>
            <div className="mt-4 grid gap-3">
              {message.comments.map((c) => (
                <div key={c.id} className="border-b border-[var(--line)] pb-3">
                  <p className="text-xs text-[var(--ink-soft)]">
                    {c.user.name} · {c.createdAt.toLocaleString()}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{c.body}</p>
                </div>
              ))}
              {!message.comments.length && (
                <p className="text-sm text-[var(--ink-soft)]">No comments yet.</p>
              )}
            </div>
            <form action={addMessageComment} className="mt-4">
              <input type="hidden" name="messageId" value={id} />
              <div className="field">
                <label>Add comment</label>
                <textarea name="body" required minLength={2} />
              </div>
              <button className="btn btn-primary">Post comment</button>
            </form>
          </section>
        </div>

        <section className="admin-card">
          <h2 className="display text-2xl">Activity trail</h2>
          <p className="mt-1 text-xs text-[var(--ink-soft)]">Who viewed, commented, completed or reopened.</p>
          <ol className="mt-4 grid gap-3">
            {message.activities.map((a) => (
              <li key={a.id} className="border-b border-[var(--line)] pb-3 text-sm">
                <p className="font-medium capitalize">{a.action}</p>
                <p className="text-xs text-[var(--ink-soft)]">
                  {a.user.name} ({a.user.email}) · {a.createdAt.toLocaleString()}
                </p>
                {a.note && <p className="mt-1 text-xs text-[var(--ink-soft)]">{a.note}</p>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
