"use client";

import {
  Paper,
  Table,
  Badge,
  Group,
  Text,
  Avatar,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCrown, IconShield, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import PlayerProfileModal from "./player/PlayerProfileModal";

interface Member {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  trophies: number;
  builderBaseTrophies: number;
  donations: number;
  donationsReceived: number;
  townHallLevel: number;
}

interface MembersViewProps {
  members: Member[];
}

function getRoleBadge(role: string) {
  switch (role) {
    case "leader":
      return (
        <Badge color="yellow" leftSection={<IconCrown size={12} />}>
          Líder
        </Badge>
      );
    case "coLeader":
      return (
        <Badge color="orange" leftSection={<IconShield size={12} />}>
          Co-Líder
        </Badge>
      );
    case "admin":
      return (
        <Badge color="blue" leftSection={<IconShield size={12} />}>
          Anciano
        </Badge>
      );
    default:
      return (
        <Badge color="gray" leftSection={<IconUser size={12} />}>
          Miembro
        </Badge>
      );
  }
}

export default function MembersView({ members }: MembersViewProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  function handleRowClick(tag: string) {
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

  const rows = sorted.map((member, index) => (
    <Table.Tr
      key={member.tag}
      onClick={() => handleRowClick(member.tag)}
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
  ));

  return (
    <Stack gap="md">
      <Title order={3}>Miembros del clan</Title>
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
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      <PlayerProfileModal tag={selectedTag} opened={opened} onClose={close} />
    </Stack>
  );
}
