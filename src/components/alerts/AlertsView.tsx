"use client";

import { Stack, Title, Text, Paper, Group, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { Member, CurrentWar, CapitalRaidSeason } from "@/types/clash";
import AlertCard from "./AlertCard";

interface AlertsViewProps {
  members: Member[];
  currentWar: CurrentWar | null;
  capitalSeasons: CapitalRaidSeason[];
}

export default function AlertsView({
  members,
  currentWar,
  capitalSeasons,
}: AlertsViewProps) {
  // Miembros sin donaciones
  const zeroDonations = members
    .filter((m) => m.donations === 0)
    .map((m) => m.name);

  // Miembros que no atacaron en guerra actual
  const didntAttackWar: string[] = [];
  const partialAttackWar: string[] = [];

  if (currentWar && currentWar.state !== "notInWar") {
    const attacksPerMember = currentWar.attacksPerMember;
    currentWar.clan.members.forEach((m) => {
      const attacks = m.attacks?.length || 0;
      if (attacks === 0) didntAttackWar.push(m.name);
      else if (attacks < attacksPerMember) partialAttackWar.push(m.name);
    });
  }

  // Miembros que no participaron en el capital (temporada actual)
  const noCapitalParticipation: string[] = [];
  const currentSeason = capitalSeasons.find((s) => s.state === "ongoing");

  if (currentSeason) {
    const participantTags = new Set(
      (currentSeason.members || []).map((m) => m.tag),
    );
    members.forEach((m) => {
      if (!participantTags.has(m.tag)) {
        noCapitalParticipation.push(m.name);
      }
    });
  }

  // Miembros con ataques de capital incompletos
  const incompleteCapital: string[] = [];
  if (currentSeason?.members) {
    currentSeason.members.forEach((m) => {
      const totalLimit = m.attackLimit + m.bonusAttackLimit;
      if (m.attacks < totalLimit) {
        incompleteCapital.push(`${m.name} (${m.attacks}/${totalLimit})`);
      }
    });
  }

  // Miembros con preferencia de guerra en "out"

  const hasAlerts =
    zeroDonations.length > 0 ||
    didntAttackWar.length > 0 ||
    partialAttackWar.length > 0 ||
    noCapitalParticipation.length > 0 ||
    incompleteCapital.length > 0;

  // Miembros posiblemente inactivos (cumplen las 3 condiciones)
  const possiblyInactive = members
    .filter((m) => {
      const noDonations = m.donations === 0;
      const didntAttack = didntAttackWar.includes(m.name);
      const noCapital = noCapitalParticipation.includes(m.name);
      return noDonations && didntAttack && noCapital;
    })
    .map((m) => m.name);

  return (
    <Stack gap="md">
      <Title order={3}>Alertas del clan</Title>

      {!hasAlerts && (
        <Paper p="xl" radius="md" withBorder>
          <Group justify="center" gap="xs">
            <ThemeIcon color="green" variant="light" size="lg">
              <IconCircleCheck size={20} />
            </ThemeIcon>
            <Text c="green" fw={600}>
              Todo en orden, no hay alertas activas!
            </Text>
          </Group>
        </Paper>
      )}

      {didntAttackWar.length > 0 && (
        <AlertCard
          severity="error"
          title={`No atacaron en guerra ${currentWar?.state === "inWar" ? "(guerra activa)" : "(guerra finalizada)"}`}
          members={didntAttackWar}
        />
      )}

      {partialAttackWar.length > 0 && (
        <AlertCard
          severity="warning"
          title="Ataques de guerra incompletos"
          members={partialAttackWar}
        />
      )}

      {noCapitalParticipation.length > 0 && (
        <AlertCard
          severity="error"
          title="No participaron en el Capital esta semana"
          members={noCapitalParticipation}
        />
      )}

      {incompleteCapital.length > 0 && (
        <AlertCard
          severity="warning"
          title="Ataques de Capital incompletos"
          members={incompleteCapital}
        />
      )}

      {zeroDonations.length > 0 && (
        <AlertCard
          severity="info"
          title="Sin donaciones esta temporada"
          members={zeroDonations}
        />
      )}

      {possiblyInactive.length > 0 && (
        <AlertCard
          severity="error"
          title="Posiblemente inactivos (sin donaciones, sin guerra, sin capital)"
          members={possiblyInactive}
        />
      )}
    </Stack>
  );
}
