export interface BadgeUrls {
  small: string;
  medium: string;
  large: string;
}

export interface WarLeague {
  id: number;
  name: string;
}

export interface Clan {
  tag: string;
  name: string;
  type: string;
  description: string;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  clanPoints: number;
  members: number;
  warWinStreak: number;
  warLeague: WarLeague;
}

export interface Member {
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

export interface Attack {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
  duration: number;
}

export interface WarMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  opponentAttacks?: number;
  attacks?: Attack[];
  bestOpponentAttack?: Attack;
}

export interface WarClan {
  tag: string;
  name: string;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  members: WarMember[];
}

export interface CurrentWar {
  state: string;
  teamSize: number;
  attacksPerMember: number;
  battleModifier: string;
  preparationStartTime: string;
  startTime: string;
  endTime: string;
  clan: WarClan;
  opponent: WarClan;
}

export interface WarLogClan {
  tag: string;
  name: string;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  expEarned?: number;
}

export interface WarLogOpponent {
  tag: string;
  name: string;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  stars: number;
  destructionPercentage: number;
}

export interface WarLogEntry {
  result: string;
  endTime: string;
  teamSize: number;
  attacksPerMember: number;
  battleModifier: string;
  clan: WarLogClan;
  opponent: WarLogOpponent;
}

export interface CapitalRaidAttacker {
  tag: string;
  name: string;
}

export interface CapitalRaidDistrict {
  id: number;
  name: string;
  districtHallLevel: number;
  destructionPercent: number;
  stars: number;
  attackCount: number;
  totalLooted: number;
  attacks?: {
    attacker: CapitalRaidAttacker;
    destructionPercent: number;
    stars: number;
  }[];
}

export interface CapitalRaidClan {
  tag: string;
  name: string;
  level: number;
  badgeUrls: BadgeUrls;
}

export interface CapitalRaidLogEntry {
  defender?: CapitalRaidClan;
  attacker?: CapitalRaidClan;
  attackCount: number;
  districtCount: number;
  districtsDestroyed: number;
  districts: CapitalRaidDistrict[];
}

export interface CapitalRaidMember {
  tag: string;
  name: string;
  attacks: number;
  attackLimit: number;
  bonusAttackLimit: number;
  capitalResourcesLooted: number;
}

export interface CapitalRaidSeason {
  state: string;
  startTime: string;
  endTime: string;
  capitalTotalLoot: number;
  raidsCompleted: number;
  totalAttacks: number;
  enemyDistrictsDestroyed: number;
  offensiveReward: number;
  defensiveReward: number;
  members?: CapitalRaidMember[];
  attackLog: CapitalRaidLogEntry[];
  defenseLog: CapitalRaidLogEntry[];
}

export interface PlayerLeague {
  id: number;
  name: string;
  iconUrls: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface PlayerAchievement {
  name: string;
  stars: number;
  value: number;
  target: number;
  info: string;
  completionInfo: string | null;
  village: string;
}

export interface PlayerTroop {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface PlayerHeroEquipment {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface PlayerHero {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
  equipment?: PlayerHeroEquipment[];
}

export interface PlayerSpell {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface PlayerDetail {
  tag: string;
  name: string;
  townHallLevel: number;
  townHallWeaponLevel?: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel?: number;
  builderBaseTrophies?: number;
  role: string;
  warPreference: string;
  donations: number;
  donationsReceived: number;
  clanCapitalContributions: number;
  clan: {
    tag: string;
    name: string;
    clanLevel: number;
    badgeUrls: BadgeUrls;
  };
  league?: PlayerLeague;
  achievements: PlayerAchievement[];
  troops: PlayerTroop[];
  heroes: PlayerHero[];
  heroEquipment: PlayerHeroEquipment[];
  spells: PlayerSpell[];
}

export interface CWLClanMember {
  tag: string;
  name: string;
  townHallLevel: number;
}

export interface CWLClan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: BadgeUrls;
  members: CWLClanMember[];
}

export interface CWLRound {
  warTags: string[];
}

export interface CWLGroup {
  state: string;
  season: string;
  clans: CWLClan[];
  rounds: CWLRound[];
}

export interface CWLWar {
  state: string;
  teamSize: number;
  preparationStartTime: string;
  startTime: string;
  endTime: string;
  clan: WarClan;
  opponent: WarClan;
  warStartTime?: string;
}
