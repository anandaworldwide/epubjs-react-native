"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isURL = isURL;
function isURL(value) {
  return value.slice(0, 4) === 'http';
}