/**
 * Portal DB helpers — closed-membership customer portal
 * Handles portal_users, portal_contracts, tickets tables.
 */
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import {
  portalUsers,
  portalContracts,
  tickets,
  portalNotifications,
  type PortalUser,
  type PortalContract,
  type Ticket,
  type PortalNotification,
} from "../drizzle/schema";

// ── Ticket number generator ───────────────────────────────────────────────────
export function generateTicketNumber(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `TKT-${yy}${mm}${dd}-${rand}`;
}

// ── Portal User helpers ───────────────────────────────────────────────────────

export async function createPortalUser(data: {
  username: string;
  password: string;
  companyName: string;
  email?: string;
  language?: "en" | "ko" | "ja";
  timezone?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const passwordHash = await bcrypt.hash(data.password, 10);
  await db.insert(portalUsers).values({
    username: data.username,
    passwordHash,
    companyName: data.companyName,
    email: data.email ?? null,
    language: data.language ?? "en",
    timezone: data.timezone ?? "UTC",
    isActive: true,
  });

  const created = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.username, data.username))
    .limit(1);
  return created[0];
}

export async function getPortalUserByUsername(username: string): Promise<PortalUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.username, username))
    .limit(1);
  return rows[0];
}

export async function getPortalUserById(id: number): Promise<PortalUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(portalUsers).where(eq(portalUsers.id, id)).limit(1);
  return rows[0];
}

export async function getAllPortalUsers(): Promise<PortalUser[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portalUsers).orderBy(desc(portalUsers.createdAt));
}

export async function updatePortalUser(
  id: number,
  data: Partial<{
    companyName: string;
    email: string;
    language: "en" | "ko" | "ja";
    timezone: string;
    isActive: boolean;
    password: string;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = {};
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.timezone !== undefined) updateData.timezone = data.timezone;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(portalUsers).set(updateData).where(eq(portalUsers.id, id));
  }
}

export async function verifyPortalPassword(username: string, password: string): Promise<PortalUser | null> {
  const user = await getPortalUserByUsername(username);
  if (!user || !user.isActive) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

// ── Portal Contract helpers ───────────────────────────────────────────────────

export async function getContractByPortalUserId(portalUserId: number): Promise<PortalContract | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(portalContracts)
    .where(eq(portalContracts.portalUserId, portalUserId))
    .limit(1);
  return rows[0];
}

export async function upsertPortalContract(
  portalUserId: number,
  data: {
    totalHours: number;
    contractStartDate?: Date;
    contractEndDate?: Date;
    notes?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getContractByPortalUserId(portalUserId);
  if (existing) {
    await db
      .update(portalContracts)
      .set({
        totalHours: String(data.totalHours),
        contractStartDate: data.contractStartDate ?? null,
        contractEndDate: data.contractEndDate ?? null,
        notes: data.notes ?? null,
      })
      .where(eq(portalContracts.portalUserId, portalUserId));
  } else {
    await db.insert(portalContracts).values({
      portalUserId,
      totalHours: String(data.totalHours),
      usedHours: "0",
      contractStartDate: data.contractStartDate ?? null,
      contractEndDate: data.contractEndDate ?? null,
      notes: data.notes ?? null,
    });
  }
  return getContractByPortalUserId(portalUserId);
}

export async function deductContractHours(portalUserId: number, hours: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const contract = await getContractByPortalUserId(portalUserId);
  if (!contract) throw new Error("Contract not found");

  const currentUsed = parseFloat(String(contract.usedHours));
  const newUsed = currentUsed + hours;

  await db
    .update(portalContracts)
    .set({ usedHours: String(newUsed) })
    .where(eq(portalContracts.portalUserId, portalUserId));
}

// ── Ticket helpers ────────────────────────────────────────────────────────────

export async function createTicket(data: {
  portalUserId: number;
  title: string;
  description: string;
  screenshotUrl?: string;
  screenshotKey?: string;
  screenshotUrls?: string; // JSON string of [{url, key}]
}): Promise<Ticket> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const ticketNumber = generateTicketNumber();
  await db.insert(tickets).values({
    ticketNumber,
    portalUserId: data.portalUserId,
    title: data.title,
    description: data.description,
    screenshotUrl: data.screenshotUrl ?? null,
    screenshotKey: data.screenshotKey ?? null,
    screenshotUrls: data.screenshotUrls ?? null,
    status: "open",
    hoursDeducted: false,
  });

  const rows = await db
    .select()
    .from(tickets)
    .where(eq(tickets.ticketNumber, ticketNumber))
    .limit(1);
  return rows[0];
}

export async function getTicketsByPortalUser(portalUserId: number): Promise<Ticket[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(tickets)
    .where(eq(tickets.portalUserId, portalUserId))
    .orderBy(desc(tickets.createdAtUtc));
}

export async function getAllTickets(): Promise<(Ticket & { companyName: string; username: string; userTimezone: string })[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      portalUserId: tickets.portalUserId,
      title: tickets.title,
      description: tickets.description,
      screenshotUrl: tickets.screenshotUrl,
      screenshotKey: tickets.screenshotKey,
      screenshotUrls: tickets.screenshotUrls,
      status: tickets.status,
      adminFeedback: tickets.adminFeedback,
      internalNote: tickets.internalNote,
      spentHours: tickets.spentHours,
      hoursDeducted: tickets.hoursDeducted,
      createdAtUtc: tickets.createdAtUtc,
      updatedAt: tickets.updatedAt,
      resolvedAt: tickets.resolvedAt,
      companyName: portalUsers.companyName,
      username: portalUsers.username,
      userTimezone: portalUsers.timezone,
    })
    .from(tickets)
    .leftJoin(portalUsers, eq(tickets.portalUserId, portalUsers.id))
    .orderBy(desc(tickets.createdAtUtc));

  return rows.map((r) => ({
    ...r,
    companyName: r.companyName ?? "",
    username: r.username ?? "",
    userTimezone: r.userTimezone ?? "UTC",
  }));
}

export async function getTicketById(id: number): Promise<Ticket | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
  return rows[0];
}

export async function updateTicketByAdmin(
  ticketId: number,
  data: {
    status?: "open" | "in_progress" | "resolved" | "closed";
    adminFeedback?: string;
    internalNote?: string;
    spentHours?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const ticket = await getTicketById(ticketId);
  if (!ticket) throw new Error("Ticket not found");

  const updateData: Record<string, unknown> = {};
  if (data.status !== undefined) updateData.status = data.status;
  if (data.adminFeedback !== undefined) updateData.adminFeedback = data.adminFeedback;
  if (data.internalNote !== undefined) updateData.internalNote = data.internalNote;
  if (data.spentHours !== undefined) updateData.spentHours = String(data.spentHours);

  // If resolving and spentHours provided, deduct from contract (once)
  if (
    data.status === "resolved" &&
    data.spentHours !== undefined &&
    data.spentHours > 0 &&
    !ticket.hoursDeducted
  ) {
    updateData.hoursDeducted = true;
    updateData.resolvedAt = new Date();
    await deductContractHours(ticket.portalUserId, data.spentHours);
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(tickets).set(updateData).where(eq(tickets.id, ticketId));
  }

  return getTicketById(ticketId);
}

// ── Notification helpers ─────────────────────────────────────────────────────

export async function createNotification(data: {
  portalUserId: number;
  ticketId?: number;
  ticketNumber?: string;
  type?: string;
  message: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(portalNotifications).values({
    portalUserId: data.portalUserId,
    ticketId: data.ticketId ?? null,
    ticketNumber: data.ticketNumber ?? null,
    type: data.type ?? "ticket_status_changed",
    message: data.message,
    isRead: false,
  });
}

export async function getNotificationsForUser(portalUserId: number): Promise<PortalNotification[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(portalNotifications)
    .where(eq(portalNotifications.portalUserId, portalUserId))
    .orderBy(desc(portalNotifications.createdAtUtc))
    .limit(50);
}

export async function markNotificationsRead(portalUserId: number, ids?: number[]): Promise<void> {
  const db = await getDb();
  if (!db) return;
  if (ids && ids.length > 0) {
    await db
      .update(portalNotifications)
      .set({ isRead: true })
      .where(and(eq(portalNotifications.portalUserId, portalUserId)));
  } else {
    await db
      .update(portalNotifications)
      .set({ isRead: true })
      .where(eq(portalNotifications.portalUserId, portalUserId));
  }
}

export async function getUnreadNotificationCount(portalUserId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select()
    .from(portalNotifications)
    .where(and(eq(portalNotifications.portalUserId, portalUserId), eq(portalNotifications.isRead, false)));
  return rows.length;
}

/** Delete a portal user and cascade-delete their tickets and contract */
export async function deletePortalUser(portalUserId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Delete tickets first (FK dependency)
  await db.delete(tickets).where(eq(tickets.portalUserId, portalUserId));
  // Delete contract
  await db.delete(portalContracts).where(eq(portalContracts.portalUserId, portalUserId));
  // Delete user
  await db.delete(portalUsers).where(eq(portalUsers.id, portalUserId));
}
