import { Dispatch, SetStateAction } from "react";
import { View, ViewProps } from "react-native";

type MeasureHeightProps = Omit<ViewProps, "onLayout"> & {
  setHeight: Dispatch<SetStateAction<number>>;
};

export default function MeasureHeight({
  setHeight,
  children,
  ...viewProps
}: MeasureHeightProps) {
  return (
    <View
      {...viewProps}
      onLayout={(event) => {
        const height = event.nativeEvent.layout.height;

        setHeight((currentHeight) =>
          currentHeight === height ? currentHeight : height,
        );
      }}
    >
      {children}
    </View>
  );
}
