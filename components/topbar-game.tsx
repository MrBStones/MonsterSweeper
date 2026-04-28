import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type StatBarProps = {
  currentValue: number;
  maxValue: number;
  suffix: string;
  color: string;
  children: ReactNode;
  showValues?: boolean;
};

function StatBar({
  currentValue,
  maxValue,
  suffix,
  color,
  children,
  showValues = true,
}: StatBarProps) {
  const progress =
    maxValue > 0
      ? Math.min(100, Math.max(0, (currentValue / maxValue) * 100))
      : 0;

  return (
    <View style={styles.bar}>
      <View style={[styles.barLeft]}>{children}</View>
      <View>
        {showValues ? (
          <Text style={styles.barText}>
            {currentValue}/{maxValue} {suffix}
          </Text>
        ) : null}
        <View style={styles.barOuter}>
          <View
            style={[
              styles.barInner,
              { width: `${progress}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

type TopbarGameProps = {
  playerHP: number;
  playerMaxHP: number;
  playerXP: number;
  playerLevel: number;
  nextXP: number[];
};

export default function TopbarGame({
  playerHP,
  playerMaxHP,
  playerXP,
  playerLevel,
  nextXP,
}: TopbarGameProps) {
  const { top } = useSafeAreaInsets();
  const nextLevelXP = nextXP[playerLevel + 1];
  const xpIntoLevel = playerXP;
  const xpNeededForLevel = nextLevelXP;

  return (
    <View style={[styles.topBar, { paddingTop: 10 + top }]}>
      <Pressable style={styles.topBarButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
      <StatBar
        currentValue={playerHP}
        maxValue={playerMaxHP}
        suffix="HP"
        color="#00e24b"
      >
        <Ionicons name="heart" size={24} color="white" />
      </StatBar>

      <StatBar
        currentValue={xpIntoLevel}
        maxValue={xpNeededForLevel}
        suffix="XP"
        color="#4ea1ff"
      >
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
          Lvl {playerLevel}
        </Text>
      </StatBar>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  barText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    padding: 5,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  topBarButton: {
    backgroundColor: "#2b3138",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    minWidth: 60,
    overflow: "hidden",
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
  topBarButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  barOuter: {
    height: 30,
    minWidth: 120,
    backgroundColor: "black",
    borderEndEndRadius: 10,
    borderTopEndRadius: 10,
    borderColor: "#3c4148",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderEndWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  barInner: {
    backgroundColor: "#00e24b",
    height: 28,
    borderEndWidth: 1,
    borderEndColor: "#ffffff63",
  },
  barLeft: {
    backgroundColor: "#2b3138",

    borderTopEndRadius: 13,
    borderStartStartRadius: 30,
    borderBottomStartRadius: 30,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 60,
    minWidth: 60,
    overflow: "hidden",

    borderColor: "#3c4148",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
});
