import BoardRow from "@/components/board-row";
import BottomNumberRow from "@/components/bottom-number-row";
import GameOverModal from "@/components/game-over-modal";
import MeasureHeight from "@/components/measure-height";
import PinchZoom from "@/components/pinch-zoom";
import TopbarGame from "@/components/topbar-game";
import { useGameStore } from "@/store/gameStore";
import { GameInitializationProps } from "@/types/gameModeTypes";
import { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

const Board = memo(({ containerWidth }: { containerWidth: number }) => {
  const tiles = useGameStore((state) => state.gameState?.tiles);
  const handleTilePress = useGameStore((state) => state.handleTilePress);
  const gameSessionId = useGameStore((state) => state.gameSessionId);

  if (!tiles) return null;

  return (
    <View style={[styles.board, { width: containerWidth }]}>
      {tiles.map((row, rowIndex) => (
        <BoardRow
          key={`${gameSessionId}-${rowIndex}`}
          row={row}
          rowIndex={rowIndex}
          gameSessionId={gameSessionId}
          onTilePress={handleTilePress}
        />
      ))}
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
  const [topBarHeight, setTopBarHeight] = useState(0);
  const initGame = useGameStore((state) => state.initGame);
  const gameSessionId = useGameStore((state) => state.gameSessionId);
  const showGameOver = useGameStore((state) => state.showGameOver);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const isReady = useGameStore((state) => state.gameState !== null);

  useEffect(() => {
    initGame(mode);
  }, [initGame, mode]);

  useEffect(() => {
    if (!isReady || showGameOver) {
      return;
    }

    const intervalId = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameSessionId, isReady, showGameOver, tickTimer]);

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
      <BottomNumberRow />
      <GameOverModal mode={mode} />
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
});
