import React from 'react';
import { I18nManager, Platform, View } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture, Directions, TouchableWithoutFeedback } from 'react-native-gesture-handler';
export function GestureHandler({
  width = '100%',
  height = '100%',
  onSingleTap,
  onDoubleTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  children
}) {
  const singleTap = Gesture.Tap().runOnJS(true).maxDuration(250).onStart(onSingleTap);
  const doubleTap = Gesture.Tap().runOnJS(true).maxDuration(250).numberOfTaps(2).onStart(onDoubleTap);
  const longPress = Gesture.LongPress().runOnJS(true).onStart(onLongPress);
  const swipeLeft = Gesture.Fling().runOnJS(true).direction(I18nManager.isRTL ? Directions.RIGHT : Directions.LEFT).onStart(onSwipeLeft);
  const swipeRight = Gesture.Fling().runOnJS(true).direction(I18nManager.isRTL ? Directions.LEFT : Directions.RIGHT).onStart(onSwipeRight);
  const swipeUp = Gesture.Fling().runOnJS(true).direction(Directions.UP).onStart(onSwipeUp);
  const swipeDown = Gesture.Fling().runOnJS(true).direction(Directions.DOWN).onStart(onSwipeDown);
  let lastTap = null;
  let timer;
  const handleDoubleTap = () => {
    if (lastTap) {
      onDoubleTap();
      clearTimeout(timer);
      lastTap = null;
    } else {
      lastTap = Date.now();
      timer = setTimeout(() => {
        onSingleTap();
        lastTap = null;
        clearTimeout(timer);
      }, 500);
    }
  };
  if (Platform.OS === 'ios') {
    return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(GestureDetector, {
      gesture: Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress, doubleTap, singleTap)
    }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      style: {
        width,
        height
      },
      onPress: () => Platform.OS === 'ios' && handleDoubleTap(),
      onLongPress: () => Platform.OS === 'ios' && onLongPress()
    }, children)));
  }
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress, doubleTap, singleTap)
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width,
      height
    }
  }, children)));
}