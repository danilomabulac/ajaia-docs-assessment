import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, handleApiError, requireUser } from "@/lib/api";
import { DEMO_USERS } from "@/lib/demo-users";
import { requireOwner } from "@/lib/documents";
import { getSupabaseAdmin } from "@/lib/supabase";

const shareSchema = z.object({ userId: z.string().uuid() });
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    const ownerId = requireUser(request);
    const { id } = await params;
    await requireOwner(id, ownerId);
    const { userId } = shareSchema.parse(await request.json());
    if (ownerId === userId) throw new ApiError(400, "A document is already available to its owner.");
    if (!DEMO_USERS.some((user) => user.id === userId)) throw new ApiError(400, "Select a valid demo user.");
    const { error } = await getSupabaseAdmin()
      .from("document_shares")
      .upsert({ document_id: id, user_id: userId }, { onConflict: "document_id,user_id" });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
