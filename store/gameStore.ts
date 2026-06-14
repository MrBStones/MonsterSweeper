import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { StandardGameMode } from "@/game-logic/game-logic";
import {
  GameInitializationProps,
  GameState,
  Tile,
} from "@/types/gameModeTypes";

export type AppOptions = {
  longPressDelay: number;
};

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
  isPanningDisabled: boolean;
  activeLongPressTile: { x: number; y: number } | null;
  boardScale: number;
  longPressPageCoords: { pageX: number; pageY: number } | null;
  hoveredFlagNumber: number | null;
  topBarHeight: number;
  bottomBarHeight: number;
  options: AppOptions;
  initGame: (props: GameInitializationProps) => void;
  resetGame: () => void;
  setSelectedNumber: (num: number) => void;
  clearLevelUpEffect: () => void;
  clearDamageEffect: () => void;
  tickTimer: () => void;
  handleTilePress: (x: number, y: number) => void;
  handleTileLongPress: (x: number, y: number, flag?: number) => void;
  setIsPanningDisabled: (disabled: boolean) => void;
  setActiveLongPressTile: (tile: { x: number; y: number } | null) => void;
  setBoardScale: (scale: number) => void;
  setLongPressPageCoords: (coords: { pageX: number; pageY: number } | null) => void;
  setHoveredFlagNumber: (num: number | null) => void;
  setTopBarHeight: (height: number) => void;
  setBottomBarHeight: (height: number) => void;
  setLongPressDelay: (delay: number) => void;
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

const triggerRevealHaptic = () => {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// Safe persistent storage adapter that falls back to localStorage on Web,
// and to a simple memory storage if AsyncStorage's native modules are not loaded/linked.
const memoryStorage = new Map<string, string>();
let isStorageHealthy = true;

const safeStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(name);
      }
    }
    if (!isStorageHealthy) {
      return memoryStorage.get(name) || null;
    }
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      if (isStorageHealthy) {
        isStorageHealthy = false;
        console.warn(
          "AsyncStorage is not available (native modules might not be linked). Falling back to memory storage.",
        );
      }
      return memoryStorage.get(name) || null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(name, value);
        return;
      }
    }
    if (!isStorageHealthy) {
      memoryStorage.set(name, value);
      return;
    }
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      if (isStorageHealthy) {
        isStorageHealthy = false;
        console.warn(
          "AsyncStorage is not available (native modules might not be linked). Falling back to memory storage.",
        );
      }
      memoryStorage.set(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(name);
        return;
      }
    }
    if (!isStorageHealthy) {
      memoryStorage.delete(name);
      return;
    }
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      if (isStorageHealthy) {
        isStorageHealthy = false;
        console.warn(
          "AsyncStorage is not available (native modules might not be linked). Falling back to memory storage.",
        );
      }
      memoryStorage.delete(name);
    }
  },
};

export const useGameStore = create<GameStore>()(persist((set, get) => ({
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
  isPanningDisabled: false,
  activeLongPressTile: null,
  boardScale: 1,
  longPressPageCoords: null,
  hoveredFlagNumber: null,
  topBarHeight: 0,
  bottomBarHeight: 0,
  options: {
    longPressDelay: 150,
  },

  setIsPanningDisabled: (disabled) => set({ isPanningDisabled: disabled }),
  setActiveLongPressTile: (tile) => set({ activeLongPressTile: tile }),
  setBoardScale: (scale) => set({ boardScale: scale }),
  setLongPressPageCoords: (coords) => set({ longPressPageCoords: coords }),
  setHoveredFlagNumber: (num) => set({ hoveredFlagNumber: num }),
  setTopBarHeight: (height) => set({ topBarHeight: height }),
  setBottomBarHeight: (height) => set({ bottomBarHeight: height }),
  setLongPressDelay: (delay) =>
    set((state) => ({
      options: {
        ...state.options,
        longPressDelay: delay,
      },
    })),

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
      isPanningDisabled: false,
      activeLongPressTile: null,
      boardScale: 1,
      longPressPageCoords: null,
      hoveredFlagNumber: null,
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
      isPanningDisabled: false,
      activeLongPressTile: null,
      boardScale: 1,
      longPressPageCoords: null,
      hoveredFlagNumber: null,
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
    const didLevelUp = gameState.playerLevel > previousLevel;
    const didTakeDamage = gameState.playerHP < previousHP;

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

  handleTileLongPress: (x, y, flag) => {
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
    if (currentTile?.revealed) {
      return;
    }

    if (flag === 0) {
      if (currentTile) {
        const nextTiles = [...gameState.tiles];
        const nextRow = [...nextTiles[y]];
        nextRow[x] = {
          ...currentTile,
          flag: 0,
        };
        nextTiles[y] = nextRow;

        set({
          gameState: {
            ...gameState,
            tiles: nextTiles,
          },
          visibleTiles: snapshotVisibleTiles(
            visibleTiles,
            nextTiles,
          ),
        });

        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }
    }

    const flagToUse = flag !== undefined ? flag : (selectedNumber > 0 ? selectedNumber : Math.max(1, gameState.playerLevel));

    if (!boardGenerated) {
      const gameLogic = new StandardGameMode(undefined, {
        ...initializationProps,
        initialTap: { x, y },
      });

      const previousLevel = gameLogic.gameState.playerLevel;
      const previousHP = gameLogic.gameState.playerHP;
      gameLogic.onPress(x, y, flagToUse);
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

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    const gameLogic = new StandardGameMode(gameState);
    const previousLevel = gameState.playerLevel;
    const previousHP = gameState.playerHP;
    gameLogic.onPress(x, y, flagToUse);
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

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
}), {
  name: "monster-sweeper-storage",
  storage: createJSONStorage(() => safeStorage),
  partialize: (state) => ({
    options: state.options,
  }),
}));
