"use client";

import {
  Paper,
  Table,
  Badge,
  Group,
  Text,
  Avatar,
  Progress,
  Stack,
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconHeart } from "@tabler/icons-react";
import { Member } from "@/types/clash";

interface TopDonatorsProps {
  members: Member[];
}

const medals = ["🥇", "🥈", "🥉"];

export default function TopDonators({ members }: TopDonatorsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sorted = [...members]
    .sort((a, b) => b.donations - a.donations)
    .slice(0, 10);
  const max = sorted[0]?.donations || 1;

  return (
    <Paper withBorder radius="md" p="md">
      <Group mb="md" gap="xs">
        <IconHeart size={18} color="#e03131" />
        <Text fw={700} size="sm">
          Top Donadores
        </Text>
      </Group>

      {isMobile ? (
        <Stack gap="sm">
          {sorted.map((m, i) => {
            const ratio =
              m.donationsReceived > 0
                ? (m.donations / m.donationsReceived).toFixed(1)
                : "∞";
            return (
              <Card key={m.tag} withBorder radius="md" p="sm">
                <Group justify="space-between">
                  <Group gap="sm">
                    <Text size="sm">{medals[i] ?? `#${i + 1}`}</Text>
                    <Avatar color="yellow" radius="xl" size="sm">
                      {m.name.charAt(0)}
                    </Avatar>
                    <Stack gap={2}>
                      <Text size="sm" fw={600}>
                        {m.name}
                      </Text>
                      <Progress
                        value={(m.donations / max) * 100}
                        color="green"
                        size="xs"
                        radius="xl"
                        w={80}
                      />
                    </Stack>
                  </Group>
                  <Stack gap={2} align="flex-end">
                    <Text size="sm" c="green" fw={600}>
                      ↑ {m.donations.toLocaleString()}
                    </Text>
                    <Badge
                      color={parseFloat(ratio) >= 1 ? "green" : "orange"}
                      variant="light"
                      size="xs"
                    >
                      {ratio}x
                    </Badge>
                  </Stack>
                </Group>
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Jugador</Table.Th>
              <Table.Th>Donadas</Table.Th>
              <Table.Th>Recibidas</Table.Th>
              <Table.Th>Ratio</Table.Th>
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
      )}
    </Paper>
  );
}
