import Square, { SquareProps } from "@/components/square";
import { MonsterLevel1 } from "@/constants/monsters";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

type Tile = Omit<SquareProps, "onPress">;

export default function SquareTestScreen() {
  const gridX = 3;
  const gridY = 3;
  const sqSize = 64;

  const containerWidth = sqSize * gridX;

  const [tiles, setTiles] = useState<Tile[]>([
    {
      isRevealed: false,
      flag: 0,
      monster: MonsterLevel1,
      value: 2,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: undefined,
      value: 3,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 1,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: MonsterLevel1,
      value: 3,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: MonsterLevel1,
      value: 3,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: undefined,
      value: 2,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 3,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: MonsterLevel1,
      value: 2,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: undefined,
      value: 2,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: undefined,
      value: 1,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 1,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 1,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
  ]);

  const handleTilePress = (index: number) => {
    setTiles((currentTiles) =>
      currentTiles.map((tile, tileIndex) => {
        if (tileIndex !== index) {
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
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.squareContainer, { width: containerWidth }]}>
        {tiles.map((tile, index) => (
          <Square
            key={index}
            isRevealed={tile.isRevealed}
            flag={tile.flag}
            monster={tile.monster}
            value={tile.value}
            onPress={() => handleTilePress(index)}
            hideMonster={tile.hideMonster}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  squareContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
