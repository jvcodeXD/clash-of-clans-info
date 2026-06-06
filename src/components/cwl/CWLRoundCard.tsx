"use client";

import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Avatar,
  SimpleGrid,
  Progress,
  ThemeIcon,
  Table,
  Divider,
} from "@mantine/core";
import { IconStar, IconSword, IconClock } from "@tabler/icons-react";
import { CWLWar, WarMember, Attack } from "@/types/clash";
import AttackStars from "../wars/AttackStars";

interface CWLRoundCardProps {
  war: CWLWar;
  roundNumber: number;
  ourClanTag: string;
}

function formatDate(time: string) {
  return new Date(
    time.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
      "$1-$2-$3T$4:$5:$6",
    ),
  ).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function getStateBadge(state: string) {
  switch (state) {
    case "inWar":
      return (
        <Badge color="red" variant="filled" size="sm">
          ⚔️ En curso
        </Badge>
      );
    case "preparation":
      return (
        <Badge color="yellow" variant="filled" size="sm">
          🛡️ Preparación
        </Badge>
      );
    case "warEnded":
      return (
        <Badge color="gray" variant="filled" size="sm">
          ✅ Finalizada
        </Badge>
      );
    default:
      return (
        <Badge color="gray" size="sm">
          Desconocido
        </Badge>
      );
  }
}

function getResult(war: CWLWar, ourClanTag: string) {
  if (war.state !== "warEnded") return null;
  const isMainClan = war.clan.tag === ourClanTag;
  const ourStars = isMainClan ? war.clan.stars : war.opponent.stars;
  const theirStars = isMainClan ? war.opponent.stars : war.clan.stars;

  if (ourStars > theirStars)
    return (
      <Badge color="green" variant="filled">
        Victoria
      </Badge>
    );
  if (ourStars < theirStars)
    return (
      <Badge color="red" variant="filled">
        Derrota
      </Badge>
    );
  return (
    <Badge color="gray" variant="filled">
      Empate
    </Badge>
  );
}

interface MemberRowProps {
  member: WarMember;
}

function MemberRow({ member }: MemberRowProps) {
  const attacks = member.attacks || [];
  const totalStars = attacks.reduce((s, a: Attack) => s + a.stars, 0);
  const avgDestruction = attacks.length
    ? Math.round(
        attacks.reduce((s, a: Attack) => s + a.destructionPercentage, 0) /
          attacks.length,
      )
    : 0;

  return (
    <Table.Tr>
      <Table.Td>
        <Text size="xs" c="dimmed">
          #{member.mapPosition}
        </Text>
      </Table.Td>
      <Table.Td>
        <Stack gap={0}>
          <Text size="sm" fw={600}>
            {member.name}
          </Text>
          <Badge size="xs" variant="light" color="cyan">
            TH {member.townhallLevel}
          </Badge>
        </Stack>
      </Table.Td>
      <Table.Td>
        {attacks.length > 0 ? (
          <Stack gap={2}>
            {attacks.map((a, i) => (
              <Group key={i} gap="xs">
                <AttackStars stars={a.stars} />
                <Text size="xs" c="dimmed">
                  {a.destructionPercentage}%
                </Text>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text size="xs" c="red">
            Sin ataque
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        {attacks.length > 0 && (
          <Group gap={4}>
            <Text size="sm" fw={700} c="yellow">
              ⭐ {totalStars}
            </Text>
          </Group>
        )}
      </Table.Td>
      <Table.Td>
        {attacks.length > 0 && (
          <Stack gap={2}>
            <Progress
              value={avgDestruction}
              color={
                avgDestruction >= 70
                  ? "green"
                  : avgDestruction >= 40
                    ? "yellow"
                    : "red"
              }
              size="sm"
              radius="xl"
              w={80}
            />
            <Text size="xs" c="dimmed">
              {avgDestruction}%
            </Text>
          </Stack>
        )}
      </Table.Td>
      <Table.Td>
        {member.bestOpponentAttack ? (
          <Group gap="xs">
            <AttackStars stars={member.bestOpponentAttack.stars} />
            <Text size="xs" c="dimmed">
              {member.bestOpponentAttack.destructionPercentage}%
            </Text>
          </Group>
        ) : (
          <Badge color="green" variant="light" size="xs">
            No atacado
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  );
}

export default function CWLRoundCard({
  war,
  roundNumber,
  ourClanTag,
}: CWLRoundCardProps) {
  const isMainClan = war.clan.tag === ourClanTag;
  const ourClan = isMainClan ? war.clan : war.opponent;
  const theirClan = isMainClan ? war.opponent : war.clan;

  const sortedMembers = [...ourClan.members].sort(
    (a, b) => a.mapPosition - b.mapPosition,
  );

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconSword size={12} />
            </ThemeIcon>
            <Text fw={700} size="sm">
              Ronda {roundNumber}
            </Text>
            {getStateBadge(war.state)}
            {getResult(war, ourClanTag)}
          </Group>
          {war.endTime && (
            <Group gap="xs">
              <ThemeIcon color="gray" variant="light" size="xs">
                <IconClock size={10} />
              </ThemeIcon>
              <Text size="xs" c="dimmed">
                {formatDate(war.endTime)}
              </Text>
            </Group>
          )}
        </Group>

        {/* VS */}
        <SimpleGrid cols={3}>
          <Stack align="center" gap="xs">
            <Avatar src={ourClan.badgeUrls?.medium} size={48} radius="md" />
            <Text fw={700} size="sm" ta="center">
              {ourClan.name}
            </Text>
            <Badge color="yellow" variant="light">
              Tu clan
            </Badge>
          </Stack>

          <Stack align="center" justify="center" gap={4}>
            <SimpleGrid cols={2} spacing="xs">
              <Stack align="center" gap={0}>
                <Group gap={4}>
                  <IconStar size={14} color="#FFD700" fill="#FFD700" />
                  <Text fw={900} size="xl" c="yellow">
                    {ourClan.stars}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {ourClan.destructionPercentage?.toFixed(1)}%
                </Text>
              </Stack>
              <Stack align="center" gap={0}>
                <Group gap={4}>
                  <IconStar size={14} color="#555" />
                  <Text fw={900} size="xl" c="dimmed">
                    {theirClan.stars}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {theirClan.destructionPercentage?.toFixed(1)}%
                </Text>
              </Stack>
            </SimpleGrid>
            <Text size="xs" c="dimmed">
              {war.teamSize}v{war.teamSize}
            </Text>
          </Stack>

          <Stack align="center" gap="xs">
            <Avatar src={theirClan.badgeUrls?.medium} size={48} radius="md" />
            <Text fw={700} size="sm" ta="center">
              {theirClan.name}
            </Text>
            <Badge color="gray" variant="light">
              Rival
            </Badge>
          </Stack>
        </SimpleGrid>

        <Divider />

        {/* Members table */}
        {war.state !== "preparation" && (
          <Table verticalSpacing="xs" horizontalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Jugador</Table.Th>
                <Table.Th>Ataques</Table.Th>
                <Table.Th>⭐</Table.Th>
                <Table.Th>Destrucción</Table.Th>
                <Table.Th>Mejor defensa</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedMembers.map((member) => (
                <MemberRow key={member.tag} member={member} />
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Paper>
  );
}
