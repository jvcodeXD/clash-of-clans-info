"use client";

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
import { useMediaQuery } from "@mantine/hooks";
import { Clan } from "@/types/clash";

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
    <Paper p="sm" radius="md" withBorder>
      <Group gap="sm">
        <ThemeIcon size="md" variant="light" color="yellow">
          {icon}
        </ThemeIcon>
        <Stack gap={0}>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          <Text fw={700} size="sm">
            {value}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}

export default function ClanHeader({ clan }: ClanHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (!clan) return null;

  return (
    <Stack gap="sm">
      <Paper p="md" radius="md" withBorder>
        <Group wrap="nowrap" align="flex-start">
          <Avatar
            src={clan.badgeUrls?.medium}
            size={isMobile ? 50 : 80}
            radius="md"
            style={{ flexShrink: 0 }}
          />
          <Stack gap={4} style={{ minWidth: 0 }}>
            <Group gap="xs" wrap="wrap">
              <Title order={isMobile ? 3 : 2} lineClamp={1}>
                {clan.name}
              </Title>
              <Badge color="yellow" variant="filled" size="sm">
                {clan.tag}
              </Badge>
            </Group>
            {!isMobile && (
              <Text c="dimmed" size="sm" lineClamp={2}>
                {clan.description || "Sin descripción"}
              </Text>
            )}
            <Group gap="xs" wrap="wrap">
              <Badge color="blue" variant="light" size="sm">
                Nivel {clan.clanLevel}
              </Badge>
              <Badge color="green" variant="light" size="sm">
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
          icon={<IconUsers size={16} />}
          label="Miembros"
          value={`${clan.members}/50`}
        />
        <StatCard
          icon={<IconTrophy size={16} />}
          label="Puntos"
          value={clan.clanPoints?.toLocaleString()}
        />
        <StatCard
          icon={<IconSword size={16} />}
          label="Liga"
          value={clan.warLeague?.name || "Sin liga"}
        />
        <StatCard
          icon={<IconFlame size={16} />}
          label="Racha"
          value={clan.warWinStreak || 0}
        />
      </SimpleGrid>
    </Stack>
  );
}
