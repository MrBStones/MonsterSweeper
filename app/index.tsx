import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

const MODES = [
  { id: "easy", label: "Easy", color: "#00e24b" },
  { id: "normal", label: "Normal", color: "#488dff" },
  { id: "huge", label: "Huge", color: "#a648ff" },
  { id: "blind", label: "Blind", color: "#888888" },
  { id: "extreme", label: "Extreme", color: "#ff4848" },
] as const;

export default function Index() {
  const [selectedMode, setSelectedMode] = useState<string>("easy");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const activeMode = MODES.find((m) => m.id === selectedMode) || MODES[0];

  return (
    <View style={styles.background}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Monster</Text>
          <Text style={styles.title}>Sweeper</Text>
        </View>

        <Link
          href={{ pathname: "/game", params: { mode: selectedMode } }}
          style={styles.playButton}
        >
          <View style={styles.playButtonContent}>
            <Entypo name="controller-play" size={48} color="#01285c" />
            <Text style={styles.playButtonText}>PLAY</Text>
            <Text style={styles.playButtonSubText}>
              Selected Mode: {activeMode.label}
            </Text>
          </View>
        </Link>

        <View style={styles.cardsRow}>
          {/* MODES CARD */}
          <Pressable
            style={styles.cardContainer}
            onPress={() => setIsModalVisible(true)}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="dashboard" size={20} color="#8ab4f8" />
              <Text style={styles.cardTitle}>MODES</Text>
            </View>
            <View style={styles.cardContent}>
              {MODES.slice(0, 3).map((mode) => (
                <View key={mode.id} style={styles.modeListItem}>
                  <View
                    style={[styles.modeDot, { backgroundColor: mode.color }]}
                  />
                  <Text
                    style={[
                      styles.modeListText,
                      selectedMode === mode.id && styles.modeListTextSelected,
                    ]}
                  >
                    {mode.label}
                  </Text>
                  {selectedMode === mode.id && (
                    <MaterialIcons
                      name="check"
                      size={16}
                      color="#00e24b"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </View>
              ))}
              {MODES.length > 3 && (
                <Text style={styles.moreText}>+{MODES.length - 3} more...</Text>
              )}
            </View>
          </Pressable>

          {/* SETTINGS CARD */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings" size={20} color="#81c995" />
              <Text style={[styles.cardTitle, { color: "#81c995" }]}>
                SETTINGS
              </Text>
            </View>
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderText}>Options</Text>
              <Text style={styles.placeholderSubText}>Coming Soon</Text>
            </View>
          </View>
        </View>
      </View>

      {/* MODES MODAL */}
      <Modal transparent visible={isModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader}>Select Game Mode</Text>
            {MODES.map((mode) => (
              <Pressable
                key={mode.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedMode(mode.id);
                  setIsModalVisible(false);
                }}
              >
                <View
                  style={[styles.modeDot, { backgroundColor: mode.color }]}
                />
                <Text style={styles.modalOptionText}>{mode.label}</Text>
                {selectedMode === mode.id && (
                  <MaterialIcons name="check" size={24} color="#00e24b" />
                )}
              </Pressable>
            ))}
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  titleContainer: {
    marginBottom: 40,
  },
  playButton: {
    backgroundColor: "#488dff",
    borderColor: "rgba(255, 255, 255, 0.08)",
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
  cardsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#2b3138",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    color: "#8ab4f8",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  modeListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modeListText: {
    color: "#c1c6d7",
    fontSize: 14,
  },
  modeListTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  moreText: {
    color: "#5b6574",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  placeholderContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  placeholderSubText: {
    color: "#c1c6d7",
    fontSize: 12,
  },
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
  },
  modalHeader: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    gap: 12,
  },
  modalOptionText: {
    color: "#fff",
    fontSize: 18,
    flex: 1,
  },
  modalCloseButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
