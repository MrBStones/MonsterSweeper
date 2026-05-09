import { MonstersArray } from "@/constants/monsters";
import { GameModeInterface } from "@/interfaces/gameModeInterface";
import {
  GameInitializationProps,
  GameState,
  Tile,
  Vector2,
} from "@/types/gameModeTypes";

export class StandardGameMode implements GameModeInterface {
  gameState!: GameState;

  constructor(
    gameState?: GameState,
    initializationProps?: GameInitializationProps,
  ) {
    if (gameState) {
      this.gameState = gameState;
      return;
    }

    if (!initializationProps) {
      throw new Error("No props were passed to game");
    }

    this.initLevel(initializationProps);
  }

  onPress(x: number, y: number, flag: number): void {
    const currentTile = this.gameState.tiles[y]?.[x];

    if (!currentTile) {
      return;
    }

    if (!currentTile.revealed) {
      if (flag > 0) {
        const nextTiles = [...this.gameState.tiles];
        const nextRow = [...nextTiles[y]];

        nextRow[x] = {
          ...currentTile,
          flag: currentTile.flag === flag ? 0 : flag,
        };
        nextTiles[y] = nextRow;
        this.gameState.tiles = nextTiles;
      } else {
        this.revealTile(x, y);
      }
      return;
    }

    if (currentTile.monster) {
      const nextTiles = [...this.gameState.tiles];
      const nextRow = [...nextTiles[y]];

      nextRow[x] = {
        ...currentTile,
        hideMonster: !currentTile.hideMonster,
      };
      nextTiles[y] = nextRow;
      this.gameState.tiles = nextTiles;
    }
  }

  revealTile(x: number, y: number): void {
    const currentTile = this.gameState.tiles[y]?.[x];

    if (
      !currentTile ||
      currentTile.revealed ||
      currentTile.flag > this.gameState.playerLevel
    ) {
      return;
    }

    if (currentTile.monster) {
      const nextTiles = [...this.gameState.tiles];
      const nextRow = [...nextTiles[y]];
      nextRow[x] = {
        ...currentTile,
        revealed: true,
      };
      nextTiles[y] = nextRow;
      this.gameState.tiles = nextTiles;

      const monsterLevel = currentTile.monster.value;
      if (monsterLevel > this.gameState.playerLevel) {
        this.gameState.playerHP -= this.calculateDamage(
          monsterLevel,
          this.gameState.playerLevel,
        );
      }
      this.gameState.playerXP += this.calculateXP(monsterLevel);
      this.gameState.playerLevel = this.calculateCurrentLevel();
      this.gameState.monstersRevealed[monsterLevel] += 1;
      return;
    }

    const nextTiles = [...this.gameState.tiles];
    const width = nextTiles[0]?.length ?? 0;
    const queue: Vector2[] = [{ x, y }];
    const visited = new Uint8Array(width * nextTiles.length);
    const clonedRows = new Set<number>();
    visited[y * width + x] = 1;

    const getMutableRow = (rowIndex: number) => {
      if (!clonedRows.has(rowIndex)) {
        nextTiles[rowIndex] = [...nextTiles[rowIndex]];
        clonedRows.add(rowIndex);
      }

      return nextTiles[rowIndex];
    };

    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const current = queue[queueIndex++];

      const tile = nextTiles[current.y]?.[current.x];

      if (!tile || tile.revealed || tile.monster) {
        continue;
      }

      const mutableRow = getMutableRow(current.y);
      mutableRow[current.x] = {
        ...tile,
        revealed: true,
      };

      if (tile.value !== 0) {
        continue;
      }

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }

          const nextX = current.x + dx;
          const nextY = current.y + dy;

          if (
            nextY >= 0 &&
            nextY < nextTiles.length &&
            nextX >= 0 &&
            nextX < nextTiles[nextY].length
          ) {
            const nextIndex = nextY * width + nextX;

            if (!visited[nextIndex]) {
              visited[nextIndex] = 1;
              queue.push({ x: nextX, y: nextY });
            }
          }
        }
      }
    }

    this.gameState.tiles = nextTiles;
  }

  initLevel({
    initialHP,
    sizeX,
    sizeY,
    monsters,
    initialTap,
    blind,
    nextXP,
  }: GameInitializationProps) {
    const tiles: Tile[][] = Array.from({ length: sizeY }, () =>
      Array.from(
        { length: sizeX },
        (): Tile => ({
          revealed: false,
          flag: 0,
          value: 0,
          hideMonster: false,
          monster: undefined,
        }),
      ),
    );

    this.populateLevel(tiles, monsters, initialTap);

    this.gameState = {
      gridSizeX: sizeX,
      gridSizeY: sizeY,
      tiles: tiles,
      monstersRevealed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // index 0 is unused, monster levels start at 1
      totalMonsters: monsters,
      maxMonsterLevel: monsters.length - 1,
      playerLevel: blind ? 0 : 1,
      playerXP: 0,
      nextXP: nextXP,
      playerHP: initialHP,
      playerMaxHP: initialHP,
    };
  }

  populateLevel(tiles: Tile[][], monsters: number[], initialTap?: Vector2) {
    const emptyTiles: Vector2[] = [];
    const height = tiles.length;
    if (height === 0) return;
    const width = tiles[0].length;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (
          !initialTap ||
          Math.abs(x - initialTap.x) > 1 ||
          Math.abs(y - initialTap.y) > 1
        ) {
          emptyTiles.push({ x, y });
        }
      }
    }

    const totalMonsters = monsters.reduce((a, b) => a + b, 0);

    // Partial Fisher-Yates shuffle: we only need to pick `totalMonsters` random tiles
    for (let i = 0; i < totalMonsters; i++) {
      const randIndex = i + Math.floor(Math.random() * (emptyTiles.length - i));
      const temp = emptyTiles[i];
      emptyTiles[i] = emptyTiles[randIndex];
      emptyTiles[randIndex] = temp;
    }

    // Place monsters and compute surrounding values in the same pass
    let emptyTileIndex = 0;
    for (let level = monsters.length - 1; level > 0; level--) {
      const monsterLevel = MonstersArray[level].value;
      for (let i = 0; i < monsters[level]; i++) {
        const pos = emptyTiles[emptyTileIndex++];
        tiles[pos.y][pos.x].monster = MonstersArray[level];

        const minY = Math.max(0, pos.y - 1);
        const maxY = Math.min(height - 1, pos.y + 1);
        const minX = Math.max(0, pos.x - 1);
        const maxX = Math.min(width - 1, pos.x + 1);

        for (let j = minY; j <= maxY; j++) {
          for (let k = minX; k <= maxX; k++) {
            if (j !== pos.y || k !== pos.x) {
              tiles[j][k].value += monsterLevel;
            }
          }
        }
      }
    }
  }

  calculateXP(monsterLevel: number): number {
    if (monsterLevel <= 0) return 0;
    return Math.pow(2, monsterLevel - 1);
  }

  calculateDamage(monsterLevel: number, playerLevel: number): number {
    if (monsterLevel <= playerLevel) return 0;
    return (monsterLevel - playerLevel) * monsterLevel;
  }

  calculateCurrentLevel(): number {
    if (this.gameState.playerLevel === 0 || this.gameState.nextXP.length < 2) {
      return 0;
    }

    let level = 1;
    for (let i = 1; i < this.gameState.nextXP.length; i++) {
      if (this.gameState.playerXP >= this.gameState.nextXP[i]) {
        level = i;
      } else {
        break;
      }
    }
    return level;
  }
}
