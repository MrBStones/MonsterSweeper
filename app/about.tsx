import BottomNumberRow from "@/components/bottom-number-row";
import PinchZoom from "@/components/pinch-zoom";
import Square, { Tile } from "@/components/square";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const createTiles = (gridX: number, gridY: number): Tile[][] =>
  Array.from({ length: gridY }, () =>
    Array.from({ length: gridX }, () => ({
      isRevealed: false,
      flag: 0,
      value: 0,
      hideMonster: false,
      monster: undefined,
    })),
  );

export default function SquareTestScreen() {
  const gridX = 10;
  const gridY = 10;
  const sqSize = 64;

  const containerWidth = sqSize * gridX;

  const [tiles, setTiles] = useState<Tile[][]>(() => createTiles(gridX, gridY));

  const handleTilePress = (rowIndex: number, columnIndex: number) => {
    setTiles((currentTiles) =>
      currentTiles.map((row, currentRowIndex) =>
        row.map((tile, currentColumnIndex) => {
          if (
            currentRowIndex !== rowIndex ||
            currentColumnIndex !== columnIndex
          ) {
            return tile;
          }

          if (!tile.isRevealed) {
            return { ...tile, isRevealed: true };
          }

          if (tile.monster) {
            return { ...tile, hideMonster: !tile.hideMonster };
          }

          return tile;
        }),
      ),
    );
  };

  const [selectedNumber, setSelectedNumber] = useState(0);
  const maxNumber = 9;

  return (
    <View style={styles.container}>
      <PinchZoom style={styles.zoomArea}>
        <View style={[styles.board, { width: containerWidth }]}>
          {tiles.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((tile, columnIndex) => (
                <Square
                  key={`${rowIndex}-${columnIndex}`}
                  isRevealed={tile.isRevealed}
                  flag={tile.flag}
                  monster={tile.monster}
                  value={tile.value}
                  onPress={() => handleTilePress(rowIndex, columnIndex)}
                  hideMonster={tile.hideMonster}
                />
              ))}
            </View>
          ))}
        </View>
      </PinchZoom>
      <BottomNumberRow
        selectedNumber={selectedNumber}
        setSelectedNumber={setSelectedNumber}
        maxNumber={maxNumber}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: "stretch",
  },
  row: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  zoomArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
