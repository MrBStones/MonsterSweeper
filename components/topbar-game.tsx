import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameStore } from "@/store/gameStore";

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
          >
            <View style={styles.borderOnly}></View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TopbarGame() {
  const { top } = useSafeAreaInsets();
  const playerHP = useGameStore((state) => state.gameState?.playerHP ?? 0);
  const playerMaxHP = useGameStore(
    (state) => state.gameState?.playerMaxHP ?? 0,
  );
  const playerXP = useGameStore((state) => state.gameState?.playerXP ?? 0);
  const playerLevel = useGameStore(
    (state) => state.gameState?.playerLevel ?? 1,
  );
  const nextXP = useGameStore((state) => state.gameState?.nextXP ?? [0, 0]);
  const nextLevelXP = nextXP[playerLevel + 1];
  const xpIntoLevel = playerXP;
  const xpNeededForLevel = nextLevelXP;

  return (
    <View style={[styles.topBar, { paddingTop: 10 + top }]}>
      <Pressable style={styles.topBarButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
      <View style={styles.statsBarContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  statsBarContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    gap: 10,
  },
  topBar: {
    padding: 5,
    flexDirection: "row",
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
    width: 120,
    backgroundColor: "black",
    borderEndEndRadius: 10,
    borderTopEndRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  barInner: {
    backgroundColor: "#00e24b",
    height: "100%",
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
  borderOnly: {
    height: 30,
    width: 120,
    borderEndEndRadius: 10,
    borderTopEndRadius: 10,
    borderColor: "#3c4148",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderEndWidth: 1,
    outlineWidth: 2,
    outlineColor: "#3c4148",
  },
});
