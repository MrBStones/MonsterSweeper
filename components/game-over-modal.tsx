import { useGameStore } from "@/store/gameStore";
import { GameInitializationProps } from "@/types/gameModeTypes";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
    backgroundColor: "rgba(10, 12, 14, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#23272d",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    color: "#c8d0d9",
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    alignSelf: "center",
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#00e24b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  modalButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  modalButtonText: {
    color: "#101214",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
