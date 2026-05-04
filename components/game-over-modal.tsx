import { useGameStore } from "@/store/gameStore";
import { GameInitializationProps } from "@/types/gameModeTypes";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/constants/theme";

export default function GameOverModal({
  mode,
}: {
  mode: GameInitializationProps;
}) {
  const showGameOver = useGameStore((state) => state.showGameOver);
  const initGame = useGameStore((state) => state.initGame);

  return (
    <Modal transparent visible={showGameOver} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Game Over</Text>
          <Text style={styles.modalText}>You ran out of health.</Text>

          <Pressable
            style={({ pressed }) => [
              styles.modalButton,
              pressed && styles.modalButtonPressed,
            ]}
            onPress={() => {
              initGame(mode);
            }}
          >
            <Text style={styles.modalButtonText}>Restart</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.modalBackdrop,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: radii.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 30,
    textAlign: "center",
    marginBottom: spacing.sm,
    ...typography.headline,
  },
  modalText: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: spacing.lg,
    ...typography.body,
  },
  modalButton: {
    alignSelf: "center",
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  modalButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  modalButtonText: {
    color: colors.primaryDark,
    fontSize: 17,
    textAlign: "center",
    ...typography.labelMono,
  },
});
