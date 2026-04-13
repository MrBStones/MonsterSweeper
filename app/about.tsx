import BottomNumberRow from "@/components/bottom-number-row";
import PinchZoom from "@/components/pinch-zoom";
import Square from "@/components/square";
import { StandardGameMode } from "@/game-logic/game-logic";
import { GameModeInterface } from "@/interfaces/gameModeInterface";
import { InintalizationProps } from "@/types/gameModeTypes";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SquareTestScreen() {
  const gridX = 25;
  const gridY = 60;
  const sqSize = 64;

  const containerWidth = sqSize * gridX;
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
  const gameLogicRef = useRef<GameModeInterface | null>(null);

  if (!gameLogicRef.current) {
    gameLogicRef.current = new StandardGameMode(undefined, HUGEProps);
  }

  const gameLogic = gameLogicRef.current;
  const [, forceRender] = useState(0);

  const handleTilePress = (rowIndex: number, columnIndex: number) => {
    gameLogic.onPress(columnIndex, rowIndex);
    forceRender((value) => value + 1);
  };

  const [selectedNumber, setSelectedNumber] = useState(0);
  const maxNumber = 9;

  return (
    <View style={styles.container}>
      <PinchZoom style={styles.zoomArea}>
        <View style={[styles.board, { width: containerWidth }]}>
          {gameLogic.gameState.tiles.map((row, rowIndex) => (
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
