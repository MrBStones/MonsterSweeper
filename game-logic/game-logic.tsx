import { MonstersArray } from "@/constants/monsters";
import { GameModeInterface } from "@/interfaces/gameModeInterface";
import {
  GameState,
  InintalizationProps,
  Tile,
  Vector2,
} from "@/types/gameModeTypes";

export class StandardGameMode implements GameModeInterface {
  gameState!: GameState;

  constructor(
    gameState?: GameState,
    initializationProps?: InintalizationProps,
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
  }: InintalizationProps) {
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
      playerLevel: 1,
      playerXP: 0,
      nextXP: this.calculateDynamicXPNeeded(monsters),
      playerHP: initialHP,
      playerMaxHP: initialHP,
    };
  }

  populateLevel(tiles: Tile[][], monsters: number[], initialTap?: Vector2) {
    let monsterCount: number = monsters.reduce((sum, count) => sum + count, 0);
    let emptyTiles: Vector2[] = [];

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        emptyTiles.push({ x, y });
      }
    }

    // remove initial tap area from empty tiles
    if (initialTap) {
      emptyTiles = emptyTiles.filter(
        (tile) =>
          Math.abs(tile.x - initialTap.x) > 1 ||
          Math.abs(tile.y - initialTap.y) > 1,
      );
    }

    // shuffle empty tiles in place
    for (let i = emptyTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptyTiles[i], emptyTiles[j]] = [emptyTiles[j], emptyTiles[i]];
    }

    // place monsters
    let emptyTileIndex = 0;
    for (let level = monsters.length - 1; level > 0; level--) {
      for (let i = 0; i < monsters[level]; i++) {
        const pos = emptyTiles[emptyTileIndex];
        tiles[pos.y][pos.x].monster = MonstersArray[level];
        emptyTileIndex++;
      }
    }

    // place values
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        if (tiles[y][x].monster) {
          const monsterLevel = tiles[y][x].monster!.value;
          for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
              if (
                y + j >= 0 &&
                y + j < tiles.length &&
                x + i >= 0 &&
                x + i < tiles[y].length &&
                !(i === 0 && j === 0)
              ) {
                tiles[y + j][x + i].value += monsterLevel;
              }
            }
          }
        }
      }
    }
  }

  calculateDynamicXPNeeded(monsters: number[]): number[] {
    // Index 0 is a placeholder, Index 1 (Level 1) requires 0 XP to reach
    const xpNeeded: number[] = [0, 0];
    let cumulativeXP = 0;

    // These ratios represent the exact percentage of total available XP
    // the original HUGE mode forces you to get before leveling up early on.
    // Using percentages ensures the curve scales perfectly if you change monster counts!
    const earlyPacingRatios = {
      2: 10 / 52, // ~19.2% of Level 1 XP
      3: 90 / 144, // 62.5% of Level 1-2 XP
      4: 202 / 304, // ~66.4% of Level 1-3 XP
      5: 400 / 592, // ~67.5% of Level 1-4 XP
    };

    for (
      let currentLevel = 1;
      currentLevel < monsters.length - 1;
      currentLevel++
    ) {
      // Add the maximum possible XP for the current monster tier
      cumulativeXP += monsters[currentLevel] * this.calculateXP(currentLevel);
      const nextLevel = currentLevel + 1;

      if (nextLevel >= 6) {
        // THE BOTTLENECK: For level 6+, you must clear 100% of all lower-level monsters.
        xpNeeded.push(cumulativeXP);
      } else {
        // THE SLACK: Apply the pacing ratio to dynamically generate early game milestones.
        // We use Math.round() to keep the numbers clean integers.
        const ratio =
          earlyPacingRatios[nextLevel as keyof typeof earlyPacingRatios];
        xpNeeded.push(Math.round(cumulativeXP * ratio));
      }
    }

    return xpNeeded;
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
