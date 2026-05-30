"use client";

import {
  Stack,
  Text,
  Paper,
  Group,
  Progress,
  Badge,
  SimpleGrid,
} from "@mantine/core";
import { PlayerAchievement } from "@/types/clash";

interface PlayerAchievementsProps {
  achievements: PlayerAchievement[];
}

const RELEVANT_ACHIEVEMENTS = [
  "War Hero",
  "War League Legend",
  "Friend in Need",
  "Sharing is caring",
  "Games Champion",
  "Well Seasoned",
  "Conqueror",
  "Unbreakable",
  "Sweet Victory!",
  "Gold Grab",
  "Elixir Escapade",
  "Heroic Heist",
  "Most Valuable Clanmate",
  "Aggressive Capitalism",
  "Siege Sharer",
];

function AchievementCard({ achievement }: { achievement: PlayerAchievement }) {
  const progress = Math.min(
    Math.round((achievement.value / achievement.target) * 100),
    100,
  );
  const isComplete = achievement.stars === 3;

  return (
    <Paper p="sm" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" fw={600}>
            {achievement.name}
          </Text>
          <Group gap={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} size="xs">
                {i < achievement.stars ? "⭐" : "☆"}
              </Text>
            ))}
          </Group>
        </Group>
        <Text size="xs" c="dimmed">
          {achievement.info}
        </Text>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {achievement.value.toLocaleString()} /{" "}
            {achievement.target.toLocaleString()}
          </Text>
          {isComplete && (
            <Badge size="xs" color="yellow" variant="filled">
              Completado
            </Badge>
          )}
        </Group>
        <Progress
          value={progress}
          color={
            isComplete
              ? "yellow"
              : progress >= 66
                ? "green"
                : progress >= 33
                  ? "blue"
                  : "gray"
          }
          size="sm"
          radius="xl"
        />
      </Stack>
    </Paper>
  );
}

export default function PlayerAchievements({
  achievements,
}: PlayerAchievementsProps) {
  const relevant = achievements.filter(
    (a) => RELEVANT_ACHIEVEMENTS.includes(a.name) && a.village === "home",
  );

  if (!relevant.length) return null;

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm">
        Logros relevantes
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {relevant.map((a) => (
          <AchievementCard key={a.name} achievement={a} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
