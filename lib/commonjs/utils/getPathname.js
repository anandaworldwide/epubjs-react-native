"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceName = getSourceName;
var _sourceType = require("./enums/source-type.enum");
var _getSourceType = require("./getSourceType");
function getSourceName(source) {
  const extension = (0, _getSourceType.getSourceType)(source);
  const randomName = Date.now().toString();
  if (extension === _sourceType.SourceType.BASE64) {
    return randomName;
  }
  if (extension === _sourceType.SourceType.EPUB) {
    return `${randomName}.epub`;
  }
  if (extension === _sourceType.SourceType.OPF) {
    return `${randomName}.opf`;
  }
  return undefined;
}