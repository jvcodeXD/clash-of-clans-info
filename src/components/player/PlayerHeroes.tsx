"use client";

import {
  SimpleGrid,
  Paper,
  Stack,
  Text,
  Progress,
  Badge,
  Group,
} from "@mantine/core";
import { PlayerHero } from "@/types/clash";

interface PlayerHeroesProps {
  heroes: PlayerHero[];
}

function HeroCard({ hero }: { hero: PlayerHero }) {
  const progress = Math.round((hero.level / hero.maxLevel) * 100);
  const isMax = hero.level === hero.maxLevel;

  const heroColors: Record<string, string> = {
    "Barbarian King": "red",
    "Archer Queen": "pink",
    "Grand Warden": "blue",
    "Royal Champion": "violet",
    "Minion Prince": "dark",
    "Battle Machine": "orange",
  };

  const color = heroColors[hero.name] || "gray";

  return (
    <Paper p="sm" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" fw={700}>
            {hero.name}
          </Text>
          {isMax && (
            <Badge color="yellow" size="xs" variant="filled">
              MAX
            </Badge>
          )}
        </Group>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Nivel
          </Text>
          <Text size="sm" fw={600} c={color}>
            {hero.level}/{hero.maxLevel}
          </Text>
        </Group>
        <Progress
          value={progress}
          color={isMax ? "yellow" : color}
          size="sm"
          radius="xl"
        />
        {hero.equipment && hero.equipment.length > 0 && (
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Equipamiento:
            </Text>
            <Group gap={4}>
              {hero.equipment.map((eq) => (
                <Badge key={eq.name} size="xs" variant="light" color="gray">
                  {eq.name} {eq.level}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default function PlayerHeroes({ heroes }: PlayerHeroesProps) {
  const homeHeroes = heroes.filter((h) => h.village === "home");

  if (!homeHeroes.length) return null;

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm">
        Héroes
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {homeHeroes.map((hero) => (
          <HeroCard key={hero.name} hero={hero} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
