import React from 'react';
import { ActivityIndicator, DimensionValue, View } from 'react-native';

import { styles } from './styles';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: string;
}

export function OpeningBook({ width, height, backgroundColor }: Props) {
  return (
    <View style={[styles.container, { width, height, backgroundColor }]}>
      <ActivityIndicator size="large" />
    </View>
  );
}
