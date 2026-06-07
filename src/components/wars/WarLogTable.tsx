"use client";

import { useState } from "react";
import {
  Paper,
  Table,
  Badge,
  Group,
  Text,
  Stack,
  Title,
  ThemeIcon,
  Progress,
  Avatar,
  Modal,
  SimpleGrid,
  Divider,
  Card,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconTrophy,
  IconX,
  IconMinus,
  IconSword,
  IconStar,
  IconShield,
} from "@tabler/icons-react";
import { WarLogEntry } from "@/types/clash";
import AttackStars from "./AttackStars";

interface WarLogTableProps {
  warLog: WarLogEntry[];
}

function getResultBadge(result: string) {
  switch (result) {
    case "win":
      return (
        <Badge color="green" leftSection={<IconTrophy size={12} />}>
          Victoria
        </Badge>
      );
    case "lose":
      return (
        <Badge color="red" leftSection={<IconX size={12} />}>
          Derrota
        </Badge>
      );
    default:
      return (
        <Badge color="gray" leftSection={<IconMinus size={12} />}>
          Empate
        </Badge>
      );
  }
}

function formatDate(endTime: string) {
  const date = new Date(
    endTime.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
      "$1-$2-$3T$4:$5:$6",
    ),
  );
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface WarDetailModalProps {
  entry: WarLogEntry | null;
  opened: boolean;
  onClose: () => void;
}

function WarDetailModal({ entry, opened, onClose }: WarDetailModalProps) {
  if (!entry) return null;

  const starDiff = entry.clan.stars - entry.opponent.stars;
  const destructionDiff = (
    entry.clan.destructionPercentage - entry.opponent.destructionPercentage
  ).toFixed(1);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text fw={700}>Detalle de guerra</Text>
          {getResultBadge(entry.result)}
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        <Text size="xs" c="dimmed">
          {formatDate(entry.endTime)} · {entry.teamSize}v{entry.teamSize}
        </Text>

        <SimpleGrid cols={3}>
          <Stack align="center" gap="xs">
            <Avatar src={entry.clan.badgeUrls?.medium} size={60} radius="md" />
            <Text fw={700} size="sm" ta="center">
              {entry.clan.name}
            </Text>
            <Badge color="blue" variant="light">
              Nivel {entry.clan.clanLevel}
            </Badge>
          </Stack>

          <Stack align="center" justify="center" gap={4}>
            <Text size="xl" fw={900}>
              VS
            </Text>
            <Badge
              color={starDiff > 0 ? "green" : starDiff < 0 ? "red" : "gray"}
              variant="filled"
            >
              {starDiff > 0 ? `+${starDiff}` : starDiff} ⭐
            </Badge>
          </Stack>

          <Stack align="center" gap="xs">
            <Avatar
              src={entry.opponent.badgeUrls?.medium}
              size={60}
              radius="md"
            />
            <Text fw={700} size="sm" ta="center">
              {entry.opponent.name}
            </Text>
            <Badge color="gray" variant="light">
              Nivel {entry.opponent.clanLevel}
            </Badge>
          </Stack>
        </SimpleGrid>

        <Divider />

        <SimpleGrid cols={2}>
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon color="yellow" variant="light" size="sm">
                  <IconStar size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600}>
                  Estrellas
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={900} size="xl" c="yellow">
                  {entry.clan.stars}
                </Text>
                <Text fw={900} size="xl" c="dimmed">
                  {entry.opponent.stars}
                </Text>
              </Group>
              <Progress.Root size="md" radius="xl">
                <Progress.Section
                  value={
                    (entry.clan.stars /
                      (entry.clan.stars + entry.opponent.stars)) *
                    100
                  }
                  color="yellow"
                />
                <Progress.Section
                  value={
                    (entry.opponent.stars /
                      (entry.clan.stars + entry.opponent.stars)) *
                    100
                  }
                  color="dark"
                />
              </Progress.Root>
            </Stack>
          </Paper>

          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon color="orange" variant="light" size="sm">
                  <IconSword size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600}>
                  Destrucción
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={900} size="xl" c="orange">
                  {entry.clan.destructionPercentage.toFixed(1)}%
                </Text>
                <Text fw={900} size="xl" c="dimmed">
                  {entry.opponent.destructionPercentage.toFixed(1)}%
                </Text>
              </Group>
              <Progress.Root size="md" radius="xl">
                <Progress.Section
                  value={entry.clan.destructionPercentage}
                  color="orange"
                />
                <Progress.Section
                  value={Math.max(
                    0,
                    entry.opponent.destructionPercentage -
                      entry.clan.destructionPercentage,
                  )}
                  color="dark"
                />
              </Progress.Root>
              <Text
                size="xs"
                c={parseFloat(destructionDiff) >= 0 ? "green" : "red"}
              >
                {parseFloat(destructionDiff) >= 0 ? "+" : ""}
                {destructionDiff}% diferencia
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        <SimpleGrid cols={2}>
          <Paper p="sm" radius="md" withBorder>
            <Group gap="xs">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconSword size={12} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Ataques usados
                </Text>
                <Text fw={700}>
                  {entry.clan.attacks} /{" "}
                  {entry.teamSize * entry.attacksPerMember}
                </Text>
              </Stack>
            </Group>
          </Paper>

          {entry.clan.expEarned !== undefined && (
            <Paper p="sm" radius="md" withBorder>
              <Group gap="xs">
                <ThemeIcon color="violet" variant="light" size="sm">
                  <IconShield size={12} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    Experiencia ganada
                  </Text>
                  <Text fw={700}>{entry.clan.expEarned} XP</Text>
                </Stack>
              </Group>
            </Paper>
          )}
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}

export default function WarLogTable({ warLog }: WarLogTableProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedWar, setSelectedWar] = useState<WarLogEntry | null>(null);
  const [showAll, setShowAll] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!warLog?.length) {
    return <Text c="dimmed">No hay historial de guerras disponible.</Text>;
  }

  const wins = warLog.filter((w) => w.result === "win").length;
  const losses = warLog.filter((w) => w.result === "lose").length;
  const draws = warLog.filter((w) => w.result === "tie").length;
  const winRate = Math.round((wins / warLog.length) * 100);
  const displayed = showAll ? warLog : warLog.slice(0, 10);

  function handleClick(entry: WarLogEntry) {
    setSelectedWar(entry);
    open();
  }

  return (
    <Stack gap="md">
      <Title order={3}>Historial de guerras</Title>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="xs">
          <Group justify="space-between">
            <Group gap="lg">
              <Group gap="xs">
                <ThemeIcon color="green" variant="light" size="sm">
                  <IconTrophy size={12} />
                </ThemeIcon>
                <Text size="sm">{wins} victorias</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon color="red" variant="light" size="sm">
                  <IconX size={12} />
                </ThemeIcon>
                <Text size="sm">{losses} derrotas</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon color="gray" variant="light" size="sm">
                  <IconMinus size={12} />
                </ThemeIcon>
                <Text size="sm">{draws} empates</Text>
              </Group>
            </Group>
            <Text fw={700} c={winRate >= 50 ? "green" : "red"}>
              {winRate}% win rate
            </Text>
          </Group>
          <Progress
            value={winRate}
            color={winRate >= 60 ? "green" : winRate >= 40 ? "yellow" : "red"}
            size="md"
            radius="xl"
          />
        </Stack>
      </Paper>

      {isMobile ? (
        <Stack gap="sm">
          {displayed.map((entry, index) => (
            <Card
              key={index}
              withBorder
              radius="md"
              p="sm"
              onClick={() => handleClick(entry)}
              style={{ cursor: "pointer" }}
            >
              <Group justify="space-between" mb={6}>
                <Group gap="xs">
                  <Avatar
                    src={entry.opponent.badgeUrls?.medium}
                    size={32}
                    radius="sm"
                  />
                  <Stack gap={0}>
                    <Text size="sm" fw={600}>
                      {entry.opponent.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Nv {entry.opponent.clanLevel} · {entry.teamSize}v
                      {entry.teamSize}
                    </Text>
                  </Stack>
                </Group>
                {getResultBadge(entry.result)}
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {formatDate(entry.endTime)}
                </Text>
                <Group gap="xs">
                  <Text size="sm" fw={700} c="yellow">
                    ⭐ {entry.clan.stars}
                  </Text>
                  <Text size="xs" c="dimmed">
                    vs
                  </Text>
                  <Text size="sm" fw={700} c="dimmed">
                    ⭐ {entry.opponent.stars}
                  </Text>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Paper withBorder radius="md">
          <Table
            striped
            highlightOnHover
            verticalSpacing="sm"
            horizontalSpacing="md"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Rival</Table.Th>
                <Table.Th>Tamaño</Table.Th>
                <Table.Th>Resultado</Table.Th>
                <Table.Th>Nuestras ⭐</Table.Th>
                <Table.Th>Sus ⭐</Table.Th>
                <Table.Th>Nuestra dest.</Table.Th>
                <Table.Th>Su dest.</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayed.map((entry, index) => (
                <Table.Tr
                  key={index}
                  onClick={() => handleClick(entry)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {formatDate(entry.endTime)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        src={entry.opponent.badgeUrls?.medium}
                        size={28}
                        radius="sm"
                      />
                      <Stack gap={0}>
                        <Text size="sm" fw={600}>
                          {entry.opponent.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Nivel {entry.opponent.clanLevel}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue">
                      {entry.teamSize}v{entry.teamSize}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{getResultBadge(entry.result)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <AttackStars
                        stars={Math.min(entry.clan.stars, 3)}
                        max={3}
                      />
                      <Text size="sm" fw={600}>
                        {entry.clan.stars}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <AttackStars
                        stars={Math.min(entry.opponent.stars, 3)}
                        max={3}
                      />
                      <Text size="sm" fw={600}>
                        {entry.opponent.stars}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={2}>
                      <Progress
                        value={entry.clan.destructionPercentage}
                        color="green"
                        size="sm"
                        radius="xl"
                      />
                      <Text size="xs" c="dimmed">
                        {entry.clan.destructionPercentage?.toFixed(1)}%
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={2}>
                      <Progress
                        value={entry.opponent.destructionPercentage}
                        color="red"
                        size="sm"
                        radius="xl"
                      />
                      <Text size="xs" c="dimmed">
                        {entry.opponent.destructionPercentage?.toFixed(1)}%
                      </Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      {warLog.length > 10 && (
        <Group justify="center">
          <Badge
            style={{ cursor: "pointer" }}
            color="gray"
            variant="light"
            size="lg"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Ver menos" : `Ver ${warLog.length - 10} guerras más`}
          </Badge>
        </Group>
      )}

      <WarDetailModal entry={selectedWar} opened={opened} onClose={close} />
    </Stack>
  );
}
