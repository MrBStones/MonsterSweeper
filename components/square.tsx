import { Tile } from "@/types/gameModeTypes";
import { memo, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SquareProps = Tile & {
  rowIndex: number;
  columnIndex: number;
  onTilePress?: (x: number, y: number) => void;
  onTileLongPressStart?: (x: number, y: number) => void;
  onTileLongPressMove?: (
    x: number,
    y: number,
    localX: number,
    localY: number,
  ) => void;
  onTileLongPressEnd?: (x: number, y: number) => void;
};

function Square({
  rowIndex,
  columnIndex,
  onTilePress,
  onTileLongPressStart,
  onTileLongPressMove,
  onTileLongPressEnd,
  revealed,
  flag,
  value,
  hideMonster = false,
  monster,
}: SquareProps) {
  const revealAnim = useRef(new Animated.Value(revealed ? 1 : 0)).current;

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

  let text = "";

  if (revealed) {
    text = value <= 0 && !hideMonster ? "" : value + "";
  } else {
    text = flag <= 0 ? "" : flag + "";
  }

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);

  const callbacks = useRef({
    onTilePress,
    onTileLongPressStart,
    onTileLongPressMove,
    onTileLongPressEnd,
  });

  callbacks.current = {
    onTilePress,
    onTileLongPressStart,
    onTileLongPressMove,
    onTileLongPressEnd,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        isDragging.current = false;

        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
        }

        longPressTimer.current = setTimeout(() => {
          isDragging.current = true;
          callbacks.current.onTileLongPressStart?.(columnIndex, rowIndex);
        }, 250);
      },
      onPanResponderMove: (e, gestureState) => {
        if (!isDragging.current) {
          if (
            Math.abs(gestureState.dx) > 10 ||
            Math.abs(gestureState.dy) > 10
          ) {
            if (longPressTimer.current) clearTimeout(longPressTimer.current);
          }
        } else {
          callbacks.current.onTileLongPressMove?.(
            columnIndex,
            rowIndex,
            e.nativeEvent.locationX,
            e.nativeEvent.locationY,
          );
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);

        if (isDragging.current) {
          callbacks.current.onTileLongPressEnd?.(columnIndex, rowIndex);
          isDragging.current = false;
        } else {
          if (
            Math.abs(gestureState.dx) < 10 &&
            Math.abs(gestureState.dy) < 10
          ) {
            callbacks.current.onTilePress?.(columnIndex, rowIndex);
          }
        }
      },
      onPanResponderTerminate: () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);

        if (isDragging.current) {
          callbacks.current.onTileLongPressEnd?.(columnIndex, rowIndex);
          isDragging.current = false;
        }
      },
    }),
  ).current;

  return (
    <View style={styles.touchTarget} {...panResponder.panHandlers}>
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
        {revealed && monster !== undefined && !hideMonster ? (
          <Image source={monster.imgSource} style={styles.monsterImage} />
        ) : (
          <Text
            selectable={false}
            style={
              revealed && hideMonster && monster !== undefined
                ? styles.numMonsterHidden
                : styles.num
            }
          >
            {text}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

export default memo(
  Square,
  (previousProps, nextProps) =>
    previousProps.rowIndex === nextProps.rowIndex &&
    previousProps.columnIndex === nextProps.columnIndex &&
    previousProps.onTilePress === nextProps.onTilePress &&
    previousProps.onTileLongPressStart === nextProps.onTileLongPressStart &&
    previousProps.onTileLongPressMove === nextProps.onTileLongPressMove &&
    previousProps.onTileLongPressEnd === nextProps.onTileLongPressEnd &&
    previousProps.revealed === nextProps.revealed &&
    previousProps.flag === nextProps.flag &&
    previousProps.value === nextProps.value &&
    previousProps.hideMonster === nextProps.hideMonster &&
    previousProps.monster === nextProps.monster,
);

const styles = StyleSheet.create({
  touchTarget: {
    width: 64,
    height: 64,
    padding: 2,
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  revealed: {
    backgroundColor: "#0e0e0e",
  },
  notRevealed: {
    borderColor: "#505050",
    borderWidth: 1,
    backgroundColor: "#393939",
  },
  num: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  numMonsterHidden: {
    color: "#00e24b",
    fontWeight: "bold",
    fontSize: 24,
  },
  monsterImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});
