"use client";

import {
  Paper,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  SimpleGrid,
  Progress,
  ThemeIcon,
  Divider,
  Table,
} from "@mantine/core";
import { IconClock, IconStar } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import WarMemberRow from "./WarMemberRow";
import { CurrentWar, WarMember, Attack } from "@/types/clash";

interface CurrentWarCardProps {
  war: CurrentWar | null;
}

function getWarStateBadge(state: string) {
  switch (state) {
    case "inWar":
      return (
        <Badge color="red" variant="filled" size="lg">
          ⚔️ En guerra
        </Badge>
      );
    case "preparation":
      return (
        <Badge color="yellow" variant="filled" size="lg">
          🛡️ Preparación
        </Badge>
      );
    case "warEnded":
      return (
        <Badge color="gray" variant="filled" size="lg">
          ✅ Finalizada
        </Badge>
      );
    default:
      return <Badge color="gray">Desconocido</Badge>;
  }
}

function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculate = () => {
      const end = new Date(
        endTime.replace(
          /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
          "$1-$2-$3T$4:$5:$6",
        ),
      );
      const diff = end.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Finalizado");

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}

function WarTeamStats({ team, label }: { team: WarMember[]; label: string }) {
  const totalStars = team.reduce(
    (sum, m) =>
      sum + (m.attacks || []).reduce((s, a: Attack) => s + a.stars, 0),
    0,
  );
  const totalDestruction = team.reduce(
    (sum, m) =>
      sum +
      (m.attacks || []).reduce(
        (s, a: Attack) => s + a.destructionPercentage,
        0,
      ),
    0,
  );
  const totalAttacks = team.reduce(
    (sum, m) => sum + (m.attacks?.length || 0),
    0,
  );
  const avgDestruction =
    totalAttacks > 0 ? Math.round(totalDestruction / totalAttacks) : 0;

  return (
    <Stack gap="xs">
      <Text fw={700} size="sm">
        {label}
      </Text>
      <Group gap="xs">
        <IconStar size={14} color="#FFD700" fill="#FFD700" />
        <Text size="sm">{totalStars} estrellas</Text>
      </Group>
      <Progress value={avgDestruction} color="yellow" size="sm" radius="xl" />
      <Text size="xs" c="dimmed">
        {avgDestruction}% destrucción promedio
      </Text>
    </Stack>
  );
}

export default function CurrentWarCard({ war }: CurrentWarCardProps) {
  const endTime =
    war?.state === "preparation" ? war.startTime : (war?.endTime ?? "");
  const countdown = useCountdown(endTime);

  if (!war || war.state === "notInWar") {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">
          El clan no está en guerra actualmente.
        </Text>
      </Paper>
    );
  }

  const { clan, opponent } = war;

  return (
    <Stack gap="md">
      <Paper p="xl" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Guerra actual</Title>
            {getWarStateBadge(war.state)}
          </Group>

          <Group gap="xs">
            <ThemeIcon variant="light" color="red" size="sm">
              <IconClock size={14} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              {war.state === "preparation" ? "Inicia en:" : "Termina en:"}
            </Text>
            <Text fw={700} c="red">
              {countdown}
            </Text>
          </Group>

          <Divider />

          <SimpleGrid cols={3}>
            <WarTeamStats team={clan.members} label={clan.name} />
            <Stack align="center" justify="center" gap={4}>
              <Text size="xl" fw={900}>
                VS
              </Text>
              <Text size="xs" c="dimmed">
                {war.teamSize}v{war.teamSize}
              </Text>
            </Stack>
            <WarTeamStats team={opponent.members} label={opponent.name} />
          </SimpleGrid>

          <SimpleGrid cols={2}>
            <Paper p="md" radius="md" bg="dark.6" withBorder>
              <Group justify="space-between">
                <Text fw={700}>{clan.name}</Text>
                <Group gap={4}>
                  <IconStar size={16} color="#FFD700" fill="#FFD700" />
                  <Text fw={900} size="lg">
                    {clan.stars}
                  </Text>
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                {clan.destructionPercentage?.toFixed(2)}% destrucción
              </Text>
            </Paper>

            <Paper p="md" radius="md" bg="dark.6" withBorder>
              <Group justify="space-between">
                <Text fw={700}>{opponent.name}</Text>
                <Group gap={4}>
                  <IconStar size={16} color="#FFD700" fill="#FFD700" />
                  <Text fw={900} size="lg">
                    {opponent.stars}
                  </Text>
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                {opponent.destructionPercentage?.toFixed(2)}% destrucción
              </Text>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Paper>

      <Paper withBorder radius="md">
        <Table
          striped
          highlightOnHover
          verticalSpacing="sm"
          horizontalSpacing="md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Jugador</Table.Th>
              <Table.Th>TH</Table.Th>
              <Table.Th>Ataques</Table.Th>
              <Table.Th>Detalle</Table.Th>
              <Table.Th>Estrellas</Table.Th>
              <Table.Th>Destrucción</Table.Th>
              <Table.Th>Mejor defensa rival</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[...clan.members]
              .sort((a, b) => a.mapPosition - b.mapPosition)
              .map((member) => (
                <WarMemberRow
                  key={member.tag}
                  member={member}
                  maxAttacks={war.attacksPerMember || 2}
                />
              ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
