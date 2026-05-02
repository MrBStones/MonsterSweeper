import { GameInitializationProps } from "@/types/gameModeTypes";

export const EASYProps: GameInitializationProps = {
  sizeX: 16,
  sizeY: 16,
  initialHP: 10,
  initialTap: { x: 0, y: 0 },
  monsters: [0, 10, 8, 6, 4, 2],
};

export const NORMALProps: GameInitializationProps = {
  sizeX: 16,
  sizeY: 30,
  initialHP: 10,
  initialTap: { x: 0, y: 0 },
  monsters: [0, 33, 27, 20, 13, 6],
};

export const HUGEProps: GameInitializationProps = {
  sizeX: 25,
  sizeY: 50,
  initialHP: 30,
  initialTap: { x: 0, y: 0 },
  monsters: [0, 52, 46, 40, 36, 30, 24, 18, 13, 1],
};

export const BLINDProps: GameInitializationProps = {
  sizeX: 16,
  sizeY: 30,
  initialHP: 1,
  initialTap: { x: 0, y: 0 },
  monsters: [0, 33, 27, 20, 13, 6],
  blind: true,
};

export const EXTREMEProps: GameInitializationProps = {
  sizeX: 16,
  sizeY: 30,
  initialHP: 1,
  initialTap: { x: 0, y: 0 },
  monsters: [0, 25, 25, 25, 25, 25],
};

export type GameMode = "easy" | "normal" | "huge" | "blind" | "extreme";

export function getGameModeProps(mode: GameMode): GameInitializationProps {
  switch (mode) {
    case "easy":
      return EASYProps;
    case "normal":
      return NORMALProps;
    case "huge":
      return HUGEProps;
    case "blind":
      return BLINDProps;
    case "extreme":
      return EXTREMEProps;
    default:
      return HUGEProps;
  }
}
