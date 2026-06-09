import { Tile } from "@/types/gameModeTypes";
import * as Haptics from "expo-haptics";
import { memo, useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameStore } from "@/store/gameStore";

import { colors, radii, typography } from "@/constants/theme";

type SquareProps = Tile & {
  rowIndex: number;
  columnIndex: number;
  onTilePress?: (x: number, y: number) => void;
  onTileLongPress?: (x: number, y: number, flag?: number) => void;
};

function Square({
  rowIndex,
  columnIndex,
  onTilePress,
  onTileLongPress,
  revealed,
  flag,
  value,
  hideMonster = false,
  monster,
}: SquareProps) {
  const setIsPanningDisabled = useGameStore((state) => state.setIsPanningDisabled);
  const setActiveLongPressTile = useGameStore((state) => state.setActiveLongPressTile);
  const setLongPressPageCoords = useGameStore((state) => state.setLongPressPageCoords);
  const setHoveredFlagNumber = useGameStore((state) => state.setHoveredFlagNumber);
  const maxNumber = useGameStore((state) => state.gameState?.maxMonsterLevel ?? 0);

  const { height: screenHeight } = useWindowDimensions();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();

  const isLongPressedRef = useRef(false);
  const touchStartRef = useRef({ pageX: 0, pageY: 0 });
  const hoveredNumberRef = useRef<number | null>(null);
  const revealAnim = useRef(new Animated.Value(revealed ? 1 : 0)).current;
  const hideAnim = useRef(new Animated.Value(hideMonster ? 1 : 0)).current;

  useEffect(() => {
    if (revealed) {
      Animated.timing(revealAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      return;
    }

    revealAnim.setValue(0);
  }, [revealed, revealAnim]);

  useEffect(() => {
    Animated.timing(hideAnim, {
      toValue: hideMonster ? 1 : 0,
      duration: 100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [hideMonster, hideAnim]);

  const numbers = Array.from(
    { length: Math.max(0, maxNumber) },
    (_, index) => index + 1,
  );

  let text = "";

  if (revealed) {
    text = value <= 0 && !hideMonster ? "" : value + "";
  } else {
    text = flag <= 0 ? "" : flag + "";
  }

  return (
    <Pressable
      onPress={() => {
        if (isLongPressedRef.current) return;
        onTilePress?.(columnIndex, rowIndex);
      }}
      onLongPress={() => {
        if (revealed) return;
        isLongPressedRef.current = true;
        setIsPanningDisabled(true);
        setActiveLongPressTile({ x: columnIndex, y: rowIndex });
        setLongPressPageCoords(touchStartRef.current);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
      delayLongPress={400}
      onTouchStart={(event) => {
        isLongPressedRef.current = false;
        touchStartRef.current = {
          pageX: event.nativeEvent.pageX,
          pageY: event.nativeEvent.pageY,
        };
      }}
      onTouchMove={(event) => {
        if (!isLongPressedRef.current) return;
        const { pageX, pageY } = event.nativeEvent;

        const relativeX = pageX - touchStartRef.current.pageX;
        const relativeY = pageY - touchStartRef.current.pageY;

        // Check if touch is within the horizontal active zone of the menu
        // Expanding in both directions (left or right of touch start) prevents the hand from obscuring the menu on screen.
        const isActiveX = Math.abs(relativeX) >= 10;

        if (isActiveX) {
          const N = maxNumber + 1; // +1 for the 'X' (no mark) option
          const menuHeight = N * 36 + (N - 1) * 4 + 8; // buttons + gaps + padding

          // Calculate the exact vertical shift that LongPressMenu applies
          const { topBarHeight, bottomBarHeight } = useGameStore.getState();
          const originalMenuTop = touchStartRef.current.pageY - menuHeight / 2;
          const minY = Math.max(safeTop + 8, topBarHeight + 8);
          const maxY = Math.min(
            screenHeight - safeBottom - 8 - menuHeight,
            screenHeight - bottomBarHeight - 8 - menuHeight,
          );
          const shiftedMenuTop = Math.min(Math.max(originalMenuTop, minY), maxY);
          const shiftY = shiftedMenuTop - originalMenuTop;

          // Buttons start relative to center of the touch, shifted by the vertical offset
          const buttonsStart = -(N * 40) / 2 + shiftY;
          const buttonTouchY = relativeY - buttonsStart;
          const index = Math.floor(buttonTouchY / 40);

          // If the user overshoots the top of the menu (index < 0), clamp it to 0 (the clear option)
          const selectedIndex = index < 0 ? 0 : index;

          if (selectedIndex < N) {
            const selectedVal = selectedIndex; // index 0 maps to 0 (no mark), index > 0 maps to flag level
            if (hoveredNumberRef.current !== selectedVal) {
              hoveredNumberRef.current = selectedVal;
              setHoveredFlagNumber(selectedVal);
              void Haptics.selectionAsync();
            }
            return;
          }
        }

        if (hoveredNumberRef.current !== null) {
          hoveredNumberRef.current = null;
          setHoveredFlagNumber(null);
        }
      }}
      onTouchEnd={() => {
        if (isLongPressedRef.current) {
          const selectedFlag = hoveredNumberRef.current;
          if (selectedFlag !== null) {
            onTileLongPress?.(columnIndex, rowIndex, selectedFlag);
          }
          setIsPanningDisabled(false);
          setActiveLongPressTile(null);
          setLongPressPageCoords(null);
          setHoveredFlagNumber(null);
          isLongPressedRef.current = false;
          hoveredNumberRef.current = null;
        }
      }}
      onTouchCancel={() => {
        if (isLongPressedRef.current) {
          setIsPanningDisabled(false);
          setActiveLongPressTile(null);
          setLongPressPageCoords(null);
          setHoveredFlagNumber(null);
          isLongPressedRef.current = false;
          hoveredNumberRef.current = null;
        }
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Animated.View
        style={[
          styles.container,
          revealed ? styles.revealed : styles.notRevealed,
          revealed && {
            opacity: revealAnim,
            transform: [
              {
                scale: revealAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.88, 1],
                }),
              },
            ],
          },
        ]}
      >
        {revealed && monster !== undefined ? (
          <>
            <Animated.Image
              source={monster.imgSource}
              style={[
                styles.monsterImage,
                { position: "absolute" },
                {
                  opacity: hideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                  transform: [
                    {
                      scale: hideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.88],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.Text
              selectable={false}
              style={[
                styles.numMonsterHidden,
                {
                  opacity: hideAnim,
                  transform: [
                    {
                      scale: hideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.88, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {value}
            </Animated.Text>
          </>
        ) : (
          <Text selectable={false} style={styles.num}>
            {text}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default memo(
  Square,
  (previousProps, nextProps) =>
    previousProps.rowIndex === nextProps.rowIndex &&
    previousProps.columnIndex === nextProps.columnIndex &&
    previousProps.onTilePress === nextProps.onTilePress &&
    previousProps.onTileLongPress === nextProps.onTileLongPress &&
    previousProps.revealed === nextProps.revealed &&
    previousProps.flag === nextProps.flag &&
    previousProps.value === nextProps.value &&
    previousProps.hideMonster === nextProps.hideMonster &&
    previousProps.monster === nextProps.monster,
);

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.sm,
    margin: 2,
  },
  revealed: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  notRevealed: {
    borderColor: colors.outline,
    borderWidth: 1,
    backgroundColor: colors.surfaceHigh,
  },
  num: {
    color: colors.text,
    fontSize: 22,
    ...typography.headline,
  },
  numMonsterHidden: {
    color: colors.primary,
    fontSize: 22,
    ...typography.headline,
  },
  monsterImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  pressed: {
    opacity: 0.94,
  },
});
