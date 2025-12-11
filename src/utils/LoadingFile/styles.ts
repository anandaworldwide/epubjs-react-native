import { StyleSheet } from 'react-native';

let _styles: ReturnType<typeof StyleSheet.create> | null = null;

export const getStyles = () => {
  if (!_styles) {
    _styles = StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      },
      text: { marginTop: 20, fontSize: 18 },
    });
  }
  return _styles;
};
