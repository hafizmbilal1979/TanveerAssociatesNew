"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { can, type Permission } from "@/lib/permissions";
import { saveSafeImage } from "@/lib/security";
import { slugify } from "@/lib/utils";
import {
  categorySchema,
  contactSchema,
  homeSectionSchema,
  projectSchema,
  settingsSchema,
  sliderSchema,
  teamSchema,
  userSchema,
} from "@/lib/validations";

async function assertPerm(permission: Permission) {
  const session = await getAdminSession();
  if (!session || !can(session.user.role, permission)) {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function upsertCategory(formData: FormData) {
  await assertPerm("categories");
  const id = String(formData.get("id") || "");
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    sortOrder: formData.get("sortOrder") || 0,
    isEnabled: formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true",
  });
  const slug = slugify(parsed.name);
  if (id) {
    await prisma.category.update({
      where: { id },
      data: { ...parsed, slug, description: parsed.description || null },
    });
  } else {
    await prisma.category.create({
      data: { ...parsed, slug, description: parsed.description || null },
    });
  }
  revalidateAll();
}

export async function deleteCategory(id: string) {
  await assertPerm("categories");
  await prisma.category.delete({ where: { id } });
  revalidateAll();
}

export async function toggleCategory(id: string, isEnabled: boolean) {
  await assertPerm("categories");
  await prisma.category.update({ where: { id }, data: { isEnabled } });
  revalidateAll();
}

export async function upsertProject(formData: FormData) {
  await assertPerm("projects");
  const id = String(formData.get("id") || "");
  const parsed = projectSchema.parse({
    title: formData.get("title"),
    clientName: formData.get("clientName") || "",
    location: formData.get("location") || "",
    year: formData.get("year") || "",
    summary: formData.get("summary") || "",
    description: formData.get("description") || "",
    categoryId: formData.get("categoryId"),
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    isEnabled: formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true",
    sortOrder: formData.get("sortOrder") || 0,
  });

  let coverImage: string | undefined;
  const cover = formData.get("coverImage");
  if (cover instanceof File && cover.size > 0) {
    coverImage = await saveSafeImage(cover, "projects");
  }

  const slugBase = slugify(parsed.title);
  let slug = slugBase;
  const existing = await prisma.project.findFirst({
    where: { slug, NOT: id ? { id } : undefined },
  });
  if (existing) slug = `${slugBase}-${Date.now().toString(36)}`;

  const data = {
    title: parsed.title,
    slug,
    clientName: parsed.clientName || null,
    location: parsed.location || null,
    year: parsed.year || null,
    summary: parsed.summary || null,
    description: parsed.description || null,
    categoryId: parsed.categoryId,
    isFeatured: !!parsed.isFeatured,
    isEnabled: parsed.isEnabled !== false,
    sortOrder: parsed.sortOrder || 0,
    ...(coverImage ? { coverImage } : {}),
  };

  let projectId = id;
  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    const created = await prisma.project.create({ data });
    projectId = created.id;
  }

  const gallery = formData.getAll("gallery");
  for (const file of gallery) {
    if (file instanceof File && file.size > 0) {
      const pathUrl = await saveSafeImage(file, "projects");
      const count = await prisma.projectImage.count({ where: { projectId } });
      await prisma.projectImage.create({
        data: {
          projectId,
          path: pathUrl,
          alt: parsed.title,
          sortOrder: count + 1,
          isEnabled: true,
        },
      });
      if (!coverImage && !id) {
        await prisma.project.update({
          where: { id: projectId },
          data: { coverImage: pathUrl },
        });
        coverImage = pathUrl;
      }
    }
  }

  revalidateAll();
  return { id: projectId };
}

export async function deleteProject(id: string) {
  await assertPerm("projects");
  await prisma.project.delete({ where: { id } });
  revalidateAll();
}

export async function toggleProject(id: string, isEnabled: boolean) {
  await assertPerm("projects");
  await prisma.project.update({ where: { id }, data: { isEnabled } });
  revalidateAll();
}

export async function deleteProjectImage(id: string) {
  await assertPerm("projects");
  await prisma.projectImage.delete({ where: { id } });
  revalidateAll();
}

export async function toggleProjectImage(id: string, isEnabled: boolean) {
  await assertPerm("projects");
  await prisma.projectImage.update({ where: { id }, data: { isEnabled } });
  revalidateAll();
}

export async function upsertTeam(formData: FormData) {
  await assertPerm("team");
  const id = String(formData.get("id") || "");
  const parsed = teamSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio") || "",
    education: formData.get("education") || "",
    experience: formData.get("experience") || "",
    sortOrder: formData.get("sortOrder") || 0,
    isEnabled: formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true",
  });

  let photo: string | undefined;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    photo = await saveSafeImage(file, "team");
  }

  const data = {
    name: parsed.name,
    role: parsed.role,
    bio: parsed.bio || null,
    education: parsed.education || null,
    experience: parsed.experience || null,
    sortOrder: parsed.sortOrder || 0,
    isEnabled: parsed.isEnabled !== false,
    ...(photo ? { photo } : {}),
  };

  if (id) await prisma.teamMember.update({ where: { id }, data });
  else await prisma.teamMember.create({ data });
  revalidateAll();
}

export async function deleteTeam(id: string) {
  await assertPerm("team");
  await prisma.teamMember.delete({ where: { id } });
  revalidateAll();
}

export async function toggleTeam(id: string, isEnabled: boolean) {
  await assertPerm("team");
  await prisma.teamMember.update({ where: { id }, data: { isEnabled } });
  revalidateAll();
}

export async function upsertSlider(formData: FormData) {
  await assertPerm("sliders");
  const id = String(formData.get("id") || "");
  const parsed = sliderSchema.parse({
    title: formData.get("title") || "",
    subtitle: formData.get("subtitle") || "",
    linkUrl: formData.get("linkUrl") || "",
    sortOrder: formData.get("sortOrder") || 0,
    isEnabled: formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true",
  });

  const file = formData.get("image");
  let image: string | undefined;
  if (file instanceof File && file.size > 0) {
    image = await saveSafeImage(file, "sliders");
  }

  if (!id && !image) throw new Error("Slider image is required");

  const data = {
    title: parsed.title || null,
    subtitle: parsed.subtitle || null,
    linkUrl: parsed.linkUrl || null,
    sortOrder: parsed.sortOrder || 0,
    isEnabled: parsed.isEnabled !== false,
    ...(image ? { image } : {}),
  };

  if (id) await prisma.slider.update({ where: { id }, data });
  else await prisma.slider.create({ data: { ...data, image: image! } });
  revalidateAll();
}

export async function deleteSlider(id: string) {
  await assertPerm("sliders");
  await prisma.slider.delete({ where: { id } });
  revalidateAll();
}

export async function toggleSlider(id: string, isEnabled: boolean) {
  await assertPerm("sliders");
  await prisma.slider.update({ where: { id }, data: { isEnabled } });
  revalidateAll();
}

export async function saveSettings(formData: FormData) {
  await assertPerm("settings");
  const parsed = settingsSchema.parse({
    site_name: formData.get("site_name"),
    tagline: formData.get("tagline") || "",
    about: formData.get("about") || "",
    address: formData.get("address") || "",
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",
    isdn: formData.get("isdn") || "",
  });

  for (const [key, value] of Object.entries(parsed)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: value || "" },
      create: { key, value: value || "" },
    });
  }
  revalidateAll();
}

export async function upsertHomeSection(formData: FormData) {
  await assertPerm("home");
  const id = String(formData.get("id") || "");
  const parsed = homeSectionSchema.parse({
    type: formData.get("type") || "custom",
    key: formData.get("key") || "",
    eyebrow: formData.get("eyebrow") || "",
    title: formData.get("title"),
    body: formData.get("body") || "",
    ctaLabel: formData.get("ctaLabel") || "",
    ctaUrl: formData.get("ctaUrl") || "",
    bgStyle: formData.get("bgStyle") || "paper",
    sortOrder: formData.get("sortOrder") || 0,
    isEnabled: formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true",
  });

  const key =
    parsed.key?.trim() ||
    `${parsed.type}-${slugify(parsed.title)}-${Date.now().toString(36)}`;

  const data = {
    key,
    type: parsed.type,
    eyebrow: parsed.eyebrow || null,
    title: parsed.title,
    body: parsed.body || null,
    ctaLabel: parsed.ctaLabel || null,
    ctaUrl: parsed.ctaUrl || null,
    bgStyle: parsed.bgStyle || "paper",
    sortOrder: parsed.sortOrder || 0,
    isEnabled: parsed.isEnabled !== false,
  };

  if (id) await prisma.homeSection.update({ where: { id }, data });
  else await prisma.homeSection.create({ data });
  revalidateAll();
}

export async function deleteHomeSection(id: string) {
  await assertPerm("home");
  await prisma.homeSection.delete({ where: { id } });
  revalidateAll();
}

export async function toggleHomeSection(id: string, isEnabled: boolean) {
  await assertPerm("home");
  await prisma.homeSection.update({ where: { id }, data: { isEnabled } });
  revalidateAll();
}

export async function upsertUser(formData: FormData) {
  const session = await assertPerm("users");
  const id = String(formData.get("id") || "");
  const parsed = userSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role") || "editor",
    password: formData.get("password") || "",
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });

  const email = parsed.email.toLowerCase().trim();

  if (id) {
    const data: {
      name: string;
      email: string;
      role: string;
      isActive: boolean;
      passwordHash?: string;
    } = {
      name: parsed.name,
      email,
      role: parsed.role,
      isActive: parsed.isActive !== false,
    };
    if (parsed.password) {
      data.passwordHash = await bcrypt.hash(parsed.password, 12);
    }
    // Prevent locking yourself out of admin
    if (id === session.user.id && parsed.role !== "admin") {
      throw new Error("You cannot remove your own admin role.");
    }
    await prisma.user.update({ where: { id }, data });
  } else {
    if (!parsed.password) throw new Error("Password is required for new users");
    await prisma.user.create({
      data: {
        name: parsed.name,
        email,
        role: parsed.role,
        isActive: parsed.isActive !== false,
        passwordHash: await bcrypt.hash(parsed.password, 12),
      },
    });
  }
  revalidatePath("/admin/users");
}

export async function toggleUser(id: string, isActive: boolean) {
  const session = await assertPerm("users");
  if (id === session.user.id && !isActive) {
    throw new Error("You cannot deactivate your own account.");
  }
  await prisma.user.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/users");
}

export async function logMessageView(messageId: string) {
  const session = await assertPerm("messages");
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead: true },
  });
  await prisma.messageActivity.create({
    data: {
      messageId,
      userId: session.user.id,
      action: "viewed",
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${messageId}`);
}

export async function addMessageComment(formData: FormData) {
  const session = await assertPerm("messages");
  const messageId = String(formData.get("messageId") || "");
  const body = String(formData.get("body") || "").trim();
  if (!messageId || body.length < 2) throw new Error("Comment required");

  await prisma.messageComment.create({
    data: {
      messageId,
      userId: session.user.id,
      body: body.slice(0, 4000),
    },
  });
  await prisma.messageActivity.create({
    data: {
      messageId,
      userId: session.user.id,
      action: "commented",
      note: body.slice(0, 160),
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${messageId}`);
}

export async function markMessageComplete(messageId: string) {
  const session = await assertPerm("messages");
  const msg = await prisma.contactMessage.findUnique({ where: { id: messageId } });
  if (!msg) throw new Error("Message not found");
  if (msg.status === "complete") return;

  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { status: "complete", isRead: true },
  });
  await prisma.messageActivity.create({
    data: {
      messageId,
      userId: session.user.id,
      action: "completed",
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${messageId}`);
}

export async function reopenMessage(messageId: string) {
  const session = await assertPerm("messages.reopen");
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { status: "open" },
  });
  await prisma.messageActivity.create({
    data: {
      messageId,
      userId: session.user.id,
      action: "reopened",
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${messageId}`);
}

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    message: formData.get("message"),
  });

  const hp = String(formData.get("company_website") || "");
  if (hp) return { ok: true };

  await prisma.contactMessage.create({
    data: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      phone: parsed.phone || null,
      message: parsed.message,
      status: "open",
    },
  });
  revalidatePath("/admin/messages");
  return { ok: true };
}
