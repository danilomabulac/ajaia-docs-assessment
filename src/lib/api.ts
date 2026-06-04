import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USERS } from "@/lib/demo-users";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function requireUser(request: Request) {
  const userId = request.headers.get("x-demo-user-id");
  if (!userId || !DEMO_USERS.some((user) => user.id === userId)) {
    throw new ApiError(401, "Select a valid demo user to continue.");
  }
  return userId;
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }
  if (
    error instanceof Error && error.message.includes("fetch failed") ||
    typeof error === "object" && error !== null && "message" in error &&
    String(error.message).includes("fetch failed")
  ) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "The database is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 },
  );
}
