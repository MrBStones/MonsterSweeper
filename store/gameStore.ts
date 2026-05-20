import * as Haptics from "expo-haptics";
import { create } from "zustand";

import { StandardGameMode } from "@/game-logic/game-logic";
import {
  GameInitializationProps,
  GameState,
  Tile,
} from "@/types/gameModeTypes";

type GameStore = {
  gameState: GameState | null;
  visibleTiles: Tile[][];
  selectedNumber: number;
  showGameOver: boolean;
  levelUpEffect: LevelUpEffect | null;
  damageEffect: DamageEffect | null;
  initializationProps: GameInitializationProps | null;
  boardGenerated: boolean;
  gameSessionId: number;
  elapsedSeconds: number;
  gameStartedAt: number | null;
  gameEndedAt: number | null;
  initGame: (props: GameInitializationProps) => void;
  resetGame: () => void;
  setSelectedNumber: (num: number) => void;
  clearLevelUpEffect: () => void;
  clearDamageEffect: () => void;
  tickTimer: () => void;
  handleTilePress: (x: number, y: number) => void;
};

export type LevelUpEffect = {
  id: number;
  x: number;
  y: number;
  level: number;
};

export type DamageEffect = {
  id: number;
  x: number;
  y: number;
};

function snapshotGameState(gameState: GameState): GameState {
  return {
    ...gameState,
  };
}

function createBlankTiles(sizeX: number, sizeY: number): Tile[][] {
  return Array.from({ length: sizeY }, () =>
    Array.from(
      { length: sizeX },
      (): Tile => ({
        revealed: false,
        flag: 0,
        value: 0,
        hideMonster: false,
        monster: undefined,
      }),
    ),
  );
}

function createBlankGameState(props: GameInitializationProps): GameState {
  const tiles = createBlankTiles(props.sizeX, props.sizeY);

  return {
    gridSizeX: props.sizeX,
    gridSizeY: props.sizeY,
    tiles,
    monstersRevealed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalMonsters: [...props.monsters],
    maxMonsterLevel: props.monsters.length - 1,
    playerLevel: 1,
    playerXP: 0,
    nextXP: [...props.nextXP],
    playerHP: props.initialHP,
    playerMaxHP: props.initialHP,
  };
}

function projectVisibleTile(previousTile: Tile, nextTile: Tile): Tile {
  if (!nextTile.revealed) {
    if (
      previousTile.flag === nextTile.flag &&
      previousTile.hideMonster === nextTile.hideMonster
    ) {
      return previousTile;
    }

    return {
      ...previousTile,
      revealed: false,
      flag: nextTile.flag,
      hideMonster: nextTile.hideMonster,
    };
  }

  if (
    previousTile.revealed === nextTile.revealed &&
    previousTile.flag === nextTile.flag &&
    previousTile.hideMonster === nextTile.hideMonster &&
    previousTile.value === nextTile.value &&
    previousTile.monster === nextTile.monster
  ) {
    return previousTile;
  }

  return {
    ...nextTile,
  };
}

function snapshotVisibleTiles(
  previousVisibleTiles: Tile[][],
  nextGameTiles: Tile[][],
): Tile[][] {
  const nextVisibleTiles = [...previousVisibleTiles];

  for (let y = 0; y < nextGameTiles.length; y++) {
    const previousRow = previousVisibleTiles[y];
    const nextGameRow = nextGameTiles[y];
    let nextVisibleRow = previousRow;

    for (let x = 0; x < nextGameRow.length; x++) {
      const previousTile = previousRow[x];
      const nextTile = nextGameRow[x];
      const visibleTile = projectVisibleTile(previousTile, nextTile);

      if (visibleTile !== previousTile) {
        if (nextVisibleRow === previousRow) {
          nextVisibleRow = [...previousRow];
        }

        nextVisibleRow[x] = visibleTile;
      }
    }

    if (nextVisibleRow !== previousRow) {
      nextVisibleTiles[y] = nextVisibleRow;
    }
  }

  return nextVisibleTiles;
}

export function hasWonGame(gameState: GameState | null): boolean {
  if (!gameState) {
    return false;
  }

  return gameState.totalMonsters.every(
    (monsterCount, monsterLevel) =>
      monsterLevel === 0 ||
      gameState.monstersRevealed[monsterLevel] >= monsterCount,
  );
}

function triggerRevealHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  visibleTiles: [],
  selectedNumber: 0,
  showGameOver: false,
  levelUpEffect: null,
  damageEffect: null,
  initializationProps: null,
  boardGenerated: false,
  gameSessionId: 0,
  elapsedSeconds: 0,
  gameStartedAt: null,
  gameEndedAt: null,

  initGame: (props) => {
    set({
      gameState: createBlankGameState(props),
      visibleTiles: createBlankTiles(props.sizeX, props.sizeY),
      selectedNumber: 0,
      showGameOver: false,
      levelUpEffect: null,
      damageEffect: null,
      initializationProps: props,
      boardGenerated: false,
      gameSessionId: get().gameSessionId + 1,
      elapsedSeconds: 0,
      gameStartedAt: null,
      gameEndedAt: null,
    });
  },

  resetGame: () =>
    set({
      gameState: null,
      visibleTiles: [],
      selectedNumber: 0,
      showGameOver: false,
      levelUpEffect: null,
      damageEffect: null,
      initializationProps: null,
      boardGenerated: false,
      elapsedSeconds: 0,
      gameStartedAt: null,
      gameEndedAt: null,
    }),

  setSelectedNumber: (num) => set({ selectedNumber: num }),

  clearLevelUpEffect: () => set({ levelUpEffect: null }),

  clearDamageEffect: () => set({ damageEffect: null }),

  tickTimer: () =>
    set((state) => ({
      elapsedSeconds: state.elapsedSeconds + 1,
    })),

  handleTilePress: (x, y) => {
    const {
      gameState,
      selectedNumber,
      showGameOver,
      initializationProps,
      boardGenerated,
      visibleTiles,
      gameStartedAt,
      levelUpEffect,
      damageEffect,
    } = get();

    if (
      showGameOver ||
      hasWonGame(gameState) ||
      !gameState ||
      !initializationProps
    ) {
      return;
    }

    const now = Date.now();
    const startedAt = gameStartedAt ?? now;

    const currentTile = gameState.tiles[y]?.[x];
    const shouldTriggerRevealHaptic =
      currentTile !== undefined &&
      !currentTile.revealed &&
      selectedNumber === 0;

    if (!boardGenerated) {
      const gameLogic = new StandardGameMode(undefined, {
        ...initializationProps,
        initialTap: { x, y },
      });

      const previousLevel = gameLogic.gameState.playerLevel;
      const previousHP = gameLogic.gameState.playerHP;
      gameLogic.onPress(x, y, selectedNumber);
      const didWin = hasWonGame(gameLogic.gameState);
      const didLose = gameLogic.gameState.playerHP <= 0;
      const didLevelUp = gameLogic.gameState.playerLevel > previousLevel;
      const didTakeDamage = gameLogic.gameState.playerHP < previousHP;

      set({
        gameState: snapshotGameState(gameLogic.gameState),
        visibleTiles: snapshotVisibleTiles(
          visibleTiles,
          gameLogic.gameState.tiles,
        ),
        selectedNumber: 0,
        showGameOver: didLose,
        levelUpEffect:
          didLevelUp && currentTile?.monster
            ? {
                id: now,
                x,
                y,
                level: gameLogic.gameState.playerLevel,
              }
            : levelUpEffect,
        damageEffect:
          didTakeDamage && currentTile?.monster
            ? {
                id: now,
                x,
                y,
              }
            : damageEffect,
        boardGenerated: true,
        gameStartedAt: startedAt,
        gameEndedAt: didWin || didLose ? now : null,
      });

      if (shouldTriggerRevealHaptic) {
        triggerRevealHaptic();
      }

      return;
    }

    const gameLogic = new StandardGameMode(gameState);
    const previousLevel = gameState.playerLevel;
    const previousHP = gameState.playerHP;
    gameLogic.onPress(x, y, selectedNumber);
    const didWin = hasWonGame(gameLogic.gameState);
    const didLose = gameLogic.gameState.playerHP <= 0;
    const didLevelUp = gameLogic.gameState.playerLevel > previousLevel;
    const didTakeDamage = gameLogic.gameState.playerHP < previousHP;

    set({
      gameState: snapshotGameState(gameLogic.gameState),
      visibleTiles: snapshotVisibleTiles(
        visibleTiles,
        gameLogic.gameState.tiles,
      ),
      selectedNumber: 0,
      showGameOver: didLose,
      levelUpEffect:
        didLevelUp && currentTile?.monster
          ? {
              id: now,
              x,
              y,
              level: gameLogic.gameState.playerLevel,
            }
          : levelUpEffect,
      damageEffect:
        didTakeDamage && currentTile?.monster
          ? {
              id: now,
              x,
              y,
            }
          : damageEffect,
      boardGenerated: true,
      gameStartedAt: startedAt,
      gameEndedAt: didWin || didLose ? now : null,
    });

    if (shouldTriggerRevealHaptic) {
      triggerRevealHaptic();
    }
  },
}));
