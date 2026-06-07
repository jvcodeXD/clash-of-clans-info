"use client";

import {
  Modal,
  Stack,
  Text,
  Group,
  Badge,
  Avatar,
  Paper,
  SimpleGrid,
  Progress,
  ThemeIcon,
  Divider,
  ScrollArea,
  Accordion,
} from "@mantine/core";
import { IconSword, IconShield, IconStar } from "@tabler/icons-react";
import {
  CapitalRaidSeason,
  CapitalRaidLogEntry,
  CapitalRaidDistrict,
} from "@/types/clash";

interface CapitalRaidDetailProps {
  season: CapitalRaidSeason | null;
  opened: boolean;
  onClose: () => void;
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

function DistrictRow({ district }: { district: CapitalRaidDistrict }) {
  return (
    <Paper p="sm" radius="md" withBorder>
      <Group justify="space-between" mb={4}>
        <Group gap="xs">
          <Text size="sm" fw={600}>
            {district.name}
          </Text>
          <Badge size="xs" variant="light" color="gray">
            Nivel {district.districtHallLevel}
          </Badge>
        </Group>
        <Group gap="xs">
          <Text size="xs">{"⭐".repeat(district.stars)}</Text>
          <Badge
            size="xs"
            color={
              district.destructionPercent === 100
                ? "green"
                : district.destructionPercent > 0
                  ? "yellow"
                  : "red"
            }
            variant="light"
          >
            {district.destructionPercent}%
          </Badge>
        </Group>
      </Group>
      <Progress
        value={district.destructionPercent}
        color={
          district.destructionPercent === 100
            ? "green"
            : district.destructionPercent > 0
              ? "yellow"
              : "gray"
        }
        size="sm"
        radius="xl"
        mb={4}
      />
      <Text size="xs" c="dimmed">
        {district.attackCount} ataques · {district.totalLooted.toLocaleString()}{" "}
        oro saqueado
      </Text>
    </Paper>
  );
}

function RaidLogAccordion({
  entries,
  type,
}: {
  entries: CapitalRaidLogEntry[];
  type: "attack" | "defense";
}) {
  const isAttack = type === "attack";

  return (
    <Accordion variant="separated" radius="md">
      {entries.map((entry, i) => {
        const clan = isAttack ? entry.defender : entry.attacker;
        const totalLooted = entry.districts.reduce(
          (s, d) => s + d.totalLooted,
          0,
        );

        return (
          <Accordion.Item key={i} value={`${type}-${i}`}>
            <Accordion.Control>
              <Stack gap={4}>
                <Group gap="sm" wrap="nowrap">
                  <Avatar src={clan?.badgeUrls?.medium} size={32} radius="sm" />
                  <Stack gap={0}>
                    <Text size="sm" fw={700}>
                      {clan?.name ?? "Desconocido"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Nivel {clan?.level}
                    </Text>
                  </Stack>
                </Group>
                <Group gap="xs" wrap="wrap">
                  <Badge
                    color={
                      entry.districtsDestroyed === entry.districtCount
                        ? "green"
                        : entry.districtsDestroyed > 0
                          ? "yellow"
                          : "red"
                    }
                    variant="light"
                    size="sm"
                  >
                    {entry.districtsDestroyed}/{entry.districtCount} distritos
                  </Badge>
                  {isAttack && (
                    <Badge color="yellow" variant="light" size="sm">
                      {totalLooted.toLocaleString()} oro
                    </Badge>
                  )}
                  <Text size="xs" c="dimmed">
                    {entry.attackCount} ataques
                  </Text>
                </Group>
              </Stack>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {entry.districts.map((d) => (
                  <DistrictRow key={d.id} district={d} />
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default function CapitalRaidDetail({
  season,
  opened,
  onClose,
}: CapitalRaidDetailProps) {
  if (!season) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text fw={700}>Detalle de Raid Capital</Text>
          <Badge
            color={season.state === "ongoing" ? "green" : "gray"}
            variant="filled"
          >
            {season.state === "ongoing" ? "En curso" : "Finalizada"}
          </Badge>
        </Group>
      }
      size="xl"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md">
        <Text size="xs" c="dimmed">
          {formatDate(season.startTime)} → {formatDate(season.endTime)}
        </Text>

        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          <Paper p="sm" radius="md" withBorder>
            <Stack gap={0} align="center">
              <Text size="xl" fw={900} c="yellow">
                {season.capitalTotalLoot.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                Oro saqueado
              </Text>
            </Stack>
          </Paper>
          <Paper p="sm" radius="md" withBorder>
            <Stack gap={0} align="center">
              <Text size="xl" fw={900} c="green">
                {season.raidsCompleted}
              </Text>
              <Text size="xs" c="dimmed">
                Raids completas
              </Text>
            </Stack>
          </Paper>
          <Paper p="sm" radius="md" withBorder>
            <Stack gap={0} align="center">
              <Text size="xl" fw={900} c="blue">
                {season.totalAttacks}
              </Text>
              <Text size="xs" c="dimmed">
                Ataques totales
              </Text>
            </Stack>
          </Paper>
          <Paper p="sm" radius="md" withBorder>
            <Stack gap={0} align="center">
              <Text size="xl" fw={900} c="orange">
                {season.enemyDistrictsDestroyed}
              </Text>
              <Text size="xs" c="dimmed">
                Distritos destruidos
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        {season.members && season.members.length > 0 && (
          <Accordion variant="separated" radius="md">
            <Accordion.Item value="members">
              <Accordion.Control>
                <Group gap="xs">
                  <ThemeIcon color="yellow" variant="light" size="sm">
                    <IconStar size={12} />
                  </ThemeIcon>
                  <Text fw={600} size="sm">
                    Participantes
                  </Text>
                  <Badge color="yellow" variant="light" size="sm">
                    {season.members.length} jugadores
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  {[...season.members]
                    .sort(
                      (a, b) =>
                        b.capitalResourcesLooted - a.capitalResourcesLooted,
                    )
                    .map((m, i) => (
                      <Paper key={m.tag} p="sm" radius="md" withBorder>
                        <Group
                          justify="space-between"
                          wrap="nowrap"
                          align="center"
                        >
                          <Group
                            gap="xs"
                            wrap="nowrap"
                            style={{ minWidth: 0, flex: 1 }}
                          >
                            <Text
                              size="sm"
                              c="dimmed"
                              style={{ flexShrink: 0 }}
                            >
                              #{i + 1}
                            </Text>
                            <Avatar
                              color="yellow"
                              radius="xl"
                              size="sm"
                              style={{ flexShrink: 0 }}
                            >
                              {m.name.charAt(0)}
                            </Avatar>
                            <Text
                              size="sm"
                              fw={600}
                              lineClamp={1}
                              style={{ minWidth: 0 }}
                            >
                              {m.name}
                            </Text>
                          </Group>
                          <Group
                            gap="sm"
                            wrap="nowrap"
                            style={{ flexShrink: 0, marginLeft: 8 }}
                          >
                            <Stack gap={0} align="center">
                              <Text
                                size="sm"
                                fw={700}
                                c="yellow"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {m.capitalResourcesLooted.toLocaleString()}
                              </Text>
                              <Text size="xs" c="dimmed">
                                oro
                              </Text>
                            </Stack>
                            <Badge
                              color={
                                m.attacks >= m.attackLimit
                                  ? "green"
                                  : m.attacks > 0
                                    ? "yellow"
                                    : "red"
                              }
                              variant="light"
                              size="sm"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {m.attacks}/{m.attackLimit + m.bonusAttackLimit}
                            </Badge>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}

        <Divider />

        {season.attackLog.length > 0 && (
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon color="green" variant="light" size="sm">
                <IconSword size={12} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                Clanes atacados
              </Text>
            </Group>
            <RaidLogAccordion entries={season.attackLog} type="attack" />
          </Stack>
        )}

        {season.defenseLog.length > 0 && (
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon color="red" variant="light" size="sm">
                <IconShield size={12} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                Clanes que nos atacaron
              </Text>
            </Group>
            <RaidLogAccordion entries={season.defenseLog} type="defense" />
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
