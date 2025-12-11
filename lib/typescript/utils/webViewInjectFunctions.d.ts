import WebView from 'react-native-webview';
import { Annotation, AnnotationStyles, AnnotationType, ePubCfi } from '../types';
export declare function injectJavaScript(ref: React.MutableRefObject<WebView | null>, script: string): void;
export declare function mapAnnotationStylesToEpubStyles(type: AnnotationType, styles?: AnnotationStyles): {
    [key: string]: unknown;
};
export declare function mapObjectToAnnotation(objectName?: string): string;
export declare function mapArrayObjectsToAnnotations(array: string | Array<object>): string;
export declare function onChangeAnnotations(annotations?: string): string;
export declare function addAnnotation(type: AnnotationType, cfiRange: ePubCfi, data?: object, iconClass?: string, styles?: AnnotationStyles, cfiRangeText?: string, noEmit?: boolean): string;
export declare function addAnnotationByTagId(type: AnnotationType, tagId: ePubCfi, data?: object, iconClass?: string, styles?: AnnotationStyles, cfiRangeText?: string, noEmit?: boolean): string;
export declare function updateAnnotation(annotation: Annotation, data?: {}, styles?: AnnotationStyles): string;
export declare function updateAnnotationByTagId(tagId: string, data?: {}, styles?: AnnotationStyles): string;
export declare function removeAnnotationByTagId(tagId: string): string;
//# sourceMappingURL=webViewInjectFunctions.d.ts.map