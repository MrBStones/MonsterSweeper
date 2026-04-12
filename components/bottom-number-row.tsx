import { Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomNumberRowProps = {
  selectedNumber: number;
  setSelectedNumber: Dispatch<SetStateAction<number>>;
  maxNumber: number;
};

export default function BottomNumberRow({
  selectedNumber,
  setSelectedNumber,
  maxNumber,
}: BottomNumberRowProps) {
  const { bottom } = useSafeAreaInsets();
  const numbers = Array.from(
    { length: Math.max(0, maxNumber) },
    (_, index) => index + 1,
  );

  return (
    <View style={[styles.container, { paddingBottom: 10 + bottom }]}>
      <View style={styles.shell}>
        <View style={styles.content}>
          {numbers.map((number) => {
            const isSelected = number === selectedNumber;
            const isFirst = number === 1;
            const isLast = number === maxNumber;

            return (
              <Pressable
                key={number}
                onPress={() => setSelectedNumber(number)}
                style={({ pressed }) => [
                  styles.button,
                  { flex: 1 },
                  isFirst && styles.buttonFirst,
                  isLast && styles.buttonLast,
                  !isLast && styles.buttonDivider,
                  isSelected && styles.buttonSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  selectable={false}
                  style={[styles.label, isSelected && styles.labelSelected]}
                >
                  {number}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#171a1e",
    borderTopWidth: 1,
    borderTopColor: "#2f363f",
  },
  shell: {
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: "#23272d",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  button: {
    height: 48,
    backgroundColor: "#2b3138",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonFirst: {
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  buttonLast: {
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },
  buttonDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(255, 255, 255, 0.12)",
  },
  buttonSelected: {
    backgroundColor: "#00e24b",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  label: {
    color: "#edf1f6",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  labelSelected: {
    color: "#101214",
  },
});
