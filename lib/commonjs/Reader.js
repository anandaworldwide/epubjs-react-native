"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reader = Reader;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _LoadingFile = require("./utils/LoadingFile");
var _useInjectWebviewVariables = require("./hooks/useInjectWebviewVariables");
var _context = require("./context");
var _isURL = require("./utils/isURL");
var _getSourceType = require("./utils/getSourceType");
var _getPathname = require("./utils/getPathname");
var _sourceType = require("./utils/enums/source-type.enum");
var _isFsUri = require("./utils/isFsUri");
var _jszip = _interopRequireDefault(require("./jszip"));
var _epubjs = _interopRequireDefault(require("./epubjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Lazy load View to defer react-native-webview import until runtime
// This fixes bridgeless mode compatibility
const View = /*#__PURE__*/(0, _react.lazy)(() => Promise.resolve().then(() => _interopRequireWildcard(require('./View'))).then(m => ({
  default: m.View
})));
function Reader({
  src,
  width = '100%',
  height = '100%',
  defaultTheme = _context.defaultTheme,
  initialLocations,
  initialLocation,
  allowScriptedContent = _reactNative.Platform.OS === 'ios',
  onPressExternalLink,
  renderLoadingFileComponent = props => /*#__PURE__*/_react.default.createElement(_LoadingFile.LoadingFile, _extends({}, props, {
    width: width,
    height: height
  })),
  fileSystem: useFileSystem,
  menuItems,
  manager = 'default',
  flow = 'auto',
  snap,
  spread,
  fullsize,
  charactersPerLocation,
  ...rest
}) {
  const {
    downloadFile,
    size: fileSize,
    progress: downloadProgress,
    success: downloadSuccess,
    error: downloadError,
    documentDirectory,
    writeAsStringAsync
  } = useFileSystem();
  const enableSelection = menuItems ? true : rest.enableSelection || false;
  const allowPopups = onPressExternalLink ? true : rest.allowPopups || false;
  const {
    setIsLoading,
    isLoading
  } = (0, _react.useContext)(_context.ReaderContext);
  const {
    injectWebViewVariables
  } = (0, _useInjectWebviewVariables.useInjectWebViewVariables)();
  const [template, setTemplate] = (0, _react.useState)(null);
  const [templateUrl, setTemplateUrl] = (0, _react.useState)(null);
  const [allowedUris, setAllowedUris] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    (async () => {
      setIsLoading(true);
      const jszipFileUri = `${documentDirectory}/jszip.min.js`;
      const epubjsFileUri = `${documentDirectory}/epub.min.js`;
      try {
        await writeAsStringAsync(jszipFileUri, _jszip.default);
      } catch (e) {
        throw new Error('failed to write jszip js file');
      }
      try {
        await writeAsStringAsync(epubjsFileUri, _epubjs.default);
      } catch (e) {
        throw new Error('failed to write epubjs js file');
      }
      setAllowedUris(`${jszipFileUri},${epubjsFileUri}`);
      if (src) {
        const sourceType = (0, _getSourceType.getSourceType)(src);
        const isExternalSource = (0, _isURL.isURL)(src);
        const isSrcInFs = (0, _isFsUri.isFsUri)(src);
        if (!sourceType) {
          throw new Error(`Invalid source type: ${src}`);
        }
        if (!isExternalSource) {
          if (isSrcInFs) {
            setAllowedUris(`${src}${jszipFileUri},${epubjsFileUri}`);
          }
          if (sourceType === _sourceType.SourceType.BASE64) {
            setTemplate(injectWebViewVariables({
              jszip: jszipFileUri,
              epubjs: epubjsFileUri,
              type: _sourceType.SourceType.BASE64,
              book: src,
              theme: defaultTheme,
              locations: initialLocations,
              enableSelection,
              allowScriptedContent,
              allowPopups,
              manager,
              flow,
              snap,
              spread,
              fullsize,
              charactersPerLocation,
              initialLocation
            }));
            setIsLoading(false);
          } else {
            setTemplate(injectWebViewVariables({
              jszip: jszipFileUri,
              epubjs: epubjsFileUri,
              type: _sourceType.SourceType.BINARY,
              book: src,
              theme: defaultTheme,
              locations: initialLocations,
              enableSelection,
              allowScriptedContent,
              allowPopups,
              manager,
              flow,
              snap,
              spread,
              fullsize,
              charactersPerLocation,
              initialLocation
            }));
            setIsLoading(false);
          }
        }
        if (isExternalSource) {
          const sourceName = (0, _getPathname.getSourceName)(src);
          if (!sourceName) {
            throw new Error(`Invalid source name: ${src}`);
          }
          if (sourceType === _sourceType.SourceType.OPF || sourceType === _sourceType.SourceType.EPUB) {
            setTemplate(injectWebViewVariables({
              jszip: jszipFileUri,
              epubjs: epubjsFileUri,
              type: sourceType,
              book: src,
              theme: defaultTheme,
              locations: initialLocations,
              enableSelection,
              allowScriptedContent,
              allowPopups,
              manager,
              flow,
              snap,
              spread,
              fullsize,
              charactersPerLocation,
              initialLocation
            }));
            setIsLoading(false);
          } else {
            const {
              uri: bookFileUri
            } = await downloadFile(src, sourceName);
            if (!bookFileUri) throw new Error("Couldn't download book");
            setAllowedUris(`${bookFileUri},${jszipFileUri},${epubjsFileUri}`);
            setTemplate(injectWebViewVariables({
              jszip: jszipFileUri,
              epubjs: epubjsFileUri,
              type: sourceType,
              book: bookFileUri,
              theme: defaultTheme,
              locations: initialLocations,
              enableSelection,
              allowScriptedContent,
              allowPopups,
              manager,
              flow,
              snap,
              spread,
              fullsize,
              charactersPerLocation,
              initialLocation
            }));
            setIsLoading(false);
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowPopups, allowScriptedContent, defaultTheme, documentDirectory, downloadFile, enableSelection, initialLocation, initialLocations, injectWebViewVariables, setIsLoading, src
  // ! Causing unknown loop
  // writeAsStringAsync,
  ]);
  (0, _react.useEffect)(() => {
    const saveTemplateFileToDoc = async () => {
      try {
        if (template) {
          const content = template;
          const fileUri = `${documentDirectory}/index.html`;
          await writeAsStringAsync(fileUri, content);
          setTemplateUrl(fileUri);
        }
      } catch (error) {
        throw new Error('Error saving index.html file:');
      }
    };
    if (template) {
      saveTemplateFileToDoc();
    }
  }, [documentDirectory, template, writeAsStringAsync]);
  if (isLoading) {
    return renderLoadingFileComponent({
      fileSize,
      downloadProgress,
      downloadSuccess,
      downloadError
    });
  }
  if (!templateUrl || !allowedUris) {
    return renderLoadingFileComponent({
      fileSize,
      downloadProgress,
      downloadSuccess,
      downloadError
    });
  }
  return /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: renderLoadingFileComponent({
      fileSize,
      downloadProgress,
      downloadSuccess,
      downloadError
    })
  }, /*#__PURE__*/_react.default.createElement(View, _extends({
    templateUri: templateUrl,
    allowedUris: allowedUris,
    width: width,
    height: height,
    defaultTheme: defaultTheme || _context.defaultTheme,
    onPressExternalLink: onPressExternalLink,
    enableSelection: enableSelection,
    menuItems: menuItems,
    manager: manager,
    flow: flow,
    snap: snap,
    initialLocation: initialLocation
  }, rest)));
}