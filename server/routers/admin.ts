/**
 * Admin Portal tRPC Router — standalone admin auth (master/staff)
 * Uses adminToken as input parameter (same pattern as portal router).
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { SignJWT, jwtVerify } from "jose";
import { router, publicProcedure } from "../_core/trpc";
import {
  verifyAdminPassword,
  getAdminById,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  type AdminRole,
} from "../adminDb";
import { ENV } from "../_core/env";

const ADMIN_JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret + "_admin");
const ADMIN_TOKEN_TTL = "7d";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function signAdminToken(payload: {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
}) {
  return new SignJWT({ ...payload, type: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ADMIN_TOKEN_TTL)
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.type !== "admin") return null;
    return payload as {
      id: number;
      username: string;
      displayName: string;
      role: AdminRole;
      type: "admin";
    };
  } catch {
    return null;
  }
}

async function requireAdmin(adminToken: string) {
  const payload = await verifyAdminToken(adminToken);
  if (!payload) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired admin token" });
  return payload;
}

async function requireMaster(adminToken: string) {
  const payload = await requireAdmin(adminToken);
  if (payload.role !== "master") throw new TRPCError({ code: "FORBIDDEN", message: "Master role required" });
  return payload;
}

// ── Router ────────────────────────────────────────────────────────────────────
export const adminRouter = router({
  /** Login: returns JWT token */
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await verifyAdminPassword(input.username, input.password);
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      const token = await signAdminToken(user);
      return { token, user };
    }),

  /** Verify token and return current admin user */
  me: publicProcedure
    .input(z.object({ adminToken: z.string() }))
    .query(async ({ input }) => {
      const payload = await verifyAdminToken(input.adminToken);
      if (!payload) throw new TRPCError({ code: "UNAUTHORIZED" });
      const user = await getAdminById(payload.id);
      if (!user || !user.isActive) throw new TRPCError({ code: "UNAUTHORIZED" });
      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role as AdminRole,
      };
    }),

  /** List all admin users (master only) */
  listStaff: publicProcedure
    .input(z.object({ adminToken: z.string() }))
    .query(async ({ input }) => {
      await requireMaster(input.adminToken);
      return listAdminUsers();
    }),

  /** Create new staff account (master only) */
  createStaff: publicProcedure
    .input(
      z.object({
        adminToken: z.string(),
        username: z.string().min(3).max(64),
        password: z.string().min(4),
        displayName: z.string().min(1).max(128),
        role: z.enum(["master", "staff"]),
      })
    )
    .mutation(async ({ input }) => {
      await requireMaster(input.adminToken);
      try {
        await createAdminUser({
          username: input.username,
          password: input.password,
          displayName: input.displayName,
          role: input.role,
        });
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Duplicate") || msg.includes("unique")) {
          throw new TRPCError({ code: "CONFLICT", message: "Username already exists" });
        }
        throw err;
      }
    }),

  /** Update staff account (master only) */
  updateStaff: publicProcedure
    .input(
      z.object({
        adminToken: z.string(),
        id: z.number(),
        displayName: z.string().min(1).max(128).optional(),
        role: z.enum(["master", "staff"]).optional(),
        isActive: z.boolean().optional(),
        password: z.string().min(4).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await requireMaster(input.adminToken);
      const { id, adminToken: _token, ...data } = input;
      await updateAdminUser(id, data);
      return { success: true };
    }),
});
