import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  await requireAdmin("messages");
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true, activities: true } },
      activities: {
        where: { action: "completed" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div>
      <h1 className="display text-4xl">Messages</h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        Inbox with comments and activity trail. Delete is disabled — mark complete instead.
      </p>

      <div className="admin-card mt-8 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>From</th>
              <th>Message</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Trail</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => {
              const completedBy = m.activities[0];
              return (
                <tr key={m.id}>
                  <td>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-[var(--ink-soft)]">{m.email}</div>
                    <div className="text-xs text-[var(--ink-soft)]">{m.createdAt.toLocaleString()}</div>
                  </td>
                  <td className="max-w-xs">
                    <p className="line-clamp-2 text-sm">{m.message}</p>
                    {!m.isRead && <span className="badge badge-on mt-1">Unread</span>}
                  </td>
                  <td>
                    <span className={`badge ${m.status === "complete" ? "badge-on" : "badge-off"}`}>
                      {m.status === "complete" ? "Complete" : "Open"}
                    </span>
                    {completedBy && (
                      <p className="mt-1 text-[0.7rem] text-[var(--ink-soft)]">
                        by {completedBy.user.name}
                      </p>
                    )}
                  </td>
                  <td>{m._count.comments}</td>
                  <td>{m._count.activities} events</td>
                  <td>
                    <Link href={`/admin/messages/${m.id}`} className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!messages.length && <p className="text-sm text-[var(--ink-soft)]">No messages yet.</p>}
      </div>
    </div>
  );
}
