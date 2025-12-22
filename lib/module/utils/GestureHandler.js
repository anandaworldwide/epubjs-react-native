import React from 'react';
import { I18nManager, Platform, View } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture, Directions, TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
  children
}) {
  // Tap gestures are handled via WebView touch events (onContentTap messages)
  // Only swipes and long press are handled here

  const longPress = Gesture.LongPress().runOnJS(true).onStart(onLongPress);
  const swipeLeft = Gesture.Fling().runOnJS(true).direction(I18nManager.isRTL ? Directions.RIGHT : Directions.LEFT).onStart(onSwipeLeft);
  const swipeRight = Gesture.Fling().runOnJS(true).direction(I18nManager.isRTL ? Directions.LEFT : Directions.RIGHT).onStart(onSwipeRight);
  const swipeUp = Gesture.Fling().runOnJS(true).direction(Directions.UP).onStart(onSwipeUp);
  const swipeDown = Gesture.Fling().runOnJS(true).direction(Directions.DOWN).onStart(onSwipeDown);
  if (Platform.OS === 'ios') {
    return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(GestureDetector, {
      gesture: Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress)
    }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      style: {
        width,
        height
      },
      onLongPress: () => Platform.OS === 'ios' && onLongPress()
    }, children)));
  }
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress)
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width,
      height
    }
  }, children)));
}