import { Monster } from "./monsterType";

export type GameState = {
  gridSizeX: number;
  gridSizeY: number;
  tiles: Tile[][];
  monstersRevealed: number[];
  totalMonsters: number[];
  maxMonsterLevel: number;

  playerLevel: number;
  playerXP: number;
  nextXP: number[];
  playerHP: number;
  playerMaxHP: number;
};

export type Tile = {
  revealed: boolean;
  flag: number;
  value: number;
  hideMonster: boolean;
  monster: Monster | undefined;
};

export type GameInitializationProps = {
  sizeX: number;
  sizeY: number;
  /** Array of monster counts by level. Index 0 is ignored. */
  monsters: number[];
  initialHP: number;
  initialTap?: Vector2;
  blind?: boolean;
};

export type Vector2 = {
  x: number;
  y: number;
};
