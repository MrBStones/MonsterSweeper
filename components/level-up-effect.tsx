import { colors, radii, typography } from "@/constants/theme";
import { LevelUpEffect as LevelUpEffectData } from "@/store/gameStore";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type LevelUpEffectProps = {
  effect: LevelUpEffectData;
  onFinished: () => void;
};

const TILE_SIZE = 64;

export default function LevelUpEffect({
  effect,
  onFinished,
}: LevelUpEffectProps) {
  const rippleOne = useRef(new Animated.Value(0)).current;
  const rippleTwo = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const cleanupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    rippleOne.setValue(0);
    rippleTwo.setValue(0);
    badgeAnim.setValue(0);

    const rippleDuration = 820;
    const fadeInDuration = 150;
    const holdDuration = 340;
    const fadeOutDuration = 220;

    Animated.parallel([
      Animated.timing(rippleOne, {
        toValue: 1,
        duration: rippleDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rippleTwo, {
        toValue: 1,
        duration: rippleDuration,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(badgeAnim, {
          toValue: 1,
          duration: fadeInDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(holdDuration),
        Animated.timing(badgeAnim, {
          toValue: 0,
          duration: fadeOutDuration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (cleanupTimeout.current) {
      clearTimeout(cleanupTimeout.current);
    }

    cleanupTimeout.current = setTimeout(
      () => {
        onFinished();
      },
      fadeInDuration + holdDuration + fadeOutDuration + 80,
    );

    return () => {
      if (cleanupTimeout.current) {
        clearTimeout(cleanupTimeout.current);
        cleanupTimeout.current = null;
      }
      rippleOne.stopAnimation();
      rippleTwo.stopAnimation();
      badgeAnim.stopAnimation();
    };
  }, [badgeAnim, effect.id, onFinished, rippleOne, rippleTwo]);

  const ringOneScale = rippleOne.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 2.2],
  });
  const ringTwoScale = rippleTwo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 2.55],
  });
  const ringOneOpacity = rippleOne.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0.65, 0.4, 0],
  });
  const ringTwoOpacity = rippleTwo.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0.45, 0.28, 0],
  });
  const badgeTranslateY = badgeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 0],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: effect.x * TILE_SIZE,
          top: effect.y * TILE_SIZE,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.ring,
          styles.ringOuter,
          {
            opacity: ringOneOpacity,
            transform: [{ scale: ringOneScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ringInner,
          {
            opacity: ringTwoOpacity,
            transform: [{ scale: ringTwoScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.label,
          {
            opacity: badgeAnim,
            transform: [{ translateY: badgeTranslateY }],
          },
        ]}
      >
        <Text selectable={false} style={styles.text}>
          {`LVL ${effect.level}`}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: TILE_SIZE,
    height: TILE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 20,
  },
  ring: {
    position: "absolute",
    width: TILE_SIZE - 4,
    height: TILE_SIZE - 4,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "rgba(107, 222, 113, 0.08)",
  },
  ringOuter: {
    borderColor: "rgba(107, 222, 113, 0.85)",
  },
  ringInner: {
    borderColor: "rgba(107, 222, 113, 0.5)",
    backgroundColor: "rgba(107, 222, 113, 0.03)",
  },
  label: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: "rgba(19, 19, 19, 0.84)",
    borderWidth: 2,
    borderColor: "rgba(107, 222, 113, 0.62)",
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  text: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
    includeFontPadding: false,
    ...typography.headline,
  },
});
