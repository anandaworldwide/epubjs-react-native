import React from 'react';
import type WebView from 'react-native-webview';
import type { ePubCfi, FontSize, Location, AnnotationType, SearchResult, Theme, Annotation, AnnotationStyles, Bookmark, SearchOptions, Section, Toc, Landmark, Flow, PaginateOptions } from './types';
export declare const defaultTheme: Theme;
export interface ReaderContextProps {
    registerBook: (bookRef: WebView) => void;
    setAtStart: (atStart: boolean) => void;
    setAtEnd: (atEnd: boolean) => void;
    setTotalLocations: (totalLocations: number) => void;
    setCurrentLocation: (location: Location) => void;
    setMeta: (meta: {
        cover: string | ArrayBuffer | null | undefined;
        author: string;
        title: string;
        description: string;
        language: string;
        publisher: string;
        rights: string;
    }) => void;
    setProgress: (progress: number) => void;
    setLocations: (locations: ePubCfi[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsRendering: (isRendering: boolean) => void;
    /**
     * Go to specific location in the book
     * @param {ePubCfi} target {@link ePubCfi}
     */
    goToLocation: (cfi: ePubCfi) => void;
    /**
     * Go to previous page in the book
     *
     * keepScrollOffset - default is false
     */
    goPrevious: (options?: PaginateOptions) => void;
    /**
     * Go to next page in the book
     *
     * keepScrollOffset - default is false
     */
    goNext: (options?: PaginateOptions) => void;
    /**
     * Get the total locations of the book
     */
    getLocations: () => ePubCfi[];
    /**
     * Returns the current location of the book
     * @returns {Location} {@link Location}
     */
    getCurrentLocation: () => Location | null;
    /**
     * Returns an object containing the book's metadata
     * @returns { cover: string | ArrayBuffer | null | undefined, author: string, title: string, description: string, language: string, publisher: string, rights: string, }
     */
    getMeta: () => {
        cover: string | ArrayBuffer | null | undefined;
        author: string;
        title: string;
        description: string;
        language: string;
        publisher: string;
        rights: string;
    };
    /**
     * Search for a specific text in the book
     */
    search: (term: string, page?: number, limit?: number, options?: SearchOptions) => void;
    setIsSearching: (value: boolean) => void;
    clearSearchResults: () => void;
    /**
     * @param theme {@link Theme}
     * @description Theme object.
     * @example
     * ```
     * selectTheme({ body: { background: '#fff' } });
     * ```
     */
    changeTheme: (theme: Theme) => void;
    /**
     * Change font size of all elements in the book
     * @param font
     * @see https://www.w3schools.com/cssref/css_websafe_fonts.asp
     */
    changeFontFamily: (fontFamily: string) => void;
    /**
     * Change font size of all elements in the book
     * @param {FontSize} size {@link FontSize}
     */
    changeFontSize: (size: FontSize) => void;
    addAnnotation: (type: AnnotationType, cfiRange: ePubCfi, data?: object, styles?: AnnotationStyles, 
    /**
     * The name of the css class defined in the applied theme that will be used as the icon for the markup.
     * Example of how the class should be defined in the theme file:
     * ```html
     * <style type="text/css">
     *  [ref="epubjs-mk-heart"] {
     *    background: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLj4...") no-repeat;
     *    width: 20px;
     *    height: 20px;
     *    cursor: pointer;
     *    margin-left: 0;
     *  }
     * </style>
     * ```
     *
     *
     * And how it should be defined:
     *
     *
     * ```js
     * addAnnotation('mark', 'epubCfi(20/14...)', {}, undefined, 'epubjs-mk-heart');
     * ```
     */
    iconClass?: string) => void;
    addAnnotationByTagId: (type: AnnotationType, tagId: string, data?: object, styles?: AnnotationStyles, 
    /**
     * The name of the css class defined in the applied theme that will be used as the icon for the markup.
     * Example of how the class should be defined in the theme file:
     * ```html
     * <style type="text/css">
     *  [ref="epubjs-mk-heart"] {
     *    background: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLj4...") no-repeat;
     *    width: 20px;
     *    height: 20px;
     *    cursor: pointer;
     *    margin-left: 0;
     *  }
     * </style>
     * ```
     *
     *
     * And how it should be defined:
     *
     *
     * ```js
     * addAnnotation('mark', 'epubCfi(20/14...)', {}, undefined, 'epubjs-mk-heart');
     * ```
     */
    iconClass?: string) => void;
    updateAnnotation: (annotation: Annotation, data?: object, styles?: AnnotationStyles) => void;
    updateAnnotationByTagId: (tagId: string, data?: object, styles?: AnnotationStyles) => void;
    removeAnnotation: (annotation: Annotation) => void;
    /**
     * Remove all annotations matching with provided cfi
     */
    removeAnnotationByCfi: (cfiRange: ePubCfi) => void;
    removeAnnotationByTagId: (tagId: string) => void;
    removeAnnotations: (type?: AnnotationType) => void;
    setAnnotations: (annotations: Annotation[]) => void;
    setInitialAnnotations: (annotations: Annotation[]) => void;
    setKey: (key: string) => void;
    setSection: (section: Section | null) => void;
    setToc: (toc: Toc) => void;
    setLandmarks: (landmarks: Landmark[]) => void;
    addBookmark: (location: Location, data?: object) => void;
    removeBookmark: (bookmark: Bookmark) => void;
    removeBookmarks: () => void;
    updateBookmark: (id: number, data: object) => void;
    setBookmarks: (bookmarks: Bookmark[]) => void;
    setIsBookmarked: (isBookmarked: boolean) => void;
    /**
     * Works like a unique id for book
     */
    key: string;
    /**
     * A theme object.
     */
    theme: Theme;
    /**
     * Indicates if you are at the beginning of the book
     * @returns {boolean} {@link boolean}
     */
    atStart: boolean;
    /**
     * Indicates if you are at the end of the book
     * @returns {boolean} {@link boolean}
     */
    atEnd: boolean;
    /**
     * The total number of locations
     */
    totalLocations: number;
    /**
     * The current location of the book
     */
    currentLocation: Location | null;
    /**
     * An object containing the book's metadata
     * { cover: string | ArrayBuffer | null | undefined, author: string, title: string, description: string, language: string, publisher: string, rights: string, }
     */
    meta: {
        cover: string | ArrayBuffer | null | undefined;
        author: string;
        title: string;
        description: string;
        language: string;
        publisher: string;
        rights: string;
    };
    /**
     * The progress of the book
     * @returns {number} {@link number}
     */
    progress: number;
    locations: ePubCfi[];
    /**
     * Indicates if the book is loading
     * @returns {boolean} {@link boolean}
     */
    isLoading: boolean;
    /**
     * Indicates if the book is rendering
     * @returns {boolean} {@link boolean}
     */
    isRendering: boolean;
    isSearching: boolean;
    searchResults: {
        results: SearchResult[];
        totalResults: number;
    };
    setSearchResults: ({ results, totalResults, }: {
        results: SearchResult[];
        totalResults: number;
    }) => void;
    removeSelection: () => void;
    annotations: Annotation[];
    section: Section | null;
    toc: Toc;
    landmarks: Landmark[];
    bookmarks: Bookmark[];
    /**
     * Indicates if current page is bookmarked
     */
    isBookmarked: boolean;
    injectJavascript: (script: string) => void;
    changeFlow: (flow: Flow) => void;
    flow: Flow;
    /**
     * Private
     */
    setFlow: (flow: Flow) => void;
}
declare const ReaderContext: React.Context<ReaderContextProps>;
declare function ReaderProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export { ReaderProvider, ReaderContext };
//# sourceMappingURL=context.d.ts.map