/**
 * Plain text glyphs for action buttons, shown next to the label when
 * settings.iconsWithLabels is on. Same approach as the home tiles: no emoji,
 * no image assets, and the text label is always kept.
 */
export type ButtonIcon =
  | 'back'
  | 'continue'
  | 'retry'
  | 'tell'
  | 'cancel'
  | 'ok'
  | 'send'
  | 'new';

export const BUTTON_GLYPH: Record<ButtonIcon, string> = {
  back: '←',
  continue: '→',
  retry: '↻',
  tell: '!',
  cancel: '×',
  ok: '✓',
  send: '▶',
  new: '+',
};
