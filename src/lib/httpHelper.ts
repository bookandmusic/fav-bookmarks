import { NextResponse } from "next/server";
import z from "zod";

export function createErrorResponse(
  message: string,
  status: number,
  issues?: z.ZodIssue[],
) {
  return NextResponse.json(
    { error: message, ...(issues && { issues }) },
    { status },
  );
}
