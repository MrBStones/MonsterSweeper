import Square from "@/components/square";
import { Monster } from "@/types/monsterTypes";
import { StyleSheet, View } from "react-native";

const PlaceholderImage = require("@/assets/images/react-logo.png");

export default function SquareTestScreen() {
  const monster: Monster = {
    value: 1,
    imgSource: PlaceholderImage,
  };

  const gridX = 3;
  const gridY = 3;
  const sqSize = 64;

  const containerWidth = sqSize * gridX;

  return (
    <View style={styles.container}>
      <View style={[styles.squareContainer, { width: containerWidth }]}>
        <Square isRevealed={false} flag={0} monster={monster} value={0} />
        <Square isRevealed={true} flag={0} monster={undefined} value={0} />
        <Square isRevealed={false} flag={1} monster={monster} value={0} />
        <Square isRevealed={true} flag={123} monster={monster} value={10} />
        <Square isRevealed={false} flag={0} monster={monster} value={0} />
        <Square isRevealed={true} flag={0} monster={undefined} value={0} />
        <Square isRevealed={false} flag={1} monster={monster} value={0} />
        <Square isRevealed={true} flag={123} monster={monster} value={10} />
        <Square isRevealed={true} flag={123} monster={monster} value={10} />
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
