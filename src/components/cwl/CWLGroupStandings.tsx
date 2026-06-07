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
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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

const normalize = (tag: string) => tag.replace("#", "").toUpperCase();
const medals = ["🥇", "🥈", "🥉"];

function computeStandings(clans: CWLClan[], wars: CWLWar[]): ClanStats[] {
  const statsMap = new Map<string, ClanStats>();
  const warCount = new Map<string, number>();

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

export default function CWLGroupStandings({
  clans,
  wars,
  ourClanTag,
}: CWLGroupStandingsProps) {
  const standings = computeStandings(clans, wars);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <ThemeIcon color="yellow" variant="light" size="sm">
          <IconTrophy size={14} />
        </ThemeIcon>
        <Title order={5}>Clasificación del grupo</Title>
      </Group>

      {isMobile ? (
        <Stack gap="sm">
          {standings.map((clan, i) => {
            const isOurs = normalize(clan.tag) === normalize(ourClanTag);

            if (isOurs) {
              return (
                <Card
                  key={clan.tag}
                  withBorder
                  radius="md"
                  p="md"
                  style={{
                    borderColor: "var(--mantine-color-yellow-6)",
                    borderWidth: 2,
                    background:
                      "linear-gradient(135deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-6) 100%)",
                  }}
                >
                  <Stack gap="sm">
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                        <Text size="lg">{medals[i] ?? `#${i + 1}`}</Text>
                        <Avatar
                          src={clan.badgeUrl}
                          size={44}
                          radius="md"
                          style={{ flexShrink: 0 }}
                        />
                        <Stack gap={2} style={{ minWidth: 0 }}>
                          <Text
                            fw={900}
                            size="md"
                            c="yellow"
                            lineClamp={1}
                            style={{ minWidth: 0 }}
                          >
                            {clan.name}
                          </Text>
                          <Group gap={4}>
                            <Badge size="xs" color="yellow" variant="filled">
                              Tu clan
                            </Badge>
                            <Badge color="gray" variant="light" size="xs">
                              Nv {clan.clanLevel}
                            </Badge>
                          </Group>
                        </Stack>
                      </Group>
                      <Stack gap={0} align="flex-end" style={{ flexShrink: 0 }}>
                        <Text size="xl" fw={900} c="yellow">
                          ⭐ {clan.stars}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {clan.destruction}%
                        </Text>
                      </Stack>
                    </Group>

                    <Group grow>
                      <Paper p="xs" radius="md" withBorder ta="center">
                        <Text size="xl" fw={900} c="green">
                          {clan.wins}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Victorias
                        </Text>
                      </Paper>
                      <Paper p="xs" radius="md" withBorder ta="center">
                        <Text size="xl" fw={900} c="red">
                          {clan.losses}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Derrotas
                        </Text>
                      </Paper>
                      <Paper p="xs" radius="md" withBorder ta="center">
                        <Text size="md" fw={700} c="blue">
                          {clan.destruction}%
                        </Text>
                        <Text size="xs" c="dimmed">
                          Dest. prom.
                        </Text>
                      </Paper>
                    </Group>
                  </Stack>
                </Card>
              );
            }

            return (
              <Card key={clan.tag} withBorder radius="md" p="sm">
                <Group justify="space-between" wrap="nowrap" align="center">
                  <Group
                    gap="xs"
                    wrap="nowrap"
                    style={{ minWidth: 0, flex: 1 }}
                  >
                    <Text size="sm" style={{ flexShrink: 0 }}>
                      {medals[i] ?? `#${i + 1}`}
                    </Text>
                    <Avatar
                      src={clan.badgeUrl}
                      size={36}
                      radius="sm"
                      style={{ flexShrink: 0 }}
                    />
                    <Stack gap={2} style={{ minWidth: 0 }}>
                      <Text size="sm" lineClamp={1} style={{ minWidth: 0 }}>
                        {clan.name}
                      </Text>
                      <Group gap={4}>
                        <Badge color="gray" variant="light" size="xs">
                          Nv {clan.clanLevel}
                        </Badge>
                        <Text size="xs" c="green">
                          {clan.wins}V
                        </Text>
                        <Text size="xs" c="red">
                          {clan.losses}D
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                  <Stack
                    gap={2}
                    align="flex-end"
                    style={{ flexShrink: 0, marginLeft: 8 }}
                  >
                    <Text
                      size="sm"
                      fw={700}
                      c="yellow"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      ⭐ {clan.stars}
                    </Text>
                    <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                      {clan.destruction}%
                    </Text>
                  </Stack>
                </Group>
              </Card>
            );
          })}
        </Stack>
      ) : (
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
                bg={
                  normalize(clan.tag) === normalize(ourClanTag)
                    ? "dark.6"
                    : undefined
                }
              >
                <Table.Td>
                  <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar src={clan.badgeUrl} size={28} radius="sm" />
                    <Stack gap={0}>
                      <Text
                        size="sm"
                        fw={
                          normalize(clan.tag) === normalize(ourClanTag)
                            ? 700
                            : 400
                        }
                      >
                        {clan.name}
                      </Text>
                      {normalize(clan.tag) === normalize(ourClanTag) && (
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
                  <Text size="sm" fw={700} c="yellow">
                    ⭐ {clan.stars}
                  </Text>
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
      )}
    </Paper>
  );
}
