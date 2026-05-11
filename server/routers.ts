import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { clientContracts, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

// Admin-only middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Client portal procedures
  portal: router({
    // Get current user's contracts
    myContracts: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const contracts = await db
        .select()
        .from(clientContracts)
        .where(eq(clientContracts.userId, ctx.user.id));
      return contracts;
    }),

    // Admin: list all contracts
    allContracts: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return db.select().from(clientContracts);
    }),

    // Admin: create contract for a user
    createContract: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          clientName: z.string().optional(),
          contractStatus: z
            .enum(["active", "pending", "completed", "on_hold", "expired"])
            .default("active"),
          remainingHours: z.number().default(0),
          totalHours: z.number().default(0),
          contractStartDate: z.string().optional(),
          contractEndDate: z.string().optional(),
          projectDescription: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.insert(clientContracts).values({
          userId: input.userId,
          clientName: input.clientName,
          contractStatus: input.contractStatus,
          remainingHours: input.remainingHours,
          totalHours: input.totalHours,
          contractStartDate: input.contractStartDate
            ? new Date(input.contractStartDate)
            : undefined,
          contractEndDate: input.contractEndDate
            ? new Date(input.contractEndDate)
            : undefined,
          projectDescription: input.projectDescription,
          notes: input.notes,
        });
        return { success: true };
      }),

    // Admin: update contract
    updateContract: adminProcedure
      .input(
        z.object({
          id: z.number(),
          contractStatus: z
            .enum(["active", "pending", "completed", "on_hold", "expired"])
            .optional(),
          remainingHours: z.number().optional(),
          totalHours: z.number().optional(),
          clientName: z.string().optional(),
          projectDescription: z.string().optional(),
          notes: z.string().optional(),
          contractStartDate: z.string().optional(),
          contractEndDate: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, ...rest } = input;
        const updateData: Record<string, unknown> = {};
        if (rest.contractStatus !== undefined) updateData.contractStatus = rest.contractStatus;
        if (rest.remainingHours !== undefined) updateData.remainingHours = rest.remainingHours;
        if (rest.totalHours !== undefined) updateData.totalHours = rest.totalHours;
        if (rest.clientName !== undefined) updateData.clientName = rest.clientName;
        if (rest.projectDescription !== undefined) updateData.projectDescription = rest.projectDescription;
        if (rest.notes !== undefined) updateData.notes = rest.notes;
        if (rest.contractStartDate !== undefined) updateData.contractStartDate = new Date(rest.contractStartDate);
        if (rest.contractEndDate !== undefined) updateData.contractEndDate = new Date(rest.contractEndDate);
        await db.update(clientContracts).set(updateData).where(eq(clientContracts.id, id));
        return { success: true };
      }),

    // Admin: list users (for assigning contracts)
    listUsers: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          openId: users.openId,
        })
        .from(users);
    }),
  }),

  // Contact form submission
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          company: z.string().optional(),
          message: z.string().min(10),
        })
      )
      .mutation(async ({ input }) => {
        // Notify owner of new contact submission
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `New Contact Form Submission from ${input.name}`,
          content: `Name: ${input.name}\nEmail: ${input.email}\nCompany: ${input.company || "N/A"}\n\nMessage:\n${input.message}`,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
