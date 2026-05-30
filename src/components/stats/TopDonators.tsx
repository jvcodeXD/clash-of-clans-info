"use client";

import {
  Paper,
  Table,
  Title,
  Badge,
  Group,
  Text,
  Avatar,
  Progress,
  Stack,
} from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { Member } from "@/types/clash";

interface TopDonatorsProps {
  members: Member[];
}

export default function TopDonators({ members }: TopDonatorsProps) {
  const sorted = [...members]
    .sort((a, b) => b.donations - a.donations)
    .slice(0, 10);

  const max = sorted[0]?.donations || 1;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <IconHeart size={18} color="#e03131" />
        <Title order={5}>Top Donadores</Title>
      </Group>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Jugador</Table.Th>
            <Table.Th>Donadas</Table.Th>
            <Table.Th>Recibidas</Table.Th>
            <Table.Th w={120}>Ratio</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((m, i) => {
            const ratio =
              m.donationsReceived > 0
                ? (m.donations / m.donationsReceived).toFixed(1)
                : "∞";
            return (
              <Table.Tr key={m.tag}>
                <Table.Td>
                  <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Avatar color="yellow" radius="xl" size="sm">
                      {m.name.charAt(0)}
                    </Avatar>
                    <Text size="sm" fw={600}>
                      {m.name}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Text size="sm" c="green" fw={600}>
                      ↑ {m.donations.toLocaleString()}
                    </Text>
                    <Progress
                      value={(m.donations / max) * 100}
                      color="green"
                      size="xs"
                      radius="xl"
                    />
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="red">
                    ↓ {m.donationsReceived.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={parseFloat(ratio) >= 1 ? "green" : "orange"}
                    variant="light"
                  >
                    {ratio}x
                  </Badge>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
