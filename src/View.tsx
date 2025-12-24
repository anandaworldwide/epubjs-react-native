import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, View as RNView } from 'react-native';
import { WebView } from 'react-native-webview';
import type {
  ShouldStartLoadRequest,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { defaultTheme as initialTheme, ReaderContext } from './context';
import type { Bookmark, ReaderProps } from './types';
import { OpeningBook } from './utils/OpeningBook';
import INTERNAL_EVENTS from './utils/internalEvents.util';
import { GestureHandler } from './utils/GestureHandler';

export type ViewProps = Omit<ReaderProps, 'src' | 'fileSystem'> & {
  templateUri: string;
  allowedUris: string;
};

export function View({
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
  defaultTheme = initialTheme,
  renderOpeningBookComponent = () => (
    <OpeningBook
      width={width}
      height={height}
      backgroundColor={defaultTheme.body.background}
    />
  ),
  openingBookComponentContainerStyle = {
    width: width || Dimensions.get('screen').width,
    height: height || Dimensions.get('screen').height,
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
  onChangeSection = () => {},
}: ViewProps) {
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
    setFlow,
  } = useContext(ReaderContext);
  const book = useRef<WebView>(null);
  const [selectedText, setSelectedText] = useState<{
    cfiRange: string;
    cfiRangeText: string;
  }>({ cfiRange: '', cfiRangeText: '' });

  useEffect(() => {
    setFlow(flow || 'auto');
  }, [flow, setFlow]);

  useEffect(() => {
    if (getInjectionJavascriptFn && book.current) {
      getInjectionJavascriptFn(book.current.injectJavaScript);
    }
  }, [getInjectionJavascriptFn]);

  const handleChangeIsBookmarked = (
    items: Bookmark[],
    currentLoc = currLoc
  ) => {
    const isBookmarked = items.some(
      (bookmark) =>
        bookmark.location.start.cfi === currentLoc?.start.cfi &&
        bookmark.location.end.cfi === currentLoc?.end.cfi
    );

    setIsBookmarked(isBookmarked);
    onIsBookmarked(isBookmarked);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    const parsedEvent = JSON.parse(event.nativeEvent.data);

    const { type } = parsedEvent;

    if (type === 'onDebug') {
      console.log(
        '[EPUB WebView]',
        parsedEvent.message || JSON.stringify(parsedEvent)
      );
      return;
    }

    if (!INTERNAL_EVENTS.includes(type) && onWebViewMessage) {
      onWebViewMessage(parsedEvent);
      return;
    }

    delete parsedEvent.type;

    if (type === 'meta') {
      const { metadata } = parsedEvent;
      setMeta(metadata);
    }

    if (type === 'onStarted') {
      setIsRendering(true);

      changeTheme(defaultTheme);

      onStarted();
      return;
    }

    if (type === 'onReady') {
      const { totalLocations, currentLocation, progress } = parsedEvent;

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

      onReady(totalLocations, currentLocation, progress);
      return;
    }

    if (type === 'onDisplayError') {
      const { reason } = parsedEvent;
      setIsRendering(false);

      onDisplayError(reason);
      return;
    }

    if (type === 'onResized') {
      const { layout } = parsedEvent;

      onResized(layout);
      return;
    }

    if (type === 'onLocationChange') {
      const { totalLocations, currentLocation, progress, currentSection } =
        parsedEvent;
      setTotalLocations(totalLocations);
      setCurrentLocation(currentLocation);
      setProgress(progress);
      setSection(currentSection);

      if (section?.href !== currentSection?.href) {
        onChangeSection(currentSection);
      }

      handleChangeIsBookmarked(bookmarks, currentLocation);

      if (currentLocation.atStart) setAtStart(true);
      else if (currentLocation.atEnd) setAtEnd(true);
      else {
        setAtStart(false);
        setAtEnd(false);
      }
      onLocationChange(
        totalLocations,
        currentLocation,
        progress,
        currentSection
      );
      return;
    }

    if (type === 'onSearch') {
      const { results, totalResults } = parsedEvent;
      setSearchResults({ results, totalResults });
      setIsSearching(false);

      onSearch(results, totalResults);
      return;
    }

    if (type === 'onLocationsReady') {
      const { epubKey, totalLocations, currentLocation, progress } =
        parsedEvent;
      setLocations(parsedEvent.locations);
      setKey(epubKey);
      setTotalLocations(totalLocations);
      setCurrentLocation(currentLocation);
      setProgress(progress);

      if (waitForLocationsReady) {
        setIsRendering(false);
      }

      onLocationsReady(epubKey, parsedEvent.locations);
      return;
    }

    if (type === 'onSelected') {
      const { cfiRange, text } = parsedEvent;

      setSelectedText({ cfiRange, cfiRangeText: text });
      onSelected(text, cfiRange);
      return;
    }

    if (type === 'onOrientationChange') {
      const { orientation } = parsedEvent;

      onOrientationChange(orientation);
      return;
    }

    if (type === 'onBeginning') {
      setAtStart(true);

      onBeginning();
      return;
    }

    if (type === 'onFinish') {
      setAtEnd(true);

      onFinish();
      return;
    }

    if (type === 'onRendered') {
      const { currentSection } = parsedEvent;

      onRendered(parsedEvent.section, currentSection);
      return;
    }

    if (type === 'onInternalLinkPress') {
      const { href } = parsedEvent;
      console.log(`[EPUB] onInternalLinkPress received, href=${href}`);
      onInternalLinkPress?.(href);
      goToLocation(href);
      console.log('[EPUB] goToLocation called');
      return;
    }

    if (type === 'onContentTap') {
      const { tapZone } = parsedEvent;

      if (tapZone === 'left') {
        // Left zone tap - go to previous page
        if (enableSwipe) {
          goPrevious({
            keepScrollOffset: keepScrollOffsetOnLocationChange,
          });
          onSwipeRight();
        }
      } else if (tapZone === 'right') {
        // Right zone tap - go to next page
        if (enableSwipe) {
          goNext({
            keepScrollOffset: keepScrollOffsetOnLocationChange,
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
      const { layout } = parsedEvent;

      onLayout(layout);
      return;
    }

    if (type === 'onNavigationLoaded') {
      const { toc, landmarks } = parsedEvent;

      setToc(toc);
      setLandmarks(landmarks);

      onNavigationLoaded({ toc, landmarks });
      return;
    }

    if (type === 'onAddAnnotation') {
      const { annotation } = parsedEvent;

      onAddAnnotation(annotation);
      return;
    }

    if (type === 'onChangeAnnotations') {
      const { annotations } = parsedEvent;
      setAnnotations(annotations);
      onChangeAnnotations(annotations);
      return;
    }

    if (type === 'onSetInitialAnnotations') {
      const { annotations } = parsedEvent;
      setAnnotations(annotations);
      return;
    }

    if (type === 'onPressAnnotation') {
      const { annotation } = parsedEvent;

      onPressAnnotation(annotation);
      return;
    }

    if (type === 'onAddBookmark') {
      const { bookmark } = parsedEvent;

      setBookmarks([...bookmarks, bookmark]);
      onAddBookmark(bookmark);
      handleChangeIsBookmarked([...bookmarks, bookmark]);
      onChangeBookmarks([...bookmarks, bookmark]);
      return;
    }

    if (type === 'onRemoveBookmark') {
      const { bookmark } = parsedEvent;

      onRemoveBookmark(bookmark);
      handleChangeIsBookmarked(
        bookmarks.filter(({ id }) => id !== bookmark.id)
      );
      onChangeBookmarks(bookmarks.filter(({ id }) => id !== bookmark.id));
      return;
    }

    if (type === 'onRemoveBookmarks') {
      handleChangeIsBookmarked([]);
      onChangeBookmarks([]);
      return;
    }

    if (type === 'onUpdateBookmark') {
      const { bookmark } = parsedEvent;
      const Bookmarks = bookmarks;

      const index = Bookmarks.findIndex((item) => item.id === bookmark.id);
      Bookmarks[index] = bookmark;

      onUpdateBookmark(bookmark);
      handleChangeIsBookmarked(Bookmarks);
      onChangeBookmarks(Bookmarks);
    }
  };

  const handleOnCustomMenuSelection = (event: {
    nativeEvent: {
      label: string;
      key: string;
      selectedText: string;
    };
  }) => {
    menuItems?.forEach((item) => {
      if (event.nativeEvent.label === item.label) {
        const removeSelectionMenu = item.action(
          selectedText.cfiRange,
          selectedText.cfiRangeText
        );

        if (removeSelectionMenu) {
          removeSelection();
        }
      }
    });
  };

  const handleOnShouldStartLoadWithRequest = (
    request: ShouldStartLoadRequest
  ) => {
    // Handle mailto/tel links
    if (
      (request.url.includes('mailto:') || request.url.includes('tel:')) &&
      onPressExternalLink
    ) {
      onPressExternalLink(request.url);
      return true;
    }

    // Detect internal link navigation (URL differs from main document)
    // This catches edge cases where browser's native hit testing detects a link
    // that our JavaScript closest() missed (e.g., tapping a few pixels outside a link)
    // Let native navigation proceed - epub.js will handle it

    return true;
  };

  useEffect(() => {
    if (initialBookmarks) {
      setBookmarks(initialBookmarks);
    }
  }, [initialBookmarks, setBookmarks]);

  useEffect(() => {
    if (book.current) registerBook(book.current);
  }, [registerBook]);

  return (
    <GestureHandler
      width={width}
      height={height}
      onSingleTap={() => {
        // Single taps are now handled via WebView onContentTap messages
        // This callback is kept for GestureHandler interface but won't be called
      }}
      onDoubleTap={() => {
        // Double taps are now handled via WebView onContentTap messages
        // This callback is kept for GestureHandler interface but won't be called
      }}
      onLongPress={onLongPress}
      onSwipeLeft={() => {
        if (enableSwipe) {
          goNext({
            keepScrollOffset: keepScrollOffsetOnLocationChange,
          });
          onSwipeLeft();
        }
      }}
      onSwipeRight={() => {
        if (enableSwipe) {
          goPrevious({
            keepScrollOffset: keepScrollOffsetOnLocationChange,
          });
          onSwipeRight();
        }
      }}
      onSwipeUp={() => {
        if (enableSwipe) {
          onSwipeUp();
        }
      }}
      onSwipeDown={() => {
        if (enableSwipe) {
          onSwipeDown();
        }
      }}
    >
      {isRendering && (
        <RNView
          style={{
            ...openingBookComponentContainerStyle,
            position: 'absolute',
            zIndex: 2,
          }}
        >
          {renderOpeningBookComponent()}
        </RNView>
      )}

      <WebView
        ref={book}
        source={{ uri: templateUri }}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled
        originWhitelist={['*']}
        scrollEnabled={false}
        mixedContentMode="compatibility"
        onMessage={onMessage}
        menuItems={menuItems?.map((item, key) => ({
          label: item.label,
          key: key.toString(),
        }))}
        onCustomMenuSelection={handleOnCustomMenuSelection}
        allowingReadAccessToURL={allowedUris}
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        allowFileAccess
        javaScriptCanOpenWindowsAutomatically
        onOpenWindow={(event: any) => {
          event.preventDefault();

          if (onPressExternalLink) {
            onPressExternalLink(event.nativeEvent.targetUrl);
          }
        }}
        onShouldStartLoadWithRequest={handleOnShouldStartLoadWithRequest}
        style={{
          width,
          backgroundColor: theme.body.background,
          height,
          opacity: isRendering ? 0 : 1,
        }}
        onContentProcessDidTerminate={onContentProcessDidTerminate}
      />
    </GestureHandler>
  );
}
