import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { insights, insightsSettings } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { storagePut } from "../storage";
import { verifyAdminToken } from "./admin";

// Admin auth via JWT token passed as input (no Manus OAuth required)
async function requireAdminToken(adminToken: string) {
  const payload = await verifyAdminToken(adminToken);
  if (!payload) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired admin token" });
  return payload;
}

const insightBodySchema = z.object({
  slug: z.string().min(1).max(256).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(512),
  titleKo: z.string().max(512).optional(),
  titleJa: z.string().max(512).optional(),
  excerpt: z.string().max(2000).optional(),
  excerptKo: z.string().max(2000).optional(),
  excerptJa: z.string().max(2000).optional(),
  content: z.string().optional(),
  contentKo: z.string().optional(),
  contentJa: z.string().optional(),
  category: z.string().max(128).optional(),
  tags: z.array(z.string()).optional(),
  relatedIndustries: z.array(z.string()).optional(),
  relatedSolutions: z.array(z.string()).optional(),
  imageUrl: z.string().max(512).optional(),
  thumbnailBase64: z.string().optional(),
  thumbnailMime: z.string().optional(),
  readTimeMinutes: z.number().int().min(1).max(120).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

export const blogRouter = router({
  listInsights: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(insights).orderBy(desc(insights.publishedAt));
  }),

  getInsight: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "NOT_FOUND" });
      const rows = await db.select().from(insights).where(eq(insights.slug, input.slug)).limit(1);
      if (!rows.length) throw new TRPCError({ code: "NOT_FOUND" });
      return rows[0];
    }),

  createInsight: publicProcedure
    .input(insightBodySchema.extend({ adminToken: z.string() }))
    .mutation(async ({ input }) => {
      await requireAdminToken(input.adminToken);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db.select({ id: insights.id }).from(insights).where(eq(insights.slug, input.slug)).limit(1);
      if (existing.length) throw new TRPCError({ code: "CONFLICT", message: "Slug already exists" });
      let imageUrl = input.imageUrl ?? null;
      if (input.thumbnailBase64 && input.thumbnailMime) {
        const buffer = Buffer.from(input.thumbnailBase64, "base64");
        const ext = input.thumbnailMime.split("/")[1] ?? "jpg";
        const key = `insights/thumbnails/${input.slug}-${Date.now()}.${ext}`;
        const result = await storagePut(key, buffer, input.thumbnailMime);
        imageUrl = result.url;
      }
      const publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();
      await db.insert(insights).values({
        slug: input.slug, title: input.title,
        titleKo: input.titleKo ?? null, titleJa: input.titleJa ?? null,
        excerpt: input.excerpt ?? null, excerptKo: input.excerptKo ?? null, excerptJa: input.excerptJa ?? null,
        content: input.content ?? null, contentKo: input.contentKo ?? null, contentJa: input.contentJa ?? null,
        category: input.category ?? null, tags: input.tags ?? [], relatedIndustries: input.relatedIndustries ?? [],
        relatedSolutions: input.relatedSolutions ?? [], imageUrl,
        readTimeMinutes: input.readTimeMinutes ?? 5, featured: input.featured ?? false, publishedAt,
      });
      const created = await db.select().from(insights).where(eq(insights.slug, input.slug)).limit(1);
      return created[0];
    }),

  updateInsight: publicProcedure
    .input(insightBodySchema.extend({ id: z.number().int(), adminToken: z.string() }))
    .mutation(async ({ input }) => {
      await requireAdminToken(input.adminToken);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db.select({ id: insights.id }).from(insights).where(eq(insights.slug, input.slug)).limit(1);
      if (existing.length && existing[0].id !== input.id) throw new TRPCError({ code: "CONFLICT", message: "Slug already used" });
      let imageUrl: string | null = input.imageUrl ?? null;
      if (input.thumbnailBase64 && input.thumbnailMime) {
        const buffer = Buffer.from(input.thumbnailBase64, "base64");
        const ext = input.thumbnailMime.split("/")[1] ?? "jpg";
        const key = `insights/thumbnails/${input.slug}-${Date.now()}.${ext}`;
        const result = await storagePut(key, buffer, input.thumbnailMime);
        imageUrl = result.url;
      }
      const publishedAt = input.publishedAt ? new Date(input.publishedAt) : undefined;
      await db.update(insights).set({
        slug: input.slug, title: input.title,
        titleKo: input.titleKo ?? null, titleJa: input.titleJa ?? null,
        excerpt: input.excerpt ?? null, excerptKo: input.excerptKo ?? null, excerptJa: input.excerptJa ?? null,
        content: input.content ?? null, contentKo: input.contentKo ?? null, contentJa: input.contentJa ?? null,
        category: input.category ?? null, tags: input.tags ?? [], relatedIndustries: input.relatedIndustries ?? [],
        relatedSolutions: input.relatedSolutions ?? [], imageUrl,
        readTimeMinutes: input.readTimeMinutes ?? 5, featured: input.featured ?? false,
        ...(publishedAt ? { publishedAt } : {}),
      }).where(eq(insights.id, input.id));
      const updated = await db.select().from(insights).where(eq(insights.id, input.id)).limit(1);
      return updated[0];
    }),

  deleteInsight: publicProcedure
    .input(z.object({ id: z.number().int(), adminToken: z.string() }))
    .mutation(async ({ input }) => {
      await requireAdminToken(input.adminToken);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(insights).where(eq(insights.id, input.id));
      return { success: true };
    }),

  getInsightsSettings: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select().from(insightsSettings).where(eq(insightsSettings.id, 1)).limit(1);
    if (!rows.length) return { id: 1, bannerSlug: null, featured1Slug: null, featured2Slug: null, featured3Slug: null };
    return rows[0];
  }),

  updateInsightsSettings: publicProcedure
    .input(z.object({ adminToken: z.string(),
      bannerSlug: z.string().max(256).optional(),
      featured1Slug: z.string().max(256).optional(),
      featured2Slug: z.string().max(256).optional(),
      featured3Slug: z.string().max(256).optional(),
    }))
    .mutation(async ({ input }) => {
      await requireAdminToken(input.adminToken);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db.select({ id: insightsSettings.id }).from(insightsSettings).where(eq(insightsSettings.id, 1)).limit(1);
      const data = {
        bannerSlug: input.bannerSlug ?? null,
        featured1Slug: input.featured1Slug ?? null,
        featured2Slug: input.featured2Slug ?? null,
        featured3Slug: input.featured3Slug ?? null,
      };
      if (existing.length) {
        await db.update(insightsSettings).set(data).where(eq(insightsSettings.id, 1));
      } else {
        await db.insert(insightsSettings).values({ id: 1, ...data });
      }
      return data;
    }),
});
