import Square from "@/components/square";
import { Tile } from "@/types/gameModeTypes";
import { memo } from "react";
import { View } from "react-native";

type BoardRowProps = {
  row: Tile[];
  rowIndex: number;
  onTilePress: (x: number, y: number) => void;
};

function BoardRow({ row, rowIndex, onTilePress }: BoardRowProps) {
  return (
    <View style={styles.row}>
      {row.map((tile, columnIndex) => (
        <Square
          key={`${rowIndex}-${columnIndex}`}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          onTilePress={onTilePress}
          revealed={tile.revealed}
          flag={tile.flag}
          monster={tile.monster}
          value={tile.value}
          hideMonster={tile.hideMonster}
        />
      ))}
    </View>
  );
}

export default memo(
  BoardRow,
  (previousProps, nextProps) =>
    previousProps.row === nextProps.row &&
    previousProps.rowIndex === nextProps.rowIndex &&
    previousProps.onTilePress === nextProps.onTilePress,
);

const styles = {
  row: {
    flexDirection: "row" as const,
  },
};
