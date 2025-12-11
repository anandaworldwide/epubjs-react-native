"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Themes: true,
  ReaderProvider: true,
  useReader: true
};
Object.defineProperty(exports, "ReaderProvider", {
  enumerable: true,
  get: function () {
    return _context.ReaderProvider;
  }
});
Object.defineProperty(exports, "Themes", {
  enumerable: true,
  get: function () {
    return _themes.default;
  }
});
Object.defineProperty(exports, "useReader", {
  enumerable: true,
  get: function () {
    return _useReader.useReader;
  }
});
var _Reader = require("./Reader");
Object.keys(_Reader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Reader[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Reader[key];
    }
  });
});
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _themes = _interopRequireDefault(require("./utils/themes"));
var _context = require("./context");
var _useReader = require("./hooks/useReader");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }