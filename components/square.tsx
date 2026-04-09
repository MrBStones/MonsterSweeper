import { Monster } from "@/types/monsterType";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export type SquareProps = {
  isRevealed: boolean;
  flag: number;
  value: number;
  hideMonster: boolean;
  monster: Monster | undefined;
  onPress?: () => void;
};

export default function Square({
  isRevealed,
  flag,
  value,
  hideMonster = false,
  monster,
  onPress,
}: SquareProps) {
  let text: string = "";

  if (isRevealed) {
    text = value <= 0 && !hideMonster ? "" : value + "";
  } else {
    text = flag <= 0 ? "" : flag + "";
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        isRevealed ? styles.revealed : styles.notRevealed,
      ]}
    >
      {isRevealed && monster !== undefined && !hideMonster ? (
        <Image source={monster.imgSource} style={styles.monsterImage} />
      ) : (
        <Text
          selectable={false}
          style={
            isRevealed && hideMonster && monster !== undefined
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
