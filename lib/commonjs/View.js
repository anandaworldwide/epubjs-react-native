"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = View;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeWebview = require("react-native-webview");
var _context = require("./context");
var _OpeningBook = require("./utils/OpeningBook");
var _internalEvents = _interopRequireDefault(require("./utils/internalEvents.util"));
var _GestureHandler = require("./utils/GestureHandler");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function View({
  templateUri,
  allowedUris,
  onStarted = () => {},
  onReady = () => {},
  onDisplayError = () => {},
  onResized = () => {},
  onLocationChange = () => {},
  onRendered = () => {},
  onSearch = () => {},
  onLocationsReady = () => {},
  onSelected = () => {},
  onPressAnnotation = () => {},
  onOrientationChange = () => {},
  onLayout = () => {},
  onNavigationLoaded = () => {},
  onBeginning = () => {},
  onFinish = () => {},
  onPress = () => {},
  onSingleTap = () => {},
  // Double tap callbacks kept for API compatibility
  onDoublePress: _onDoublePress = () => {},
  onDoubleTap: _onDoubleTap = () => {},
  onLongPress = () => {},
  width,
  height,
  enableSwipe = true,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  onSwipeUp = () => {},
  onSwipeDown = () => {},
  defaultTheme = _context.defaultTheme,
  renderOpeningBookComponent = () => /*#__PURE__*/_react.default.createElement(_OpeningBook.OpeningBook, {
    width: width,
    height: height,
    backgroundColor: defaultTheme.body.background
  }),
  openingBookComponentContainerStyle = {
    width: width || _reactNative.Dimensions.get('screen').width,
    height: height || _reactNative.Dimensions.get('screen').height
  },
  onPressExternalLink,
  onInternalLinkPress,
  menuItems,
  onAddAnnotation = () => {},
  onChangeAnnotations = () => {},
  initialAnnotations,
  onAddBookmark = () => {},
  onRemoveBookmark = () => {},
  onUpdateBookmark = () => {},
  onChangeBookmarks = () => {},
  onIsBookmarked = () => {},
  onContentProcessDidTerminate = () => {},
  initialBookmarks,
  injectedJavascript,
  getInjectionJavascriptFn,
  onWebViewMessage,
  waitForLocationsReady = false,
  keepScrollOffsetOnLocationChange,
  flow,
  onChangeSection = () => {}
}) {
  const {
    registerBook,
    setTotalLocations,
    setCurrentLocation,
    setMeta,
    setProgress,
    setLocations,
    setAtStart,
    setAtEnd,
    goNext,
    goPrevious,
    isRendering,
    setIsRendering,
    goToLocation,
    changeTheme,
    setKey,
    setSearchResults,
    theme,
    removeSelection,
    setAnnotations,
    setInitialAnnotations,
    section,
    setSection,
    setToc,
    setLandmarks,
    setBookmarks,
    bookmarks,
    setIsBookmarked,
    currentLocation: currLoc,
    setIsSearching,
    setFlow
  } = (0, _react.useContext)(_context.ReaderContext);
  const book = (0, _react.useRef)(null);
  const [selectedText, setSelectedText] = (0, _react.useState)({
    cfiRange: '',
    cfiRangeText: ''
  });
  (0, _react.useEffect)(() => {
    setFlow(flow || 'auto');
  }, [flow, setFlow]);
  (0, _react.useEffect)(() => {
    if (getInjectionJavascriptFn && book.current) {
      getInjectionJavascriptFn(book.current.injectJavaScript);
    }
  }, [getInjectionJavascriptFn]);
  const handleChangeIsBookmarked = (items, currentLoc = currLoc) => {
    const isBookmarked = items.some(bookmark => bookmark.location.start.cfi === currentLoc?.start.cfi && bookmark.location.end.cfi === currentLoc?.end.cfi);
    setIsBookmarked(isBookmarked);
    onIsBookmarked(isBookmarked);
  };
  const onMessage = event => {
    const parsedEvent = JSON.parse(event.nativeEvent.data);
    const {
      type
    } = parsedEvent;
    if (type === 'onDebug') {
      console.log('[EPUB WebView]', parsedEvent.message || JSON.stringify(parsedEvent));
      return;
    }
    if (!_internalEvents.default.includes(type) && onWebViewMessage) {
      return onWebViewMessage(parsedEvent);
    }
    delete parsedEvent.type;
    if (type === 'meta') {
      const {
        metadata
      } = parsedEvent;
      setMeta(metadata);
    }
    if (type === 'onStarted') {
      setIsRendering(true);
      changeTheme(defaultTheme);
      return onStarted();
    }
    if (type === 'onReady') {
      const {
        totalLocations,
        currentLocation,
        progress
      } = parsedEvent;
      if (initialAnnotations) {
        setInitialAnnotations(initialAnnotations);
      }
      if (injectedJavascript) {
        book.current?.injectJavaScript(injectedJavascript);
      }

      // Delay hiding the overlay to ensure WebView content is fully painted
      // Use setTimeout to give extra buffer time for WebView to settle
      if (!waitForLocationsReady) {
        setTimeout(() => {
          setIsRendering(false);
        }, 50);
      }
      return onReady(totalLocations, currentLocation, progress);
    }
    if (type === 'onDisplayError') {
      const {
        reason
      } = parsedEvent;
      setIsRendering(false);
      return onDisplayError(reason);
    }
    if (type === 'onResized') {
      const {
        layout
      } = parsedEvent;
      return onResized(layout);
    }
    if (type === 'onLocationChange') {
      const {
        totalLocations,
        currentLocation,
        progress,
        currentSection
      } = parsedEvent;
      setTotalLocations(totalLocations);
      setCurrentLocation(currentLocation);
      setProgress(progress);
      setSection(currentSection);
      if (section?.href !== currentSection?.href) {
        onChangeSection(currentSection);
      }
      handleChangeIsBookmarked(bookmarks, currentLocation);
      if (currentLocation.atStart) setAtStart(true);else if (currentLocation.atEnd) setAtEnd(true);else {
        setAtStart(false);
        setAtEnd(false);
      }
      return onLocationChange(totalLocations, currentLocation, progress, currentSection);
    }
    if (type === 'onSearch') {
      const {
        results,
        totalResults
      } = parsedEvent;
      setSearchResults({
        results,
        totalResults
      });
      setIsSearching(false);
      return onSearch(results, totalResults);
    }
    if (type === 'onLocationsReady') {
      const {
        epubKey,
        totalLocations,
        currentLocation,
        progress
      } = parsedEvent;
      setLocations(parsedEvent.locations);
      setKey(epubKey);
      setTotalLocations(totalLocations);
      setCurrentLocation(currentLocation);
      setProgress(progress);
      if (waitForLocationsReady) {
        setIsRendering(false);
      }
      return onLocationsReady(epubKey, parsedEvent.locations);
    }
    if (type === 'onSelected') {
      const {
        cfiRange,
        text
      } = parsedEvent;
      setSelectedText({
        cfiRange,
        cfiRangeText: text
      });
      return onSelected(text, cfiRange);
    }
    if (type === 'onOrientationChange') {
      const {
        orientation
      } = parsedEvent;
      return onOrientationChange(orientation);
    }
    if (type === 'onBeginning') {
      setAtStart(true);
      return onBeginning();
    }
    if (type === 'onFinish') {
      setAtEnd(true);
      return onFinish();
    }
    if (type === 'onRendered') {
      const {
        currentSection
      } = parsedEvent;
      return onRendered(parsedEvent.section, currentSection);
    }
    if (type === 'onInternalLinkPress') {
      const {
        href
      } = parsedEvent;
      onInternalLinkPress?.(href);
      goToLocation(href);
      return;
    }
    if (type === 'onContentTap') {
      const {
        tapZone
      } = parsedEvent;
      if (tapZone === 'left') {
        // Left zone tap - go to previous page
        if (enableSwipe) {
          goPrevious({
            keepScrollOffset: keepScrollOffsetOnLocationChange
          });
          onSwipeRight();
        }
      } else if (tapZone === 'right') {
        // Right zone tap - go to next page
        if (enableSwipe) {
          goNext({
            keepScrollOffset: keepScrollOffsetOnLocationChange
          });
          onSwipeLeft();
        }
      }
      return;
    }
    if (type === 'toggle-fullscreen') {
      // Center tap - call tap callbacks and pass to onWebViewMessage
      onPress();
      onSingleTap();
      if (onWebViewMessage) {
        onWebViewMessage(parsedEvent);
      }
      return;
    }
    if (type === 'onLayout') {
      const {
        layout
      } = parsedEvent;
      return onLayout(layout);
    }
    if (type === 'onNavigationLoaded') {
      const {
        toc,
        landmarks
      } = parsedEvent;
      setToc(toc);
      setLandmarks(landmarks);
      return onNavigationLoaded({
        toc,
        landmarks
      });
    }
    if (type === 'onAddAnnotation') {
      const {
        annotation
      } = parsedEvent;
      return onAddAnnotation(annotation);
    }
    if (type === 'onChangeAnnotations') {
      const {
        annotations
      } = parsedEvent;
      setAnnotations(annotations);
      return onChangeAnnotations(annotations);
    }
    if (type === 'onSetInitialAnnotations') {
      const {
        annotations
      } = parsedEvent;
      setAnnotations(annotations);
      return () => {};
    }
    if (type === 'onPressAnnotation') {
      const {
        annotation
      } = parsedEvent;
      return onPressAnnotation(annotation);
    }
    if (type === 'onAddBookmark') {
      const {
        bookmark
      } = parsedEvent;
      setBookmarks([...bookmarks, bookmark]);
      onAddBookmark(bookmark);
      handleChangeIsBookmarked([...bookmarks, bookmark]);
      return onChangeBookmarks([...bookmarks, bookmark]);
    }
    if (type === 'onRemoveBookmark') {
      const {
        bookmark
      } = parsedEvent;
      onRemoveBookmark(bookmark);
      handleChangeIsBookmarked(bookmarks.filter(({
        id
      }) => id !== bookmark.id));
      return onChangeBookmarks(bookmarks.filter(({
        id
      }) => id !== bookmark.id));
    }
    if (type === 'onRemoveBookmarks') {
      handleChangeIsBookmarked([]);
      return onChangeBookmarks([]);
    }
    if (type === 'onUpdateBookmark') {
      const {
        bookmark
      } = parsedEvent;
      const Bookmarks = bookmarks;
      const index = Bookmarks.findIndex(item => item.id === bookmark.id);
      Bookmarks[index] = bookmark;
      onUpdateBookmark(bookmark);
      handleChangeIsBookmarked(Bookmarks);
      return onChangeBookmarks(Bookmarks);
    }
    return () => {};
  };
  const handleOnCustomMenuSelection = event => {
    menuItems?.forEach(item => {
      if (event.nativeEvent.label === item.label) {
        const removeSelectionMenu = item.action(selectedText.cfiRange, selectedText.cfiRangeText);
        if (removeSelectionMenu) {
          removeSelection();
        }
      }
    });
  };
  const handleOnShouldStartLoadWithRequest = request => {
    // Handle mailto/tel links
    if ((request.url.includes('mailto:') || request.url.includes('tel:')) && onPressExternalLink) {
      onPressExternalLink(request.url);
      return true;
    }

    // Detect internal link navigation (URL differs from main document)
    // This catches edge cases where browser's native hit testing detects a link
    // that our JavaScript closest() missed (e.g., tapping a few pixels outside a link)
    // Let native navigation proceed - epub.js will handle it

    return true;
  };
  (0, _react.useEffect)(() => {
    if (initialBookmarks) {
      setBookmarks(initialBookmarks);
    }
  }, [initialBookmarks, setBookmarks]);
  (0, _react.useEffect)(() => {
    if (book.current) registerBook(book.current);
  }, [registerBook]);
  return /*#__PURE__*/_react.default.createElement(_GestureHandler.GestureHandler, {
    width: width,
    height: height,
    onSingleTap: () => {
      // Single taps are now handled via WebView onContentTap messages
      // This callback is kept for GestureHandler interface but won't be called
    },
    onDoubleTap: () => {
      // Double taps are now handled via WebView onContentTap messages
      // This callback is kept for GestureHandler interface but won't be called
    },
    onLongPress: onLongPress,
    onSwipeLeft: () => {
      if (enableSwipe) {
        goNext({
          keepScrollOffset: keepScrollOffsetOnLocationChange
        });
        onSwipeLeft();
      }
    },
    onSwipeRight: () => {
      if (enableSwipe) {
        goPrevious({
          keepScrollOffset: keepScrollOffsetOnLocationChange
        });
        onSwipeRight();
      }
    },
    onSwipeUp: () => {
      if (enableSwipe) {
        onSwipeUp();
      }
    },
    onSwipeDown: () => {
      if (enableSwipe) {
        onSwipeDown();
      }
    }
  }, isRendering && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      ...openingBookComponentContainerStyle,
      position: 'absolute',
      zIndex: 2
    }
  }, renderOpeningBookComponent()), /*#__PURE__*/_react.default.createElement(_reactNativeWebview.WebView, {
    ref: book,
    source: {
      uri: templateUri
    },
    showsVerticalScrollIndicator: false,
    javaScriptEnabled: true,
    originWhitelist: ['*'],
    scrollEnabled: false,
    mixedContentMode: "compatibility",
    onMessage: onMessage,
    menuItems: menuItems?.map((item, key) => ({
      label: item.label,
      key: key.toString()
    })),
    onCustomMenuSelection: handleOnCustomMenuSelection,
    allowingReadAccessToURL: allowedUris,
    allowUniversalAccessFromFileURLs: true,
    allowFileAccessFromFileURLs: true,
    allowFileAccess: true,
    javaScriptCanOpenWindowsAutomatically: true,
    onOpenWindow: event => {
      event.preventDefault();
      if (onPressExternalLink) {
        onPressExternalLink(event.nativeEvent.targetUrl);
      }
    },
    onShouldStartLoadWithRequest: handleOnShouldStartLoadWithRequest,
    style: {
      width,
      backgroundColor: theme.body.background,
      height,
      opacity: isRendering ? 0 : 1
    },
    onContentProcessDidTerminate: onContentProcessDidTerminate
  }));
}