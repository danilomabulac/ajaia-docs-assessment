import { NextResponse } from "next/server";
import { handleApiError, requireUser } from "@/lib/api";
import { requireOwner } from "@/lib/documents";
import { getSupabaseAdmin } from "@/lib/supabase";

type Context = { params: Promise<{ id: string; userId: string }> };

export async function DELETE(request: Request, { params }: Context) {
  try {
    const ownerId = requireUser(request);
    const { id, userId } = await params;
    await requireOwner(id, ownerId);
    const { error } = await getSupabaseAdmin()
      .from("document_shares")
      .delete()
      .eq("document_id", id)
      .eq("user_id", userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
