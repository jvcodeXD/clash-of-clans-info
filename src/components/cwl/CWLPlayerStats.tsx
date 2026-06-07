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
  Progress,
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconStar } from "@tabler/icons-react";
import { CWLWar, WarMember, Attack } from "@/types/clash";

interface PlayerCWLStats {
  tag: string;
  name: string;
  townhallLevel: number;
  totalStars: number;
  totalAttacks: number;
  missedAttacks: number;
  avgDestruction: number;
  threeStars: number;
}

interface CWLPlayerStatsProps {
  wars: CWLWar[];
  ourClanTag: string;
}

const normalize = (tag: string) => tag.replace("#", "").toUpperCase();
const medals = ["🥇", "🥈", "🥉"];

function computePlayerStats(
  wars: CWLWar[],
  ourClanTag: string,
): PlayerCWLStats[] {
  const our = normalize(ourClanTag);
  const statsMap = new Map<string, PlayerCWLStats>();

  wars.forEach((war) => {
    if (!war || war.state === "preparation") return;
    const isMain = normalize(war.clan.tag) === our;
    const ourClan = isMain ? war.clan : war.opponent;

    ourClan.members.forEach((member: WarMember) => {
      if (!statsMap.has(member.tag)) {
        statsMap.set(member.tag, {
          tag: member.tag,
          name: member.name,
          townhallLevel: member.townhallLevel,
          totalStars: 0,
          totalAttacks: 0,
          missedAttacks: 0,
          avgDestruction: 0,
          threeStars: 0,
        });
      }

      const stats = statsMap.get(member.tag)!;
      const attacks = member.attacks || [];
      stats.missedAttacks +=
        war.state === "warEnded" && attacks.length === 0 ? 1 : 0;

      attacks.forEach((a: Attack) => {
        stats.totalStars += a.stars;
        stats.totalAttacks++;
        stats.avgDestruction += a.destructionPercentage;
        if (a.stars === 3) stats.threeStars++;
      });
    });
  });

  statsMap.forEach((stats) => {
    if (stats.totalAttacks > 0) {
      stats.avgDestruction = Math.round(
        stats.avgDestruction / stats.totalAttacks,
      );
    }
  });

  return Array.from(statsMap.values()).sort(
    (a, b) => b.totalStars - a.totalStars,
  );
}

export default function CWLPlayerStats({
  wars,
  ourClanTag,
}: CWLPlayerStatsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const finishedWars = wars.filter((w) => w.state === "warEnded");

  if (!finishedWars.length) {
    return (
      <Paper withBorder radius="md" p="md">
        <Text c="dimmed" ta="center">
          No hay guerras finalizadas aún.
        </Text>
      </Paper>
    );
  }

  const players = computePlayerStats(wars, ourClanTag);
  const maxStars = players[0]?.totalStars || 1;

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <ThemeIcon color="yellow" variant="light" size="sm">
          <IconStar size={14} />
        </ThemeIcon>
        <Title order={5}>Rendimiento de jugadores en CWL</Title>
      </Group>

      {isMobile ? (
        <Stack gap="sm">
          {players.map((p, i) => (
            <Card key={p.tag} withBorder radius="md" p="sm">
              <Group justify="space-between">
                <Group gap="sm">
                  <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
                  <Avatar color="yellow" radius="xl" size="sm">
                    {p.name.charAt(0)}
                  </Avatar>
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>
                      {p.name}
                    </Text>
                    <Group gap={4}>
                      <Badge variant="light" color="cyan" size="xs">
                        TH {p.townhallLevel}
                      </Badge>
                      <Text size="xs" c="yellow">
                        ⭐ {p.totalStars}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
                <Stack gap={2} align="flex-end">
                  <Badge
                    color={p.threeStars > 0 ? "green" : "gray"}
                    variant="light"
                    size="xs"
                  >
                    {p.threeStars} triple{p.threeStars !== 1 ? "s" : ""}
                  </Badge>
                  {p.missedAttacks > 0 ? (
                    <Badge color="red" variant="light" size="xs">
                      {p.missedAttacks} falta{p.missedAttacks > 1 ? "s" : ""}
                    </Badge>
                  ) : (
                    <Badge color="green" variant="light" size="xs">
                      ✓
                    </Badge>
                  )}
                </Stack>
              </Group>
              <Stack gap={2} mt="xs">
                <Progress
                  value={(p.totalStars / maxStars) * 100}
                  color="yellow"
                  size="xs"
                  radius="xl"
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : (
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Jugador</Table.Th>
              <Table.Th>TH</Table.Th>
              <Table.Th>⭐ Total</Table.Th>
              <Table.Th>Ataques</Table.Th>
              <Table.Th>Triples</Table.Th>
              <Table.Th>Destrucción prom.</Table.Th>
              <Table.Th>Faltas</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.map((p, i) => (
              <Table.Tr key={p.tag}>
                <Table.Td>
                  <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Avatar color="yellow" radius="xl" size="sm">
                      {p.name.charAt(0)}
                    </Avatar>
                    <Text size="sm" fw={600}>
                      {p.name}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="cyan" size="sm">
                    TH {p.townhallLevel}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Stack gap={2}>
                    <Text size="sm" fw={700} c="yellow">
                      ⭐ {p.totalStars}
                    </Text>
                    <Progress
                      value={(p.totalStars / maxStars) * 100}
                      color="yellow"
                      size="xs"
                      radius="xl"
                      w={80}
                    />
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{p.totalAttacks}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={p.threeStars > 0 ? "green" : "gray"}
                    variant="light"
                    size="sm"
                  >
                    {p.threeStars} triple{p.threeStars !== 1 ? "s" : ""}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Stack gap={2}>
                    <Progress
                      value={p.avgDestruction}
                      color={
                        p.avgDestruction >= 70
                          ? "green"
                          : p.avgDestruction >= 40
                            ? "yellow"
                            : "red"
                      }
                      size="sm"
                      radius="xl"
                      w={80}
                    />
                    <Text size="xs" c="dimmed">
                      {p.avgDestruction}%
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  {p.missedAttacks > 0 ? (
                    <Badge color="red" variant="light" size="sm">
                      {p.missedAttacks} falta{p.missedAttacks > 1 ? "s" : ""}
                    </Badge>
                  ) : (
                    <Badge color="green" variant="light" size="sm">
                      ✓
                    </Badge>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
