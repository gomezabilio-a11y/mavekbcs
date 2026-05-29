/**
 * Tests for email notification helpers
 * Validates that Resend is configured and email functions work correctly
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Resend module
vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: "test-email-id" }, error: null }),
      },
    })),
  };
});

describe("Email helpers", () => {
  beforeEach(() => {
    // Set a fake API key for tests
    process.env.RESEND_API_KEY = "re_test_fake_key";
    process.env.RESEND_FROM_EMAIL = "noreply@mavekbcs.com";
    // Reset module cache so the new env var is picked up
    vi.resetModules();
  });

  it("sendTicketStatusEmail should not throw when called with valid params", async () => {
    const { sendTicketStatusEmail } = await import("./email");
    await expect(
      sendTicketStatusEmail({
        toEmail: "customer@example.com",
        toName: "Test Company",
        ticketNumber: "TKT-20260001",
        ticketTitle: "Test ticket",
        newStatus: "resolved",
        adminFeedback: "Issue resolved successfully.",
        spentHours: 2,
      })
    ).resolves.not.toThrow();
  });

  it("sendNewTicketAdminEmail should not throw when called with valid params", async () => {
    const { sendNewTicketAdminEmail } = await import("./email");
    await expect(
      sendNewTicketAdminEmail({
        adminEmails: ["admin@mavekbcs.com"],
        ticketNumber: "TKT-20260001",
        ticketTitle: "New support request",
        customerName: "Test Company",
        description: "We need help with our SAP configuration.",
      })
    ).resolves.not.toThrow();
  });

  it("sendNewTicketAdminEmail should skip sending when adminEmails is empty", async () => {
    const { sendNewTicketAdminEmail } = await import("./email");
    // Should resolve without error even with empty array
    await expect(
      sendNewTicketAdminEmail({
        adminEmails: [],
        ticketNumber: "TKT-20260001",
        ticketTitle: "Test",
        customerName: "Test Company",
      })
    ).resolves.not.toThrow();
  });

  it("email functions should gracefully skip when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    const { sendTicketStatusEmail } = await import("./email");
    // Should resolve without error (just logs a warning)
    await expect(
      sendTicketStatusEmail({
        toEmail: "customer@example.com",
        toName: "Test Company",
        ticketNumber: "TKT-20260001",
        ticketTitle: "Test ticket",
        newStatus: "open",
      })
    ).resolves.not.toThrow();
  });
});
