import * as Haptics from "expo-haptics";
import { create } from "zustand";

import { StandardGameMode } from "@/game-logic/game-logic";
import { GameState, InintalizationProps, Tile } from "@/types/gameModeTypes";

type GameStore = {
  gameState: GameState | null;
  selectedNumber: number;
  showGameOver: boolean;
  initializationProps: InintalizationProps | null;
  boardGenerated: boolean;
  gameSessionId: number;
  initGame: (props: InintalizationProps) => void;
  setSelectedNumber: (num: number) => void;
  handleTilePress: (x: number, y: number) => void;
};

function snapshotGameState(gameState: GameState): GameState {
  return {
    ...gameState,
  };
}

function calculateDynamicXPNeeded(monsters: number[]): number[] {
  const xpNeeded: number[] = [0, 0];
  let cumulativeXP = 0;

  const earlyPacingRatios = {
    2: 10 / 52,
    3: 90 / 144,
    4: 202 / 304,
    5: 400 / 592,
  };

  for (
    let currentLevel = 1;
    currentLevel < monsters.length - 1;
    currentLevel++
  ) {
    cumulativeXP += monsters[currentLevel] * Math.pow(2, currentLevel - 1);
    const nextLevel = currentLevel + 1;

    if (nextLevel >= 6) {
      xpNeeded.push(cumulativeXP);
    } else {
      const ratio =
        earlyPacingRatios[nextLevel as keyof typeof earlyPacingRatios];
      xpNeeded.push(Math.round(cumulativeXP * ratio));
    }
  }

  return xpNeeded;
}

function createBlankGameState(props: InintalizationProps): GameState {
  const tiles: Tile[][] = Array.from({ length: props.sizeY }, () =>
    Array.from(
      { length: props.sizeX },
      (): Tile => ({
        revealed: false,
        flag: 0,
        value: 0,
        hideMonster: false,
        monster: undefined,
      }),
    ),
  );

  return {
    gridSizeX: props.sizeX,
    gridSizeY: props.sizeY,
    tiles,
    monstersRevealed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalMonsters: [...props.monsters],
    maxMonsterLevel: props.monsters.length - 1,
    playerLevel: 1,
    playerXP: 0,
    nextXP: calculateDynamicXPNeeded(props.monsters),
    playerHP: props.initialHP,
    playerMaxHP: props.initialHP,
  };
}

function triggerRevealHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  selectedNumber: 0,
  showGameOver: false,
  initializationProps: null,
  boardGenerated: false,
  gameSessionId: 0,

  initGame: (props) => {
    set({
      gameState: createBlankGameState(props),
      selectedNumber: 0,
      showGameOver: false,
      initializationProps: props,
      boardGenerated: false,
      gameSessionId: get().gameSessionId + 1,
    });
  },

  setSelectedNumber: (num) => set({ selectedNumber: num }),

  handleTilePress: (x, y) => {
    const {
      gameState,
      selectedNumber,
      showGameOver,
      initializationProps,
      boardGenerated,
    } = get();

    if (showGameOver || !gameState || !initializationProps) {
      return;
    }

    const currentTile = gameState.tiles[y]?.[x];
    const shouldTriggerRevealHaptic =
      currentTile !== undefined && !currentTile.revealed && selectedNumber === 0;

    if (!boardGenerated) {
      const gameLogic = new StandardGameMode(undefined, {
        ...initializationProps,
        initialTap: { x, y },
      });

      gameLogic.onPress(x, y, selectedNumber);

      set({
        gameState: snapshotGameState(gameLogic.gameState),
        selectedNumber: 0,
        showGameOver: gameLogic.gameState.playerHP <= 0,
        boardGenerated: true,
      });

      if (shouldTriggerRevealHaptic) {
        triggerRevealHaptic();
      }

      return;
    }

    const gameLogic = new StandardGameMode(gameState);
    gameLogic.onPress(x, y, selectedNumber);

    set({
      gameState: snapshotGameState(gameLogic.gameState),
      selectedNumber: 0,
      showGameOver: gameLogic.gameState.playerHP <= 0,
      boardGenerated: true,
    });

    if (shouldTriggerRevealHaptic) {
      triggerRevealHaptic();
    }
  },
}));
