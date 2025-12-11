"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _light = require("./light");
var _dark = require("./dark");
var _sepia = require("./sepia");
const Themes = {
  LIGHT: _light.light,
  DARK: _dark.dark,
  SEPIA: _sepia.sepia
};
var _default = exports.default = Themes;