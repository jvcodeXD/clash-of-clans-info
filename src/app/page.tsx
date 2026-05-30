"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AppShell,
  Container,
  Tabs,
  Text,
  Loader,
  Center,
  Alert,
  Group,
  ActionIcon,
  Tooltip,
  Badge,
} from "@mantine/core";
import {
  IconUsers,
  IconSword,
  IconRefresh,
  IconAlertCircle,
  IconBuildingCastle,
  IconBell,
} from "@tabler/icons-react";
import ClanHeader from "@/components/ClanHeader";
import MembersView from "@/components/MembersView";
import WarsView from "@/components/wars/WarsView";
import {
  Clan,
  Member,
  CurrentWar,
  WarLogEntry,
  CapitalRaidSeason,
} from "@/types/clash";
import StatsView from "@/components/stats/StatsView";
import { IconChartBar } from "@tabler/icons-react";
import CapitalView from "@/components/capital/CapitalView";
import AlertsView from "@/components/alerts/AlertsView";

const REFRESH_INTERVAL = 60000;

interface AppData {
  clan: Clan | null;
  members: Member[];
  currentWar: CurrentWar | null;
  warLog: WarLogEntry[];
  capitalSeasons: CapitalRaidSeason[];
}

async function fetchAllData(): Promise<AppData> {
  const [clanRes, membersRes, warsRes, capitalRes] = await Promise.all([
    fetch("/api/clan"),
    fetch("/api/members"),
    fetch("/api/wars"),
    fetch("/api/capital"),
  ]);

  if (!clanRes.ok || !membersRes.ok || !warsRes.ok) {
    throw new Error("Error al obtener datos de la API");
  }

  const [clanData, membersData, warsData, capitalData] = await Promise.all([
    clanRes.json() as Promise<Clan>,
    membersRes.json() as Promise<{ items: Member[] }>,
    warsRes.json() as Promise<{
      currentWar: CurrentWar;
      warLog: { items: WarLogEntry[] };
    }>,
    capitalRes.json() as Promise<{ items: CapitalRaidSeason[] }>,
  ]);

  return {
    clan: clanData,
    members: membersData.items || [],
    currentWar: warsData.currentWar,
    warLog: warsData.warLog?.items || [],
    capitalSeasons: capitalData.items || [],
  };
}

export default function HomePage() {
  const [data, setData] = useState<AppData>({
    clan: null,
    members: [],
    currentWar: null,
    warLog: [],
    capitalSeasons: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback((isManual = false) => {
    if (isManual) setRefreshing(true);

    fetchAllData()
      .then((result) => {
        setData(result);
        setLastUpdated(new Date());
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const interval = setInterval(() => loadData(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="xl" color="yellow" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          maw={400}
        >
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <AppShell padding="md">
      <AppShell.Main>
        <Container size="xl">
          <Group justify="space-between" mb="md">
            <Text size="xs" c="dimmed">
              {lastUpdated
                ? `Actualizado: ${lastUpdated.toLocaleTimeString("es-ES")}`
                : "Cargando..."}
            </Text>
            <Group gap="xs">
              <Badge color="yellow" variant="dot" size="sm">
                Auto-refresh cada 60s
              </Badge>
              <Tooltip label="Actualizar ahora">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => loadData(true)}
                  loading={refreshing}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {data.clan && <ClanHeader clan={data.clan} />}

          <Tabs defaultValue="members" mt="lg">
            <Tabs.List>
              <Tabs.Tab value="members" leftSection={<IconUsers size={16} />}>
                Miembros
              </Tabs.Tab>
              <Tabs.Tab value="wars" leftSection={<IconSword size={16} />}>
                Guerras
              </Tabs.Tab>
              <Tabs.Tab value="stats" leftSection={<IconChartBar size={16} />}>
                Estadísticas
              </Tabs.Tab>
              <Tabs.Tab
                value="capital"
                leftSection={<IconBuildingCastle size={16} />}
              >
                Capital
              </Tabs.Tab>
              <Tabs.Tab value="alerts" leftSection={<IconBell size={16} />}>
                Alertas
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="members" pt="md">
              <MembersView members={data.members} />
            </Tabs.Panel>

            <Tabs.Panel value="wars" pt="md">
              <WarsView currentWar={data.currentWar} warLog={data.warLog} />
            </Tabs.Panel>
            <Tabs.Panel value="stats" pt="md">
              <StatsView
                members={data.members}
                warLog={data.warLog}
                currentWar={data.currentWar}
              />
            </Tabs.Panel>
            <Tabs.Panel value="capital" pt="md">
              <CapitalView seasons={data.capitalSeasons} />
            </Tabs.Panel>
            <Tabs.Panel value="alerts" pt="md">
              <AlertsView
                members={data.members}
                currentWar={data.currentWar}
                capitalSeasons={data.capitalSeasons}
              />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
