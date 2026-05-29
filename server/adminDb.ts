/**
 * Admin DB helpers — standalone admin portal auth (master/staff roles)
 * Separate from Manus OAuth users and portal customer users.
 */
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { adminUsers } from "../drizzle/schema";

export type AdminRole = "master" | "staff";

export interface AdminSession {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);
  return rows[0];
}

export async function getAdminById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);
  return rows[0];
}

export async function listAdminUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select({
      id: adminUsers.id,
      username: adminUsers.username,
      displayName: adminUsers.displayName,
      email: adminUsers.email,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(adminUsers.createdAt);
}

/** Returns only active admin emails (for notification purposes) */
export async function listAdminEmails(): Promise<string[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select({ email: adminUsers.email })
    .from(adminUsers)
    .where(eq(adminUsers.isActive, true));
  return rows.map((r) => r.email).filter((e): e is string => !!e);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function verifyAdminPassword(
  username: string,
  password: string
): Promise<AdminSession | null> {
  const user = await getAdminByUsername(username);
  if (!user || !user.isActive) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role as AdminRole,
  };
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function createAdminUser(data: {
  username: string;
  password: string;
  displayName: string;
  email?: string;
  role: AdminRole;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const passwordHash = await bcrypt.hash(data.password, 10);
  await db.insert(adminUsers).values({
    username: data.username,
    passwordHash,
    displayName: data.displayName,
    email: data.email ?? null,
    role: data.role,
    isActive: true,
  });
}

export async function updateAdminUser(
  id: number,
  data: {
    displayName?: string;
    email?: string | null;
    role?: AdminRole;
    isActive?: boolean;
    password?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<typeof adminUsers.$inferInsert> = {};
  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10);
  if (Object.keys(updateData).length === 0) return;
  await db.update(adminUsers).set(updateData).where(eq(adminUsers.id, id));
}
