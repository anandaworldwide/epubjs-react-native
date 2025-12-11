import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getStyles } from './styles';
export function LoadingFile({
  // downloadProgress,
  width,
  height
}) {
  const styles = getStyles();
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      width,
      height
    }]
  }, /*#__PURE__*/React.createElement(ActivityIndicator, {
    size: "large"
  }));
}