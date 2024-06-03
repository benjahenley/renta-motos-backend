import { authenticateToken } from "@/middlewares/token";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  return await authenticateToken(req);
}

export const config = {
  matcher: ["/api/reservation"],
};
