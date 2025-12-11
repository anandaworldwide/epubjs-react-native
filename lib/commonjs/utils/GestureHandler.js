"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GestureHandler = GestureHandler;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function GestureHandler({
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
  const singleTap = _reactNativeGestureHandler.Gesture.Tap().runOnJS(true).maxDuration(250).onStart(onSingleTap);
  const doubleTap = _reactNativeGestureHandler.Gesture.Tap().runOnJS(true).maxDuration(250).numberOfTaps(2).onStart(onDoubleTap);
  const longPress = _reactNativeGestureHandler.Gesture.LongPress().runOnJS(true).onStart(onLongPress);
  const swipeLeft = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNative.I18nManager.isRTL ? _reactNativeGestureHandler.Directions.RIGHT : _reactNativeGestureHandler.Directions.LEFT).onStart(onSwipeLeft);
  const swipeRight = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNative.I18nManager.isRTL ? _reactNativeGestureHandler.Directions.LEFT : _reactNativeGestureHandler.Directions.RIGHT).onStart(onSwipeRight);
  const swipeUp = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNativeGestureHandler.Directions.UP).onStart(onSwipeUp);
  const swipeDown = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNativeGestureHandler.Directions.DOWN).onStart(onSwipeDown);
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
  if (_reactNative.Platform.OS === 'ios') {
    return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
      gesture: _reactNativeGestureHandler.Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress, doubleTap, singleTap)
    }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.TouchableWithoutFeedback, {
      style: {
        width,
        height
      },
      onPress: () => _reactNative.Platform.OS === 'ios' && handleDoubleTap(),
      onLongPress: () => _reactNative.Platform.OS === 'ios' && onLongPress()
    }, children)));
  }
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: _reactNativeGestureHandler.Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress, doubleTap, singleTap)
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      width,
      height
    }
  }, children)));
}