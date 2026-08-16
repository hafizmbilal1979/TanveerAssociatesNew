export type Role = "admin" | "editor" | "messages";

export type Permission =
  | "dashboard"
  | "home"
  | "projects"
  | "categories"
  | "team"
  | "sliders"
  | "settings"
  | "messages"
  | "messages.reopen"
  | "users";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "dashboard",
    "home",
    "projects",
    "categories",
    "team",
    "sliders",
    "settings",
    "messages",
    "messages.reopen",
    "users",
  ],
  editor: [
    "dashboard",
    "home",
    "projects",
    "categories",
    "team",
    "sliders",
    "settings",
    "messages",
  ],
  messages: ["dashboard", "messages"],
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin — full access",
  editor: "Editor — content & homepage",
  messages: "Messages — inbox only",
};

export function normalizeRole(role?: string | null): Role {
  if (role === "admin" || role === "editor" || role === "messages") return role;
  return "editor";
}

export function can(role: string | null | undefined, permission: Permission) {
  const r = normalizeRole(role);
  return ROLE_PERMISSIONS[r].includes(permission);
}

export function navForRole(role: string | null | undefined) {
  const items: { href: string; label: string; permission: Permission }[] = [
    { href: "/admin", label: "Dashboard", permission: "dashboard" },
    { href: "/admin/home", label: "Home page", permission: "home" },
    { href: "/admin/projects", label: "Projects", permission: "projects" },
    { href: "/admin/categories", label: "Categories", permission: "categories" },
    { href: "/admin/team", label: "Team", permission: "team" },
    { href: "/admin/sliders", label: "Sliders", permission: "sliders" },
    { href: "/admin/messages", label: "Messages", permission: "messages" },
    { href: "/admin/users", label: "Users", permission: "users" },
    { href: "/admin/settings", label: "Settings", permission: "settings" },
  ];
  return items.filter((i) => can(role, i.permission));
}
