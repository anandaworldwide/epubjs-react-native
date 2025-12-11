"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyles = void 0;
var _reactNative = require("react-native");
let cachedStyles = null;
const getStyles = () => {
  if (!cachedStyles) {
    cachedStyles = _reactNative.StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      },
      text: {
        marginTop: 20,
        fontSize: 18
      }
    });
  }
  return cachedStyles;
};
exports.getStyles = getStyles;