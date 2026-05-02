import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.background}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Monster</Text>
          <Text style={styles.title}>Sweeper</Text>
        </View>
        <Link
          href={{ pathname: "/game", params: { mode: "easy" } }}
          style={styles.playButton}
        >
          <View style={styles.playButtonContent}>
            <Entypo name="controller-play" size={48} color="#01285c" />
            <Text style={styles.playButtonText}>PLAY</Text>
            <Text style={styles.playButtonSubText}>Continue Run</Text>
          </View>
        </Link>
        <View style={styles.cardContainer}>
          <Text style={styles.cardText}>Card lmao</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
  },
  button: {
    color: "#01285c",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#488dff", // slightly brighter blue
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: 220,
    textAlign: "center",
    overflow: "hidden",
    elevation: 3, // for android shadow
  },
  titleContainer: {
    marginBottom: 40,
  },
  playButton: {
    backgroundColor: "#488dff",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(74,142,255,0.2)",
    width: "100%",
    paddingVertical: 40,
    marginBottom: 20,
  },
  playButtonContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  playButtonText: {
    color: "#01285c",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
    letterSpacing: 1,
  },
  playButtonSubText: {
    color: "#01285c",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  cardContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#2b3138",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  cardText: {
    color: "#c1c6d7",
  },
});
