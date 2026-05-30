import { NextResponse } from "next/server";

const BASE_URL = "https://api.clashofclans.com/v1";
const API_KEY = process.env.CLASH_API_KEY!;
const CLAN_TAG = process.env.CLAN_TAG!;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export async function GET() {
  try {
    const res = await fetch(
      `${BASE_URL}/clans/${CLAN_TAG}/capitalraidseasons?limit=5`,
      {
        headers,
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) throw new Error("Error al obtener capital raids");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
