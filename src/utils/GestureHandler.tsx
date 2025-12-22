import React from 'react';
import { DimensionValue, I18nManager, Platform, View } from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  Directions,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  onSingleTap: () => void;
  onDoubleTap: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onLongPress: () => void;
  children: React.ReactNode;
}

export function GestureHandler({
  width = '100%',
  height = '100%',
  // Single and double taps are now handled via WebView onContentTap messages
  // These props are kept for API compatibility but not used here
  onSingleTap: _onSingleTap,
  onDoubleTap: _onDoubleTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  children,
}: Props) {
  // Tap gestures are handled via WebView touch events (onContentTap messages)
  // Only swipes and long press are handled here

  const longPress = Gesture.LongPress().runOnJS(true).onStart(onLongPress);

  const swipeLeft = Gesture.Fling()
    .runOnJS(true)
    .direction(I18nManager.isRTL ? Directions.RIGHT : Directions.LEFT)
    .onStart(onSwipeLeft);

  const swipeRight = Gesture.Fling()
    .runOnJS(true)
    .direction(I18nManager.isRTL ? Directions.LEFT : Directions.RIGHT)
    .onStart(onSwipeRight);

  const swipeUp = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.UP)
    .onStart(onSwipeUp);

  const swipeDown = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onStart(onSwipeDown);

  if (Platform.OS === 'ios') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector
          gesture={Gesture.Exclusive(
            swipeLeft,
            swipeRight,
            swipeUp,
            swipeDown,
            longPress
          )}
        >
          <TouchableWithoutFeedback
            style={{ width, height }}
            onLongPress={() => Platform.OS === 'ios' && onLongPress()}
          >
            {children}
          </TouchableWithoutFeedback>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector
        gesture={Gesture.Exclusive(
          swipeLeft,
          swipeRight,
          swipeUp,
          swipeDown,
          longPress
        )}
      >
        <View style={{ width, height }}>{children}</View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
