import GameScreen from "@/components/game-screen";
import { GameMode, getGameModeProps } from "@/constants/gameModes";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Platform, StatusBar } from "react-native";

export default function GameView() {
  const { mode } = useLocalSearchParams<{ mode?: GameMode }>();
  const GameModeProps = getGameModeProps(mode != undefined ? mode : "easy");

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") {
        return;
      }

      void NavigationBar.setBehaviorAsync("overlay-swipe");
      void NavigationBar.setVisibilityAsync("hidden");
      StatusBar.setHidden(true, "fade");

      return () => {
        void NavigationBar.setVisibilityAsync("visible");
        StatusBar.setHidden(false, "fade");
      };
    }, []),
  );

  return <GameScreen mode={GameModeProps} />;
}
