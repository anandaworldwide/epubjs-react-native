import { StyleSheet } from 'react-native';
let cachedStyles = null;
export const getStyles = () => {
  if (!cachedStyles) {
    cachedStyles = StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      },
      text: {
        marginTop: 20,
        fontSize: 18
      }
    });
  }
  return cachedStyles;
};