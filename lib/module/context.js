import React, { createContext, useCallback, useMemo, useReducer, useRef } from 'react';
import * as webViewInjectFunctions from './utils/webViewInjectFunctions';
var Types = /*#__PURE__*/function (Types) {
  Types["CHANGE_THEME"] = "CHANGE_THEME";
  Types["CHANGE_FONT_SIZE"] = "CHANGE_FONT_SIZE";
  Types["CHANGE_FONT_FAMILY"] = "CHANGE_FONT_FAMILY";
  Types["SET_AT_START"] = "SET_AT_START";
  Types["SET_AT_END"] = "SET_AT_END";
  Types["SET_KEY"] = "SET_KEY";
  Types["SET_TOTAL_LOCATIONS"] = "SET_TOTAL_LOCATIONS";
  Types["SET_CURRENT_LOCATION"] = "SET_CURRENT_LOCATION";
  Types["SET_META"] = "SET_META";
  Types["SET_PROGRESS"] = "SET_PROGRESS";
  Types["SET_LOCATIONS"] = "SET_LOCATIONS";
  Types["SET_IS_LOADING"] = "SET_IS_LOADING";
  Types["SET_IS_RENDERING"] = "SET_IS_RENDERING";
  Types["SET_SEARCH_RESULTS"] = "SET_SEARCH_RESULTS";
  Types["SET_IS_SEARCHING"] = "SET_IS_SEARCHING";
  Types["SET_ANNOTATIONS"] = "SET_ANNOTATIONS";
  Types["SET_SECTION"] = "SET_SECTION";
  Types["SET_TOC"] = "SET_TOC";
  Types["SET_LANDMARKS"] = "SET_LANDMARKS";
  Types["SET_BOOKMARKS"] = "SET_BOOKMARKS";
  Types["SET_IS_BOOKMARKED"] = "SET_IS_BOOKMARKED";
  Types["SET_FLOW"] = "SET_FLOW";
  return Types;
}(Types || {});
export const defaultTheme = {
  'body': {
    background: '#fff'
  },
  'span': {
    color: '#000 !important'
  },
  'p': {
    color: '#000 !important'
  },
  'li': {
    color: '#000 !important'
  },
  'h1': {
    color: '#000 !important'
  },
  'a': {
    'color': '#000 !important',
    'pointer-events': 'auto',
    'cursor': 'pointer'
  },
  '::selection': {
    background: 'lightskyblue'
  }
};
const initialState = {
  theme: defaultTheme,
  fontFamily: 'Helvetica',
  fontSize: '12pt',
  atStart: false,
  atEnd: false,
  key: '',
  totalLocations: 0,
  currentLocation: null,
  meta: {
    cover: '',
    author: '',
    title: '',
    description: '',
    language: '',
    publisher: '',
    rights: ''
  },
  progress: 0,
  locations: [],
  isLoading: true,
  isRendering: true,
  isSearching: false,
  searchResults: {
    results: [],
    totalResults: 0
  },
  annotations: [],
  section: null,
  toc: [],
  landmarks: [],
  bookmarks: [],
  isBookmarked: false,
  flow: 'auto'
};
function bookReducer(state, action) {
  switch (action.type) {
    case Types.CHANGE_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case Types.CHANGE_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      };
    case Types.CHANGE_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.payload
      };
    case Types.SET_AT_START:
      return {
        ...state,
        atStart: action.payload
      };
    case Types.SET_AT_END:
      return {
        ...state,
        atEnd: action.payload
      };
    case Types.SET_KEY:
      return {
        ...state,
        key: action.payload
      };
    case Types.SET_TOTAL_LOCATIONS:
      return {
        ...state,
        totalLocations: action.payload
      };
    case Types.SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload
      };
    case Types.SET_META:
      return {
        ...state,
        meta: action.payload
      };
    case Types.SET_PROGRESS:
      return {
        ...state,
        progress: action.payload
      };
    case Types.SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    case Types.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case Types.SET_IS_RENDERING:
      return {
        ...state,
        isRendering: action.payload
      };
    case Types.SET_IS_SEARCHING:
      return {
        ...state,
        isSearching: action.payload
      };
    case Types.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };
    case Types.SET_ANNOTATIONS:
      return {
        ...state,
        annotations: action.payload
      };
    case Types.SET_SECTION:
      return {
        ...state,
        section: action.payload
      };
    case Types.SET_TOC:
      return {
        ...state,
        toc: action.payload
      };
    case Types.SET_LANDMARKS:
      return {
        ...state,
        landmarks: action.payload
      };
    case Types.SET_BOOKMARKS:
      return {
        ...state,
        bookmarks: action.payload
      };
    case Types.SET_IS_BOOKMARKED:
      return {
        ...state,
        isBookmarked: action.payload
      };
    case Types.SET_FLOW:
      return {
        ...state,
        flow: action.payload
      };
    default:
      return state;
  }
}
const ReaderContext = /*#__PURE__*/createContext({
  registerBook: () => {},
  setAtStart: () => {},
  setAtEnd: () => {},
  setTotalLocations: () => {},
  setCurrentLocation: () => {},
  setMeta: () => {},
  setProgress: () => {},
  setLocations: () => {},
  setIsLoading: () => {},
  setIsRendering: () => {},
  goToLocation: () => {},
  goPrevious: () => {},
  goNext: () => {},
  getLocations: () => [],
  getCurrentLocation: () => null,
  getMeta: () => ({
    cover: '',
    author: '',
    title: '',
    description: '',
    language: '',
    publisher: '',
    rights: ''
  }),
  search: () => {},
  clearSearchResults: () => {},
  setIsSearching: () => {},
  changeTheme: () => {},
  changeFontFamily: () => {},
  changeFontSize: () => {},
  setKey: () => {},
  setSection: () => {},
  setToc: () => {},
  setLandmarks: () => {},
  addBookmark: () => {},
  removeBookmark: () => {},
  removeBookmarks: () => {},
  updateBookmark: () => {},
  setBookmarks: () => {},
  setIsBookmarked: () => {},
  key: '',
  theme: defaultTheme,
  atStart: false,
  atEnd: false,
  totalLocations: 0,
  currentLocation: null,
  meta: {
    cover: '',
    author: '',
    title: '',
    description: '',
    language: '',
    publisher: '',
    rights: ''
  },
  progress: 0,
  locations: [],
  isLoading: true,
  isRendering: true,
  isSearching: false,
  searchResults: {
    results: [],
    totalResults: 0
  },
  setSearchResults: () => {},
  removeSelection: () => {},
  addAnnotation: () => {},
  addAnnotationByTagId: () => {},
  updateAnnotation: () => {},
  updateAnnotationByTagId: () => {},
  removeAnnotation: () => {},
  removeAnnotationByTagId: () => {},
  removeAnnotationByCfi: () => {},
  removeAnnotations: () => {},
  setAnnotations: () => {},
  setInitialAnnotations: () => {},
  annotations: [],
  section: null,
  toc: [],
  landmarks: [],
  bookmarks: [],
  isBookmarked: false,
  injectJavascript: () => {},
  changeFlow: () => {},
  setFlow: () => {},
  flow: 'auto'
});
function ReaderProvider({
  children
}) {
  const [state, dispatch] = useReducer(bookReducer, initialState);
  const book = useRef(null);
  const registerBook = useCallback(bookRef => {
    book.current = bookRef;
  }, []);
  const changeTheme = useCallback(theme => {
    book.current?.injectJavaScript(`
      rendition.themes.register({ theme: ${JSON.stringify(theme)} });
      rendition.themes.select('theme');
      rendition.views().forEach(view => view.pane ? view.pane.render() : null); true;
    `);
    dispatch({
      type: Types.CHANGE_THEME,
      payload: theme
    });
  }, []);
  const changeFontFamily = useCallback(fontFamily => {
    book.current?.injectJavaScript(`
      rendition.themes.font('${fontFamily}');
      rendition.views().forEach(view => view.pane ? view.pane.render() : null); true;
    `);
    dispatch({
      type: Types.CHANGE_FONT_FAMILY,
      payload: fontFamily
    });
  }, []);
  const changeFontSize = useCallback(size => {
    book.current?.injectJavaScript(`
      rendition.themes.fontSize('${size}');
      rendition.views().forEach(view => view.pane ? view.pane.render() : null); true;
    `);
    dispatch({
      type: Types.CHANGE_FONT_SIZE,
      payload: size
    });
  }, []);
  const setAtStart = useCallback(atStart => {
    dispatch({
      type: Types.SET_AT_START,
      payload: atStart
    });
  }, []);
  const setAtEnd = useCallback(atEnd => {
    dispatch({
      type: Types.SET_AT_END,
      payload: atEnd
    });
  }, []);
  const setTotalLocations = useCallback(totalLocations => {
    dispatch({
      type: Types.SET_TOTAL_LOCATIONS,
      payload: totalLocations
    });
  }, []);
  const setCurrentLocation = useCallback(location => {
    dispatch({
      type: Types.SET_CURRENT_LOCATION,
      payload: location
    });
  }, []);
  const setMeta = useCallback(meta => {
    dispatch({
      type: Types.SET_META,
      payload: meta
    });
  }, []);
  const setProgress = useCallback(progress => {
    dispatch({
      type: Types.SET_PROGRESS,
      payload: progress
    });
  }, []);
  const setLocations = useCallback(locations => {
    dispatch({
      type: Types.SET_LOCATIONS,
      payload: locations
    });
  }, []);
  const setIsLoading = useCallback(isLoading => {
    dispatch({
      type: Types.SET_IS_LOADING,
      payload: isLoading
    });
  }, []);
  const setIsRendering = useCallback(isRendering => {
    dispatch({
      type: Types.SET_IS_RENDERING,
      payload: isRendering
    });
  }, []);
  const goToLocation = useCallback(targetCfi => {
    // Escape special characters to prevent JavaScript injection issues
    const escaped = targetCfi.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    book.current?.injectJavaScript(`rendition.display('${escaped}'); true`);
  }, []);
  const goPrevious = useCallback(options => {
    webViewInjectFunctions.injectJavaScript(book, `
      ${!options?.keepScrollOffset && state.flow === 'scrolled-doc' ? `rendition.once('relocated', () => rendition.moveTo(0));` : ''}
      rendition.prev();
    `);
  }, [state.flow]);
  const goNext = useCallback(options => {
    webViewInjectFunctions.injectJavaScript(book, `
      ${!options?.keepScrollOffset && state.flow === 'scrolled-doc' ? `rendition.once('relocated', () => rendition.moveTo(0));` : ''}
      rendition.next();
    `);
  }, [state.flow]);
  const getLocations = useCallback(() => state.locations, [state.locations]);
  const getCurrentLocation = useCallback(() => state.currentLocation, [state.currentLocation]);
  const getMeta = useCallback(() => state.meta, [state.meta]);
  const search = useCallback((term, page, limit, options) => {
    dispatch({
      type: Types.SET_SEARCH_RESULTS,
      payload: {
        results: [],
        totalResults: 0
      }
    });
    dispatch({
      type: Types.SET_IS_SEARCHING,
      payload: true
    });
    webViewInjectFunctions.injectJavaScript(book, `
      const page = ${page || 1};
      const limit = ${limit || 20};
      const term = ${JSON.stringify(term)};
      const chapterId = ${JSON.stringify(options?.sectionId)};
      const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
      if (!term) {
        reactNativeWebview.postMessage(
          JSON.stringify({ type: 'onSearch', results: [] })
        );
      } else {
        Promise.all(
          book.spine.spineItems.map((item) => {
            return item.load(book.load.bind(book)).then(() => {
              let results = item.find(term.trim());
              const locationHref = item.href;

              let [match] = flatten(book.navigation.toc)
              .filter((chapter, index) => {
                  return book.canonical(chapter.href).includes(locationHref)
              }, null);

              if (results.length > 0) {
                results = results.map(result => ({ ...result, section: { ...match, index: book.navigation.toc.findIndex(elem => elem.id === match?.id) } }));

                if (chapterId) {
                  results = results.filter(result => result.section.id === chapterId);
                }
              }

              item.unload();
              return Promise.resolve(results);
            });
          })
        ).then((results) => {
          const items = [].concat.apply([], results);

          reactNativeWebview.postMessage(
            JSON.stringify({ type: 'onSearch', results: items.slice((page - 1) * limit, page * limit), totalResults: items.length })
          );
        }).catch(err => {
          alert(err?.message);

          reactNativeWebview.postMessage(
            JSON.stringify({ type: 'onSearch', results: [], totalResults: 0 })
          );
        })
      }
    `);
  }, []);
  const clearSearchResults = useCallback(() => {
    dispatch({
      type: Types.SET_SEARCH_RESULTS,
      payload: {
        results: [],
        totalResults: 0
      }
    });
  }, []);
  const setIsSearching = useCallback(value => {
    dispatch({
      type: Types.SET_IS_SEARCHING,
      payload: value
    });
  }, []);
  const setSearchResults = useCallback(({
    results,
    totalResults
  }) => {
    dispatch({
      type: Types.SET_SEARCH_RESULTS,
      payload: {
        results,
        totalResults
      }
    });
  }, []);
  const addAnnotation = useCallback((type, cfiRange, data, styles, iconClass = '') => {
    webViewInjectFunctions.injectJavaScript(book, `
          ${webViewInjectFunctions.addAnnotation(type, cfiRange, data, iconClass, styles)}

          ${webViewInjectFunctions.onChangeAnnotations()}
        `);
  }, []);
  const addAnnotationByTagId = useCallback((type, tagId, data, styles, iconClass = '') => {
    webViewInjectFunctions.injectJavaScript(book, webViewInjectFunctions.addAnnotationByTagId(type, tagId, data, iconClass, styles));
  }, []);
  const updateAnnotation = useCallback((annotation, data = {}, styles) => {
    webViewInjectFunctions.injectJavaScript(book, webViewInjectFunctions.updateAnnotation(annotation, data, styles));
  }, []);
  const updateAnnotationByTagId = useCallback((tagId, data = {}, styles) => {
    webViewInjectFunctions.injectJavaScript(book, webViewInjectFunctions.updateAnnotationByTagId(tagId, data, styles));
  }, []);
  const removeAnnotation = useCallback(annotation => {
    webViewInjectFunctions.injectJavaScript(book, `
        rendition.annotations.remove(${JSON.stringify(annotation.cfiRange)}, ${JSON.stringify(annotation.type)});

        ${webViewInjectFunctions.onChangeAnnotations()}
    `);
  }, []);
  const removeAnnotationByTagId = useCallback(tagId => {
    webViewInjectFunctions.injectJavaScript(book, webViewInjectFunctions.removeAnnotationByTagId(tagId));
  }, []);
  const removeAnnotationByCfi = useCallback(cfiRange => {
    webViewInjectFunctions.injectJavaScript(book, `
        ['highlight', 'underline', 'mark'].forEach(type => {
          rendition.annotations.remove('${cfiRange}', type);
        });

        ${webViewInjectFunctions.onChangeAnnotations()}
    `);
  }, []);
  const removeAnnotations = useCallback(type => {
    webViewInjectFunctions.injectJavaScript(book, `
        let annotations = Object.values(rendition.annotations._annotations);

        if (typeof ${type} === 'string') {
          annotations = annotations.filter(annotation => annotation.type === ${type});
        }

        annotations.forEach(annotation => {
          rendition.annotations.remove(annotation.cfiRange, annotation.type);
        });

        ${webViewInjectFunctions.onChangeAnnotations()}
      `);
  }, []);
  const setAnnotations = useCallback(annotations => {
    dispatch({
      type: Types.SET_ANNOTATIONS,
      payload: annotations
    });
  }, []);
  const setInitialAnnotations = useCallback(annotations => {
    annotations.forEach(annotation => {
      webViewInjectFunctions.injectJavaScript(book, webViewInjectFunctions.addAnnotation(annotation.type, annotation.cfiRange, annotation.data, annotation.iconClass, annotation.styles, annotation.cfiRangeText, true));
    });
    const transform = JSON.stringify(annotations);
    webViewInjectFunctions.injectJavaScript(book, `
        const initialAnnotations = JSON.stringify(${transform});
        const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;

        reactNativeWebview.postMessage(JSON.stringify({
          type: 'onSetInitialAnnotations',
          annotations: ${webViewInjectFunctions.mapArrayObjectsToAnnotations('JSON.parse(initialAnnotations)')}
        }));
      `);
  }, []);
  const setKey = useCallback(key => {
    dispatch({
      type: Types.SET_KEY,
      payload: key
    });
  }, []);
  const removeSelection = useCallback(() => {
    webViewInjectFunctions.injectJavaScript(book, `
        const getSelections = () => rendition.getContents().map(contents => contents.window.getSelection());
        const clearSelection = () => getSelections().forEach(s => s.removeAllRanges());
        clearSelection();
    `);
  }, []);
  const setSection = useCallback(section => {
    dispatch({
      type: Types.SET_SECTION,
      payload: section
    });
  }, []);
  const setToc = useCallback(toc => {
    dispatch({
      type: Types.SET_TOC,
      payload: toc
    });
  }, []);
  const setLandmarks = useCallback(landmarks => {
    dispatch({
      type: Types.SET_LANDMARKS,
      payload: landmarks
    });
  }, []);
  const addBookmark = useCallback((location, data) => {
    webViewInjectFunctions.injectJavaScript(book, `
      const location = ${JSON.stringify(location)};
      const chapter = getChapter(${JSON.stringify(location)});
      const cfi = makeRangeCfi(location.start.cfi, location.end.cfi);
      const data = ${JSON.stringify(data)};
      const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;

      book.getRange(cfi).then(range => {
        reactNativeWebview.postMessage(JSON.stringify({
          type: "onAddBookmark",
          bookmark: {
            id: Date.now(),
            chapter,
            location,
            text: range.toString(),
            data,
          },
        }));
      }).catch(error => alert(error?.message));
    `);
  }, []);
  const removeBookmark = useCallback(bookmark => {
    webViewInjectFunctions.injectJavaScript(book, `
        const bookmark = ${JSON.stringify(bookmark)};
        const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
        reactNativeWebview.postMessage(JSON.stringify({
          type: "onRemoveBookmark",
          bookmark,
        }));
      `);
    dispatch({
      type: Types.SET_BOOKMARKS,
      payload: state.bookmarks.filter(({
        id
      }) => id !== bookmark.id)
    });
  }, [state.bookmarks]);
  const removeBookmarks = useCallback(() => {
    dispatch({
      type: Types.SET_BOOKMARKS,
      payload: []
    });
    webViewInjectFunctions.injectJavaScript(book, `
      const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
      reactNativeWebview.postMessage(JSON.stringify({
        type: "onRemoveBookmarks",
      }));
    `);
  }, []);
  const setBookmarks = useCallback(bookmarks => {
    dispatch({
      type: Types.SET_BOOKMARKS,
      payload: bookmarks
    });
  }, []);
  const updateBookmark = useCallback((id, data) => {
    const {
      bookmarks
    } = state;
    const bookmark = state.bookmarks.find(item => item.id === id);
    if (!bookmark) return;
    bookmark.data = data;
    const index = state.bookmarks.findIndex(item => item.id === id);
    bookmarks[index] = bookmark;
    dispatch({
      type: Types.SET_BOOKMARKS,
      payload: bookmarks
    });
    webViewInjectFunctions.injectJavaScript(book, `
        const bookmark = ${JSON.stringify(bookmark)};
         const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
          reactNativeWebview.postMessage(JSON.stringify({
          type: "onUpdateBookmark",
          bookmark,
        }));
      `);
  }, [state]);
  const setIsBookmarked = useCallback(value => {
    dispatch({
      type: Types.SET_IS_BOOKMARKED,
      payload: value
    });
  }, []);
  const injectJavascript = useCallback(script => {
    book.current?.injectJavaScript(script);
  }, []);
  const changeFlow = useCallback(flow => {
    webViewInjectFunctions.injectJavaScript(book, `rendition.flow(${JSON.stringify(flow)}); true`);
    dispatch({
      type: Types.SET_FLOW,
      payload: flow
    });
  }, []);
  const setFlow = useCallback(flow => {
    dispatch({
      type: Types.SET_FLOW,
      payload: flow
    });
  }, []);
  const contextValue = useMemo(() => ({
    registerBook,
    setAtStart,
    setAtEnd,
    setTotalLocations,
    setCurrentLocation,
    setMeta,
    setProgress,
    setLocations,
    setIsLoading,
    setIsRendering,
    goToLocation,
    goPrevious,
    goNext,
    getLocations,
    getCurrentLocation,
    getMeta,
    search,
    clearSearchResults,
    setIsSearching,
    setKey,
    key: state.key,
    changeTheme,
    changeFontFamily,
    changeFontSize,
    theme: state.theme,
    atStart: state.atStart,
    atEnd: state.atEnd,
    totalLocations: state.totalLocations,
    currentLocation: state.currentLocation,
    meta: state.meta,
    progress: state.progress,
    locations: state.locations,
    isLoading: state.isLoading,
    isRendering: state.isRendering,
    isSearching: state.isSearching,
    searchResults: state.searchResults,
    setSearchResults,
    removeSelection,
    addAnnotation,
    addAnnotationByTagId,
    updateAnnotation,
    updateAnnotationByTagId,
    removeAnnotation,
    removeAnnotationByTagId,
    removeAnnotationByCfi,
    removeAnnotations,
    setAnnotations,
    setInitialAnnotations,
    annotations: state.annotations,
    setSection,
    setToc,
    setLandmarks,
    section: state.section,
    toc: state.toc,
    landmarks: state.landmarks,
    addBookmark,
    removeBookmark,
    removeBookmarks,
    updateBookmark,
    setBookmarks,
    bookmarks: state.bookmarks,
    setIsBookmarked,
    isBookmarked: state.isBookmarked,
    injectJavascript,
    changeFlow,
    setFlow,
    flow: state.flow
  }), [changeFontFamily, changeFontSize, changeTheme, getCurrentLocation, getMeta, getLocations, goNext, goPrevious, goToLocation, registerBook, search, clearSearchResults, setIsSearching, setAtEnd, setAtStart, setCurrentLocation, setMeta, setIsLoading, setIsRendering, setKey, setLocations, setProgress, setSearchResults, setTotalLocations, removeSelection, addAnnotation, addAnnotationByTagId, updateAnnotation, updateAnnotationByTagId, removeAnnotation, removeAnnotationByTagId, removeAnnotationByCfi, removeAnnotations, setAnnotations, setInitialAnnotations, state.atEnd, state.atStart, state.currentLocation, state.meta, state.isLoading, state.isRendering, state.key, state.locations, state.progress, state.isSearching, state.searchResults, state.theme, state.totalLocations, state.annotations, setSection, setToc, setLandmarks, state.section, state.toc, state.landmarks, addBookmark, removeBookmark, removeBookmarks, updateBookmark, setBookmarks, state.bookmarks, state.isBookmarked, setIsBookmarked, injectJavascript, changeFlow, setFlow, state.flow]);
  return /*#__PURE__*/React.createElement(ReaderContext.Provider, {
    value: contextValue
  }, children);
}
export { ReaderProvider, ReaderContext };