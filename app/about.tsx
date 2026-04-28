import BoardRow from "@/components/board-row";
import BottomNumberRow from "@/components/bottom-number-row";
import PinchZoom from "@/components/pinch-zoom";
import TopbarGame from "@/components/topbar-game";
import { StandardGameMode } from "@/game-logic/game-logic";
import { GameModeInterface } from "@/interfaces/gameModeInterface";
import { InintalizationProps } from "@/types/gameModeTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SquareTestScreen() {
  const gridW = 25;
  const sqSize = 64;

  const containerWidth = sqSize * gridW;
  const HUGEProps: InintalizationProps = {
    sizeX: 25,
    sizeY: 50,
    initialHP: 30,
    initialTap: { x: 0, y: 0 },
    monsters: [0, 52, 46, 40, 36, 30, 24, 18, 13, 1],
  };
  const SMALLProps: InintalizationProps = {
    sizeX: 10,
    sizeY: 10,
    initialHP: 30,
    initialTap: { x: 0, y: 0 },
    monsters: [0, 3, 3, 3, 3, 1],
  };
  const [selectedNumber, setSelectedNumber] = useState(0);
  const maxNumber = 9;
  const gameLogicRef = useRef<GameModeInterface | null>(null);
  const selectedNumberRef = useRef(selectedNumber);

  useEffect(() => {
    selectedNumberRef.current = selectedNumber;
  }, [selectedNumber]);

  if (!gameLogicRef.current) {
    gameLogicRef.current = new StandardGameMode(undefined, HUGEProps);
  }

  const gameLogic = gameLogicRef.current;
  const [, forceRender] = useState(0);

  const handleTilePress = useCallback(
    (rowIndex: number, columnIndex: number) => {
      gameLogic.onPress(columnIndex, rowIndex, selectedNumberRef.current);
      setSelectedNumber(0);
      forceRender((value) => value + 1);
    },
    [gameLogic],
  );

  return (
    <View style={styles.container}>
      <PinchZoom style={styles.zoomArea}>
        <View style={[styles.board, { width: containerWidth }]}>
          {gameLogic.gameState.tiles.map((row, rowIndex) => (
            <BoardRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onTilePress={handleTilePress}
            />
          ))}
        </View>
      </PinchZoom>

      <View style={styles.topBarOverlay}>
        <TopbarGame
          playerHP={gameLogic.gameState.playerHP}
          playerMaxHP={gameLogic.gameState.playerMaxHP}
          playerXP={gameLogic.gameState.playerXP}
          playerLevel={gameLogic.gameState.playerLevel}
          nextXP={gameLogic.gameState.nextXP}
        />
      </View>
      <BottomNumberRow
        selectedNumber={selectedNumber}
        setSelectedNumber={setSelectedNumber}
        maxNumber={gameLogic.gameState.maxMonsterLevel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: "stretch",
  },
  container: {
    flex: 1,
    backgroundColor: "#2a2a2a",
  },
  zoomArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
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
