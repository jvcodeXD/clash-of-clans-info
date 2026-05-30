const BASE_URL = "https://api.clashofclans.com/v1";
const API_KEY = process.env.CLASH_API_KEY!;
const CLAN_TAG = process.env.CLAN_TAG!;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export async function getClan() {
  const res = await fetch(`${BASE_URL}/clans/${CLAN_TAG}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Error al obtener datos del clan");
  return res.json();
}

export async function getClanMembers() {
  const res = await fetch(`${BASE_URL}/clans/${CLAN_TAG}/members`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Error al obtener miembros");
  return res.json();
}

export async function getCurrentWar() {
  const res = await fetch(`${BASE_URL}/clans/${CLAN_TAG}/currentwar`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Error al obtener guerra actual");
  return res.json();
}

export async function getWarLog() {
  const res = await fetch(`${BASE_URL}/clans/${CLAN_TAG}/warlog`, {
    headers,
    next: { revalidate: 60 },
  });
  if (res.status === 403) return { items: [] }; // log privado
  if (!res.ok) throw new Error("Error al obtener historial de guerras");
  return res.json();
}

export async function getCapitalRaids() {
  const res = await fetch(
    `${BASE_URL}/clans/${CLAN_TAG}/capitalraidseasons?limit=5`,
    {
      headers,
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) throw new Error("Error al obtener capital raids");
  return res.json();
}
