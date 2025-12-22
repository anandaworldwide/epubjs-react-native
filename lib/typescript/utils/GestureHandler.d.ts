import React from 'react';
import { DimensionValue } from 'react-native';
interface Props {
    width?: DimensionValue;
    height?: DimensionValue;
    onSingleTap: () => void;
    onDoubleTap: () => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    onSwipeUp: () => void;
    onSwipeDown: () => void;
    onLongPress: () => void;
    children: React.ReactNode;
}
export declare function GestureHandler({ width, height, onSingleTap: _onSingleTap, onDoubleTap: _onDoubleTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onLongPress, children, }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=GestureHandler.d.ts.map