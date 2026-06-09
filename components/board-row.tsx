import Square from "@/components/square";
import { useGameStore } from "@/store/gameStore";
import { Tile } from "@/types/gameModeTypes";
import { memo } from "react";
import { View } from "react-native";

type BoardRowProps = {
  row: Tile[];
  rowIndex: number;
  gameSessionId: number;
  onTilePress: (x: number, y: number) => void;
  onTileLongPress: (x: number, y: number, flag?: number) => void;
};

function BoardRow({
  row,
  rowIndex,
  gameSessionId,
  onTilePress,
  onTileLongPress,
}: BoardRowProps) {
  const isActiveRow = useGameStore(
    (state) => state.activeLongPressTile?.y === rowIndex,
  );

  return (
    <View style={[styles.row, isActiveRow && { zIndex: 100 }]}>
      {row.map((tile, columnIndex) => (
        <Square
          key={`${gameSessionId}-${rowIndex}-${columnIndex}`}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          onTilePress={onTilePress}
          onTileLongPress={onTileLongPress}
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
    previousProps.onTilePress === nextProps.onTilePress &&
    previousProps.onTileLongPress === nextProps.onTileLongPress,
);

const styles = {
  row: {
    flexDirection: "row" as const,
  },
};
