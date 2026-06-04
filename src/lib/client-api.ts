import type { DocumentDetail, DocumentSummary } from "@/lib/types";

export async function apiFetch<T>(path: string, userId: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", "x-demo-user-id": userId, ...options?.headers },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error ?? "Request failed.");
  return payload as T;
}

export type DocumentListResponse = { owned: DocumentSummary[]; shared: DocumentSummary[] };
export type DocumentResponse = { document: DocumentDetail };
