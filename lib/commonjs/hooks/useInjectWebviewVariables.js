"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInjectWebViewVariables = useInjectWebViewVariables;
var _react = require("react");
var _template = _interopRequireDefault(require("../template"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function useInjectWebViewVariables() {
  const injectWebViewVariables = (0, _react.useCallback)(({
    jszip,
    epubjs,
    type,
    book,
    theme,
    enableSelection,
    locations,
    allowScriptedContent,
    allowPopups,
    manager,
    flow,
    snap,
    spread,
    fullsize,
    charactersPerLocation = 1600
  }) => {
    return _template.default.replace(/<script id="jszip"><\/script>/, `<script src="${jszip}"></script>`).replace(/<script id="epubjs"><\/script>/, `<script src="${epubjs}"></script>`).replace(/const type = window.type;/, `const type = '${type}';`).replace(/const file = window.book;/, `const file = '${book}';`).replace(/const theme = window.theme;/, `const theme = ${JSON.stringify(theme)};`).replace(/const initialLocations = window.locations;/, `const initialLocations = ${locations};`).replace(/const enableSelection = window.enable_selection;/, `const enableSelection = ${enableSelection};`).replace(/allowScriptedContent: allowScriptedContent/, `allowScriptedContent: ${allowScriptedContent}`).replace(/allowPopups: allowPopups/, `allowPopups: ${allowPopups}`).replace(/manager: "default"/, `manager: ${JSON.stringify(manager)}`).replace(/flow: "auto"/, `flow: ${JSON.stringify(flow)}`).replace(/snap: undefined/, `snap: ${snap ?? undefined}`).replace(/spread: undefined/, `spread: ${spread ? JSON.stringify(spread) : undefined}`).replace(/fullsize: undefined/, `fullsize: ${fullsize ?? undefined}`).replace(/book\.locations\.generate\(1600\)/, `book.locations.generate(${charactersPerLocation})`);
  }, []);
  return {
    injectWebViewVariables
  };
}