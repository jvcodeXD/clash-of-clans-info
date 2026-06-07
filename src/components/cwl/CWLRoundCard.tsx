"use client";

import {
  Accordion,
  Group,
  Stack,
  Text,
  Badge,
  Avatar,
  SimpleGrid,
  ThemeIcon,
  Table,
  Divider,
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconStar, IconSword, IconClock } from "@tabler/icons-react";
import { CWLWar, WarMember, Attack } from "@/types/clash";
import AttackStars from "../wars/AttackStars";

interface CWLRoundCardProps {
  wars: CWLWar[];
  ourClanTag: string;
}

const normalize = (tag: string) => tag.replace("#", "").toUpperCase();

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
  const isMain = normalize(war.clan.tag) === normalize(ourClanTag);
  const ourStars = isMain ? war.clan.stars : war.opponent.stars;
  const theirStars = isMain ? war.opponent.stars : war.clan.stars;
  if (ourStars > theirStars)
    return (
      <Badge color="green" variant="filled" size="sm">
        Victoria
      </Badge>
    );
  if (ourStars < theirStars)
    return (
      <Badge color="red" variant="filled" size="sm">
        Derrota
      </Badge>
    );
  return (
    <Badge color="gray" variant="filled" size="sm">
      Empate
    </Badge>
  );
}

function MemberRowDesktop({ member }: { member: WarMember }) {
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
          <Text size="sm" fw={700} c="yellow">
            ⭐ {totalStars}
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        {attacks.length > 0 && (
          <Text size="xs" c="dimmed">
            {avgDestruction}%
          </Text>
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

function MemberCardMobile({ member }: { member: WarMember }) {
  const attacks = member.attacks || [];
  const totalStars = attacks.reduce((s, a: Attack) => s + a.stars, 0);

  return (
    <Card withBorder radius="md" p="sm">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
            #{member.mapPosition}
          </Text>
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text size="sm" fw={600} lineClamp={1}>
              {member.name}
            </Text>
            <Badge size="xs" variant="light" color="cyan">
              TH {member.townhallLevel}
            </Badge>
          </Stack>
        </Group>
        <Stack gap={2} align="flex-end" style={{ flexShrink: 0 }}>
          {attacks.length > 0 ? (
            <>
              <Text size="sm" fw={700} c="yellow">
                ⭐ {totalStars}
              </Text>
              {attacks.map((a, i) => (
                <Group key={i} gap={4} wrap="nowrap">
                  <AttackStars stars={a.stars} />
                  <Text size="xs" c="dimmed">
                    {a.destructionPercentage}%
                  </Text>
                </Group>
              ))}
            </>
          ) : (
            <Badge color="red" variant="light" size="xs">
              Sin ataque
            </Badge>
          )}
          {member.bestOpponentAttack && (
            <Text size="xs" c="dimmed">
              Def: {"⭐".repeat(member.bestOpponentAttack.stars)}{" "}
              {member.bestOpponentAttack.destructionPercentage}%
            </Text>
          )}
        </Stack>
      </Group>
    </Card>
  );
}

function RoundContent({
  war,
  ourClanTag,
}: {
  war: CWLWar;
  ourClanTag: string;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isMain = normalize(war.clan.tag) === normalize(ourClanTag);
  const ourClan = isMain ? war.clan : war.opponent;
  const theirClan = isMain ? war.opponent : war.clan;
  const sortedMembers = [...ourClan.members].sort(
    (a, b) => a.mapPosition - b.mapPosition,
  );

  return (
    <Stack gap="md">
      <SimpleGrid cols={3}>
        <Stack align="center" gap="xs">
          <Avatar src={ourClan.badgeUrls?.medium} size={48} radius="md" />
          <Text fw={700} size="sm" ta="center">
            {ourClan.name}
          </Text>
          <Badge color="yellow" variant="light" size="sm">
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
          <Badge color="gray" variant="light" size="sm">
            Rival
          </Badge>
        </Stack>
      </SimpleGrid>

      <Divider />

      {war.state !== "preparation" &&
        (isMobile ? (
          <Stack gap="sm">
            {sortedMembers.map((member) => (
              <MemberCardMobile key={member.tag} member={member} />
            ))}
          </Stack>
        ) : (
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
                <MemberRowDesktop key={member.tag} member={member} />
              ))}
            </Table.Tbody>
          </Table>
        ))}
    </Stack>
  );
}

export default function CWLRoundCard({ wars, ourClanTag }: CWLRoundCardProps) {
  return (
    <Accordion variant="separated" radius="md">
      {wars.map((war, i) => {
        const isMain = normalize(war.clan.tag) === normalize(ourClanTag);
        const ourClan = isMain ? war.clan : war.opponent;
        const theirClan = isMain ? war.opponent : war.clan;

        return (
          <Accordion.Item key={i} value={`round-${i}`}>
            <Accordion.Control>
              <Stack gap={4}>
                <Group gap="xs" wrap="wrap">
                  <ThemeIcon color="blue" variant="light" size="sm">
                    <IconSword size={12} />
                  </ThemeIcon>
                  <Text fw={700} size="sm">
                    Ronda {i + 1}
                  </Text>
                  {getStateBadge(war.state)}
                  {getResult(war, ourClanTag)}
                </Group>
                <Group gap="xs" wrap="wrap">
                  <Avatar
                    src={theirClan.badgeUrls?.medium}
                    size={20}
                    radius="sm"
                  />
                  <Text size="sm" c="dimmed">
                    vs {theirClan.name}
                  </Text>
                  <Text size="sm" fw={700} c="yellow">
                    ⭐ {ourClan.stars} - {theirClan.stars}
                  </Text>
                  {war.endTime && (
                    <Group gap={4}>
                      <ThemeIcon color="gray" variant="light" size="xs">
                        <IconClock size={10} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed">
                        {formatDate(war.endTime)}
                      </Text>
                    </Group>
                  )}
                </Group>
              </Stack>
            </Accordion.Control>
            <Accordion.Panel>
              <RoundContent war={war} ourClanTag={ourClanTag} />
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
