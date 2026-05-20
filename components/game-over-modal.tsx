import { useGameStore } from "@/store/gameStore";
import { GameInitializationProps } from "@/types/gameModeTypes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radii, spacing, typography } from "@/constants/theme";
import { hasWonGame } from "@/store/gameStore";

function formatElapsedTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatElapsedTimeWithMilliseconds(totalMilliseconds: number): string {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString();
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const centiseconds = Math.floor((totalMilliseconds % 1000) / 10)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}.${centiseconds}`;
}

type ModalSnapshot = {
  title: string;
  message: string;
  buttonLabel: string;
  finishTime?: string;
  isWin: boolean;
};

export default function GameOverModal({
  mode,
}: {
  mode: GameInitializationProps;
}) {
  const showGameOver = useGameStore((state) => state.showGameOver);
  const isGameWon = useGameStore((state) => hasWonGame(state.gameState));
  const elapsedSeconds = useGameStore((state) => state.elapsedSeconds);
  const gameStartedAt = useGameStore((state) => state.gameStartedAt);
  const gameEndedAt = useGameStore((state) => state.gameEndedAt);
  const resetGame = useGameStore((state) => state.resetGame);
  const initGame = useGameStore((state) => state.initGame);
  const isVisible = showGameOver || isGameWon;
  const [snapshot, setSnapshot] = useState<ModalSnapshot | null>(null);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    setSnapshot({
      title: isGameWon ? "You Won" : "Game Over",
      message: isGameWon
        ? "Every monster has been cleared."
        : "You ran out of health.",
      buttonLabel: isGameWon ? "Play Again" : "Restart",
      finishTime:
        isGameWon && gameStartedAt !== null && gameEndedAt !== null
          ? formatElapsedTimeWithMilliseconds(gameEndedAt - gameStartedAt)
          : formatElapsedTime(elapsedSeconds),
      isWin: isGameWon,
    });
  }, [elapsedSeconds, gameEndedAt, gameStartedAt, isGameWon, isVisible]);

  const currentSnapshot = snapshot ?? {
    title: isGameWon ? "You Won" : "Game Over",
    message: isGameWon
      ? "Every monster has been cleared."
      : "You ran out of health.",
    buttonLabel: isGameWon ? "Play Again" : "Restart",
    finishTime:
      isGameWon && gameStartedAt !== null && gameEndedAt !== null
        ? formatElapsedTimeWithMilliseconds(gameEndedAt - gameStartedAt)
        : formatElapsedTime(elapsedSeconds),
    isWin: isGameWon,
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text
            style={[
              styles.modalTitle,
              currentSnapshot.isWin && styles.modalTitleWin,
              !currentSnapshot.isWin && styles.modalTitleLose,
            ]}
          >
            {currentSnapshot.title}
          </Text>
          <Text style={styles.modalText}>{currentSnapshot.message}</Text>
          {currentSnapshot.isWin ? (
            <View style={styles.timePill}>
              <Text style={styles.timeLabel}>Finish Time</Text>
              <Text style={styles.timeValue}>{currentSnapshot.finishTime}</Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                styles.modalButtonSecondary,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={() => {
                resetGame();
                router.back();
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  styles.modalButtonTextSecondary,
                ]}
              >
                Home
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={() => {
                initGame(mode);
              }}
            >
              <Text style={styles.modalButtonText}>
                {currentSnapshot.buttonLabel}
              </Text>
            </Pressable>
          </View>
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
  modalTitleWin: {
    color: colors.secondary,
  },
  modalTitleLose: {
    color: colors.danger,
  },
  modalText: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: spacing.lg,
    ...typography.body,
  },
  timePill: {
    alignSelf: "center",
    minWidth: 180,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: "center",
  },
  timeLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
    ...typography.labelMono,
  },
  timeValue: {
    color: colors.text,
    fontSize: 18,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  modalButtonSecondary: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.outline,
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
  modalButtonTextSecondary: {
    color: colors.text,
  },
});
