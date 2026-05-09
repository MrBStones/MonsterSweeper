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

function formatElapsedTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
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
  const elapsedSeconds = useGameStore((state) => state.elapsedSeconds);
  const isBlindMode = playerLevel === 0;
  const nextLevelXP = isBlindMode ? 0 : (nextXP[playerLevel + 1] ?? 0);
  const xpIntoLevel = playerXP;

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
        <View style={styles.metaRow}>
          <View style={styles.timerChip}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.timerText}>
              {formatElapsedTime(elapsedSeconds)}
            </Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>
              {isBlindMode ? "LVL BLIND" : `LVL ${playerLevel}`}
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <StatBar
            currentValue={playerHP}
            maxValue={playerMaxHP}
            suffix="HP"
            color={colors.primary}
          />
          {isBlindMode ? (
            <View style={styles.blindChip}>
              <Text style={styles.blindChipText}>NO LEVELING</Text>
            </View>
          ) : (
            <StatBar
              currentValue={xpIntoLevel}
              maxValue={nextLevelXP}
              suffix="XP"
              color={colors.info}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsBarContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: spacing.sm,
    width: "auto",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  topBar: {
    paddingBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: 52,
    borderWidth: 1,
    borderColor: "rgba(90, 90, 90, 0.55)",
    alignSelf: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  barOuter: {
    height: 18,
    width: 84,
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
  rightStatsGroup: {
    alignItems: "flex-end",
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  levelPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
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
  timerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: "rgba(32, 31, 31, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(90, 90, 90, 0.55)",
  },
  timerText: {
    color: colors.text,
    fontSize: 12,
    ...typography.labelMono,
  },
  blindChip: {
    height: 18,
    minWidth: 84,
    paddingHorizontal: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.full,
    backgroundColor: "rgba(32, 31, 31, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(90, 90, 90, 0.55)",
  },
  blindChipText: {
    color: colors.textMuted,
    fontSize: 11,
    ...typography.labelMono,
  },
  buttonPressed: {
    opacity: 0.95,
  },
});
