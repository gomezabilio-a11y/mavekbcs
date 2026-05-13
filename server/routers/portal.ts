/**
 * Portal tRPC router — admin + customer procedures
 * Uses JWT-based portal sessions (separate from Manus OAuth)
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  createPortalUser,
  getAllPortalUsers,
  getPortalUserById,
  updatePortalUser,
  verifyPortalPassword,
  getContractByPortalUserId,
  upsertPortalContract,
  createTicket,
  getTicketsByPortalUser,
  getAllTickets,
  getTicketById,
  updateTicketByAdmin,
} from "../portalDb";
import { storagePut } from "../storage";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "../_core/env";

// ── Portal JWT helpers ────────────────────────────────────────────────────────
const PORTAL_JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret + "_portal");

async function signPortalToken(portalUserId: number): Promise<string> {
  return new SignJWT({ portalUserId, type: "portal" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(PORTAL_JWT_SECRET);
}

async function verifyPortalToken(token: string): Promise<{ portalUserId: number }> {
  try {
    const { payload } = await jwtVerify(token, PORTAL_JWT_SECRET);
    if (payload.type !== "portal") throw new Error("Invalid token type");
    return { portalUserId: payload.portalUserId as number };
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired portal session" });
  }
}

// ── Middleware: require portal session token ──────────────────────────────────
const portalSessionSchema = z.object({ portalToken: z.string() });

// ── Router ────────────────────────────────────────────────────────────────────
export const portalRouter = router({

  // ── Auth ──────────────────────────────────────────────────────────────────

  /** Customer login with username + password */
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await verifyPortalPassword(input.username, input.password);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      const token = await signPortalToken(user.id);
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          companyName: user.companyName,
          language: user.language,
          timezone: user.timezone,
        },
      };
    }),

  /** Get current portal session user */
  me: publicProcedure
    .input(portalSessionSchema)
    .query(async ({ input }) => {
      const { portalUserId } = await verifyPortalToken(input.portalToken);
      const user = await getPortalUserById(portalUserId);
      if (!user || !user.isActive) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Account not found or inactive" });
      }
      return {
        id: user.id,
        username: user.username,
        companyName: user.companyName,
        language: user.language,
        timezone: user.timezone,
        email: user.email,
      };
    }),

  // ── Customer: Contract ────────────────────────────────────────────────────

  /** Get own contract (hours remaining) */
  myContract: publicProcedure
    .input(portalSessionSchema)
    .query(async ({ input }) => {
      const { portalUserId } = await verifyPortalToken(input.portalToken);
      const contract = await getContractByPortalUserId(portalUserId);
      if (!contract) return null;
      const total = parseFloat(String(contract.totalHours));
      const used = parseFloat(String(contract.usedHours));
      return {
        id: contract.id,
        totalHours: total,
        usedHours: used,
        remainingHours: Math.max(0, total - used),
        contractStartDate: contract.contractStartDate,
        contractEndDate: contract.contractEndDate,
        notes: contract.notes,
      };
    }),

  // ── Customer: Tickets ─────────────────────────────────────────────────────

  /** List own tickets */
  myTickets: publicProcedure
    .input(portalSessionSchema)
    .query(async ({ input }) => {
      const { portalUserId } = await verifyPortalToken(input.portalToken);
      return getTicketsByPortalUser(portalUserId);
    }),

  /** Submit a new ticket */
  submitTicket: publicProcedure
    .input(
      z.object({
        portalToken: z.string(),
        title: z.string().min(1).max(512),
        description: z.string().min(1),
        // Optional base64 screenshot: "data:<mime>;base64,<data>"
        screenshotBase64: z.string().optional(),
        screenshotMime: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { portalUserId } = await verifyPortalToken(input.portalToken);

      let screenshotUrl: string | undefined;
      let screenshotKey: string | undefined;

      if (input.screenshotBase64 && input.screenshotMime) {
        // Strip data URL prefix if present
        const base64Data = input.screenshotBase64.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const ext = input.screenshotMime.split("/")[1] ?? "png";
        const key = `portal-tickets/${portalUserId}/${Date.now()}.${ext}`;
        const result = await storagePut(key, buffer, input.screenshotMime);
        screenshotUrl = result.url;
        screenshotKey = result.key;
      }

      const ticket = await createTicket({
        portalUserId,
        title: input.title,
        description: input.description,
        screenshotUrl,
        screenshotKey,
      });
      return ticket;
    }),

  // ── Admin: User Management ────────────────────────────────────────────────

  /** Create a new portal customer account (admin only) */
  adminCreateUser: protectedProcedure
    .input(
      z.object({
        username: z.string().min(3).max(128),
        password: z.string().min(6),
        companyName: z.string().min(1).max(256),
        email: z.string().email().optional(),
        language: z.enum(["en", "ko", "ja"]).default("en"),
        timezone: z.string().default("UTC"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return createPortalUser(input);
    }),

  /** List all portal customers (admin only) */
  adminListUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const users = await getAllPortalUsers();
    // Attach contract summary
    const withContracts = await Promise.all(
      users.map(async (u) => {
        const contract = await getContractByPortalUserId(u.id);
        const total = contract ? parseFloat(String(contract.totalHours)) : 0;
        const used = contract ? parseFloat(String(contract.usedHours)) : 0;
        return {
          id: u.id,
          username: u.username,
          companyName: u.companyName,
          email: u.email,
          language: u.language,
          timezone: u.timezone,
          isActive: u.isActive,
          createdAt: u.createdAt,
          totalHours: total,
          usedHours: used,
          remainingHours: Math.max(0, total - used),
        };
      })
    );
    return withContracts;
  }),

  /** Update portal user (admin only) */
  adminUpdateUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        companyName: z.string().optional(),
        email: z.string().email().optional(),
        language: z.enum(["en", "ko", "ja"]).optional(),
        timezone: z.string().optional(),
        isActive: z.boolean().optional(),
        password: z.string().min(6).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      await updatePortalUser(id, data);
      return { success: true };
    }),

  // ── Admin: Contract Management ────────────────────────────────────────────

  /** Set/update contract hours for a customer (admin only) */
  adminSetContract: protectedProcedure
    .input(
      z.object({
        portalUserId: z.number(),
        totalHours: z.number().min(0),
        contractStartDate: z.string().optional(), // ISO string
        contractEndDate: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return upsertPortalContract(input.portalUserId, {
        totalHours: input.totalHours,
        contractStartDate: input.contractStartDate ? new Date(input.contractStartDate) : undefined,
        contractEndDate: input.contractEndDate ? new Date(input.contractEndDate) : undefined,
        notes: input.notes,
      });
    }),

  // ── Admin: Ticket Management ──────────────────────────────────────────────

  /** List all tickets from all customers (admin only) */
  adminListTickets: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return getAllTickets();
  }),

  /** Update ticket status + feedback + spent hours (admin only) */
  adminUpdateTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
        adminFeedback: z.string().optional(),
        spentHours: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const { ticketId, ...data } = input;
      return updateTicketByAdmin(ticketId, data);
    }),

  /** Get single ticket detail (admin only) */
  adminGetTicket: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const ticket = await getTicketById(input.ticketId);
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
      return ticket;
    }),
});
