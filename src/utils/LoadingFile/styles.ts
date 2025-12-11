import { StyleSheet } from 'react-native';

let cachedStyles: ReturnType<typeof StyleSheet.create> | null = null;

export const getStyles = () => {
  if (!cachedStyles) {
    cachedStyles = StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      },
      text: { marginTop: 20, fontSize: 18 },
    });
  }
  return cachedStyles;
};
