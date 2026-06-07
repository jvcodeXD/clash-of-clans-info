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
  Select,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconUsers,
  IconSword,
  IconRefresh,
  IconAlertCircle,
  IconChartBar,
  IconBuildingCastle,
  IconBell,
  IconShield,
} from "@tabler/icons-react";
import ClanHeader from "@/components/ClanHeader";
import MembersView from "@/components/MembersView";
import WarsView from "@/components/wars/WarsView";
import StatsView from "@/components/stats/StatsView";
import CapitalView from "@/components/capital/CapitalView";
import AlertsView from "@/components/alerts/AlertsView";
import CWLView from "@/components/cwl/CWLView";
import {
  Clan,
  Member,
  CurrentWar,
  WarLogEntry,
  CapitalRaidSeason,
  CWLGroup,
  CWLWar,
} from "@/types/clash";

interface MainData {
  clan: Clan | null;
  members: Member[];
  currentWar: CurrentWar | null;
  warLog: WarLogEntry[];
  capitalSeasons: CapitalRaidSeason[];
}

interface CWLData {
  cwlGroup: CWLGroup | null;
  cwlWars: CWLWar[];
  cwlAllWars: CWLWar[];
  notInCWL: boolean;
}

const tabOptions = [
  { value: "members", label: "👥 Miembros" },
  { value: "wars", label: "⚔️ Guerras" },
  { value: "stats", label: "📊 Estadísticas" },
  { value: "capital", label: "🏰 Capital" },
  { value: "cwl", label: "🛡️ Liga CWL" },
  { value: "alerts", label: "🔔 Alertas" },
];

export default function HomePage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mainData, setMainData] = useState<MainData>({
    clan: null,
    members: [],
    currentWar: null,
    warLog: [],
    capitalSeasons: [],
  });
  const [cwlData, setCwlData] = useState<CWLData>({
    cwlGroup: null,
    cwlWars: [],
    cwlAllWars: [],
    notInCWL: false,
  });
  const [loading, setLoading] = useState(true);
  const [cwlLoading, setCwlLoading] = useState(false);
  const [cwlLoaded, setCwlLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("members");

  const loadMainData = useCallback((isManual = false) => {
    if (isManual) setRefreshing(true);

    Promise.all([
      fetch("/api/clan"),
      fetch("/api/members"),
      fetch("/api/wars"),
      fetch("/api/capital"),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([clanData, membersData, warsData, capitalData]) => {
        setMainData({
          clan: clanData,
          members: membersData.items || [],
          currentWar: warsData.currentWar,
          warLog: warsData.warLog?.items || [],
          capitalSeasons: capitalData.items || [],
        });
        setLastUpdated(new Date());
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  const loadCWLData = useCallback(() => {
    if (cwlLoaded) return;
    setCwlLoading(true);

    fetch("/api/cwl")
      .then((r) => r.json())
      .then((data) => {
        setCwlData({
          cwlGroup: data.group || null,
          cwlWars: data.wars || [],
          cwlAllWars: data.allWars || [],
          notInCWL: data.notInCWL || false,
        });
        setCwlLoaded(true);
      })
      .catch(() => setCwlLoaded(true))
      .finally(() => setCwlLoading(false));
  }, [cwlLoaded]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMainData();
  }, [loadMainData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeTab === "cwl") loadCWLData();
  }, [activeTab, loadCWLData]);

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
            <Tooltip label="Actualizar ahora">
              <ActionIcon
                variant="light"
                color="yellow"
                onClick={() => loadMainData(true)}
                loading={refreshing}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {mainData.clan && <ClanHeader clan={mainData.clan} />}

          <Tabs value={activeTab} onChange={setActiveTab} mt="lg">
            {isMobile ? (
              <Select
                data={tabOptions}
                value={activeTab}
                onChange={setActiveTab}
                mb="md"
                size="sm"
              />
            ) : (
              <Tabs.List>
                <Tabs.Tab value="members" leftSection={<IconUsers size={16} />}>
                  Miembros
                </Tabs.Tab>
                <Tabs.Tab value="wars" leftSection={<IconSword size={16} />}>
                  Guerras
                </Tabs.Tab>
                <Tabs.Tab
                  value="stats"
                  leftSection={<IconChartBar size={16} />}
                >
                  Estadísticas
                </Tabs.Tab>
                <Tabs.Tab
                  value="capital"
                  leftSection={<IconBuildingCastle size={16} />}
                >
                  Capital
                </Tabs.Tab>
                <Tabs.Tab value="cwl" leftSection={<IconShield size={16} />}>
                  Liga CWL
                </Tabs.Tab>
                <Tabs.Tab value="alerts" leftSection={<IconBell size={16} />}>
                  Alertas
                </Tabs.Tab>
              </Tabs.List>
            )}

            <Tabs.Panel value="members" pt="md">
              <MembersView members={mainData.members} />
            </Tabs.Panel>
            <Tabs.Panel value="wars" pt="md">
              <WarsView
                currentWar={mainData.currentWar}
                warLog={mainData.warLog}
              />
            </Tabs.Panel>
            <Tabs.Panel value="stats" pt="md">
              <StatsView
                members={mainData.members}
                warLog={mainData.warLog}
                currentWar={mainData.currentWar}
              />
            </Tabs.Panel>
            <Tabs.Panel value="capital" pt="md">
              <CapitalView seasons={mainData.capitalSeasons} />
            </Tabs.Panel>
            <Tabs.Panel value="cwl" pt="md">
              {cwlLoading ? (
                <Center py="xl">
                  <Loader color="yellow" />
                </Center>
              ) : (
                <CWLView
                  group={cwlData.cwlGroup}
                  wars={cwlData.cwlWars}
                  allWars={cwlData.cwlAllWars}
                  ourClanTag={mainData.clan?.tag || ""}
                  notInCWL={cwlData.notInCWL}
                />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="alerts" pt="md">
              <AlertsView
                members={mainData.members}
                currentWar={mainData.currentWar}
                capitalSeasons={mainData.capitalSeasons}
              />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
