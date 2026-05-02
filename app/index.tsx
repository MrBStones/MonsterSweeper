import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monster Sweeper</Text>
      <Link
        href={{ pathname: "/game", params: { mode: "easy" } }}
        style={styles.button}
      >
        EASY
      </Link>
      <Link
        href={{ pathname: "/game", params: { mode: "normal" } }}
        style={styles.button}
      >
        NORMAL
      </Link>
      <Link
        href={{ pathname: "/game", params: { mode: "huge" } }}
        style={styles.button}
      >
        HUGE
      </Link>
      <Link
        href={{ pathname: "/game", params: { mode: "blind" } }}
        style={styles.button}
      >
        BLIND
      </Link>
      <Link
        href={{ pathname: "/game", params: { mode: "extreme" } }}
        style={styles.button}
      >
        EXTREME
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 2,
  },
  button: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#00789E", // slightly brighter blue
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: 220,
    textAlign: "center",
    overflow: "hidden",
    elevation: 3, // for android shadow
  },
});
