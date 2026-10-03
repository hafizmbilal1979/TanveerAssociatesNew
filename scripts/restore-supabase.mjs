const projectRef = "aarcuirfuvkvosglwjjn";
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error(
    "Set SUPABASE_ACCESS_TOKEN (from https://supabase.com/dashboard/account/tokens)",
  );
  process.exit(1);
}

const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/restore`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  },
);

const body = await response.text();
console.log(response.status, body);

if (!response.ok) {
  process.exit(1);
}
