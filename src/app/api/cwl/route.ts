import { NextResponse } from "next/server";

const BASE_URL = "https://api.clashofclans.com/v1";
const API_KEY = process.env.CLASH_API_KEY!;
const CLAN_TAG = process.env.CLAN_TAG!;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

const normalize = (tag: string) => tag.replace("#", "").toUpperCase();

async function fetchWar(tag: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/clanwarleagues/wars/${encodeURIComponent(tag)}`,
      { headers, next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const groupRes = await fetch(
      `${BASE_URL}/clans/${CLAN_TAG}/currentwar/leaguegroup`,
      { headers, next: { revalidate: 60 } },
    );

    if (groupRes.status === 404) {
      return NextResponse.json({ notInCWL: true });
    }

    if (!groupRes.ok) throw new Error("Error al obtener CWL");

    const group = await groupRes.json();
    const ourTag = normalize(decodeURIComponent(CLAN_TAG));

    // Fetch all wars round by round sequentially
    const allWars: object[] = [];
    const ourWars: object[] = [];

    for (const round of group.rounds) {
      const validTags = round.warTags.filter((t: string) => t !== "#0");
      if (!validTags.length) continue;

      const roundWars = await Promise.all(validTags.map(fetchWar));

      for (const war of roundWars) {
        if (!war) continue;
        allWars.push(war);

        const clanTag = normalize(war.clan?.tag || "");
        const oppTag = normalize(war.opponent?.tag || "");
        if (clanTag === ourTag || oppTag === ourTag) {
          ourWars.push(war);
        }
      }
    }

    return NextResponse.json({ group, wars: ourWars, allWars });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
