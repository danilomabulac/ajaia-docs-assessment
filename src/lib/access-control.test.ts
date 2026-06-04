import { describe, expect, it } from "vitest";
import { canEditDocument, canManageDocument, canReadDocument } from "@/lib/access-control";

describe("document access control", () => {
  it("allows an owner to read, edit, and manage a document", () => {
    const access = { exists: true, isOwner: true, isShared: false };
    expect(canReadDocument(access)).toBe(true);
    expect(canEditDocument(access)).toBe(true);
    expect(canManageDocument(access)).toBe(true);
  });

  it("allows a shared user to read and edit, but not manage", () => {
    const access = { exists: true, isOwner: false, isShared: true };
    expect(canReadDocument(access)).toBe(true);
    expect(canEditDocument(access)).toBe(true);
    expect(canManageDocument(access)).toBe(false);
  });

  it("denies an unrelated user", () => {
    const access = { exists: true, isOwner: false, isShared: false };
    expect(canReadDocument(access)).toBe(false);
    expect(canEditDocument(access)).toBe(false);
    expect(canManageDocument(access)).toBe(false);
  });

  it("denies access when the document does not exist", () => {
    const access = { exists: false, isOwner: false, isShared: true };
    expect(canReadDocument(access)).toBe(false);
    expect(canManageDocument(access)).toBe(false);
  });
});
