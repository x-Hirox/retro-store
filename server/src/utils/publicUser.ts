import type { IUser } from "../models/User.js";
import { isAdminEmail } from "./security.js";

export function splitName(name?: string | null) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

export function displayName(user: {
  firstName?: string;
  lastName?: string;
  name?: string;
}) {
  const joined = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return joined || user.name || "";
}

export function publicUser(user: IUser) {
  const role = isAdminEmail(user.email) ? "admin" : "customer";
  const fromName = splitName(user.name);
  return {
    id: user._id,
    email: user.email,
    name: displayName(user) || user.email,
    firstName: user.firstName || fromName.firstName,
    lastName: user.lastName || fromName.lastName,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    role,
    isVerified: Boolean(user.isVerified),
  };
}
