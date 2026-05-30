import { getClanMembers } from "@/lib/clash";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getClanMembers();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
