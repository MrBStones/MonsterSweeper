import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radii, spacing, typography } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";

export default function BottomNumberRow() {
  const { bottom } = useSafeAreaInsets();
  const maxNumber = useGameStore(
    (state) => state.gameState?.maxMonsterLevel ?? 0,
  );
  const selectedNumber = useGameStore((state) => state.selectedNumber);
  const setSelectedNumber = useGameStore((state) => state.setSelectedNumber);
  const numbers = Array.from(
    { length: Math.max(0, maxNumber) },
    (_, index) => index + 1,
  );

  return (
    <View style={[styles.container, { paddingBottom: 10 + bottom }]}>
      <View style={styles.shell}>
        <View style={styles.content}>
          {numbers.map((number) => {
            const isSelected = number === selectedNumber;
            const isFirst = number === 1;
            const isLast = number === maxNumber;

            return (
              <Pressable
                key={number}
                onPress={() =>
                  number === selectedNumber
                    ? setSelectedNumber(0)
                    : setSelectedNumber(number)
                }
                style={({ pressed }) => [
                  styles.button,
                  { flex: 1 },
                  isFirst && styles.buttonFirst,
                  isLast && styles.buttonLast,
                  !isLast && styles.buttonDivider,
                  isSelected && styles.buttonSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  selectable={false}
                  style={[styles.label, isSelected && styles.labelSelected]}
                >
                  {number}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  shell: {
    overflow: "hidden",
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  button: {
    height: 48,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonFirst: {
    borderTopLeftRadius: radii.xl,
    borderBottomLeftRadius: radii.xl,
  },
  buttonLast: {
    borderTopRightRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  buttonDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.outline,
  },
  buttonSelected: {
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.95,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    ...typography.labelMono,
  },
  labelSelected: {
    color: colors.primaryDark,
  },
});
