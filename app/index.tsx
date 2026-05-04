import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/constants/theme";

const MODES = [
  { id: "easy", label: "Easy", color: colors.primary },
  { id: "normal", label: "Normal", color: colors.info },
  { id: "huge", label: "Huge", color: colors.secondary },
  { id: "blind", label: "Blind", color: colors.outlineStrong },
  { id: "extreme", label: "Extreme", color: colors.danger },
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
            <Entypo
              name="controller-play"
              size={48}
              color={colors.primaryDark}
            />
            <Text style={styles.playButtonText}>PLAY</Text>
            <Text style={styles.playButtonSubText}>
              Selected Mode: {activeMode.label}
            </Text>
          </View>
        </Link>

        <View style={styles.cardsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.cardContainer,
              styles.interactiveCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => setIsModalVisible(true)}
          >
            <View style={styles.cardCenterContent}>
              <View style={styles.cardIconShell}>
                <MaterialIcons
                  name="dashboard"
                  size={30}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.cardTitle}>Modes</Text>
              <Text style={styles.cardSubtitle}>
                Current: {activeMode.label}
              </Text>
            </View>
          </Pressable>

          <View style={styles.cardContainer}>
            <View style={styles.cardCenterContent}>
              <View style={styles.cardIconShellSecondary}>
                <Ionicons
                  name="settings-outline"
                  size={30}
                  color={colors.secondary}
                />
              </View>
              <Text style={[styles.cardTitle, styles.cardTitleSecondary]}>
                Options
              </Text>
              <Text style={styles.cardSubtitle}>Coming Soon</Text>
            </View>
          </View>
        </View>
      </View>

      {/* MODES MODAL */}
      <Modal transparent visible={isModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader}>Select Game Mode</Text>
            <View style={styles.modalListShell}>
              {MODES.map((mode, index) => {
                const isSelected = selectedMode === mode.id;
                const isFirst = index === 0;
                const isLast = index === MODES.length - 1;

                return (
                  <Pressable
                    key={mode.id}
                    style={({ pressed }) => [
                      styles.modalOption,
                      isFirst && styles.modalOptionFirst,
                      isLast && styles.modalOptionLast,
                      !isLast && styles.modalOptionDivider,
                      isSelected && styles.modalOptionSelected,
                      pressed && styles.modalOptionPressed,
                    ]}
                    onPress={() => {
                      setSelectedMode(mode.id);
                      setIsModalVisible(false);
                    }}
                  >
                    <View
                      style={[styles.modeDot, { backgroundColor: mode.color }]}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {mode.label}
                    </Text>
                    {isSelected && (
                      <MaterialIcons
                        name="check"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
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
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 48,
    textAlign: "center",
    ...typography.headline,
  },
  titleContainer: {
    marginBottom: 32,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderColor: colors.outlineStrong,
    borderRadius: radii.xl,
    borderWidth: 1,
    width: "100%",
    paddingVertical: 32,
    marginBottom: 20,
  },
  playButtonContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  playButtonText: {
    color: colors.primaryDark,
    fontSize: 32,
    marginTop: 10,
    ...typography.headline,
  },
  playButtonSubText: {
    color: colors.primaryDark,
    fontSize: 13,
    marginTop: 10,
    ...typography.labelMono,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    width: "100%",
    maxWidth: 440,
  },
  cardsRow: {
    flexDirection: "row",
    width: "100%",
    gap: spacing.md,
  },
  cardContainer: {
    flex: 1,
    minHeight: 152,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  interactiveCard: {
    overflow: "hidden",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    textAlign: "center",
    ...typography.labelMono,
  },
  cardTitleSecondary: {
    color: colors.secondary,
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    ...typography.body,
  },
  cardCenterContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardIconShell: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconShellSecondary: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardPressed: {
    opacity: 0.95,
  },
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
  modalHeader: {
    color: colors.text,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
    ...typography.headline,
  },
  modalSubheader: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginBottom: spacing.md,
    ...typography.labelMono,
  },
  modalList: {
    gap: spacing.sm,
  },
  modalListShell: {
    overflow: "hidden",
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    gap: 12,
  },
  modalOptionPressed: {
    opacity: 0.95,
  },
  modalOptionSelected: {
    backgroundColor: "rgba(107, 222, 113, 0.08)",
  },
  modalOptionFirst: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  modalOptionLast: {
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  modalOptionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outline,
  },
  modalOptionText: {
    color: colors.textMuted,
    fontSize: 18,
    flex: 1,
  },
  modalOptionTextSelected: {
    color: colors.text,
    ...typography.headline,
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: spacing.lg,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  modalCloseButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    ...typography.labelMono,
  },
});
