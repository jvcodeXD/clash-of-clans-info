import { NextResponse } from "next/server";

const BASE_URL = "https://api.clashofclans.com/v1";
const API_KEY = process.env.CLASH_API_KEY!;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    if (!tag)
      return NextResponse.json({ error: "Tag requerido" }, { status: 400 });

    const res = await fetch(`${BASE_URL}/players/${encodeURIComponent(tag)}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Error al obtener jugador");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
