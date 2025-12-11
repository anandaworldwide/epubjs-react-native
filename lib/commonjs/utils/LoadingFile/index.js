"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadingFile = LoadingFile;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _styles = require("./styles");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function LoadingFile({
  // downloadProgress,
  width,
  height
}) {
  const styles = (0, _styles.getStyles)();
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      width,
      height
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ActivityIndicator, {
    size: "large"
  }));
}