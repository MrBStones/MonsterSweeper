import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { colors, radii, spacing, typography } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";

const SLIDER_MIN = 30;
const SLIDER_MAX = 500;

export default function OptionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const longPressDelay = useGameStore((state) => state.options?.longPressDelay ?? 150);
  const setLongPressDelay = useGameStore((state) => state.setLongPressDelay);

  // Slider touch tracking
  const sliderRef = useRef<View>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);

  // Test pad state
  const [testFlagged, setTestFlagged] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdAnim = useRef(new Animated.Value(0)).current;
  const holdTimeoutRef = useRef<any>(null);

  const measureSlider = () => {
    sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // In some environments measure might return undefined if not laid out yet
      if (width) setSliderWidth(width);
      if (pageX) setSliderLeft(pageX);
    });
  };

  const handleSliderTouch = (event: GestureResponderEvent) => {
    if (sliderWidth <= 0) return;
    const pageX = event.nativeEvent.pageX;
    const touchX = pageX - sliderLeft;
    const pct = Math.max(0, Math.min(1, touchX / sliderWidth));
    const rawVal = SLIDER_MIN + pct * (SLIDER_MAX - SLIDER_MIN);
    const roundedVal = Math.round(rawVal / 10) * 10; // round to nearest 10ms
    setLongPressDelay(roundedVal);
  };

  const changeDelay = (amount: number) => {
    const newVal = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, longPressDelay + amount));
    setLongPressDelay(newVal);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Test pad press handlers
  const handleTestTouchStart = () => {
    if (testFlagged) {
      // If already flagged, release resets it immediately
      setTestFlagged(false);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    setIsHolding(true);
    holdAnim.setValue(0);

    // Run animation matching the current delay
    Animated.timing(holdAnim, {
      toValue: 1,
      duration: longPressDelay,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Trigger flag set after delay
    holdTimeoutRef.current = setTimeout(() => {
      setTestFlagged(true);
      setIsHolding(false);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, longPressDelay);
  };

  const handleTestTouchEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setIsHolding(false);
    if (!testFlagged) {
      Animated.timing(holdAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  // Calculate position percentage of slider thumb
  const sliderPct = (longPressDelay - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN);

  return (
    <View style={[styles.background, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Options</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* GAMEPLAY SETTINGS CONTAINER */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Gameplay Options</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingTextRow}>
              <Text style={styles.settingLabel}>Long Press Delay</Text>
              <Text style={styles.settingValue}>{longPressDelay} ms</Text>
            </View>
            <Text style={styles.settingSubtext}>
              How long you must hold a tile to mark it with a flag.
            </Text>

            {/* CUSTOM SLIDER */}
            <View
              ref={sliderRef}
              onLayout={measureSlider}
              style={styles.sliderContainer}
              onTouchStart={handleSliderTouch}
              onTouchMove={handleSliderTouch}
            >
              <View style={styles.sliderTrack} />
              <View
                style={[
                  styles.sliderTrackActive,
                  { width: `${sliderPct * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${sliderPct * 100}%` },
                ]}
              />
            </View>

            {/* BUTTON CONTROLS */}
            <View style={styles.controlsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.adjustButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => changeDelay(-10)}
              >
                <Text style={styles.adjustButtonText}>-10ms</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.adjustButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => changeDelay(10)}
              >
                <Text style={styles.adjustButtonText}>+10ms</Text>
              </Pressable>
            </View>

          </View>
        </View>

        {/* TEST PAD CONTAINER */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Test Pad</Text>
          <View style={styles.testPadCard}>
            <Text style={styles.testPadDesc}>
              Hold the tile below to test your long press timing. A haptic tap will trigger when flagged. Tap again to reset.
            </Text>

            <View style={styles.testPadCenter}>
              <Pressable
                onTouchStart={handleTestTouchStart}
                onTouchEnd={handleTestTouchEnd}
                onTouchCancel={handleTestTouchEnd}
                style={({ pressed }) => [
                  styles.testTile,
                  testFlagged ? styles.testTileFlagged : styles.testTileNormal,
                  pressed && !testFlagged && styles.testTilePressed,
                ]}
              >
                {/* Visual hold indicator */}
                {isHolding && !testFlagged && (
                  <Animated.View
                    style={[
                      styles.testTileProgress,
                      {
                        transform: [
                          {
                            scale: holdAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.1, 1],
                            }),
                          },
                        ],
                        opacity: holdAnim.interpolate({
                          inputRange: [0, 0.2, 1],
                          outputRange: [0.3, 0.8, 1],
                        }),
                      },
                    ]}
                  />
                )}

                {testFlagged ? (
                  <MaterialIcons name="flag" size={32} color={colors.primary} />
                ) : (
                  <Text style={styles.testTileText}>
                    {isHolding ? "..." : "HOLD"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    ...typography.headline,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.lg,
  },
  sectionContainer: {
    gap: spacing.sm,
  },
  sectionHeader: {
    color: colors.secondary,
    fontSize: 14,
    ...typography.labelMono,
  },
  settingCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: spacing.md,
    gap: spacing.sm,
  },
  settingTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    color: colors.text,
    fontSize: 18,
    ...typography.headline,
  },
  settingValue: {
    color: colors.primary,
    fontSize: 18,
    ...typography.labelMono,
  },
  settingSubtext: {
    color: colors.textMuted,
    fontSize: 13,
    ...typography.body,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  sliderContainer: {
    height: 32,
    justifyContent: "center",
    position: "relative",
    marginVertical: spacing.sm,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.outline,
    borderRadius: 3,
    width: "100%",
  },
  sliderTrackActive: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
    position: "absolute",
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    position: "absolute",
    marginLeft: -10,
    top: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlsRow: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  adjustButton: {
    flex: 1,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    justifyContent: "center",
    alignItems: "center",
  },
  adjustButtonText: {
    color: colors.text,
    fontSize: 14,
    ...typography.labelMono,
  },
  presetsContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  presetsLabel: {
    color: colors.text,
    fontSize: 12,
    ...typography.labelMono,
  },
  presetsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  presetBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  presetBadgeActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  presetBadgeText: {
    color: colors.textMuted,
    fontSize: 12,
    ...typography.body,
  },
  presetBadgeTextActive: {
    color: colors.primary,
    ...typography.labelMono,
    fontSize: 12,
  },
  testPadCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: spacing.md,
    gap: spacing.md,
  },
  testPadDesc: {
    color: colors.textMuted,
    fontSize: 13,
    ...typography.body,
    lineHeight: 18,
  },
  testPadCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  testTile: {
    width: 80,
    height: 80,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  testTileNormal: {
    backgroundColor: colors.surfaceHigh,
  },
  testTilePressed: {
    backgroundColor: colors.surfaceHighest,
  },
  testTileFlagged: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
  testTileText: {
    color: colors.text,
    fontSize: 16,
    ...typography.labelMono,
    zIndex: 2,
  },
  testTileProgress: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: radii.full,
    backgroundColor: "rgba(107, 222, 113, 0.15)",
    borderWidth: 1.5,
    borderColor: colors.primary,
    zIndex: 1,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
