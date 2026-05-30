"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Badge,
  Avatar,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Divider,
  Loader,
  Center,
  Tabs,
  ScrollArea,
} from "@mantine/core";
import { IconSword, IconStar, IconUser, IconMedal } from "@tabler/icons-react";
import { PlayerDetail } from "@/types/clash";
import PlayerHeroes from "./PlayerHeroes";
import PlayerAchievements from "./PlayerAchievements";

interface PlayerProfileModalProps {
  tag: string | null;
  opened: boolean;
  onClose: () => void;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Paper p="sm" radius="md" withBorder>
      <Stack gap={0} align="center">
        <Text size="lg" fw={900} c={color}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {label}
        </Text>
      </Stack>
    </Paper>
  );
}

function getRoleLabel(role: string) {
  switch (role) {
    case "leader":
      return { label: "Líder", color: "yellow" };
    case "coLeader":
      return { label: "Co-Líder", color: "orange" };
    case "admin":
      return { label: "Anciano", color: "blue" };
    default:
      return { label: "Miembro", color: "gray" };
  }
}

function getWarPreference(pref: string) {
  return pref === "in" ? (
    <Badge color="green" variant="light">
      Participa en guerra
    </Badge>
  ) : (
    <Badge color="red" variant="light">
      No participa en guerra
    </Badge>
  );
}

export default function PlayerProfileModal({
  tag,
  opened,
  onClose,
}: PlayerProfileModalProps) {
  const [player, setPlayer] = useState<PlayerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tag || !opened) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    setPlayer(null);

    fetch(`/api/player?tag=${encodeURIComponent(tag)}`)
      .then((res) => res.json())
      .then((data: PlayerDetail & { error?: string }) => {
        if (data.error) throw new Error(data.error);
        setPlayer(data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tag, opened]);

  const role = player ? getRoleLabel(player.role) : null;

  const clanGamesAchievement = player?.achievements.find(
    (a) => a.name === "Games Champion",
  );
  const warLeagueAchievement = player?.achievements.find(
    (a) => a.name === "War League Legend",
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon color="yellow" variant="light">
            <IconUser size={16} />
          </ThemeIcon>
          <Text fw={700}>Perfil del jugador</Text>
        </Group>
      }
      size="xl"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {loading && (
        <Center py="xl">
          <Loader color="yellow" />
        </Center>
      )}

      {error && (
        <Text c="red" ta="center">
          {error}
        </Text>
      )}

      {player && (
        <Stack gap="md">
          {/* Header */}
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
              <Group gap="md">
                <Avatar color="yellow" size={60} radius="md">
                  {player.name.charAt(0)}
                </Avatar>
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text fw={900} size="lg">
                      {player.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {player.tag}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    {role && (
                      <Badge color={role.color} variant="filled">
                        {role.label}
                      </Badge>
                    )}
                    <Badge color="cyan" variant="light">
                      TH {player.townHallLevel}
                    </Badge>
                    <Badge color="gray" variant="light">
                      Nivel {player.expLevel}
                    </Badge>
                  </Group>
                  <Group gap="xs">
                    {getWarPreference(player.warPreference)}
                  </Group>
                </Stack>
              </Group>
              {player.league && (
                <Stack align="center" gap={2}>
                  <Avatar
                    src={player.league.iconUrls?.medium}
                    size={40}
                    radius="md"
                  />
                  <Text size="xs" c="dimmed" ta="center">
                    {player.league.name}
                  </Text>
                </Stack>
              )}
            </Group>
          </Paper>

          {/* Main stats */}
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            <StatCard label="Trofeos" value={player.trophies} color="yellow" />
            <StatCard
              label="Mejor trofeos"
              value={player.bestTrophies}
              color="orange"
            />
            <StatCard
              label="Estrellas de guerra"
              value={player.warStars}
              color="blue"
            />
            <StatCard
              label="Capital contribuido"
              value={player.clanCapitalContributions}
              color="green"
            />
          </SimpleGrid>

          <Divider />

          <Tabs defaultValue="general">
            <Tabs.List>
              <Tabs.Tab value="general" leftSection={<IconUser size={14} />}>
                General
              </Tabs.Tab>
              <Tabs.Tab value="heroes" leftSection={<IconMedal size={14} />}>
                Héroes
              </Tabs.Tab>
              <Tabs.Tab
                value="achievements"
                leftSection={<IconStar size={14} />}
              >
                Logros
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general" pt="md">
              <Stack gap="md">
                <SimpleGrid cols={{ base: 2, sm: 4 }}>
                  <StatCard
                    label="Ataques ganados"
                    value={player.attackWins}
                    color="green"
                  />
                  <StatCard
                    label="Defensas ganadas"
                    value={player.defenseWins}
                    color="red"
                  />
                  <StatCard
                    label="Donaciones"
                    value={player.donations}
                    color="teal"
                  />
                  <StatCard
                    label="Recibidas"
                    value={player.donationsReceived}
                    color="grape"
                  />
                </SimpleGrid>

                {(clanGamesAchievement || warLeagueAchievement) && (
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    {clanGamesAchievement && (
                      <Paper p="md" radius="md" withBorder>
                        <Group gap="xs">
                          <ThemeIcon color="violet" variant="light" size="sm">
                            <IconStar size={12} />
                          </ThemeIcon>
                          <Stack gap={0}>
                            <Text size="xs" c="dimmed">
                              Juegos de clan
                            </Text>
                            <Text fw={700}>
                              {clanGamesAchievement.value.toLocaleString()} pts
                            </Text>
                          </Stack>
                        </Group>
                      </Paper>
                    )}
                    {warLeagueAchievement && (
                      <Paper p="md" radius="md" withBorder>
                        <Group gap="xs">
                          <ThemeIcon color="blue" variant="light" size="sm">
                            <IconSword size={12} />
                          </ThemeIcon>
                          <Stack gap={0}>
                            <Text size="xs" c="dimmed">
                              Estrellas CWL
                            </Text>
                            <Text fw={700}>
                              {warLeagueAchievement.value.toLocaleString()} ⭐
                            </Text>
                          </Stack>
                        </Group>
                      </Paper>
                    )}
                  </SimpleGrid>
                )}

                {/* Troops summary */}
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="xs">
                    <Text fw={600} size="sm">
                      Tropas del hogar
                    </Text>
                    <Group gap="xs">
                      {player.troops
                        .filter(
                          (t) =>
                            t.village === "home" && !t.name.startsWith("Super"),
                        )
                        .slice(0, 12)
                        .map((t) => (
                          <Badge
                            key={t.name}
                            variant="light"
                            color={t.level === t.maxLevel ? "yellow" : "gray"}
                            size="sm"
                          >
                            {t.name} {t.level}
                          </Badge>
                        ))}
                    </Group>
                  </Stack>
                </Paper>

                {/* Spells */}
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="xs">
                    <Text fw={600} size="sm">
                      Hechizos
                    </Text>
                    <Group gap="xs">
                      {player.spells
                        .filter((s) => s.village === "home")
                        .map((s) => (
                          <Badge
                            key={s.name}
                            variant="light"
                            color={s.level === s.maxLevel ? "yellow" : "gray"}
                            size="sm"
                          >
                            {s.name} {s.level}
                          </Badge>
                        ))}
                    </Group>
                  </Stack>
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="heroes" pt="md">
              <PlayerHeroes heroes={player.heroes} />
            </Tabs.Panel>

            <Tabs.Panel value="achievements" pt="md">
              <PlayerAchievements achievements={player.achievements} />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </Modal>
  );
}
