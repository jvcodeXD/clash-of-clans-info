"use client";

import { Stack, Title, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { CapitalRaidSeason } from "@/types/clash";
import CapitalSeasonCard from "./CapitalSeasonCard";
import CapitalRaidDetail from "./CapitalRaidDetail";

interface CapitalViewProps {
  seasons: CapitalRaidSeason[];
}

export default function CapitalView({ seasons }: CapitalViewProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState<CapitalRaidSeason | null>(null);

  function handleClick(season: CapitalRaidSeason) {
    setSelected(season);
    open();
  }

  if (!seasons.length) {
    return <Text c="dimmed">No hay temporadas de Capital disponibles.</Text>;
  }

  return (
    <Stack gap="md">
      <Title order={3}>Capital del Clan</Title>
      {seasons.map((season, i) => (
        <CapitalSeasonCard
          key={i}
          season={season}
          onClick={() => handleClick(season)}
        />
      ))}
      <CapitalRaidDetail season={selected} opened={opened} onClose={close} />
    </Stack>
  );
}
