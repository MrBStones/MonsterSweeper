import { Monster } from "@/types/monsterTypes";
import { Image, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  isRevealed: boolean;
  flag: number;
  value: number;
  monster: Monster | undefined;
  onPress?: () => void;
};

export default function Square({
  isRevealed,
  flag,
  value,
  monster,
  onPress,
}: Props) {
  let text: string = "";

  if (isRevealed) {
    text = value <= 0 ? "" : value + "";
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
      {isRevealed && monster !== undefined ? (
        <Image source={monster.imgSource} style={styles.monsterImage} />
      ) : (
        <Text style={styles.text}> {text} </Text>
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
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  monsterImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});
