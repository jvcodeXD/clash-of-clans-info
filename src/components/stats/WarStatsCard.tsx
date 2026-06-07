"use client";

import {
  Paper,
  Table,
  Title,
  Badge,
  Group,
  Text,
  Avatar,
  Progress,
  Stack,
  ThemeIcon,
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSword, IconStar } from "@tabler/icons-react";
import { WarLogEntry, WarMember, Attack } from "@/types/clash";

interface WarSummaryProps {
  warLog: WarLogEntry[];
}

interface CurrentWarStarsProps {
  members: WarMember[];
  attacksPerMember: number;
}

interface WarStatsCardProps {
  warLog: WarLogEntry[];
  currentWar: {
    clan: { members: WarMember[] };
    attacksPerMember: number;
    state: string;
  } | null;
}

const medals = ["🥇", "🥈", "🥉"];

function WarSummaryTable({ warLog }: WarSummaryProps) {
  const wins = warLog.filter((w) => w.result === "win").length;
  const losses = warLog.filter((w) => w.result === "lose").length;
  const draws = warLog.filter((w) => w.result === "tie").length;
  const total = warLog.length;
  const totalStars = warLog.reduce((s, w) => s + w.clan.stars, 0);
  const totalOpponentStars = warLog.reduce((s, w) => s + w.opponent.stars, 0);
  const avgDestruction =
    total > 0
      ? (
          warLog.reduce((s, w) => s + w.clan.destructionPercentage, 0) / total
        ).toFixed(1)
      : "0";
  const avgOpponentDestruction =
    total > 0
      ? (
          warLog.reduce((s, w) => s + w.opponent.destructionPercentage, 0) /
          total
        ).toFixed(1)
      : "0";
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <Stack gap="xs">
      <Group gap="xl" wrap="wrap">
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="green">
            {wins}
          </Text>
          <Text size="xs" c="dimmed">
            Victorias
          </Text>
        </Stack>
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="gray">
            {draws}
          </Text>
          <Text size="xs" c="dimmed">
            Empates
          </Text>
        </Stack>
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="red">
            {losses}
          </Text>
          <Text size="xs" c="dimmed">
            Derrotas
          </Text>
        </Stack>
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="yellow">
            {totalStars}
          </Text>
          <Text size="xs" c="dimmed">
            Estrellas
          </Text>
        </Stack>
        <Stack gap={0} align="center">
          <Text size="xl" fw={900} c="blue">
            {avgDestruction}%
          </Text>
          <Text size="xs" c="dimmed">
            Dest. prom.
          </Text>
        </Stack>
      </Group>

      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="xs">Win rate</Text>
          <Text size="xs" fw={700} c={winRate >= 50 ? "green" : "red"}>
            {winRate}%
          </Text>
        </Group>
        <Progress
          value={winRate}
          color={winRate >= 60 ? "green" : winRate >= 40 ? "yellow" : "red"}
          size="md"
          radius="xl"
        />
      </Stack>

      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="xs">Nuestras ⭐ vs rivales</Text>
          <Text size="xs" c="dimmed">
            {totalStars} vs {totalOpponentStars}
          </Text>
        </Group>
        <Progress.Root size="md" radius="xl">
          <Progress.Section
            value={(totalStars / (totalStars + totalOpponentStars)) * 100}
            color="yellow"
          />
          <Progress.Section
            value={
              (totalOpponentStars / (totalStars + totalOpponentStars)) * 100
            }
            color="gray"
          />
        </Progress.Root>
        <Group justify="space-between">
          <Text size="xs" c="yellow">
            Nosotros {avgDestruction}%
          </Text>
          <Text size="xs" c="dimmed">
            Rivales {avgOpponentDestruction}%
          </Text>
        </Group>
      </Stack>
    </Stack>
  );
}

function CurrentWarStars({ members, attacksPerMember }: CurrentWarStarsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sorted = [...members]
    .map((m) => ({
      ...m,
      totalStars: (m.attacks || []).reduce((s, a: Attack) => s + a.stars, 0),
      totalAttacks: m.attacks?.length || 0,
      avgDestruction: m.attacks?.length
        ? Math.round(
            (m.attacks || []).reduce(
              (s, a: Attack) => s + a.destructionPercentage,
              0,
            ) / m.attacks.length,
          )
        : 0,
    }))
    .sort((a, b) => b.totalStars - a.totalStars);

  const maxStars = attacksPerMember * 3;

  if (isMobile) {
    return (
      <Stack gap="sm">
        {sorted.map((m, i) => (
          <Card key={m.tag} withBorder radius="md" p="sm">
            <Group justify="space-between">
              <Group gap="sm">
                <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
                <Avatar color="yellow" radius="xl" size="sm">
                  {m.name.charAt(0)}
                </Avatar>
                <Stack gap={2}>
                  <Text size="sm" fw={600}>
                    {m.name}
                  </Text>
                  <Badge variant="light" color="cyan" size="xs">
                    TH {m.townhallLevel}
                  </Badge>
                </Stack>
              </Group>
              <Stack gap={2} align="flex-end">
                <Text size="sm" fw={700} c="yellow">
                  ⭐ {m.totalStars}/{maxStars}
                </Text>
                <Badge
                  color={
                    m.totalAttacks === attacksPerMember
                      ? "green"
                      : m.totalAttacks > 0
                        ? "yellow"
                        : "red"
                  }
                  variant="light"
                  size="xs"
                >
                  {m.totalAttacks}/{attacksPerMember} ataques
                </Badge>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Table verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>#</Table.Th>
          <Table.Th>Jugador</Table.Th>
          <Table.Th>TH</Table.Th>
          <Table.Th>Estrellas</Table.Th>
          <Table.Th>Ataques</Table.Th>
          <Table.Th>Destrucción prom.</Table.Th>
          <Table.Th>Perdidas</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sorted.map((m, i) => (
          <Table.Tr key={m.tag}>
            <Table.Td>
              <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Avatar color="yellow" radius="xl" size="sm">
                  {m.name.charAt(0)}
                </Avatar>
                <Text size="sm" fw={600}>
                  {m.name}
                </Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Badge variant="light" color="cyan" size="sm">
                TH {m.townhallLevel}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                <Text size="sm" fw={700} c="yellow">
                  ⭐ {m.totalStars}
                </Text>
                <Text size="xs" c="dimmed">
                  / {maxStars}
                </Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Badge
                color={
                  m.totalAttacks === attacksPerMember
                    ? "green"
                    : m.totalAttacks > 0
                      ? "yellow"
                      : "red"
                }
                variant="light"
                size="sm"
              >
                {m.totalAttacks}/{attacksPerMember}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Stack gap={2}>
                <Progress
                  value={m.avgDestruction}
                  color={
                    m.avgDestruction >= 70
                      ? "green"
                      : m.avgDestruction >= 40
                        ? "yellow"
                        : "red"
                  }
                  size="sm"
                  radius="xl"
                />
                <Text size="xs" c="dimmed">
                  {m.avgDestruction}%
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              {m.bestOpponentAttack ? (
                <Group gap={4}>
                  <Text size="xs">
                    {"⭐".repeat(m.bestOpponentAttack.stars)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {m.bestOpponentAttack.destructionPercentage}%
                  </Text>
                </Group>
              ) : (
                <Badge color="green" variant="light" size="sm">
                  No atacado
                </Badge>
              )}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default function WarStatsCard({
  warLog,
  currentWar,
}: WarStatsCardProps) {
  const hasCurrentWarData =
    currentWar &&
    currentWar.state !== "notInWar" &&
    currentWar.clan.members.length > 0;

  return (
    <Stack gap="md">
      {warLog.length > 0 && (
        <Paper withBorder radius="md" p="md">
          <Group mb="md" gap="xs">
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconSword size={14} />
            </ThemeIcon>
            <Title order={5}>
              Resumen de guerras ({warLog.length} guerras)
            </Title>
          </Group>
          <WarSummaryTable warLog={warLog} />
        </Paper>
      )}

      {hasCurrentWarData && (
        <Paper withBorder radius="md" p="md">
          <Group mb="md" gap="xs">
            <ThemeIcon color="orange" variant="light" size="sm">
              <IconStar size={14} />
            </ThemeIcon>
            <Title order={5}>Rendimiento en guerra actual</Title>
          </Group>
          <CurrentWarStars
            members={currentWar.clan.members}
            attacksPerMember={currentWar.attacksPerMember}
          />
        </Paper>
      )}
    </Stack>
  );
}
