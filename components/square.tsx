import { Tile } from "@/types/gameModeTypes";
import { memo, useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";

type SquareProps = Tile & {
  rowIndex: number;
  columnIndex: number;
  onTilePress?: (x: number, y: number) => void;
};

function Square({
  rowIndex,
  columnIndex,
  onTilePress,
  revealed,
  flag,
  value,
  hideMonster = false,
  monster,
}: SquareProps) {
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

  let text = "";

  if (revealed) {
    text = value <= 0 && !hideMonster ? "" : value + "";
  } else {
    text = flag <= 0 ? "" : flag + "";
  }

  return (
    <Pressable onPress={() => onTilePress?.(columnIndex, rowIndex)}>
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
    borderRadius: 5,
    margin: 2,
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
