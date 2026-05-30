"use client";

import { Group } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";

interface AttackStarsProps {
  stars: number;
  max?: number;
}

export default function AttackStars({ stars, max = 3 }: AttackStarsProps) {
  return (
    <Group gap={2}>
      {Array.from({ length: max }).map((_, i) => (
        <IconStar
          key={i}
          size={14}
          fill={i < stars ? "#FFD700" : "transparent"}
          color={i < stars ? "#FFD700" : "#555"}
        />
      ))}
    </Group>
  );
}
