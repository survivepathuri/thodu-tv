import {scaleFontSize, scaleWidth} from '../utils/scaling';
import {useSettings} from './SettingsProvider';

/**
 * Sizes are written against the 1920x1080 design grid. `fs` applies the
 * user's font scale; `sz` applies the large-targets scale.
 */
export function useUI() {
  const {theme, t, lang, settings} = useSettings();
  // settings.fontScale already holds our scale times the capped system scale;
  // Text ignores the OS scale itself (see components/Text).
  return {
    theme,
    colors: theme.colors,
    t,
    lang,
    settings,
    fs: (base: number) => scaleFontSize(theme.font(base)),
    sz: (base: number) => scaleWidth(theme.target(base)),
    px: (base: number) => scaleWidth(base),
  };
}
