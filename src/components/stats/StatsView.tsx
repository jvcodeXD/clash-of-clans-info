"use client";

import { Stack, Title, SimpleGrid } from "@mantine/core";
import { Member, WarLogEntry, CurrentWar } from "@/types/clash";
import TopDonators from "./TopDonators";
import WarStatsCard from "./WarStatsCard";

interface StatsViewProps {
  members: Member[];
  warLog: WarLogEntry[];
  currentWar: CurrentWar | null;
}

export default function StatsView({
  members,
  warLog,
  currentWar,
}: StatsViewProps) {
  return (
    <Stack gap="md">
      <Title order={3}>Estadísticas del clan</Title>
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <TopDonators members={members} />
        <WarStatsCard warLog={warLog} currentWar={currentWar} />
      </SimpleGrid>
    </Stack>
  );
}
