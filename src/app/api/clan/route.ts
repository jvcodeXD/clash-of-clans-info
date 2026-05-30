import { getClan } from "@/lib/clash";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("API KEY:", process.env.CLASH_API_KEY ? "existe" : "NO EXISTE");
  console.log("CLAN TAG:", process.env.CLAN_TAG);
  try {
    const data = await getClan();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
