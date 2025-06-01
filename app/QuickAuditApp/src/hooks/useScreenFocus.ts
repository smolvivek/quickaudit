import {useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';

type FocusCallback = () => void | (() => void);
type BlurCallback = () => void;

export const useScreenFocus = (
  onFocus: FocusCallback,
  onBlur?: BlurCallback,
  dependencies: any[] = [],
) => {
  const handleFocus = useCallback(() => {
    const cleanup = onFocus();
    return cleanup;
  }, [onFocus, ...dependencies]);

  useEffect(() => {
    if (onBlur) {
      return () => {
        onBlur();
      };
    }
  }, [onBlur, ...dependencies]);

  useFocusEffect(handleFocus);
};
