import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const ROOT = path.resolve(__dirname, "../..");
const GALLERY = path.join(ROOT, "wp-content", "gallery");
const SLIDER_SRC = path.join(ROOT, "wp-content", "uploads", "nivoslider4wp_files");
const PUBLIC_UPLOADS = path.join(__dirname, "..", "public", "uploads");

type SeedProject = {
  title: string;
  clientName: string;
  folder: string;
  category: string;
  featured?: boolean;
  summary?: string;
};

const projects: SeedProject[] = [
  { title: "Arshad Farooqui Residence", clientName: "Arshad Farooqui", folder: "arshad_1", category: "residential", featured: true },
  { title: "Ashraf Sheikhani Residence", clientName: "Ashraf Sheikhani", folder: "ashraf", category: "residential" },
  { title: "Fawad Yousuf Residence", clientName: "Fawad Yousuf", folder: "fawad-yousuf", category: "residential" },
  { title: "Athar Naseem Residence", clientName: "Athar Naseem", folder: "athar-naseem", category: "residential" },
  { title: "Khalid Ali Khan Residence", clientName: "Khalid Ali Khan", folder: "khalidalikhan", category: "residential", featured: true },
  { title: "Mrs. Aftab Residence", clientName: "Mrs. Aftab", folder: "mrsaftab", category: "residential" },
  { title: "Salman-Ur-Rehman Residence", clientName: "Salman-Ur-Rehman", folder: "salmanurrehman", category: "residential" },
  { title: "Rana Nasir Residence", clientName: "Rana Nasir", folder: "rananasir", category: "residential" },
  { title: "Isra Tower", clientName: "Isra Towers", folder: "isra-towers", category: "commercial", featured: true },
  { title: "Lakhani Presidency", clientName: "Lakhani Presidency", folder: "lakhani-presidency", category: "commercial", featured: true },
  { title: "Shah Heights", clientName: "Shah Heights", folder: "shah-heights", category: "commercial" },
  { title: "Zahid Soleja", clientName: "Zahid Soleja", folder: "zahid-soleja", category: "commercial" },
  { title: "Shabbir Machayara", clientName: "Shabbir Machayara", folder: "shabbir-machayara", category: "commercial" },
  { title: "Al Amin Textile", clientName: "Al Amin Textile", folder: "al-amin-textile", category: "industrial" },
  { title: "Stillmans", clientName: "Stillmans", folder: "stillmans", category: "industrial" },
  { title: "Steelex", clientName: "Steelex", folder: "steelex", category: "industrial" },
  { title: "Bait-Us-Salam Masjid", clientName: "Bait-Us-Salam", folder: "bait-us-salam-masjid", category: "educational", featured: true },
  { title: "Cresent Academy", clientName: "Cresent Academy", folder: "cresent-academy", category: "educational" },
  { title: "Sadequin", clientName: "Sadequin", folder: "sadequin", category: "educational" },
  { title: "Maria'B", clientName: "Maria'B", folder: "mariab", category: "interior", featured: true },
  { title: "Arenco", clientName: "Arenco", folder: "arenco", category: "interior" },
  { title: "Pak Maco", clientName: "Pak Maco", folder: "pak-maco", category: "interior" },
  { title: "Mari Gas", clientName: "Mari Gas", folder: "mari-gas", category: "interior" },
];

const categories = [
  { name: "Residential", slug: "residential", description: "Private residences crafted with spatial clarity and lasting material quality.", sortOrder: 1 },
  { name: "Commercial", slug: "commercial", description: "Workplace and mixed-use buildings designed for performance and presence.", sortOrder: 2 },
  { name: "Industrial", slug: "industrial", description: "Functional industrial facilities with disciplined planning and delivery.", sortOrder: 3 },
  { name: "Educational", slug: "educational", description: "Learning and community spaces shaped for light, movement, and purpose.", sortOrder: 4 },
  { name: "Interior", slug: "interior", description: "Interior environments refined for comfort, brand, and daily ritual.", sortOrder: 5 },
];

const team = [
  { name: "Tanveer Ahmad", role: "Principal Architect", education: "B.Architecture, N.C.A Lahore · Member PCATP / IAP", experience: "18+ years across residential, educational, cultural, commercial and industrial work.", sortOrder: 1 },
  { name: "Abdul Gaffar Agai", role: "Senior Associate Architect", education: "B.Architecture, N.C.A Lahore · Member PCATP / IAP", experience: "18 years in design and work execution across major building typologies.", sortOrder: 2 },
  { name: "Muhammad Saleem", role: "Project Co-Ordinator", experience: "25 years of experience in design coordination and project delivery.", sortOrder: 3 },
  { name: "Muhammad Ilyas", role: "Junior Architect", education: "Bachelor in Architecture, Mehran University of Engg & Tech, Jamshoro", experience: "3 years of residential, educational and commercial design.", sortOrder: 4 },
  { name: "Wajiha Khalil", role: "Junior Architect", education: "Bachelor in Architecture, NED University, Karachi", experience: "3 years of residential, educational and commercial design.", sortOrder: 5 },
  { name: "Abdul Wahid Khan", role: "3D Max Operator", experience: "4 years in modeling and animation.", sortOrder: 6 },
  { name: "Nafees Ahmed Siddiqui", role: "Project Co-Ordinator", experience: "4 years of drafting for residential, educational, cultural and commercial projects.", sortOrder: 7 },
  { name: "Farhan Ali", role: "Junior AutoCAD Operator", experience: "4 years of drafting across building typologies.", sortOrder: 8 },
  { name: "Adeel Quershi", role: "Finance Manager", experience: "15 years in accounting and office management.", sortOrder: 9 },
  { name: "Sharyar Ahmed", role: "Reception & Appointments", experience: "Client coordination and appointment management.", sortOrder: 10 },
  { name: "Mr. Kaleem", role: "Office Assistant", experience: "Office support and operations.", sortOrder: 11 },
];

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyImages(folder: string, destFolder: string) {
  const srcDir = path.join(GALLERY, folder);
  const destDir = path.join(PUBLIC_UPLOADS, "projects", destFolder);
  ensureDir(destDir);
  if (!fs.existsSync(srcDir)) return [] as string[];

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f))
    .filter((f) => {
      const full = path.join(srcDir, f);
      return fs.statSync(full).isFile();
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const out: string[] = [];
  for (const file of files) {
    const src = path.join(srcDir, file);
    const destName = file.toLowerCase().replace(/\s+/g, "-");
    const dest = path.join(destDir, destName);
    fs.copyFileSync(src, dest);
    out.push(`/uploads/projects/${destFolder}/${destName}`);
  }
  return out;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Seeding Tanveer Ahmad Associates...");

  ensureDir(path.join(PUBLIC_UPLOADS, "projects"));
  ensureDir(path.join(PUBLIC_UPLOADS, "sliders"));
  ensureDir(path.join(PUBLIC_UPLOADS, "team"));

  await prisma.messageActivity.deleteMany();
  await prisma.messageComment.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.slider.deleteMany();
  await prisma.homeSection.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.user.deleteMany();

  const password = process.env.ADMIN_PASSWORD || "Admin@TAA2026!";
  const email = (process.env.ADMIN_EMAIL || "admin@tanveerassociates.com").toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: "Site Administrator",
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });

  await prisma.homeSection.createMany({
    data: [
      {
        key: "practice",
        type: "practice",
        eyebrow: "Practice",
        title: "A studio measured in decades, not seasons.",
        body: "The firm was established in 1992 under the name of Tanveer & Cezzane Associates. In 2002, its name was changed to Tanveer Ahmed Associates and has operated as a registered firm.",
        ctaLabel: "About the firm",
        ctaUrl: "/about",
        bgStyle: "paper",
        sortOrder: 1,
        isEnabled: true,
      },
      {
        key: "featured",
        type: "featured",
        eyebrow: "Selected work",
        title: "Featured projects",
        body: "",
        ctaLabel: "All projects",
        ctaUrl: "/projects",
        bgStyle: "stone",
        sortOrder: 2,
        isEnabled: true,
      },
      {
        key: "services",
        type: "services",
        eyebrow: "Services",
        title: "Disciplines across the built environment.",
        body: "",
        ctaLabel: null,
        ctaUrl: null,
        bgStyle: "paper",
        sortOrder: 3,
        isEnabled: true,
      },
    ],
  });

  const settings: Record<string, string> = {
    site_name: "Tanveer Ahmad Associates",
    tagline: "Architecture shaped by craft, clarity, and client partnership since 1992.",
    about:
      "The firm was established in 1992 under the name of Tanveer & Cezzane Associates. In 2002, its name was changed to Tanveer Ahmed Associates and has operated as a registered firm.\n\nAcross decades of practice, Tanveer Ahmad Associates has delivered diversified projects throughout the country — residential, commercial, industrial, educational, religious and recreational facilities.\n\nWe are a group of qualified professionals who believe in personal rapport and close association with our clients. Our motive is to provide multidisciplinary solutions that honor aspiration, budget, deadline, and technical soundness.",
    principal:
      "Tanveer Ahmed — Principal Architect. Member I.A.P / P.C.A.T.P. Extensive experience designing and executing residential, educational, cultural, commercial, semi-government and government projects.",
    address: "Annexe Siddiquia Mosque, Tipu Sultan Road, Karachi, Pakistan",
    phone: "34533050",
    isdn: "92-21-34316455",
    email: "tanveer@tanveerassociates.com",
    website: "www.tanveerassociates.com",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.create({ data: { key, value } });
  }

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.create({ data: { ...c, isEnabled: true } });
    catMap[c.slug] = row.id;
  }

  for (const member of team) {
    await prisma.teamMember.create({
      data: {
        ...member,
        bio: member.experience,
        isEnabled: true,
      },
    });
  }

  // Sliders
  const sliderDest = path.join(PUBLIC_UPLOADS, "sliders");
  ensureDir(sliderDest);
  for (const [i, name] of ["1_s.jpeg", "2_s.jpeg", "3_s.jpeg"].entries()) {
    const src = path.join(SLIDER_SRC, name);
    if (!fs.existsSync(src)) continue;
    const destName = `hero-${i + 1}.jpeg`;
    fs.copyFileSync(src, path.join(sliderDest, destName));
    await prisma.slider.create({
      data: {
        title: i === 0 ? "Architecture with lasting presence" : i === 1 ? "From concept to completion" : "Spaces that serve people",
        subtitle: "Tanveer Ahmad Associates · Karachi",
        image: `/uploads/sliders/${destName}`,
        sortOrder: i + 1,
        isEnabled: true,
        linkUrl: "/projects",
      },
    });
  }

  let order = 1;
  for (const p of projects) {
    const slug = slugify(p.title);
    const images = copyImages(p.folder, slug);
    if (!images.length) {
      console.warn(`No images for ${p.title} (${p.folder})`);
    }
    await prisma.project.create({
      data: {
        title: p.title,
        slug,
        clientName: p.clientName,
        location: "Karachi, Pakistan",
        summary: p.summary || `${p.clientName} — ${p.category} architecture by Tanveer Ahmad Associates.`,
        description:
          "A carefully composed project balancing program, light, material, and construction discipline. Delivered with close client collaboration from concept through execution.",
        coverImage: images[0] || null,
        categoryId: catMap[p.category],
        isFeatured: !!p.featured,
        isEnabled: true,
        sortOrder: order++,
        images: {
          create: images.map((pathUrl, idx) => ({
            path: pathUrl,
            alt: `${p.title} ${idx + 1}`,
            sortOrder: idx + 1,
            isEnabled: true,
          })),
        },
      },
    });
    console.log(`✓ ${p.title} (${images.length} images)`);
  }

  console.log("\nSeed complete.");
  console.log(`Admin login: ${email}`);
  console.log(`Admin password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
