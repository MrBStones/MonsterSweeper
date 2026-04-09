import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monster Sweeper</Text>
      <Link href="/about" style={styles.button}>
        Squares test
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
  },
  title: {
    color: "#fff",
    fontSize: 52,
  },
  button: {
    color: "#fff",
    fontSize: 20,
    textDecorationLine: "underline",
    backgroundColor: "#005068",
    padding: 10,
    borderRadius: 10,
  },
});
