import * as webViewJavaScriptFunctions from './utils/webViewInjectFunctions';

export default `
<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EPUB.js</title>
    <script id="jszip"></script>
    <script id="epubjs"></script>

    <style type="text/css">
      body {
        margin: 0;
      }

      #viewer {
        height: 100vh;
        width: 100vw;
        overflow: hidden !important;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
        opacity: 0;
      }

      #viewer.ready {
        visibility: visible;
        opacity: 1;
      }

      /* Hide epub.js iframes until we're ready */
      #viewer:not(.ready) iframe {
        visibility: hidden !important;
        opacity: 0 !important;
      }

      [ref="epubjs-mk-balloon"] {
        background: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB2aWV3Qm94PScwIDAgNzUgNzUnPjxnIGZpbGw9JyNCREJEQkQnIGlkPSdidWJibGUnPjxwYXRoIGNsYXNzPSdzdDAnIGQ9J00zNy41LDkuNEMxOS42LDkuNCw1LDIwLjUsNSwzNC4zYzAsNS45LDIuNywxMS4zLDcuMSwxNS42TDkuNiw2NS42bDE5LTcuM2MyLjgsMC42LDUuOCwwLjksOC45LDAuOSBDNTUuNSw1OS4yLDcwLDQ4LjEsNzAsMzQuM0M3MCwyMC41LDU1LjQsOS40LDM3LjUsOS40eicvPjwvZz48L3N2Zz4=") no-repeat;
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-left: 0;
      }

      [ref="epubjs-mk-heart"] {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAACOUlEQVR4nLWUTWgTURDH14Oe9JiPNqFNujvvzdsm3bdvPxKMFUEPag/iwdaD3j1JDymlCMXiqUeRHvWgFRQUxKPirUU8eFARvCnUj7QXP7DiJtk8easJjRjzIQ784bEz82Pe7MzTtP9tpmnu8UbNpOM4uzvFKF+3GM1BHHIAbwjA7xyY5AaGPuCarZtHmzGcsGM+YevKp2JUrAN4XeW2wSxKMy6wrSkKtbsiJZ96SfnAGZbl8bG6DawhdLwqAK9xYI25XLaufCrmjkjJKQpVF3DLzrDRFtAHXJ9hUNsoxOTH8hn5afGcrBRjkR66w3I/0GoJaPWRO9T63tRGISanmVHzgK1FMBvGmSr/iZeUn5fL8svlRbl5aKQt6bGXjPQ7bKefA5MOIahZOpsuAQmUY3t1pWNSN5WABtwwT2kW4Mki0OqgoMov+YA1rrMTmk3IhCr3hd/5St303EtEV54Yw5xq4y4PcHOFt/etH12xRqQHWFGsn/MFuHAQaPCmGO8b9roQl5OEBpaB862xoZTuc4F+uJDLhv0CF/LZ0DPoe9M097YNNwd2hAMLb9rpnmGrdlr1LrQJO/zH9bMMnBWA4X0n1RV2T6TU6oUc2Pm/vQ0aN/CSAKzfFp0rvWWnI5gNbEnrxWwD59UOL+UzjXc7ftTbYlxezGca0X4Dm+sJ1jQO7LgA/Hoa9eCln5Cv/IQ8i3ogAL+pZdAGMYcQdAGfHSAkmCQkUOc8pXQgWNPUgysAl5XU+Z9gg9gPaBjV+CGbZVoAAAAASUVORK5CYII=") no-repeat;
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-left: 0;
      }
    </style>
  </head>

  <body oncopy='return false' oncut='return false'>
    <div id="viewer"></div>

    <script>
      let book;
      let rendition;
      let isReady = false;
      var readyTimeout = null;
      var settleTimeout = null;
      var displayResolved = false;
      var hasRendered = false;
      var lastRelocatedLocation = null;
      var relocatedCount = 0;
      var startTime = Date.now();
      var documentsWithClickHandler = new WeakSet();

      const type = window.type;
      const file = window.book;
      const theme = window.theme;
      const initialLocations = window.locations;
      const initialLocation = window.initialLocation;
      const enableSelection = window.enable_selection;
      const enableDebugLogging = window.enableDebugLogging;

      const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;

      function debugLog(msg) {
        var elapsed = Date.now() - startTime;
        if (enableDebugLogging) {
          reactNativeWebview.postMessage(JSON.stringify({ type: "onDebug", message: "[" + elapsed + "ms] " + msg }));
        }
      }

      function showViewer() {
        if (isReady) {
          debugLog("[EPUB] showViewer called but already ready, skipping");
          return;
        }

        isReady = true;
        clearTimeout(readyTimeout);
        clearTimeout(settleTimeout);

        var viewer = document.getElementById('viewer');
        debugLog("[EPUB] showViewer: adding ready class to viewer");
        viewer.classList.add('ready');

        // Force location recalculation to ensure internal state is accurate
        // This triggers reportLocation() which sets rendition.location properly
        // and emits a RELOCATED event with accurate data
        debugLog("[EPUB] showViewer: calling reportLocation() to sync internal state");
        rendition.reportLocation();

        // Use the last relocated location data (from the most recent relocated event)
        // instead of calling currentLocation() which may return stale data
        var currentLocation = lastRelocatedLocation || rendition.currentLocation();
        debugLog("[EPUB] showViewer: currentLocation=" + (currentLocation ? currentLocation.start.cfi : "null"));

        if (currentLocation) {
          var percent = book.locations.percentageFromCfi(currentLocation.start.cfi);
          debugLog("[EPUB] showViewer: Sending onReady, progress=" + Math.floor(percent * 100));
          reactNativeWebview.postMessage(JSON.stringify({
            type: "onReady",
            totalLocations: book.locations.total,
            currentLocation: currentLocation,
            progress: Math.floor(percent * 100),
          }));
        }
      }

      // Check if current location matches the intended initial location
      function isAtCorrectLocation(location) {
        if (!initialLocation) {
          debugLog("[EPUB] isAtCorrectLocation: no initialLocation specified, returning true");
          return true;
        }

        var cfi = location.start.cfi;
        var href = location.start.href;

        // Try various matching strategies
        var cfiContainsInit = cfi && cfi.indexOf(initialLocation) !== -1;
        var initContainsCfi = cfi && initialLocation.indexOf(cfi) !== -1;
        var hrefContainsInit = href && initialLocation.indexOf(href) !== -1;
        var initContainsHref = href && href.indexOf(initialLocation) !== -1;

        var match = cfiContainsInit || initContainsCfi || hrefContainsInit || initContainsHref;

        debugLog("[EPUB] isAtCorrectLocation: cfi=" + cfi + ", href=" + href + ", match=" + match);
        return match;
      }

      var TEMPLATE_VERSION = "v4-event-based";
      debugLog("[EPUB] Template " + TEMPLATE_VERSION + " starting, type=" + type + ", file exists=" + !!file + ", initialLocation=" + initialLocation);

      if (!file) {
        debugLog("[EPUB] ERROR: No file provided");
        alert('Failed load book');
      }

      try {
        if (type === 'epub' || type === 'opf' || type === 'binary') {
          book = ePub(file);
        } else if (type === 'base64') {
          book = ePub(file, { encoding: "base64" });
        } else {
          debugLog("[EPUB] ERROR: Unknown type: " + type);
          alert('Missing file type');
        }
        debugLog("[EPUB] Book created successfully");
      } catch (bookErr) {
        debugLog("[EPUB] ERROR creating book: " + (bookErr.message || String(bookErr)));
        throw bookErr;
      }

      try {
        rendition = book.renderTo("viewer", {
          width: "100%",
          height: "100%",
          manager: "default",
          flow: "auto",
          snap: undefined,
          spread: undefined,
          fullsize: undefined,
          allowPopups: allowPopups,
          allowScriptedContent: allowScriptedContent
        });
        debugLog("[EPUB] Rendition created successfully");
      } catch (rendErr) {
        debugLog("[EPUB] ERROR creating rendition: " + (rendErr.message || String(rendErr)));
        throw rendErr;
      }
      reactNativeWebview.postMessage(JSON.stringify({ type: "onStarted" }));

      function flatten(chapters) {
        return [].concat.apply([], chapters.map((chapter) => [].concat.apply([chapter], flatten(chapter.subitems))));
      }

      function getCfiFromHref(book, href) {
        const [_, id] = href.split('#')
        let section = book.spine.get(href.split('/')[1]) || book.spine.get(href) || book.spine.get(href.split('/').slice(1).join('/'))

        const el = (id ? section.document.getElementById(id) : section.document.body)
        return section.cfiFromElement(el)
      }

      function getChapter(location) {
          const locationHref = location.start.href

          let match = flatten(book.navigation.toc)
              .filter((chapter) => {
                  return book.canonical(chapter.href).includes(locationHref)
              }, null)
              .reduce((result, chapter) => {
                  const locationAfterChapter = ePub.CFI.prototype.compare(location.start.cfi, getCfiFromHref(book, chapter.href)) > 0
                  return locationAfterChapter ? chapter : result
              }, null);

          return match;
      };

      // Attach click handler to a document for internal link interception
      function attachClickHandler(doc) {
        if (!doc || documentsWithClickHandler.has(doc)) return;
        documentsWithClickHandler.add(doc);

        doc.addEventListener('click', function(e) {
          var link = e.target.closest ? e.target.closest('a[href]') : null;
          if (!link) return;

          var href = link.getAttribute('href');
          if (!href) return;

          // Skip external links - let them go through normal WebView flow
          if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0 ||
              href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
            return;
          }

          // Prevent default navigation for internal links
          e.preventDefault();
          e.stopPropagation();

          // Send to React Native for handling
          reactNativeWebview.postMessage(JSON.stringify({
            type: 'onInternalLinkPress',
            href: href
          }));
        }, true); // Use capture phase to intercept before other handlers
      }

      // Ensure click handlers are attached to ALL current views
      // This is called on rendered and relocated events to handle view recycling
      function ensureClickHandlersOnAllViews() {
        rendition.getContents().forEach(function(contents) {
          attachClickHandler(contents.document);
        });
      }

      const makeRangeCfi = (a, b) => {
        const CFI = new ePub.CFI()
        const start = CFI.parse(a), end = CFI.parse(b)
        const cfi = {
            range: true,
            base: start.base,
            path: {
                steps: [],
                terminal: null
            },
            start: start.path,
            end: end.path
        }
        const len = cfi.start.steps.length
        for (let i = 0; i < len; i++) {
          if (CFI.equalStep(cfi.start.steps[i], cfi.end.steps[i])) {
              if (i == len - 1) {
                  // Last step is equal, check terminals
                  if (cfi.start.terminal === cfi.end.terminal) {
                      // CFI's are equal
                      cfi.path.steps.push(cfi.start.steps[i])
                      // Not a range
                      cfi.range = false
                  }
              } else cfi.path.steps.push(cfi.start.steps[i])
          } else break
        }
        cfi.start.steps = cfi.start.steps.slice(cfi.path.steps.length)
        cfi.end.steps = cfi.end.steps.slice(cfi.path.steps.length)

        return 'epubcfi(' + CFI.segmentString(cfi.base)
            + '!' + CFI.segmentString(cfi.path)
            + ',' + CFI.segmentString(cfi.start)
            + ',' + CFI.segmentString(cfi.end)
            + ')'
      }

      if (!enableSelection) {
        rendition.themes.default({
          'body': {
            '-webkit-touch-callout': 'none', /* iOS Safari */
            '-webkit-user-select': 'none', /* Safari */
            '-khtml-user-select': 'none', /* Konqueror HTML */
            '-moz-user-select': 'none', /* Firefox */
            '-ms-user-select': 'none', /* Internet Explorer/Edge */
            'user-select': 'none'
          }
        });
      }

      book.ready
        .then(function () {
          debugLog("[EPUB] book.ready resolved");
          if (initialLocations) {
            debugLog("[EPUB] initialLocations provided, count: " + initialLocations.length);
            try {
              book.locations.load(initialLocations);
              debugLog("[EPUB] book.locations.load() completed successfully");
            } catch (loadErr) {
              debugLog("[EPUB] book.locations.load() FAILED: " + (loadErr.message || String(loadErr)));
              throw loadErr;
            }
          } else {
            book.locations.generate(1600).then(function () {
              reactNativeWebview.postMessage(JSON.stringify({
                type: "onLocationsReady",
                epubKey: book.key(),
                locations: book.locations.save(),
                totalLocations: book.locations.total,
                currentLocation: rendition.currentLocation(),
                progress: book.locations.percentageFromCfi(rendition.currentLocation().start.cfi),
              }));
            });
          }
        })
        .then(function () {
          debugLog("[EPUB] Calling rendition.display() with initialLocation: " + initialLocation);

          rendition.display(initialLocation || undefined).then(function() {
            displayResolved = true;
            debugLog("[EPUB] display() promise resolved, relocatedCount=" + relocatedCount + ", hasRendered=" + hasRendered);

            // If already rendered, we can show now
            if (!isReady && hasRendered) {
              debugLog("[EPUB] display resolved with hasRendered=true, triggering showViewer");
              clearTimeout(settleTimeout);
              settleTimeout = setTimeout(function() {
                if (!isReady) {
                  showViewer();
                }
              }, 100);
            } else {
              debugLog("[EPUB] display resolved, waiting for rendered event");
            }
          }).catch(function(err) {
            debugLog("[EPUB] display() promise rejected: " + (err.message || String(err)));
          });

          // Safety net fallback - 10 seconds max wait
          // This should rarely fire since event-based logic handles normal cases
          readyTimeout = setTimeout(function() {
            debugLog("[EPUB] Safety fallback (10s) fired, isReady=" + isReady + ", displayResolved=" + displayResolved + ", hasRendered=" + hasRendered);
            if (!isReady) {
              debugLog("[EPUB] Safety fallback: forcing showViewer");
              showViewer();
            }
          }, 10000);

          book
          .coverUrl()
          .then(async (url) => {
            var reader = new FileReader();
            reader.onload = (res) => {
              reactNativeWebview.postMessage(
                JSON.stringify({
                  type: "meta",
                  metadata: {
                    cover: reader.result,
                    author: book.package.metadata.creator,
                    title: book.package.metadata.title,
                    description: book.package.metadata.description,
                    language: book.package.metadata.language,
                    publisher: book.package.metadata.publisher,
                    rights: book.package.metadata.rights,
                  },
                })
              );
            };
            reader.readAsDataURL(await fetch(url).then((res) => res.blob()));
          })
          .catch(() => {
            reactNativeWebview.postMessage(
              JSON.stringify({
                type: "meta",
                metadata: {
                  cover: undefined,
                  author: book.package.metadata.creator,
                  title: book.package.metadata.title,
                  description: book.package.metadata.description,
                  language: book.package.metadata.language,
                  publisher: book.package.metadata.publisher,
                  rights: book.package.metadata.rights,
                },
              })
            );
          });

          book.loaded.navigation.then(function (item) {
            reactNativeWebview.postMessage(JSON.stringify({
              type: 'onNavigationLoaded',
              toc: item.toc,
              landmarks: item.landmarks
            }));
          });
        })
        .catch(function (err) {
          debugLog("[EPUB] Promise chain error: " + (err.message || String(err)));
          reactNativeWebview.postMessage(JSON.stringify({
            type: "onDisplayError",
            reason: err.message || String(err)
          }));
        });

      rendition.on('started', () => {
        debugLog("[EPUB] rendition 'started' event fired");
        rendition.themes.register({ theme: theme });
        rendition.themes.select('theme');
      });

      rendition.on("relocated", function (location) {
        relocatedCount++;
        lastRelocatedLocation = location;

        var percent = book.locations.percentageFromCfi(location.start.cfi);
        var percentage = Math.floor(percent * 100);
        var chapter = getChapter(location);

        debugLog("[EPUB] relocated event #" + relocatedCount + ", isReady=" + isReady + ", displayResolved=" + displayResolved + ", cfi=" + location.start.cfi + ", progress=" + percentage + "%");

        // Navigation settling: if we're not ready yet and display has resolved,
        // start/reset a settle timer. If no more relocated events fire within 200ms,
        // we consider navigation settled and show the viewer.
        if (!isReady && displayResolved) {
          clearTimeout(settleTimeout);

          if (isAtCorrectLocation(location)) {
            debugLog("[EPUB] relocated: at correct location, setting settle timeout (200ms)");
            settleTimeout = setTimeout(function() {
              debugLog("[EPUB] Settle timeout fired after 200ms, no more relocated events");
              // Triple rAF for paint safety
              requestAnimationFrame(function() {
                debugLog("[EPUB] rAF 1 complete");
                requestAnimationFrame(function() {
                  debugLog("[EPUB] rAF 2 complete");
                  requestAnimationFrame(function() {
                    debugLog("[EPUB] rAF 3 complete, calling showViewer");
                    showViewer();
                  });
                });
              });
            }, 200);
          } else {
            debugLog("[EPUB] relocated: NOT at correct location yet, waiting...");
          }
        }

        reactNativeWebview.postMessage(JSON.stringify({
          type: "onLocationChange",
          totalLocations: book.locations.total,
          currentLocation: location,
          progress: percentage,
          currentSection: chapter,
        }));

        if (location.atStart) {
          reactNativeWebview.postMessage(JSON.stringify({
            type: "onBeginning",
          }));
        }

        if (location.atEnd) {
          reactNativeWebview.postMessage(JSON.stringify({
            type: "onFinish",
          }));
        }

        // Ensure click handlers are attached to all current views after relocation
        // This catches any new views created during navigation
        ensureClickHandlersOnAllViews();
      });

      rendition.on("orientationchange", function (orientation) {
        reactNativeWebview.postMessage(JSON.stringify({
          type: 'onOrientationChange',
          orientation: orientation
        }));
      });

      rendition.on("rendered", function (section, view) {
        hasRendered = true;
        debugLog("[EPUB] 'rendered' event fired, section.href=" + section.href + ", isReady=" + isReady + ", displayResolved=" + displayResolved);

        // If display has resolved and we're not ready yet, we can now show
        if (!isReady && displayResolved) {
          debugLog("[EPUB] rendered: displayResolved=true, triggering showViewer");
          clearTimeout(settleTimeout);
          settleTimeout = setTimeout(function() {
            if (!isReady) {
              showViewer();
            }
          }, 100);
        }

        reactNativeWebview.postMessage(JSON.stringify({
          type: 'onRendered',
          section: section,
          currentSection: book.navigation.get(section.href),
        }));

        // Ensure click handlers are attached to all current views
        // This handles the case where views are recycled during navigation
        ensureClickHandlersOnAllViews();
      });

      rendition.on("layout", function (layout) {
        reactNativeWebview.postMessage(JSON.stringify({
          type: 'onLayout',
          layout: layout,
        }));
      });

      rendition.on("selected", function (cfiRange, contents) {
        book.getRange(cfiRange).then(function (range) {
          if (range) {
            reactNativeWebview.postMessage(JSON.stringify({
              type: 'onSelected',
              cfiRange: cfiRange,
              text: range.toString(),
            }));
          }
        });
      });

      rendition.on("markClicked", function (cfiRange, contents) {
        const annotations = Object.values(rendition.annotations._annotations);
        const annotation = annotations.find(item => item.cfiRange === cfiRange);

        if (annotation) {
          reactNativeWebview.postMessage(JSON.stringify({
            type: 'onPressAnnotation',
            annotation: ${webViewJavaScriptFunctions.mapObjectToAnnotation('annotation')}
          }));
        }
      });

      rendition.on("resized", function (layout) {
        reactNativeWebview.postMessage(JSON.stringify({
          type: 'onResized',
          layout: layout,
        }));
      });
    </script>
  </body>
</html>
`;
