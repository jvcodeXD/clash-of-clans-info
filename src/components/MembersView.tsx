"use client";

import { useState } from "react";
import {
  Paper,
  Table,
  Badge,
  Group,
  Text,
  Avatar,
  Stack,
  Title,
  Card,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCrown, IconShield, IconUser } from "@tabler/icons-react";
import { Member } from "@/types/clash";
import PlayerProfileModal from "./player/PlayerProfileModal";

interface MembersViewProps {
  members: Member[];
}

function getRoleBadge(role: string) {
  switch (role) {
    case "leader":
      return (
        <Badge color="yellow" leftSection={<IconCrown size={12} />} size="sm">
          Líder
        </Badge>
      );
    case "coLeader":
      return (
        <Badge color="orange" leftSection={<IconShield size={12} />} size="sm">
          Co-Líder
        </Badge>
      );
    case "admin":
      return (
        <Badge color="blue" leftSection={<IconShield size={12} />} size="sm">
          Anciano
        </Badge>
      );
    default:
      return (
        <Badge color="gray" leftSection={<IconUser size={12} />} size="sm">
          Miembro
        </Badge>
      );
  }
}

export default function MembersView({ members }: MembersViewProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleClick(tag: string) {
    setSelectedTag(tag);
    open();
  }

  if (!members?.length)
    return <Text c="dimmed">No hay miembros para mostrar.</Text>;

  const sorted = [...members].sort((a, b) => {
    const roleOrder: Record<string, number> = {
      leader: 0,
      coLeader: 1,
      admin: 2,
      member: 3,
    };
    return (roleOrder[a.role] ?? 3) - (roleOrder[b.role] ?? 3);
  });

  return (
    <Stack gap="md">
      <Title order={3}>Miembros del clan</Title>

      {isMobile ? (
        <Stack gap="sm">
          {sorted.map((member, index) => (
            <Card
              key={member.tag}
              withBorder
              radius="md"
              p="sm"
              onClick={() => handleClick(member.tag)}
              style={{ cursor: "pointer" }}
            >
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                  <Avatar
                    color="yellow"
                    radius="xl"
                    size="md"
                    style={{ flexShrink: 0 }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Stack gap={2} style={{ minWidth: 0 }}>
                    <Group gap={4} wrap="nowrap">
                      <Text
                        fw={600}
                        size="sm"
                        lineClamp={1}
                        style={{ flex: 1, minWidth: 0 }}
                      >
                        {member.name}
                      </Text>
                      <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                        #{index + 1}
                      </Text>
                    </Group>
                    <Group gap={4} wrap="wrap">
                      {getRoleBadge(member.role)}
                      <Badge variant="light" color="cyan" size="xs">
                        TH {member.townHallLevel}
                      </Badge>
                    </Group>
                  </Stack>
                </Group>
                <Stack
                  gap={2}
                  align="flex-end"
                  style={{ flexShrink: 0, marginLeft: 8 }}
                >
                  <Text fw={500} size="sm" style={{ whiteSpace: "nowrap" }}>
                    🏆 {member.trophies.toLocaleString()}
                  </Text>
                  <Group gap={6} wrap="nowrap">
                    <Text size="xs" c="green" style={{ whiteSpace: "nowrap" }}>
                      ↑ {member.donations}
                    </Text>
                    <Text size="xs" c="red" style={{ whiteSpace: "nowrap" }}>
                      ↓ {member.donationsReceived}
                    </Text>
                  </Group>
                </Stack>
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
                <Table.Th>#</Table.Th>
                <Table.Th>Jugador</Table.Th>
                <Table.Th>Rol</Table.Th>
                <Table.Th>Ayuntamiento</Table.Th>
                <Table.Th>Trofeos</Table.Th>
                <Table.Th>Donaciones</Table.Th>
                <Table.Th>Recibidas</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sorted.map((member, index) => (
                <Table.Tr
                  key={member.tag}
                  onClick={() => handleClick(member.tag)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Td>
                    <Text c="dimmed" size="sm">
                      #{index + 1}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="yellow" radius="xl" size="sm">
                        {member.name.charAt(0)}
                      </Avatar>
                      <Stack gap={0}>
                        <Text fw={600} size="sm">
                          {member.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {member.tag}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td>{getRoleBadge(member.role)}</Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="cyan">
                      TH {member.townHallLevel}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>🏆 {member.trophies.toLocaleString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="green">
                      ↑ {member.donations.toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="red">
                      ↓ {member.donationsReceived.toLocaleString()}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      <PlayerProfileModal tag={selectedTag} opened={opened} onClose={close} />
    </Stack>
  );
}
