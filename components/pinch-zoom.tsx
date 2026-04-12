import { ReactNode, useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type PinchZoomProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
};

const clamp = (value: number, lowerBound: number, upperBound: number) =>
  Math.min(Math.max(value, lowerBound), upperBound);

type Point = {
  x: number;
  y: number;
};

type TouchPoint = {
  pageX: number;
  pageY: number;
};

export default function PinchZoom({
  children,
  style,
  contentStyle,
  minScale = 0.5,
  maxScale = 4,
  initialScale = 1,
}: PinchZoomProps) {
  const layout = useRef({ width: 0, height: 0 });
  const gestureMode = useRef<"idle" | "pan" | "pinch">("idle");
  const startScale = useRef(initialScale);
  const currentScale = useRef(initialScale);
  const startTranslate = useRef({ x: 0, y: 0 });
  const currentTranslate = useRef({ x: 0, y: 0 });
  const startCenter = useRef<Point>({ x: 0, y: 0 });
  const startDistance = useRef(0);
  const startTouch = useRef<Point>({ x: 0, y: 0 });

  const scale = useRef(new Animated.Value(initialScale)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    layout.current = { width, height };
  };

  const getCenter = (touches: TouchPoint[]): Point => ({
    x: (touches[0].pageX + touches[1].pageX) / 2,
    y: (touches[0].pageY + touches[1].pageY) / 2,
  });

  const getDistance = (touches: TouchPoint[]) =>
    Math.hypot(
      touches[0].pageX - touches[1].pageX,
      touches[0].pageY - touches[1].pageY,
    );

  const getTouchPoint = (touch: TouchPoint): Point => ({
    x: touch.pageX,
    y: touch.pageY,
  });

  const applyTransform = (nextX: number, nextY: number, nextScale: number) => {
    currentTranslate.current = { x: nextX, y: nextY };
    currentScale.current = nextScale;
    translateX.setValue(nextX);
    translateY.setValue(nextY);
    scale.setValue(nextScale);
  };

  const finishInteraction = () => {
    gestureMode.current = "idle";
  };

  const responder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (event) =>
      event.nativeEvent.touches.length === 2,
    onMoveShouldSetPanResponderCapture: (event, gestureState) =>
      event.nativeEvent.touches.length >= 2 ||
      Math.abs(gestureState.dx) > 4 ||
      Math.abs(gestureState.dy) > 4,
    onMoveShouldSetPanResponder: (event, gestureState) =>
      event.nativeEvent.touches.length >= 2 ||
      Math.abs(gestureState.dx) > 4 ||
      Math.abs(gestureState.dy) > 4,
    onPanResponderGrant: (event) => {
      const touches = event.nativeEvent.touches;

      if (touches.length >= 2) {
        gestureMode.current = "pinch";
        startScale.current = currentScale.current;
        startTranslate.current = currentTranslate.current;
        startCenter.current = getCenter(touches);
        startDistance.current = getDistance(touches);
        return;
      }

      gestureMode.current = "pan";
      startTranslate.current = currentTranslate.current;
      startTouch.current = getTouchPoint(touches[0]);
    },
    onPanResponderMove: (event) => {
      const touches = event.nativeEvent.touches;

      if (touches.length >= 2) {
        if (gestureMode.current !== "pinch") {
          gestureMode.current = "pinch";
          startScale.current = currentScale.current;
          startTranslate.current = currentTranslate.current;
          startCenter.current = getCenter(touches);
          startDistance.current = getDistance(touches);
          return;
        }

        if (layout.current.width === 0 || layout.current.height === 0) {
          return;
        }

        const nextCenter = getCenter(touches);
        const currentDistance = getDistance(touches);
        const scaleRatio = currentDistance / startDistance.current;
        const nextScale = clamp(
          startScale.current * scaleRatio,
          minScale,
          maxScale,
        );
        const appliedScaleRatio = nextScale / startScale.current;
        const centerDeltaX = nextCenter.x - startCenter.current.x;
        const centerDeltaY = nextCenter.y - startCenter.current.y;
        const focalX = nextCenter.x - layout.current.width / 2;
        const focalY = nextCenter.y - layout.current.height / 2;

        applyTransform(
          startTranslate.current.x +
            centerDeltaX +
            focalX * (1 - appliedScaleRatio),
          startTranslate.current.y +
            centerDeltaY +
            focalY * (1 - appliedScaleRatio),
          nextScale,
        );
        return;
      }

      if (gestureMode.current !== "pan") {
        gestureMode.current = "pan";
        startTranslate.current = currentTranslate.current;
        startTouch.current = getTouchPoint(touches[0]);
        return;
      }

      const activeTouch = touches[0];

      applyTransform(
        startTranslate.current.x + (activeTouch.pageX - startTouch.current.x),
        startTranslate.current.y + (activeTouch.pageY - startTouch.current.y),
        currentScale.current,
      );
    },
    onPanResponderRelease: finishInteraction,
    onPanResponderTerminate: finishInteraction,
    onPanResponderTerminationRequest: () => false,
  });

  const animatedStyle = {
    transform: [{ translateX }, { translateY }, { scale }],
  };

  return (
    <View onLayout={handleLayout} style={[styles.container, style]}>
      <Animated.View
        {...responder.panHandlers}
        style={[styles.content, contentStyle, animatedStyle]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    alignSelf: "center",
  },
});
