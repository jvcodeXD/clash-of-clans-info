"use client";

import { Paper, Group, Text, ThemeIcon, Badge } from "@mantine/core";
import {
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";

type AlertSeverity = "error" | "warning" | "info";

interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  members: string[];
}

const config = {
  error: {
    color: "red",
    icon: <IconAlertCircle size={16} />,
  },
  warning: {
    color: "orange",
    icon: <IconAlertTriangle size={16} />,
  },
  info: {
    color: "blue",
    icon: <IconInfoCircle size={16} />,
  },
};

export default function AlertCard({
  severity,
  title,
  members,
}: AlertCardProps) {
  if (!members.length) return null;

  const { color, icon } = config[severity];

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{ borderColor: `var(--mantine-color-${color}-6)` }}
    >
      <Group mb="xs" gap="xs">
        <ThemeIcon color={color} variant="light" size="sm">
          {icon}
        </ThemeIcon>
        <Text fw={600} size="sm">
          {title}
        </Text>
        <Badge color={color} variant="filled" size="sm">
          {members.length}
        </Badge>
      </Group>
      <Group gap="xs">
        {members.map((name) => (
          <Badge key={name} color={color} variant="light" size="sm">
            {name}
          </Badge>
        ))}
      </Group>
    </Paper>
  );
}
