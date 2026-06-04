import { describe, expect, it } from "vitest";
import { MAX_IMPORT_SIZE, validateImport } from "@/lib/file-import";

describe("file import validation", () => {
  it("accepts txt and markdown files", () => {
    expect(validateImport({ name: "notes.txt", type: "text/plain", size: 20 })).toBeNull();
    expect(validateImport({ name: "brief.md", type: "text/markdown", size: 20 })).toBeNull();
  });

  it("rejects unsupported files", () => {
    expect(validateImport({ name: "brief.pdf", type: "application/pdf", size: 20 })).toContain("Only");
  });

  it("rejects files larger than 1 MB", () => {
    expect(validateImport({ name: "large.txt", type: "text/plain", size: MAX_IMPORT_SIZE + 1 })).toContain("1 MB");
  });
});
