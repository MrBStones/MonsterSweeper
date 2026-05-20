import { radii } from "@/constants/theme";
import { DamageEffect as DamageEffectData } from "@/store/gameStore";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type DamageEffectProps = {
  effect: DamageEffectData;
  onFinished: () => void;
};

const TILE_SIZE = 64;

export default function DamageEffect({
  effect,
  onFinished,
}: DamageEffectProps) {
  const rippleOne = useRef(new Animated.Value(0)).current;
  const rippleTwo = useRef(new Animated.Value(0)).current;
  const cleanupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    rippleOne.setValue(0);
    rippleTwo.setValue(0);

    const rippleDuration = 760;
    const fadeDuration = 180;

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
    ]).start();

    if (cleanupTimeout.current) {
      clearTimeout(cleanupTimeout.current);
    }

    cleanupTimeout.current = setTimeout(() => {
      onFinished();
    }, rippleDuration + fadeDuration);

    return () => {
      if (cleanupTimeout.current) {
        clearTimeout(cleanupTimeout.current);
        cleanupTimeout.current = null;
      }
      rippleOne.stopAnimation();
      rippleTwo.stopAnimation();
    };
  }, [effect.id, onFinished, rippleOne, rippleTwo]);

  const ringOneScale = rippleOne.interpolate({
    inputRange: [0, 1],
    outputRange: [0.58, 2.4],
  });
  const ringTwoScale = rippleTwo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 2.7],
  });
  const ringOneOpacity = rippleOne.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0.8, 0.45, 0],
  });
  const ringTwoOpacity = rippleTwo.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0.55, 0.3, 0],
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
    zIndex: 19,
    elevation: 19,
  },
  ring: {
    position: "absolute",
    width: TILE_SIZE - 4,
    height: TILE_SIZE - 4,
    borderRadius: radii.full,
    borderWidth: 2,
    backgroundColor: "rgba(255, 91, 91, 0.1)",
  },
  ringOuter: {
    borderColor: "rgba(255, 91, 91, 0.88)",
  },
  ringInner: {
    borderColor: "rgba(255, 91, 91, 0.55)",
    backgroundColor: "rgba(255, 91, 91, 0.03)",
  },
});
