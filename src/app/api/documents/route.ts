import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, requireUser } from "@/lib/api";
import { cleanHtml, listDocuments } from "@/lib/documents";
import { getSupabaseAdmin } from "@/lib/supabase";

const createSchema = z.object({
  title: z.string().trim().min(1).max(120).default("Untitled document"),
  contentHtml: z.string().max(2_000_000).default("<p></p>"),
});

export async function GET(request: Request) {
  try {
    return NextResponse.json(await listDocuments(requireUser(request)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const ownerId = requireUser(request);
    const input = createSchema.parse(await request.json());
    const { data, error } = await getSupabaseAdmin()
      .from("documents")
      .insert({
        title: input.title,
        content_html: cleanHtml(input.contentHtml),
        owner_id: ownerId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
