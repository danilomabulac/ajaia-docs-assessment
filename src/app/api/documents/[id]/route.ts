import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, requireUser } from "@/lib/api";
import { cleanHtml, getDocument, requireOwner, requireReadable } from "@/lib/documents";
import { getSupabaseAdmin } from "@/lib/supabase";

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    contentHtml: z.string().max(2_000_000).optional(),
  })
  .refine((value) => value.title !== undefined || value.contentHtml !== undefined, {
    message: "Provide a title or document content.",
  });

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return NextResponse.json({ document: await getDocument(id, requireUser(request)) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const userId = requireUser(request);
    const { id } = await params;
    await requireReadable(id, userId);
    const input = updateSchema.parse(await request.json());
    const updates: Record<string, string> = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.contentHtml !== undefined) updates.content_html = cleanHtml(input.contentHtml);
    const { error } = await getSupabaseAdmin().from("documents").update(updates).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    const userId = requireUser(request);
    const { id } = await params;
    await requireOwner(id, userId);
    const { error } = await getSupabaseAdmin().from("documents").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
