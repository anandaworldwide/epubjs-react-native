"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFsUri = isFsUri;
function isFsUri(value) {
  return value.startsWith('file:///');
}