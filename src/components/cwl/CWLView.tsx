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
  Select,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconTrophy,
  IconSword,
  IconStar,
  IconChartBar,
  IconShield,
} from "@tabler/icons-react";
import { CWLGroup, CWLWar } from "@/types/clash";
import CWLGroupStandings from "./CWLGroupStandings";
import CWLRoundCard from "./CWLRoundCard";
import CWLPlayerStats from "./CWLPlayerStats";
import CWLStats from "./CWLStats";
import { useState } from "react";

interface CWLViewProps {
  group: CWLGroup | null;
  wars: CWLWar[];
  allWars: CWLWar[];
  ourClanTag: string;
  notInCWL?: boolean;
}

const cwlTabOptions = [
  { value: "standings", label: "🏆 Clasificación" },
  { value: "rounds", label: "⚔️ Rondas" },
  { value: "players", label: "⭐ Jugadores" },
  { value: "stats", label: "📊 Estadísticas" },
];

export default function CWLView({
  group,
  wars,
  allWars,
  ourClanTag,
  notInCWL,
}: CWLViewProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [cwlTab, setCwlTab] = useState<string | null>("standings");

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
      <Group justify="space-between" wrap="wrap">
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

      <Tabs value={cwlTab} onChange={setCwlTab}>
        {isMobile ? (
          <Select
            data={cwlTabOptions}
            value={cwlTab}
            onChange={setCwlTab}
            mb="md"
            size="md"
            label="Vista CWL"
            leftSection={<IconShield size={16} />}
            styles={{
              input: {
                fontWeight: 600,
              },
            }}
          />
        ) : (
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
        )}

        <Tabs.Panel value="standings" pt="md">
          <CWLGroupStandings
            clans={group.clans}
            wars={allWars}
            ourClanTag={ourClanTag}
          />
        </Tabs.Panel>
        <Tabs.Panel value="rounds" pt="md">
          {wars.length > 0 ? (
            <CWLRoundCard wars={wars} ourClanTag={ourClanTag} />
          ) : (
            <Text c="dimmed" ta="center">
              No hay rondas disponibles aún.
            </Text>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="players" pt="md">
          <CWLPlayerStats wars={wars} ourClanTag={ourClanTag} />
        </Tabs.Panel>
        <Tabs.Panel value="stats" pt="md">
          <CWLStats wars={wars} ourClanTag={ourClanTag} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
