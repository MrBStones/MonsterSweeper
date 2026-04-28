import { create } from "zustand";

import { StandardGameMode } from "@/game-logic/game-logic";
import { GameState, InintalizationProps, Tile } from "@/types/gameModeTypes";

type GameStore = {
  gameState: GameState | null;
  selectedNumber: number;
  showGameOver: boolean;
  initGame: (props: InintalizationProps) => void;
  setSelectedNumber: (num: number) => void;
  handleTilePress: (x: number, y: number) => void;
};

function cloneTiles(tiles: Tile[][]): Tile[][] {
  return tiles.map((row) => row.map((tile) => ({ ...tile })));
}

function snapshotGameState(gameState: GameState): GameState {
  return {
    ...gameState,
    tiles: cloneTiles(gameState.tiles),
    monstersRevealed: [...gameState.monstersRevealed],
    totalMonsters: [...gameState.totalMonsters],
    nextXP: [...gameState.nextXP],
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  selectedNumber: 0,
  showGameOver: false,

  initGame: (props) => {
    const gameLogic = new StandardGameMode(undefined, props);

    set({
      gameState: snapshotGameState(gameLogic.gameState),
      selectedNumber: 0,
      showGameOver: false,
    });
  },

  setSelectedNumber: (num) => set({ selectedNumber: num }),

  handleTilePress: (x, y) => {
    const { gameState, selectedNumber, showGameOver } = get();

    if (showGameOver || !gameState) {
      return;
    }

    const gameLogic = new StandardGameMode(gameState);
    gameLogic.onPress(x, y, selectedNumber);

    set({
      gameState: snapshotGameState(gameLogic.gameState),
      selectedNumber: 0,
      showGameOver: gameLogic.gameState.playerHP <= 0,
    });
  },
}));
