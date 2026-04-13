import BottomNumberRow from "@/components/bottom-number-row";
import PinchZoom from "@/components/pinch-zoom";
import Square from "@/components/square";
import { StandardGameMode } from "@/game-logic/game-logic";
import { GameModeInterface } from "@/interfaces/gameModeInterface";
import { Tile } from "@/types/gameModeTypes";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const createTiles = (gridX: number, gridY: number): Tile[][] =>
  Array.from({ length: gridY }, () =>
    Array.from({ length: gridX }, () => ({
      revealed: false,
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
  const gameLogic: GameModeInterface = new StandardGameMode(undefined, {
    sizeX: 10,
    sizeY: 10,
    initialHP: 30,
    initialTap: { x: 0, y: 0 },
    monsters: [0, 3, 3, 3, 3, 1],
  });

  const [tiles, setTiles] = useState<Tile[][]>(() => gameLogic.gameState.tiles);

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

          if (!tile.revealed) {
            return { ...tile, revealed: true };
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
                  revealed={tile.revealed}
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
        maxNumber={gameLogic.gameState.maxMonsterLevel}
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
