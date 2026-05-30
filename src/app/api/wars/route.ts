import { getCurrentWar, getWarLog } from "@/lib/clash";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentWar = await getCurrentWar().catch(() => ({
      state: "notInWar",
    }));
    const warLog = await getWarLog().catch(() => ({ items: [] }));

    return NextResponse.json({ currentWar, warLog });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
