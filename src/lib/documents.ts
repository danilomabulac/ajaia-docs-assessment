import sanitizeHtml from "sanitize-html";
import { ApiError } from "@/lib/api";
import { canManageDocument, canReadDocument } from "@/lib/access-control";
import { DEMO_USERS } from "@/lib/demo-users";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { DocumentAccess, DocumentDetail, DocumentSummary } from "@/lib/types";

type DocumentRow = {
  id: string;
  title: string;
  content_html: string;
  owner_id: string;
  updated_at: string;
};

export const cleanHtml = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
    ],
    allowedAttributes: {},
  });

const ownerName = (ownerId: string) =>
  DEMO_USERS.find((user) => user.id === ownerId)?.name ?? "Unknown owner";

const toSummary = (row: DocumentRow, userId: string): DocumentSummary => ({
  id: row.id,
  title: row.title,
  ownerId: row.owner_id,
  ownerName: ownerName(row.owner_id),
  updatedAt: row.updated_at,
  isOwner: row.owner_id === userId,
});

export async function getAccess(documentId: string, userId: string): Promise<DocumentAccess> {
  const supabase = getSupabaseAdmin();
  const [{ data: document, error }, { data: share, error: shareError }] = await Promise.all([
    supabase.from("documents").select("owner_id").eq("id", documentId).maybeSingle(),
    supabase
      .from("document_shares")
      .select("document_id")
      .eq("document_id", documentId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  if (error) throw error;
  if (shareError) throw shareError;
  return {
    exists: Boolean(document),
    isOwner: document?.owner_id === userId,
    isShared: Boolean(share),
  };
}

export async function requireReadable(documentId: string, userId: string) {
  const access = await getAccess(documentId, userId);
  if (!access.exists) throw new ApiError(404, "Document not found.");
  if (!canReadDocument(access)) throw new ApiError(403, "You do not have access to this document.");
  return access;
}

export async function requireOwner(documentId: string, userId: string) {
  const access = await getAccess(documentId, userId);
  if (!access.exists) throw new ApiError(404, "Document not found.");
  if (!canManageDocument(access)) throw new ApiError(403, "Only the owner can perform this action.");
  return access;
}

export async function listDocuments(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data: shares, error: shareError } = await supabase
    .from("document_shares")
    .select("document_id")
    .eq("user_id", userId);
  if (shareError) throw shareError;

  const sharedIds = (shares ?? []).map((share) => share.document_id);
  const filter = sharedIds.length
    ? `owner_id.eq.${userId},id.in.(${sharedIds.join(",")})`
    : `owner_id.eq.${userId}`;
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .or(filter)
    .order("updated_at", { ascending: false });
  if (error) throw error;

  const summaries = (data as DocumentRow[]).map((row) => toSummary(row, userId));
  return {
    owned: summaries.filter((document) => document.isOwner),
    shared: summaries.filter((document) => !document.isOwner),
  };
}

export async function getDocument(documentId: string, userId: string): Promise<DocumentDetail> {
  const supabase = getSupabaseAdmin();
  const [{ data, error }, { data: shares, error: shareError }] = await Promise.all([
    supabase.from("documents").select("*").eq("id", documentId).maybeSingle(),
    supabase.from("document_shares").select("user_id").eq("document_id", documentId),
  ]);
  if (error) throw error;
  if (shareError) throw shareError;
  if (!data) throw new ApiError(404, "Document not found.");

  const row = data as DocumentRow;
  const isOwner = row.owner_id === userId;
  const isShared = (shares ?? []).some((share) => share.user_id === userId);
  if (!canReadDocument({ exists: true, isOwner, isShared })) {
    throw new ApiError(403, "You do not have access to this document.");
  }

  return {
    ...toSummary(row, userId),
    contentHtml: row.content_html,
    shares: (shares ?? [])
      .map((share) => DEMO_USERS.find((user) => user.id === share.user_id))
      .filter((user) => user !== undefined),
  };
}
