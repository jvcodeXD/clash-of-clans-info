"use client";

import {
  Table,
  Group,
  Stack,
  Text,
  Badge,
  Progress,
  Tooltip,
} from "@mantine/core";
import AttackStars from "./AttackStars";

interface Attack {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
}

interface WarMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  attacks?: Attack[];
  bestOpponentAttack?: Attack;
}

interface WarMemberRowProps {
  member: WarMember;
  maxAttacks: number;
}

export default function WarMemberRow({
  member,
  maxAttacks,
}: WarMemberRowProps) {
  const attacks = member.attacks || [];
  const totalStars = attacks.reduce((sum, a) => sum + a.stars, 0);
  const avgDestruction = attacks.length
    ? Math.round(
        attacks.reduce((sum, a) => sum + a.destructionPercentage, 0) /
          attacks.length,
      )
    : 0;

  return (
    <Table.Tr>
      <Table.Td>
        <Text c="dimmed" size="sm">
          #{member.mapPosition}
        </Text>
      </Table.Td>

      <Table.Td>
        <Stack gap={0}>
          <Text fw={600} size="sm">
            {member.name}
          </Text>
          <Text size="xs" c="dimmed">
            {member.tag}
          </Text>
        </Stack>
      </Table.Td>

      <Table.Td>
        <Badge variant="light" color="cyan">
          TH {member.townhallLevel}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dimmed">
          {attacks.length}/{maxAttacks}
        </Text>
      </Table.Td>

      <Table.Td>
        {attacks.length > 0 ? (
          <Stack gap={4}>
            {attacks.map((attack, i) => (
              <Tooltip
                key={i}
                label={`${attack.destructionPercentage}% destrucción`}
                position="top"
              >
                <Group gap="xs">
                  <AttackStars stars={attack.stars} />
                  <Text size="xs" c="dimmed">
                    {attack.destructionPercentage}%
                  </Text>
                </Group>
              </Tooltip>
            ))}
          </Stack>
        ) : (
          <Text size="xs" c="dimmed">
            Sin ataques
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        {attacks.length > 0 && (
          <Group gap="xs">
            <AttackStars stars={totalStars} max={maxAttacks * 3} />
            <Text size="xs" fw={600}>
              {totalStars}
            </Text>
          </Group>
        )}
      </Table.Td>

      <Table.Td>
        {attacks.length > 0 && (
          <Stack gap={4}>
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
            />
            <Text size="xs" c="dimmed">
              {avgDestruction}% promedio
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
          <Text size="xs" c="green">
            No atacado
          </Text>
        )}
      </Table.Td>
    </Table.Tr>
  );
}
