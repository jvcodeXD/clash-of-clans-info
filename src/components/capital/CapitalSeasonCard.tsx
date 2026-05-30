"use client";

import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Progress,
  ThemeIcon,
  SimpleGrid,
  Avatar,
} from "@mantine/core";
import {
  IconSword,
  IconShield,
  IconStar,
  IconChevronRight,
} from "@tabler/icons-react";
import { CapitalRaidSeason } from "@/types/clash";

interface CapitalSeasonCardProps {
  season: CapitalRaidSeason;
  onClick: () => void;
}

function formatDate(time: string) {
  return new Date(
    time.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
      "$1-$2-$3T$4:$5:$6",
    ),
  ).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CapitalSeasonCard({
  season,
  onClick,
}: CapitalSeasonCardProps) {
  const totalDistricts = season.attackLog.reduce(
    (s, e) => s + e.districtCount,
    0,
  );
  const destroyedDistricts = season.enemyDistrictsDestroyed;
  const destructionRate =
    totalDistricts > 0
      ? Math.round((destroyedDistricts / totalDistricts) * 100)
      : 0;

  const topLooter = season.members
    ? [...season.members].sort(
        (a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted,
      )[0]
    : null;

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between">
          <Group gap="xs">
            <Badge
              color={season.state === "ongoing" ? "green" : "gray"}
              variant="filled"
              size="sm"
            >
              {season.state === "ongoing" ? "En curso" : "Finalizada"}
            </Badge>
            <Text size="xs" c="dimmed">
              {formatDate(season.startTime)} → {formatDate(season.endTime)}
            </Text>
          </Group>
          <IconChevronRight size={16} color="gray" />
        </Group>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          <Stack gap={0}>
            <Text size="lg" fw={900} c="yellow">
              {season.capitalTotalLoot.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              Oro saqueado
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text size="lg" fw={900} c="blue">
              {season.totalAttacks}
            </Text>
            <Text size="xs" c="dimmed">
              Ataques
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text size="lg" fw={900} c="green">
              {season.raidsCompleted}
            </Text>
            <Text size="xs" c="dimmed">
              Raids completas
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text size="lg" fw={900} c="orange">
              {destroyedDistricts}
            </Text>
            <Text size="xs" c="dimmed">
              Distritos destruidos
            </Text>
          </Stack>
        </SimpleGrid>

        {/* Destruction progress */}
        {totalDistricts > 0 && (
          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Destrucción de distritos
              </Text>
              <Text size="xs" fw={600}>
                {destructionRate}%
              </Text>
            </Group>
            <Progress
              value={destructionRate}
              color={
                destructionRate === 100
                  ? "green"
                  : destructionRate > 50
                    ? "yellow"
                    : "red"
              }
              size="sm"
              radius="xl"
            />
          </Stack>
        )}

        {/* Attack vs Defense summary */}
        <Group gap="lg">
          {season.attackLog.length > 0 && (
            <Group gap="xs">
              <ThemeIcon color="green" variant="light" size="sm">
                <IconSword size={12} />
              </ThemeIcon>
              <Text size="xs">{season.attackLog.length} clanes atacados</Text>
            </Group>
          )}
          {season.defenseLog.length > 0 && (
            <Group gap="xs">
              <ThemeIcon color="red" variant="light" size="sm">
                <IconShield size={12} />
              </ThemeIcon>
              <Text size="xs">
                {season.defenseLog.length} defensas recibidas
              </Text>
            </Group>
          )}
        </Group>

        {/* Top looter */}
        {topLooter && (
          <Group gap="xs">
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconStar size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              Top saqueador:
            </Text>
            <Avatar color="yellow" radius="xl" size="xs">
              {topLooter.name.charAt(0)}
            </Avatar>
            <Text size="xs" fw={600}>
              {topLooter.name}
            </Text>
            <Text size="xs" c="yellow">
              {topLooter.capitalResourcesLooted.toLocaleString()} oro
            </Text>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
