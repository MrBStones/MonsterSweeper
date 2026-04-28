import { GameState } from "@/types/gameModeTypes";

export interface GameModeInterface {
  gameState: GameState;
  onPress(x: number, y: number, flag: number): void;
}
