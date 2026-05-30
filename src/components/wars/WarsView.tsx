"use client";

import { Stack, Title, Tabs } from "@mantine/core";
import { IconSword, IconHistory } from "@tabler/icons-react";
import CurrentWarCard from "./CurrentWarCard";
import WarLogTable from "./WarLogTable";
import { CurrentWar, WarLogEntry } from "@/types/clash";

interface WarsViewProps {
  currentWar: CurrentWar | null;
  warLog: WarLogEntry[];
}

export default function WarsView({ currentWar, warLog }: WarsViewProps) {
  return (
    <Stack gap="md">
      <Title order={3}>Guerras</Title>

      <Tabs defaultValue="current">
        <Tabs.List>
          <Tabs.Tab value="current" leftSection={<IconSword size={16} />}>
            Guerra actual
          </Tabs.Tab>
          <Tabs.Tab value="log" leftSection={<IconHistory size={16} />}>
            Historial
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="current" pt="md">
          {currentWar && <CurrentWarCard war={currentWar} />}
        </Tabs.Panel>

        <Tabs.Panel value="log" pt="md">
          <WarLogTable warLog={warLog} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
