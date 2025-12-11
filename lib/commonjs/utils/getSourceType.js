"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceType = getSourceType;
var _sourceType = require("./enums/source-type.enum");
function getSourceType(source) {
  if (source.includes('base64,') || source.length > 1000) {
    return _sourceType.SourceType.BASE64;
  }
  if (source.includes('.epub')) {
    return _sourceType.SourceType.EPUB;
  }
  if (source.includes('.opf')) {
    return _sourceType.SourceType.OPF;
  }
  return undefined;
}