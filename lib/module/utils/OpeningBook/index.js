import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getStyles } from './styles';
export function OpeningBook({
  width,
  height,
  backgroundColor
}) {
  const styles = getStyles();
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      width,
      height,
      backgroundColor
    }]
  }, /*#__PURE__*/React.createElement(ActivityIndicator, {
    size: "large"
  }));
}