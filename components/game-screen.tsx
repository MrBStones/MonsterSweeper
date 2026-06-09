import BoardRow from "@/components/board-row";
import BottomNumberRow from "@/components/bottom-number-row";
import DamageEffect from "@/components/damage-effect";
import GameOverModal from "@/components/game-over-modal";
import MeasureHeight from "@/components/measure-height";
import PinchZoom from "@/components/pinch-zoom";
import TopbarGame from "@/components/topbar-game";
import { hasWonGame, useGameStore } from "@/store/gameStore";
import { GameInitializationProps } from "@/types/gameModeTypes";
import { memo, useEffect, useState, SetStateAction } from "react";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LevelUpEffect from "./level-up-effect";

import { colors, radii, typography } from "@/constants/theme";



const Board = memo(({ containerWidth }: { containerWidth: number }) => {
  const tiles = useGameStore((state) => state.visibleTiles);
  const handleTilePress = useGameStore((state) => state.handleTilePress);
  const handleTileLongPress = useGameStore((state) => state.handleTileLongPress);
  const gameSessionId = useGameStore((state) => state.gameSessionId);
  const levelUpEffect = useGameStore((state) => state.levelUpEffect);
  const clearLevelUpEffect = useGameStore((state) => state.clearLevelUpEffect);
  const damageEffect = useGameStore((state) => state.damageEffect);
  const clearDamageEffect = useGameStore((state) => state.clearDamageEffect);

  return (
    <View style={[styles.board, { width: containerWidth }]}>
      {tiles.map((row, rowIndex) => (
        <BoardRow
          key={`${gameSessionId}-${rowIndex}`}
          row={row}
          rowIndex={rowIndex}
          gameSessionId={gameSessionId}
          onTilePress={handleTilePress}
          onTileLongPress={handleTileLongPress}
        />
      ))}
      {levelUpEffect ? (
        <LevelUpEffect
          key={`level-up-${levelUpEffect.id}`}
          effect={levelUpEffect}
          onFinished={clearLevelUpEffect}
        />
      ) : null}
      {damageEffect ? (
        <DamageEffect
          key={`damage-${damageEffect.id}`}
          effect={damageEffect}
          onFinished={clearDamageEffect}
        />
      ) : null}
    </View>
  );
});

Board.displayName = "Board";

type GameScreenProps = {
  mode: GameInitializationProps;
};

export default function GameScreen({ mode }: GameScreenProps) {
  const gridW = mode.sizeX;
  const sqSize = 64;

  const containerWidth = sqSize * gridW;
  const topBarHeight = useGameStore((state) => state.topBarHeight);
  const setTopBarHeightStore = useGameStore((state) => state.setTopBarHeight);
  const setBottomBarHeightStore = useGameStore((state) => state.setBottomBarHeight);
  const initGame = useGameStore((state) => state.initGame);
  const gameSessionId = useGameStore((state) => state.gameSessionId);
  const showGameOver = useGameStore((state) => state.showGameOver);
  const isGameWon = useGameStore((state) => hasWonGame(state.gameState));
  const gameStartedAt = useGameStore((state) => state.gameStartedAt);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const isReady = useGameStore((state) => state.gameState !== null);

  const activeLongPressTile = useGameStore((state) => state.activeLongPressTile);
  const longPressPageCoords = useGameStore((state) => state.longPressPageCoords);
  const hoveredFlagNumber = useGameStore((state) => state.hoveredFlagNumber);

  const setTopBarHeight = (value: SetStateAction<number>) => {
    if (typeof value === "function") {
      setTopBarHeightStore(value(useGameStore.getState().topBarHeight));
    } else {
      setTopBarHeightStore(value);
    }
  };

  const setBottomBarHeight = (value: SetStateAction<number>) => {
    if (typeof value === "function") {
      setBottomBarHeightStore(value(useGameStore.getState().bottomBarHeight));
    } else {
      setBottomBarHeightStore(value);
    }
  };


  useEffect(() => {
    initGame(mode);
  }, [initGame, mode]);

  useEffect(() => {
    if (!isReady || showGameOver || isGameWon || gameStartedAt === null) {
      return;
    }

    const intervalId = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    gameSessionId,
    gameStartedAt,
    isReady,
    isGameWon,
    showGameOver,
    tickTimer,
  ]);

  if (!isReady) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <PinchZoom style={styles.zoomArea} paddingTopExtra={topBarHeight}>
        <Board containerWidth={containerWidth} />
      </PinchZoom>

      <MeasureHeight setHeight={setTopBarHeight} style={styles.topBarOverlay}>
        <TopbarGame />
      </MeasureHeight>
      <MeasureHeight setHeight={setBottomBarHeight}>
        <BottomNumberRow />
      </MeasureHeight>
      <GameOverModal mode={mode} />

      {activeLongPressTile !== null && longPressPageCoords !== null && (
        <LongPressMenu
          coords={longPressPageCoords}
          maxNumber={mode.monsters.length - 1}
          hoveredFlagNumber={hoveredFlagNumber}
        />
      )}
    </View>
  );
}

type LongPressMenuProps = {
  coords: { pageX: number; pageY: number };
  maxNumber: number;
  hoveredFlagNumber: number | null;
};

function LongPressMenu({ coords, maxNumber, hoveredFlagNumber }: LongPressMenuProps) {
  const { height: screenHeight } = useWindowDimensions();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const topBarHeight = useGameStore((state) => state.topBarHeight);
  const bottomBarHeight = useGameStore((state) => state.bottomBarHeight);

  const numbers = Array.from(
    { length: Math.max(0, maxNumber) },
    (_, index) => index + 1,
  );
  const options = [0, ...numbers];
  const N = options.length;
  const menuHeight = N * 36 + (N - 1) * 4 + 8; // buttons + gaps + padding

  // Position it centered vertically, and horizontally either on the left or right of the touch depending on screen edge collision
  const isTooCloseToLeft = coords.pageX < 90;
  const menuLeft = isTooCloseToLeft ? coords.pageX + 16 : coords.pageX - 52;

  // Clamp vertical position inside screen safe areas and top/bottom bar heights
  const originalMenuTop = coords.pageY - menuHeight / 2;
  const minY = Math.max(safeTop + 8, topBarHeight + 8);
  const maxY = Math.min(
    screenHeight - safeBottom - 8 - menuHeight,
    screenHeight - bottomBarHeight - 8 - menuHeight,
  );
  const menuTop = Math.min(Math.max(originalMenuTop, minY), maxY);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.globalMenuContainer,
        {
          left: menuLeft,
          top: menuTop,
          height: menuHeight,
        },
      ]}
    >
      {options.map((val) => {
        const isHovered = hoveredFlagNumber === val;
        const displayLabel = val === 0 ? "X" : val + "";
        return (
          <View
            key={val}
            style={[
              styles.globalMenuButton,
              isHovered && styles.globalMenuButtonHovered,
            ]}
          >
            <Text
              style={[
                styles.globalMenuText,
                isHovered && styles.globalMenuTextHovered,
              ]}
            >
              {displayLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: "stretch",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  zoomArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  globalMenuContainer: {
    position: "absolute",
    flexDirection: "column",
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 4,
    gap: 4,
    alignItems: "center",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  globalMenuButton: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  globalMenuButtonHovered: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  globalMenuText: {
    color: colors.text,
    fontSize: 14,
    ...typography.labelMono,
  },
  globalMenuTextHovered: {
    color: colors.primaryDark,
    fontWeight: "bold",
  },
});
