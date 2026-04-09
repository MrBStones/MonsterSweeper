import Square from "@/components/square";
import { Monster } from "@/types/monsterTypes";
import { StyleSheet, View } from "react-native";

const PlaceholderImage = require("@/assets/images/react-logo.png");

export default function AboutScreen() {
  const monster: Monster = {
    value: 1,
    imgSource: PlaceholderImage,
  };
  return (
    <View style={styles.container}>
      <Square isRevealed={false} flag={0} monster={monster} value={0} />
      <Square isRevealed={true} flag={0} monster={undefined} value={0} />
      <Square isRevealed={false} flag={1} monster={monster} value={0} />
      <Square isRevealed={true} flag={123} monster={monster} value={10} />
    </View>
  );
}

const styles = StyleSheet.create({
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
