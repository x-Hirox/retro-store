export function isValidEmail(value: unknown): boolean {
  const email = String(value || "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) return false;
  if (email.length < 6 || email.length > 120) return false;
  return /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
}

export function normalizeGePhone(value: unknown): string | null {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return null;
  let n = digits;
  if (n.startsWith("995") && n.length >= 12) n = n.slice(3);
  if (n.startsWith("0") && n.length === 10) n = n.slice(1);
  if (/^5\d{8}$/.test(n)) return `+995${n}`;
  return null;
}

export function passwordError(password: unknown): string | null {
  const pass = String(password || "");
  if (pass.length < 8) return "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან.";
  if (!/[A-Z]/.test(pass)) return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს (A-Z).";
  if (!/\d/.test(pass)) return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს (0-9).";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`]/.test(pass)) {
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ სპეციალურ სიმბოლოს.";
  }
  return null;
}
