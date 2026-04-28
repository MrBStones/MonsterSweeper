import { Tile } from "@/types/gameModeTypes";
import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type SquareProps = Tile & {
  rowIndex: number;
  columnIndex: number;
  onTilePress?: (x: number, y: number) => void;
};

function Square({
  rowIndex,
  columnIndex,
  onTilePress,
  revealed,
  flag,
  value,
  hideMonster = false,
  monster,
}: SquareProps) {
  let text = "";

  if (revealed) {
    text = value <= 0 && !hideMonster ? "" : value + "";
  } else {
    text = flag <= 0 ? "" : flag + "";
  }

  return (
    <Pressable onPress={() => onTilePress?.(columnIndex, rowIndex)}>
      <View
        style={[
          styles.container,
          revealed ? styles.revealed : styles.notRevealed,
        ]}
      >
        {revealed && monster !== undefined && !hideMonster ? (
          <Image source={monster.imgSource} style={styles.monsterImage} />
        ) : (
          <Text
            selectable={false}
            style={
              revealed && hideMonster && monster !== undefined
                ? styles.numMonsterHidden
                : styles.num
            }
          >
            {text}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default memo(
  Square,
  (previousProps, nextProps) =>
    previousProps.rowIndex === nextProps.rowIndex &&
    previousProps.columnIndex === nextProps.columnIndex &&
    previousProps.onTilePress === nextProps.onTilePress &&
    previousProps.revealed === nextProps.revealed &&
    previousProps.flag === nextProps.flag &&
    previousProps.value === nextProps.value &&
    previousProps.hideMonster === nextProps.hideMonster &&
    previousProps.monster === nextProps.monster,
);

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: 2,
  },
  revealed: {
    backgroundColor: "#0e0e0e",
  },
  notRevealed: {
    borderColor: "#505050",
    borderWidth: 1,
    backgroundColor: "#393939",
  },
  num: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  numMonsterHidden: {
    color: "#00e24b",
    fontWeight: "bold",
    fontSize: 24,
  },
  monsterImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});
