import { authenticate } from "@/lib/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const { uid } = await authenticate.verifyIdToken(token);

    return uid;
  } catch (error: any) {
    throw new Error("Unauthorized");
  }
}
