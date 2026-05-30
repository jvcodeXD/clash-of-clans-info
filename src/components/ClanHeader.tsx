"use client";

import { Clan } from "@/types/clash";
import {
  Paper,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Avatar,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import {
  IconSword,
  IconUsers,
  IconTrophy,
  IconFlame,
} from "@tabler/icons-react";

interface ClanHeaderProps {
  clan: Clan;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group>
        <ThemeIcon size="lg" variant="light" color="yellow">
          {icon}
        </ThemeIcon>
        <Stack gap={0}>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          <Text fw={700} size="lg">
            {value}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}

export default function ClanHeader({ clan }: ClanHeaderProps) {
  if (!clan) return null;

  return (
    <Stack gap="md">
      <Paper p="xl" radius="md" withBorder>
        <Group>
          <Avatar src={clan.badgeUrls?.medium} size={80} radius="md" />
          <Stack gap={4}>
            <Group gap="sm">
              <Title order={2}>{clan.name}</Title>
              <Badge color="yellow" variant="filled">
                {clan.tag}
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              {clan.description || "Sin descripción"}
            </Text>
            <Group gap="xs">
              <Badge color="blue" variant="light">
                Nivel {clan.clanLevel}
              </Badge>
              <Badge color="green" variant="light">
                {clan.type === "open"
                  ? "Abierto"
                  : clan.type === "inviteOnly"
                    ? "Solo invitación"
                    : "Cerrado"}
              </Badge>
            </Group>
          </Stack>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        <StatCard
          icon={<IconUsers size={18} />}
          label="Miembros"
          value={`${clan.members}/50`}
        />
        <StatCard
          icon={<IconTrophy size={18} />}
          label="Puntos del clan"
          value={clan.clanPoints?.toLocaleString()}
        />
        <StatCard
          icon={<IconSword size={18} />}
          label="Liga de guerra"
          value={clan.warLeague?.name || "Sin liga"}
        />
        <StatCard
          icon={<IconFlame size={18} />}
          label="Racha de guerras"
          value={clan.warWinStreak || 0}
        />
      </SimpleGrid>
    </Stack>
  );
}
