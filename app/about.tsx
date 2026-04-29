import BoardRow from "@/components/board-row";
import BottomNumberRow from "@/components/bottom-number-row";
import MeasureHeight from "@/components/measure-height";
import PinchZoom from "@/components/pinch-zoom";
import TopbarGame from "@/components/topbar-game";
import { useGameStore } from "@/store/gameStore";
import { InintalizationProps } from "@/types/gameModeTypes";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import * as NavigationBar from "expo-navigation-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HUGEProps: InintalizationProps = {
  sizeX: 25,
  sizeY: 50,
  initialHP: 30,
  initialTap: { x: 0, y: 0 },
  monsters: [0, 52, 46, 40, 36, 30, 24, 18, 13, 1],
};

const TILE_STRIDE = 64;
const PICKER_GAP = 12;
const PICKER_WIDTH = 48;
const PICKER_ITEM_HEIGHT = 36;
const PICKER_ITEM_GAP = 8;

type HoldPickerState = {
  rowIndex: number;
  columnIndex: number;
  side: "left" | "right";
  selectedNumber: number | null;
};

export default function SquareTestScreen() {
  const gridW = 25;
  const sqSize = 64;

  const containerWidth = sqSize * gridW;
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [holdPickerState, setHoldPickerState] = useState<HoldPickerState | null>(null);
  const gameState = useGameStore((state) => state.gameState);
  const showGameOver = useGameStore((state) => state.showGameOver);
  const initGame = useGameStore((state) => state.initGame);
  const handleTilePress = useGameStore((state) => state.handleTilePress);
  const setSelectedNumber = useGameStore((state) => state.setSelectedNumber);
  const boardGenerated = useGameStore((state) => state.boardGenerated);
  const gameSessionId = useGameStore((state) => state.gameSessionId);
  const holdPickerStateRef = useRef<HoldPickerState | null>(null);

  useEffect(() => {
    holdPickerStateRef.current = holdPickerState;
  }, [holdPickerState]);

  const pickerOptions = useMemo(
    () =>
      Array.from(
        { length: gameState?.maxMonsterLevel ?? 0 },
        (_, index) => index + 1,
      ),
    [gameState?.maxMonsterLevel],
  );

  const pickerHeight = useMemo(
    () =>
      pickerOptions.length === 0
        ? 0
        : pickerOptions.length * PICKER_ITEM_HEIGHT +
          (pickerOptions.length - 1) * PICKER_ITEM_GAP,
    [pickerOptions.length],
  );

  const resolvePickerSelection = useCallback(
    (
      rowIndex: number,
      columnIndex: number,
      side: HoldPickerState["side"],
      localX: number,
      localY: number,
    ) => {
      const pickerLeft =
        side === "right"
          ? TILE_STRIDE + PICKER_GAP
          : -(PICKER_GAP + PICKER_WIDTH);
      const pickerTop = (TILE_STRIDE - pickerHeight) / 2;

      // localX and localY are from the tile's own coordinate space
      if (
        localX < pickerLeft ||
        localX > pickerLeft + PICKER_WIDTH ||
        localY < pickerTop ||
        localY > pickerTop + pickerHeight
      ) {
        return null;
      }

      const rowHeight = PICKER_ITEM_HEIGHT + PICKER_ITEM_GAP;
      const nextIndex = Math.floor((localY - pickerTop) / rowHeight);

      if (nextIndex < 0 || nextIndex >= pickerOptions.length) {
        return null;
      }

      return pickerOptions[nextIndex] ?? null;
    },
    [pickerHeight, pickerOptions],
  );

  const handleSquarePress = useCallback(
    (x: number, y: number) => {
      if (holdPickerStateRef.current) {
        return;
      }

      handleTilePress(x, y);
    },
    [handleTilePress],
  );

  const handleHoldStart = useCallback(
    (x: number, y: number) => {
      if (!boardGenerated || !gameState) {
        return;
      }

      const tile = gameState.tiles[y]?.[x];

      if (!tile || tile.revealed || pickerOptions.length === 0) {
        return;
      }

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const side: HoldPickerState["side"] = x >= gridW - 4 ? "left" : "right";

      const nextState: HoldPickerState = {
        rowIndex: y,
        columnIndex: x,
        side,
        selectedNumber: null,
      };

      holdPickerStateRef.current = nextState;
      setHoldPickerState(nextState);
    },
    [boardGenerated, gameState, gridW, pickerOptions.length],
  );

  const handleHoldMove = useCallback(
    (x: number, y: number, localX: number, localY: number) => {
      setHoldPickerState((currentState) => {
        if (
          !currentState ||
          currentState.rowIndex !== y ||
          currentState.columnIndex !== x
        ) {
          return currentState;
        }

        const nextSelectedNumber = resolvePickerSelection(
          currentState.rowIndex,
          currentState.columnIndex,
          currentState.side,
          localX,
          localY,
        );

        if (nextSelectedNumber === currentState.selectedNumber) {
          return currentState;
        }

        return {
          ...currentState,
          selectedNumber: nextSelectedNumber,
        };
      });
    },
    [resolvePickerSelection],
  );

  const handleHoldEnd = useCallback(
    (x: number, y: number) => {
      const currentState = holdPickerStateRef.current;

      if (
        !currentState ||
        currentState.rowIndex !== y ||
        currentState.columnIndex !== x
      ) {
        return;
      }

      holdPickerStateRef.current = null;
      setHoldPickerState(null);

      if (currentState.selectedNumber === null) {
        return;
      }

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedNumber(currentState.selectedNumber);
      handleTilePress(x, y);
    },
    [handleTilePress, setSelectedNumber],
  );

  const pickerPosition = useMemo(() => {
    if (!holdPickerState) {
      return null;
    }

    const left =
      holdPickerState.columnIndex * TILE_STRIDE +
      (holdPickerState.side === "right"
        ? TILE_STRIDE + PICKER_GAP
        : -(PICKER_GAP + PICKER_WIDTH));

    const top =
      holdPickerState.rowIndex * TILE_STRIDE + (TILE_STRIDE - pickerHeight) / 2;

    return {
      left,
      top,
      height: pickerHeight,
    };
  }, [holdPickerState, pickerHeight]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") {
        return;
      }

      void NavigationBar.setBehaviorAsync("overlay-swipe");
      void NavigationBar.setVisibilityAsync("hidden");
      StatusBar.setHidden(true, "fade");

      return () => {
        void NavigationBar.setVisibilityAsync("visible");
        StatusBar.setHidden(false, "fade");
      };
    }, []),
  );

  useEffect(() => {
    initGame(HUGEProps);
  }, [initGame]);

  if (!gameState) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <PinchZoom
        style={styles.zoomArea}
        paddingTopExtra={topBarHeight}
        disableSingleFingerPan={holdPickerState !== null}
      >
        <View style={[styles.board, { width: containerWidth }]}>
          {gameState.tiles.map((row, rowIndex) => (
            <BoardRow
              key={`${gameSessionId}-${rowIndex}`}
              row={row}
              rowIndex={rowIndex}
              gameSessionId={gameSessionId}
              onTilePress={handleSquarePress}
              onTileLongPressStart={handleHoldStart}
              onTileLongPressMove={handleHoldMove}
              onTileLongPressEnd={handleHoldEnd}
            />
          ))}

          {pickerPosition && holdPickerState ? (
            <View
              pointerEvents="none"
              style={[
                styles.holdPicker,
                {
                  left: pickerPosition.left,
                  top: pickerPosition.top,
                  height: pickerPosition.height,
                },
              ]}
            >
              {pickerOptions.map((number, index) => {
                const isSelected = number === holdPickerState.selectedNumber;

                return (
                  <View
                    key={number}
                    style={[
                      styles.holdPickerItem,
                      {
                        top: index * (PICKER_ITEM_HEIGHT + PICKER_ITEM_GAP),
                        height: PICKER_ITEM_HEIGHT,
                      },
                      isSelected && styles.holdPickerItemSelected,
                    ]}
                  >
                    <Text
                      selectable={false}
                      style={[
                        styles.holdPickerText,
                        isSelected && styles.holdPickerTextSelected,
                      ]}
                    >
                      {number}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </PinchZoom>

      <MeasureHeight setHeight={setTopBarHeight} style={styles.topBarOverlay}>
        <TopbarGame />
      </MeasureHeight>
      <BottomNumberRow maxNumber={gameState.maxMonsterLevel} />
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
                initGame(HUGEProps);
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
    position: "relative",
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
  holdPicker: {
    position: "absolute",
    width: PICKER_WIDTH,
    zIndex: 20,
    elevation: 20,
  },
  holdPickerItem: {
    position: "absolute",
    left: 0,
    width: PICKER_WIDTH,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(35, 39, 45, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 5,
  },
  holdPickerItemSelected: {
    backgroundColor: "#00e24b",
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  holdPickerText: {
    color: "#edf1f6",
    fontSize: 18,
    fontWeight: "800",
  },
  holdPickerTextSelected: {
    color: "#101214",
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
