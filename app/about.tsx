import Square, { SquareProps } from "@/components/square";
import { Monster } from "@/types/monsterTypes";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const PlaceholderImage = require("@/assets/images/react-logo.png");

type Tile = Omit<SquareProps, "onPress">;

export default function SquareTestScreen() {
  const monster: Monster = {
    value: 1,
    imgSource: PlaceholderImage,
  };

  const gridX = 3;
  const gridY = 3;
  const sqSize = 64;

  const containerWidth = sqSize * gridX;

  const [tiles, setTiles] = useState<Tile[]>([
    {
      isRevealed: false,
      flag: 0,
      monster,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 1,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 123,
      monster,
      value: 10,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 0,
      monster,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 0,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: false,
      flag: 1,
      monster: undefined,
      value: 0,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 123,
      monster,
      value: 10,
      hideMonster: false,
    },
    {
      isRevealed: true,
      flag: 123,
      monster: undefined,
      value: 10,
      hideMonster: false,
    },
  ]);

  const handleTilePress = (index: number) => {
    setTiles((currentTiles) =>
      currentTiles.map((tile, tileIndex) =>
        tileIndex === index
          ? tile.isRevealed
            ? tile.monster
              ? tile.hideMonster
                ? { ...tile, hideMonster: false }
                : { ...tile, hideMonster: true }
              : tile
            : { ...tile, isRevealed: true }
          : tile,
      ),
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
