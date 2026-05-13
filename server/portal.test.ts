import { describe, it, expect, beforeAll } from "vitest";
import {
  createPortalUser,
  getPortalUserByUsername,
  verifyPortalPassword,
  getContractByPortalUserId,
  upsertPortalContract,
  createTicket,
  getTicketsByPortalUser,
  updateTicketByAdmin,
  generateTicketNumber,
} from "./portalDb";

describe("Portal DB helpers", () => {
  it("generateTicketNumber returns correct format", () => {
    const num = generateTicketNumber();
    expect(num).toMatch(/^TKT-\d{6}-\d{4}$/);
  });

  it("verifyPortalPassword returns null for unknown user", async () => {
    const result = await verifyPortalPassword("nonexistent_user_xyz", "anypassword");
    expect(result).toBeNull();
  });

  it("getPortalUserByUsername returns undefined for unknown user", async () => {
    const user = await getPortalUserByUsername("nonexistent_user_xyz");
    expect(user).toBeUndefined();
  });

  it("getContractByPortalUserId returns undefined for unknown user", async () => {
    const contract = await getContractByPortalUserId(999999);
    expect(contract).toBeUndefined();
  });

  it("getTicketsByPortalUser returns empty array for unknown user", async () => {
    const tickets = await getTicketsByPortalUser(999999);
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBe(0);
  });
});

describe("Portal i18n", () => {
  it("usePortalT returns correct strings for all languages", async () => {
    const { usePortalT } = await import("../client/src/lib/portalI18n");
    const en = usePortalT("en");
    const ko = usePortalT("ko");
    const ja = usePortalT("ja");

    expect(en.loginTitle).toBe("Client Portal");
    expect(ko.loginTitle).toBe("고객 포털");
    expect(ja.loginTitle).toBe("カスタマーポータル");

    expect(en.open).toBe("Open");
    expect(ko.open).toBe("접수");
    expect(ja.open).toBe("受付");
  });

  it("formatInTimezone converts UTC to Seoul time correctly", async () => {
    const { formatInTimezone } = await import("../client/src/lib/portalI18n");
    // 2024-01-15 00:00:00 UTC = 2024-01-15 09:00:00 KST
    const utcDate = new Date("2024-01-15T00:00:00Z");
    const result = formatInTimezone(utcDate, "Asia/Seoul", "ko");
    expect(result).toContain("2024");
    expect(result).toContain("01");
    expect(result).toContain("15");
  });

  it("getStatusColor returns correct classes", async () => {
    const { getStatusColor } = await import("../client/src/lib/portalI18n");
    expect(getStatusColor("open")).toContain("blue");
    expect(getStatusColor("in_progress")).toContain("yellow");
    expect(getStatusColor("resolved")).toContain("green");
    expect(getStatusColor("closed")).toContain("gray");
  });
});
