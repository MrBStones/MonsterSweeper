import { Tile } from "@/types/gameModeTypes";
import { memo } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

type SquareProps = Tile & {
  onPress?: () => void;
};

function Square({
  revealed,
  flag,
  value,
  hideMonster = false,
  monster,
  onPress,
}: SquareProps) {
  let text: string = "";

  if (revealed) {
    text = value <= 0 && !hideMonster ? "" : value + "";
  } else {
    text = flag <= 0 ? "" : flag + "";
  }

  return (
    <Pressable
      onPress={onPress}
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
    </Pressable>
  );
}

export default memo(
  Square,
  (previousProps, nextProps) =>
    previousProps.revealed === nextProps.revealed &&
    previousProps.flag === nextProps.flag &&
    previousProps.value === nextProps.value &&
    previousProps.hideMonster === nextProps.hideMonster &&
    previousProps.monster === nextProps.monster,
);

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderWidth: 5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  revealed: {
    backgroundColor: "#000",
  },
  notRevealed: { backgroundColor: "#464646" },
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
