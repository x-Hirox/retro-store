const GOOGLE_CLIENT_ID = String(
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
).trim();

export function getGoogleClientId(): string {
  return GOOGLE_CLIENT_ID;
}

export function saveAuthSession(data: {
  token: string;
  user?: { id?: string; name?: string; email?: string; role?: string };
}): void {
  localStorage.setItem("token", data.token);
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
}

export function afterLoginPath(role?: string): string {
  return role === "admin" ? "/admin" : "/";
}
