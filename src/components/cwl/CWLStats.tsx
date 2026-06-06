"use client";

import {
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Progress,
  Table,
  Avatar,
  Divider,
} from "@mantine/core";
import {
  IconTrophy,
  IconTarget,
  IconChartBar,
  IconFlame,
} from "@tabler/icons-react";
import { CWLWar, WarMember, Attack } from "@/types/clash";

interface CWLStatsProps {
  wars: CWLWar[];
  ourClanTag: string;
}

interface RoundStat {
  round: number;
  result: string;
  ourStars: number;
  theirStars: number;
  ourDestruction: number;
  theirDestruction: number;
  ourAttacks: number;
  opponent: string;
  opponentBadge: string;
}

interface PlayerStat {
  tag: string;
  name: string;
  townhallLevel: number;
  totalStars: number;
  totalAttacks: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  zeroStars: number;
  missedAttacks: number;
  totalDestruction: number;
  efficiency: number;
}

const normalize = (tag: string) => tag.replace("#", "").toUpperCase();

function computeRoundStats(wars: CWLWar[], ourClanTag: string): RoundStat[] {
  const our = normalize(ourClanTag);
  return wars
    .filter((w) => w.state === "warEnded")
    .map((war, i) => {
      const isMain = normalize(war.clan.tag) === our;
      const ourClan = isMain ? war.clan : war.opponent;
      const theirClan = isMain ? war.opponent : war.clan;
      const result =
        ourClan.stars > theirClan.stars
          ? "win"
          : ourClan.stars < theirClan.stars
            ? "lose"
            : "tie";
      return {
        round: i + 1,
        result,
        ourStars: ourClan.stars,
        theirStars: theirClan.stars,
        ourDestruction: ourClan.destructionPercentage,
        theirDestruction: theirClan.destructionPercentage,
        ourAttacks: ourClan.attacks,
        opponent: theirClan.name,
        opponentBadge: theirClan.badgeUrls?.medium,
      };
    });
}

function computePlayerStats(wars: CWLWar[], ourClanTag: string): PlayerStat[] {
  const our = normalize(ourClanTag);
  const statsMap = new Map<string, PlayerStat>();

  wars.forEach((war) => {
    if (war.state === "preparation") return;
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
          threeStars: 0,
          twoStars: 0,
          oneStar: 0,
          zeroStars: 0,
          missedAttacks: 0,
          totalDestruction: 0,
          efficiency: 0,
        });
      }

      const stats = statsMap.get(member.tag)!;
      const attacks = member.attacks || [];

      if (war.state === "warEnded" && attacks.length === 0) {
        stats.missedAttacks++;
      }

      attacks.forEach((a: Attack) => {
        stats.totalStars += a.stars;
        stats.totalAttacks++;
        stats.totalDestruction += a.destructionPercentage;
        if (a.stars === 3) stats.threeStars++;
        else if (a.stars === 2) stats.twoStars++;
        else if (a.stars === 1) stats.oneStar++;
        else stats.zeroStars++;
      });
    });
  });

  statsMap.forEach((s) => {
    s.efficiency =
      s.totalAttacks > 0
        ? Math.round((s.totalStars / (s.totalAttacks * 3)) * 100)
        : 0;
  });

  return Array.from(statsMap.values()).sort(
    (a, b) => b.totalStars - a.totalStars,
  );
}

function RoundProgressBar({ rounds }: { rounds: RoundStat[] }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <ThemeIcon color="blue" variant="light" size="sm">
          <IconChartBar size={14} />
        </ThemeIcon>
        <Title order={5}>Rendimiento por ronda</Title>
      </Group>
      <Stack gap="md">
        {rounds.map((r) => (
          <Stack key={r.round} gap="xs">
            <Group justify="space-between">
              <Group gap="xs">
                <Text size="sm" fw={600}>
                  Ronda {r.round}
                </Text>
                <Avatar src={r.opponentBadge} size={20} radius="sm" />
                <Text size="xs" c="dimmed">
                  vs {r.opponent}
                </Text>
              </Group>
              <Group gap="xs">
                {r.result === "win" ? (
                  <Badge color="green" size="sm">
                    Victoria
                  </Badge>
                ) : r.result === "lose" ? (
                  <Badge color="red" size="sm">
                    Derrota
                  </Badge>
                ) : (
                  <Badge color="gray" size="sm">
                    Empate
                  </Badge>
                )}
                <Text size="sm" fw={700}>
                  ⭐ {r.ourStars} vs {r.theirStars}
                </Text>
              </Group>
            </Group>
            <Progress.Root size="lg" radius="xl">
              <Progress.Section
                value={(r.ourStars / (r.ourStars + r.theirStars)) * 100}
                color={
                  r.result === "win"
                    ? "green"
                    : r.result === "lose"
                      ? "red"
                      : "gray"
                }
              >
                <Progress.Label>{r.ourStars}⭐</Progress.Label>
              </Progress.Section>
              <Progress.Section
                value={(r.theirStars / (r.ourStars + r.theirStars)) * 100}
                color="dark"
              >
                <Progress.Label>{r.theirStars}⭐</Progress.Label>
              </Progress.Section>
            </Progress.Root>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Nuestra destrucción: {r.ourDestruction.toFixed(1)}%
              </Text>
              <Text size="xs" c="dimmed">
                Su destrucción: {r.theirDestruction.toFixed(1)}%
              </Text>
            </Group>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function SummaryCards({
  rounds,
  players,
}: {
  rounds: RoundStat[];
  players: PlayerStat[];
}) {
  const wins = rounds.filter((r) => r.result === "win").length;
  const losses = rounds.filter((r) => r.result === "lose").length;
  const totalStars = rounds.reduce((s, r) => s + r.ourStars, 0);
  const avgDestruction = rounds.length
    ? (
        rounds.reduce((s, r) => s + r.ourDestruction, 0) / rounds.length
      ).toFixed(1)
    : "0";
  const topPlayer = players[0];
  const mostMissed = [...players].sort(
    (a, b) => b.missedAttacks - a.missedAttacks,
  )[0];
  const bestEfficiency = [...players]
    .filter((p) => p.totalAttacks >= 3)
    .sort((a, b) => b.efficiency - a.efficiency)[0];

  return (
    <SimpleGrid cols={{ base: 2, sm: 3 }}>
      <Paper withBorder radius="md" p="md">
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="green">
            {wins}
          </Text>
          <Text size="xs" c="dimmed">
            Victorias
          </Text>
          <Text size="xl" fw={900} c="red">
            {losses}
          </Text>
          <Text size="xs" c="dimmed">
            Derrotas
          </Text>
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="yellow">
            ⭐ {totalStars}
          </Text>
          <Text size="xs" c="dimmed">
            Estrellas totales
          </Text>
          <Text size="lg" fw={700} c="blue">
            {avgDestruction}%
          </Text>
          <Text size="xs" c="dimmed">
            Destrucción promedio
          </Text>
        </Stack>
      </Paper>

      {topPlayer && (
        <Paper withBorder radius="md" p="md">
          <Stack gap={2} align="center">
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconTrophy size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              MVP
            </Text>
            <Text size="sm" fw={700}>
              {topPlayer.name}
            </Text>
            <Text size="xs" c="yellow">
              ⭐ {topPlayer.totalStars} estrellas
            </Text>
          </Stack>
        </Paper>
      )}

      {bestEfficiency && (
        <Paper withBorder radius="md" p="md">
          <Stack gap={2} align="center">
            <ThemeIcon color="green" variant="light" size="sm">
              <IconTarget size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              Más eficiente
            </Text>
            <Text size="sm" fw={700}>
              {bestEfficiency.name}
            </Text>
            <Text size="xs" c="green">
              {bestEfficiency.efficiency}% eficiencia
            </Text>
          </Stack>
        </Paper>
      )}

      {mostMissed && mostMissed.missedAttacks > 0 && (
        <Paper withBorder radius="md" p="md">
          <Stack gap={2} align="center">
            <ThemeIcon color="red" variant="light" size="sm">
              <IconFlame size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              Más faltas
            </Text>
            <Text size="sm" fw={700}>
              {mostMissed.name}
            </Text>
            <Text size="xs" c="red">
              {mostMissed.missedAttacks} ataques perdidos
            </Text>
          </Stack>
        </Paper>
      )}
    </SimpleGrid>
  );
}

function PlayerEfficiencyTable({ players }: { players: PlayerStat[] }) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <ThemeIcon color="green" variant="light" size="sm">
          <IconTarget size={14} />
        </ThemeIcon>
        <Title order={5}>Eficiencia por jugador</Title>
      </Group>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Jugador</Table.Th>
            <Table.Th>TH</Table.Th>
            <Table.Th>⭐</Table.Th>
            <Table.Th>🌟 x3</Table.Th>
            <Table.Th>Eficiencia</Table.Th>
            <Table.Th>Distribución</Table.Th>
            <Table.Th>Faltas</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {players.map((p, i) => {
            return (
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
                  <Text size="sm" fw={700} c="yellow">
                    ⭐ {p.totalStars}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={p.threeStars > 0 ? "green" : "gray"}
                    variant="light"
                    size="sm"
                  >
                    {p.threeStars} 🌟
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Stack gap={2}>
                    <Progress
                      value={p.efficiency}
                      color={
                        p.efficiency >= 70
                          ? "green"
                          : p.efficiency >= 40
                            ? "yellow"
                            : "red"
                      }
                      size="sm"
                      radius="xl"
                      w={80}
                    />
                    <Text size="xs" c="dimmed">
                      {p.efficiency}%
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Group gap={2}>
                    <Badge size="xs" color="green" variant="light">
                      3⭐×{p.threeStars}
                    </Badge>
                    <Badge size="xs" color="blue" variant="light">
                      2⭐×{p.twoStars}
                    </Badge>
                    <Badge size="xs" color="yellow" variant="light">
                      1⭐×{p.oneStar}
                    </Badge>
                    {p.zeroStars > 0 && (
                      <Badge size="xs" color="red" variant="light">
                        0⭐×{p.zeroStars}
                      </Badge>
                    )}
                  </Group>
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
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

function CWLAlerts({ players }: { players: PlayerStat[] }) {
  const repeatOffenders = players.filter((p) => p.missedAttacks >= 2);
  const missedOnce = players.filter((p) => p.missedAttacks === 1);
  const zeroAttacks = players.filter((p) => p.totalAttacks === 0);

  const hasAlerts =
    repeatOffenders.length > 0 ||
    missedOnce.length > 0 ||
    zeroAttacks.length > 0;

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <ThemeIcon color="red" variant="light" size="sm">
          <IconFlame size={14} />
        </ThemeIcon>
        <Title order={5}>Alertas CWL</Title>
      </Group>

      {!hasAlerts && (
        <Text c="green" ta="center" fw={600}>
          Todo en orden, sin alertas!
        </Text>
      )}

      {zeroAttacks.length > 0 && (
        <Stack gap="xs" mb="sm">
          <Text size="sm" fw={600} c="red">
            Sin ningún ataque en toda la CWL
          </Text>
          <Group gap="xs">
            {zeroAttacks.map((p) => (
              <Badge key={p.tag} color="red" variant="filled" size="sm">
                {p.name}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      {repeatOffenders.length > 0 && (
        <Stack gap="xs" mb="sm">
          <Text size="sm" fw={600} c="orange">
            Faltas repetidas (2+ rondas sin atacar)
          </Text>
          <Group gap="xs">
            {repeatOffenders.map((p) => (
              <Badge key={p.tag} color="orange" variant="filled" size="sm">
                {p.name} ({p.missedAttacks} faltas)
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      {missedOnce.length > 0 && (
        <Stack gap="xs">
          <Text size="sm" fw={600} c="yellow">
            Faltaron en 1 ronda
          </Text>
          <Group gap="xs">
            {missedOnce.map((p) => (
              <Badge key={p.tag} color="yellow" variant="light" size="sm">
                {p.name}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}
    </Paper>
  );
}

export default function CWLStats({ wars, ourClanTag }: CWLStatsProps) {
  const finishedWars = wars.filter((w) => w.state === "warEnded");

  if (!finishedWars.length) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">
          No hay rondas finalizadas aún.
        </Text>
      </Paper>
    );
  }

  const rounds = computeRoundStats(wars, ourClanTag);
  const players = computePlayerStats(wars, ourClanTag);

  return (
    <Stack gap="md">
      <CWLAlerts players={players} />
      <SummaryCards rounds={rounds} players={players} />
      <Divider />
      <RoundProgressBar rounds={rounds} />
      <Divider />
      <PlayerEfficiencyTable players={players} />
    </Stack>
  );
}
