"use client";

import {
  Paper,
  Table,
  Title,
  Badge,
  Group,
  Text,
  Avatar,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";
import { CWLClan, CWLWar } from "@/types/clash";

interface CWLGroupStandingsProps {
  clans: CWLClan[];
  wars: CWLWar[];
  ourClanTag: string;
}

interface ClanStats {
  tag: string;
  name: string;
  badgeUrl: string;
  clanLevel: number;
  wins: number;
  losses: number;
  stars: number;
  destruction: number;
  attacks: number;
}

function computeStandings(clans: CWLClan[], wars: CWLWar[]): ClanStats[] {
  const statsMap = new Map<string, ClanStats>();
  const normalize = (tag: string) => tag.replace("#", "").toUpperCase();

  clans.forEach((clan) => {
    statsMap.set(normalize(clan.tag), {
      tag: clan.tag,
      name: clan.name,
      badgeUrl: clan.badgeUrls?.medium,
      clanLevel: clan.clanLevel,
      wins: 0,
      losses: 0,
      stars: 0,
      destruction: 0,
      attacks: 0,
    });
  });

  const warCount = new Map<string, number>();

  wars.forEach((war) => {
    if (!war || war.state === "preparation") return;

    const clanTag = normalize(war.clan?.tag || "");
    const oppTag = normalize(war.opponent?.tag || "");

    const clanStats = statsMap.get(clanTag);
    const oppStats = statsMap.get(oppTag);

    if (clanStats) {
      clanStats.stars += war.clan.stars || 0;
      clanStats.destruction += war.clan.destructionPercentage || 0;
      clanStats.attacks += war.clan.attacks || 0;
      warCount.set(clanTag, (warCount.get(clanTag) || 0) + 1);
      if (war.state === "warEnded") {
        if (war.clan.stars > war.opponent.stars) clanStats.wins++;
        else if (war.clan.stars < war.opponent.stars) clanStats.losses++;
      }
    }

    if (oppStats) {
      oppStats.stars += war.opponent.stars || 0;
      oppStats.destruction += war.opponent.destructionPercentage || 0;
      oppStats.attacks += war.opponent.attacks || 0;
      warCount.set(oppTag, (warCount.get(oppTag) || 0) + 1);
      if (war.state === "warEnded") {
        if (war.opponent.stars > war.clan.stars) oppStats.wins++;
        else if (war.opponent.stars < war.clan.stars) oppStats.losses++;
      }
    }
  });

  statsMap.forEach((stats, tag) => {
    const count = warCount.get(tag) || 1;
    stats.destruction = Math.round((stats.destruction / count) * 10) / 10;
  });

  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.destruction - a.destruction;
  });
}

const medals = ["🥇", "🥈", "🥉"];

export default function CWLGroupStandings({
  clans,
  wars,
  ourClanTag,
}: CWLGroupStandingsProps) {
  const standings = computeStandings(clans, wars);

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <ThemeIcon color="yellow" variant="light" size="sm">
          <IconTrophy size={14} />
        </ThemeIcon>
        <Title order={5}>Clasificación del grupo</Title>
      </Group>

      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Clan</Table.Th>
            <Table.Th>Nivel</Table.Th>
            <Table.Th>V</Table.Th>
            <Table.Th>D</Table.Th>
            <Table.Th>⭐</Table.Th>
            <Table.Th>Destrucción</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {standings.map((clan, i) => (
            <Table.Tr
              key={clan.tag}
              bg={clan.tag === ourClanTag ? "dark.6" : undefined}
            >
              <Table.Td>
                <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Avatar src={clan.badgeUrl} size={28} radius="sm" />
                  <Stack gap={0}>
                    <Text size="sm" fw={clan.tag === ourClanTag ? 700 : 400}>
                      {clan.name}
                    </Text>
                    {clan.tag === ourClanTag && (
                      <Badge size="xs" color="yellow" variant="filled">
                        Tu clan
                      </Badge>
                    )}
                  </Stack>
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge variant="light" color="gray" size="sm">
                  Nv {clan.clanLevel}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={700} c="green">
                  {clan.wins}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={700} c="red">
                  {clan.losses}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <Text size="sm" fw={700} c="yellow">
                    ⭐ {clan.stars}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {clan.destruction}%
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
