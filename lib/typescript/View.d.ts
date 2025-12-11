import React from 'react';
import type { ReaderProps } from './types';
export type ViewProps = Omit<ReaderProps, 'src' | 'fileSystem'> & {
    templateUri: string;
    allowedUris: string;
};
export declare function View({ templateUri, allowedUris, onStarted, onReady, onDisplayError, onResized, onLocationChange, onRendered, onSearch, onLocationsReady, onSelected, onPressAnnotation, onOrientationChange, onLayout, onNavigationLoaded, onBeginning, onFinish, onPress, onSingleTap, onDoublePress, onDoubleTap, onLongPress, width, height, initialLocation, enableSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, defaultTheme, renderOpeningBookComponent, openingBookComponentContainerStyle, onPressExternalLink, menuItems, onAddAnnotation, onChangeAnnotations, initialAnnotations, onAddBookmark, onRemoveBookmark, onUpdateBookmark, onChangeBookmarks, onIsBookmarked, onContentProcessDidTerminate, initialBookmarks, injectedJavascript, getInjectionJavascriptFn, onWebViewMessage, waitForLocationsReady, keepScrollOffsetOnLocationChange, flow, onChangeSection, }: ViewProps): React.JSX.Element;
//# sourceMappingURL=View.d.ts.map