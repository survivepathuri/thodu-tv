import {scaleFontSize, scaleWidth} from '../utils/scaling';
import {useSettings} from './SettingsProvider';

/**
 * Sizes are written against the 1920x1080 design grid. `fs` applies the
 * user's font scale; `sz` applies the large-targets scale.
 */
export function useUI() {
  const {theme, t, lang, settings, systemFontScale} = useSettings();
  // Android scales Text by the system font scale on its own. settings.fontScale
  // already contains the (capped) system scale, so divide the OS's out here.
  const osScale = systemFontScale > 0 ? systemFontScale : 1;
  return {
    theme,
    colors: theme.colors,
    t,
    lang,
    settings,
    fs: (base: number) => scaleFontSize(theme.font(base)) / osScale,
    sz: (base: number) => scaleWidth(theme.target(base)),
    px: (base: number) => scaleWidth(base),
  };
}
