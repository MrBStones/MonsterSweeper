import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radii, spacing, typography } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";

type StatBarProps = {
  currentValue: number;
  maxValue: number;
  suffix: string;
  color: string;
  showValues?: boolean;
};

function StatBar({
  currentValue,
  maxValue,
  suffix,
  color,
  showValues = true,
}: StatBarProps) {
  const progress =
    maxValue > 0
      ? Math.min(100, Math.max(0, (currentValue / maxValue) * 100))
      : 0;

  return (
    <View style={styles.bar}>
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
      <Pressable
        style={({ pressed }) => [
          styles.topBarButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <View style={styles.statsBarContainer}>
        <StatBar
          currentValue={playerHP}
          maxValue={playerMaxHP}
          suffix="HP"
          color={colors.primary}
        />

        <View style={styles.xpGroup}>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>LVL {playerLevel}</Text>
          </View>
          <StatBar
            currentValue={xpIntoLevel}
            maxValue={xpNeededForLevel}
            suffix="XP"
            color={colors.info}
          />
        </View>
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
    gap: spacing.xs,
  },
  topBar: {
    paddingBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(19, 19, 19, 0.62)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(90, 90, 90, 0.45)",
  },
  barText: {
    color: colors.textMuted,
    fontSize: 12,
    paddingBottom: 6,
    ...typography.labelMono,
  },
  topBarButton: {
    backgroundColor: "rgba(32, 31, 31, 0.72)",
    borderRadius: radii.xl,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 52,
    minWidth: 52,
    borderWidth: 1,
    borderColor: "rgba(90, 90, 90, 0.55)",
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  barOuter: {
    height: 18,
    width: 92,
    backgroundColor: "rgba(19, 19, 19, 0.5)",
    borderRadius: radii.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(90, 90, 90, 0.55)",
  },
  barInner: {
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    height: "100%",
  },
  xpGroup: {
    alignItems: "flex-end",
    gap: 4,
  },
  levelPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: "rgba(32, 31, 31, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(90, 90, 90, 0.55)",
  },
  levelText: {
    color: colors.text,
    fontSize: 12,
    ...typography.labelMono,
  },
  buttonPressed: {
    opacity: 0.95,
  },
});
