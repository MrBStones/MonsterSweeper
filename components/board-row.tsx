import Square from "@/components/square";
import { Tile } from "@/types/gameModeTypes";
import { memo } from "react";
import { View } from "react-native";

type BoardRowProps = {
  row: Tile[];
  rowIndex: number;
  onTilePress: (rowIndex: number, columnIndex: number) => void;
};

function BoardRow({ row, rowIndex, onTilePress }: BoardRowProps) {
  return (
    <View style={styles.row}>
      {row.map((tile, columnIndex) => (
        <Square
          key={`${rowIndex}-${columnIndex}`}
          revealed={tile.revealed}
          flag={tile.flag}
          monster={tile.monster}
          value={tile.value}
          onPress={() => onTilePress(rowIndex, columnIndex)}
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
