import BoardRow from "@/components/board-row";
import BottomNumberRow from "@/components/bottom-number-row";
import MeasureHeight from "@/components/measure-height";
import PinchZoom from "@/components/pinch-zoom";
import TopbarGame from "@/components/topbar-game";
import { StandardGameMode } from "@/game-logic/game-logic";
import { GameModeInterface } from "@/interfaces/gameModeInterface";
import { InintalizationProps } from "@/types/gameModeTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
  const [showGameOver, setShowGameOver] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
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
      if (showGameOver) {
        return;
      }

      gameLogic.onPress(columnIndex, rowIndex, selectedNumberRef.current);
      setSelectedNumber(0);

      if (gameLogic.gameState.playerHP <= 0) {
        setShowGameOver(true);
      }

      forceRender((value) => value + 1);
    },
    [gameLogic, showGameOver],
  );

  return (
    <View style={styles.container}>
      <PinchZoom style={styles.zoomArea} paddingTopExtra={topBarHeight}>
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

      <MeasureHeight setHeight={setTopBarHeight} style={styles.topBarOverlay}>
        <TopbarGame
          playerHP={gameLogic.gameState.playerHP}
          playerMaxHP={gameLogic.gameState.playerMaxHP}
          playerXP={gameLogic.gameState.playerXP}
          playerLevel={gameLogic.gameState.playerLevel}
          nextXP={gameLogic.gameState.nextXP}
        />
      </MeasureHeight>
      <BottomNumberRow
        selectedNumber={selectedNumber}
        setSelectedNumber={setSelectedNumber}
        maxNumber={gameLogic.gameState.maxMonsterLevel}
      />
      <Modal transparent visible={showGameOver} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Game Over</Text>
            <Text style={styles.modalText}>You ran out of health.</Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={() => {
                setShowGameOver(false);
                gameLogicRef.current = new StandardGameMode(
                  undefined,
                  HUGEProps,
                );
                forceRender((value) => value + 1);
              }}
            >
              <Text style={styles.modalButtonText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 12, 14, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#23272d",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    color: "#c8d0d9",
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    alignSelf: "center",
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#00e24b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  modalButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  modalButtonText: {
    color: "#101214",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.2,
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
