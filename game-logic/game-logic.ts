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

  onPress(x: number, y: number): void {
    throw new Error("Method not implemented.");
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
      tiles,
      monstersRevealed: [],
      totalMonsters: monsters,
      maxMonsterLevel: monsters.length - 1,
      playerLevel: 1,
      playerXP: 0,
      nextXP: [],
      playerHP: initialHP,
    };
  }

  populateLevel(tiles: Tile[][], monsters: number[], initialTap?: Vector2) {
    const totalTiles = tiles.length * tiles[0].length;
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

    // shuffle empty tiles
    emptyTiles.sort(() => Math.random() - 0.5);

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

    // happy :)
  }
}
