"use client";

import {
  Stack,
  Title,
  Text,
  Tabs,
  Paper,
  Group,
  ThemeIcon,
  Badge,
} from "@mantine/core";
import {
  IconTrophy,
  IconSword,
  IconStar,
  IconChartBar,
} from "@tabler/icons-react";
import { CWLGroup, CWLWar } from "@/types/clash";
import CWLGroupStandings from "./CWLGroupStandings";
import CWLRoundCard from "./CWLRoundCard";
import CWLPlayerStats from "./CWLPlayerStats";
import CWLStats from "./CWLStats";

interface CWLViewProps {
  group: CWLGroup | null;
  wars: CWLWar[];
  ourClanTag: string;
  notInCWL?: boolean;
  allWars: CWLWar[];
}

export default function CWLView({
  group,
  wars,
  ourClanTag,
  allWars,
  notInCWL,
}: CWLViewProps) {
  if (notInCWL || !group) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Group justify="center" gap="xs">
          <ThemeIcon color="gray" variant="light" size="lg">
            <IconSword size={20} />
          </ThemeIcon>
          <Text c="dimmed" fw={600}>
            No hay una Liga de Guerra de Clanes activa en este momento.
          </Text>
        </Group>
      </Paper>
    );
  }

  const finishedRounds = wars.filter((w) => w.state === "warEnded").length;
  const totalRounds = group.rounds.filter((r) => r.warTags[0] !== "#0").length;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Liga de Guerra de Clanes</Title>
        <Group gap="xs">
          <Badge color="blue" variant="light">
            Temporada {group.season}
          </Badge>
          <Badge color="gray" variant="light">
            Ronda {finishedRounds}/{totalRounds}
          </Badge>
        </Group>
      </Group>

      <Tabs defaultValue="standings">
        <Tabs.List>
          <Tabs.Tab value="standings" leftSection={<IconTrophy size={16} />}>
            Clasificación
          </Tabs.Tab>
          <Tabs.Tab value="rounds" leftSection={<IconSword size={16} />}>
            Rondas
          </Tabs.Tab>
          <Tabs.Tab value="players" leftSection={<IconStar size={16} />}>
            Jugadores
          </Tabs.Tab>
          <Tabs.Tab value="stats" leftSection={<IconChartBar size={16} />}>
            Estadísticas
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="stats" pt="md">
          <CWLStats wars={wars} ourClanTag={ourClanTag} />
        </Tabs.Panel>

        <Tabs.Panel value="standings" pt="md">
          <CWLGroupStandings
            clans={group.clans}
            wars={allWars}
            ourClanTag={ourClanTag}
          />
        </Tabs.Panel>

        <Tabs.Panel value="rounds" pt="md">
          <Stack gap="md">
            {wars.map((war, i) => (
              <CWLRoundCard
                key={i}
                war={war}
                roundNumber={i + 1}
                ourClanTag={ourClanTag}
              />
            ))}
            {wars.length === 0 && (
              <Text c="dimmed" ta="center">
                No hay rondas disponibles aún.
              </Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="players" pt="md">
          <CWLPlayerStats wars={wars} ourClanTag={ourClanTag} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
