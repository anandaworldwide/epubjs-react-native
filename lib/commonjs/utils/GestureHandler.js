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

  const longPress = _reactNativeGestureHandler.Gesture.LongPress().runOnJS(true).onStart(onLongPress);
  const swipeLeft = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNative.I18nManager.isRTL ? _reactNativeGestureHandler.Directions.RIGHT : _reactNativeGestureHandler.Directions.LEFT).onStart(onSwipeLeft);
  const swipeRight = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNative.I18nManager.isRTL ? _reactNativeGestureHandler.Directions.LEFT : _reactNativeGestureHandler.Directions.RIGHT).onStart(onSwipeRight);
  const swipeUp = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNativeGestureHandler.Directions.UP).onStart(onSwipeUp);
  const swipeDown = _reactNativeGestureHandler.Gesture.Fling().runOnJS(true).direction(_reactNativeGestureHandler.Directions.DOWN).onStart(onSwipeDown);
  if (_reactNative.Platform.OS === 'ios') {
    return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
      gesture: _reactNativeGestureHandler.Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress)
    }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.TouchableWithoutFeedback, {
      style: {
        width,
        height
      },
      onLongPress: () => _reactNative.Platform.OS === 'ios' && onLongPress()
    }, children)));
  }
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: _reactNativeGestureHandler.Gesture.Exclusive(swipeLeft, swipeRight, swipeUp, swipeDown, longPress)
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      width,
      height
    }
  }, children)));
}