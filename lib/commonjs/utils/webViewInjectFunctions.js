"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAnnotation = addAnnotation;
exports.addAnnotationByTagId = addAnnotationByTagId;
exports.injectJavaScript = injectJavaScript;
exports.mapAnnotationStylesToEpubStyles = mapAnnotationStylesToEpubStyles;
exports.mapArrayObjectsToAnnotations = mapArrayObjectsToAnnotations;
exports.mapObjectToAnnotation = mapObjectToAnnotation;
exports.onChangeAnnotations = onChangeAnnotations;
exports.removeAnnotationByTagId = removeAnnotationByTagId;
exports.updateAnnotation = updateAnnotation;
exports.updateAnnotationByTagId = updateAnnotationByTagId;
function injectJavaScript(ref, script) {
  ref.current?.injectJavaScript(`
    try {
      ${script}
    } catch (error) {
      alert(error?.message);
    }

    true;
  `);
}
function mapAnnotationStylesToEpubStyles(type, styles) {
  let epubStyles = {};
  if (type === 'highlight') {
    epubStyles = {
      'fill': styles?.color || 'yellow',
      'fill-opacity': styles?.opacity || 0.3
    };
  }
  if (type === 'underline') {
    epubStyles = {
      'stroke': styles?.color || 'yellow',
      'stroke-opacity': styles?.opacity || 0.3,
      'stroke-width': styles?.thickness || 1
    };
  }
  return epubStyles;
}
function mapObjectToAnnotation(objectName = 'annotation') {
  return `{
    type: ${objectName}.type,
    data: ${objectName}.data,
    cfiRange: ${objectName}.cfiRange,
    sectionIndex: ${objectName}.sectionIndex,
    cfiRangeText: ${objectName}?.cfiRangeText ? ${objectName}.cfiRangeText : ${objectName}.mark?.range?.toString(),
    iconClass: ${objectName}.data?.iconClass,
    styles: ${objectName}.type !== 'mark' ? {
      color: ${objectName}.styles?.fill || ${objectName}.mark?.attributes?.fill || ${objectName}.mark?.attributes?.stroke || ${objectName}.styles?.color,
      opacity: Number(${objectName}.styles?.['fill-opacity'] || ${objectName}.mark?.attributes?.['fill-opacity'] || ${objectName}.mark?.attributes?.['stroke-opacity'] || ${objectName}.styles?.opacity),
      thickness: Number(${objectName}.styles?.['stroke-width'] || ${objectName}.mark?.attributes?.['stroke-width'] || ${objectName}.styles?.thickness),
    } : undefined
  }`;
}
function mapArrayObjectsToAnnotations(array) {
  return `
    ${array}.map(annotation => {
      const transform = annotation;

      return ${mapObjectToAnnotation('transform')};
    })
  `;
}
function onChangeAnnotations(annotations = 'Object.values(rendition.annotations._annotations)') {
  return `
    const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
    reactNativeWebview.postMessage(JSON.stringify({
      type: 'onChangeAnnotations',
      annotations: ${mapArrayObjectsToAnnotations(annotations)}
    }));
  `;
}
function addAnnotation(type, cfiRange, data, iconClass, styles, cfiRangeText, noEmit = false) {
  const epubStyles = mapAnnotationStylesToEpubStyles(type, styles);
  if (type === 'mark') {
    // eslint-disable-next-line no-param-reassign
    iconClass = iconClass || 'epubjs-mk-balloon';
  }
  return `
    const annotation = rendition.annotations.add('${type}', ${JSON.stringify(cfiRange)}, ${JSON.stringify(data ?? {})}, () => {}, ${JSON.stringify(iconClass)}, ${JSON.stringify(epubStyles)}, ${JSON.stringify(cfiRangeText)});

    const noEmit = ${noEmit};

    if (!noEmit) {
     const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
     reactNativeWebview.postMessage(JSON.stringify({
        type: 'onAddAnnotation',
        annotation: ${mapObjectToAnnotation('annotation')}
      }));
    }
  `;
}
function addAnnotationByTagId(type, tagId, data, iconClass, styles, cfiRangeText, noEmit = false) {
  const epubStyles = mapAnnotationStylesToEpubStyles(type, styles);
  if (type === 'mark') {
    // eslint-disable-next-line no-param-reassign
    iconClass = iconClass || 'epubjs-mk-balloon';
  }
  return `
    async function addAnnotationByTagId(tagId) {
      return Promise.all(book.spine.spineItems.map((item) => {
        return item.load(book.load.bind(book)).then(() => {
          const element = item.document.getElementById(tagId);

          if (!element) return null;

          const range = item.document.createRange();
          range.selectNodeContents(element);

          let textOffset = element.textContent.length;
          if (element.childNodes.length > 1) {
            const lastChildNode = element.childNodes[element.childNodes.length - 1];
            textOffset = lastChildNode.textContent.length;
          }

          const cfi = item.cfiFromElement(element).split(')')[0].concat(',/1:0,/').concat(range.endOffset).concat(':').concat(textOffset).concat(')');
          const data = ${JSON.stringify(data)} || { epubcfi: cfi }
          const cfiRangeText = ${JSON.stringify(cfiRangeText)} || range.toString();
          const annotation = rendition.annotations.add('${type}', cfi, data, () => {}, ${JSON.stringify(iconClass)}, ${JSON.stringify(epubStyles)}, cfiRangeText);

          const noEmit = ${noEmit};

          if (!noEmit) {
            const reactNativeWebview = window.ReactNativeWebView !== undefined && window.ReactNativeWebView!== null ? window.ReactNativeWebView: window;
            reactNativeWebview.postMessage(JSON.stringify({
              type: 'onAddAnnotation',
              annotation: ${mapObjectToAnnotation('annotation')}
            }));
          }

          item.unload();
          return Promise.resolve();
        });
      }));
    }

    addAnnotationByTagId(${JSON.stringify(tagId)})
      .then(() => {
        ${onChangeAnnotations()}
      })
      .catch(error => alert(JSON.stringify(error?.message)))
  `;
}
function updateAnnotation(annotation, data = {}, styles) {
  const epubStyles = mapAnnotationStylesToEpubStyles(annotation.type, styles);
  return `
    let annotations = Object.values(rendition.annotations._annotations);

    annotations = annotations.filter(item => item.cfiRange === ${JSON.stringify(annotation.cfiRange)});

    annotations.forEach(annotation => {
      annotation.update(${JSON.stringify(data)}, ${JSON.stringify(epubStyles)});
    });

    rendition.views().forEach(view => view.pane ? view.pane.render() : null);

    ${onChangeAnnotations()}
  `;
}
function updateAnnotationByTagId(tagId, data = {}, styles) {
  return `
    async function getCfiByTagId(tagId) {
      const results = await Promise.all(book.spine.spineItems.map((item) => {
        return item.load(book.load.bind(book)).then(() => {
          const element = item.document.getElementById(tagId);

          if (!element) return null;

          const range = item.document.createRange();
          range.selectNodeContents(element);

          let textOffset = element.textContent.length;
          if (element.childNodes.length > 1) {
            const lastChildNode = element.childNodes[element.childNodes.length - 1];
            textOffset = lastChildNode.textContent.length;
          }

          const cfi = item.cfiFromElement(element).split(')')[0].concat(',/1:0,/').concat(range.endOffset).concat(':').concat(textOffset).concat(')');

          item.unload();
          return Promise.resolve(cfi);
        });
      }));

      if (results.length === 0) return null;
      return results.filter(result => result)[0];
    }

    getCfiByTagId(${JSON.stringify(tagId)})
      .then((cfi) => {
        let annotations = Object.values(rendition.annotations._annotations);

        annotations = annotations.filter(item => item.cfiRange === cfi);

        annotations.forEach(annotation => {
          let epubStyles = {};
          const styles = ${JSON.stringify(styles)};

          if (annotation.type === 'highlight') {
            epubStyles = {
              'fill': styles?.color || 'yellow',
              'fill-opacity': styles?.opacity || 0.3,
            };
          }

          if (annotation.type === 'underline') {
            epubStyles = {
              'stroke': styles?.color || 'yellow',
              'stroke-opacity': styles?.opacity || 0.3,
              'stroke-width': styles?.thickness || 1,
            };
          }

          annotation.update(${JSON.stringify(data)}, epubStyles);
        });

        rendition.views().forEach(view => view.pane ? view.pane.render() : null);

        ${onChangeAnnotations()}
      })
      .catch(error => alert(JSON.stringify(error?.message)))
  `;
}
function removeAnnotationByTagId(tagId) {
  return `
    async function getCfiByTagId(tagId) {
      const results = await Promise.all(book.spine.spineItems.map((item) => {
        return item.load(book.load.bind(book)).then(() => {
          const element = item.document.getElementById(tagId);

          if (!element) return null;

          const range = item.document.createRange();
          range.selectNodeContents(element);

          let textOffset = element.textContent.length;
          if (element.childNodes.length > 1) {
            const lastChildNode = element.childNodes[element.childNodes.length - 1];
            textOffset = lastChildNode.textContent.length;
          }

          const cfi = item.cfiFromElement(element).split(')')[0].concat(',/1:0,/').concat(range.endOffset).concat(':').concat(textOffset).concat(')');

          item.unload();
          return Promise.resolve(cfi);
        });
      }));

      if (results.length === 0) return null;
      return results.filter(result => result)[0];
    }

    getCfiByTagId(${JSON.stringify(tagId)})
      .then((cfi) => {
        let annotations = Object.values(rendition.annotations._annotations);

        annotations = annotations.filter(item => item.cfiRange === cfi);

        annotations.forEach(annotation => {
          rendition.annotations.remove(annotation.cfiRange, annotation.type);
        });

        rendition.views().forEach(view => view.pane ? view.pane.render() : null);

        ${onChangeAnnotations()}
      })
      .catch(error => alert(error?.message))
  `;
}