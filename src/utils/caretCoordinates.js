/*
 * Compute the pixel position of the caret inside a <textarea>, relative to the
 * textarea's own top-left (including its padding/border). Used to anchor the
 * autocomplete dropdown under the word being typed.
 *
 * Technique: render a hidden <div> that mirrors the textarea's box and font
 * metrics, fill it with the text up to the caret, append a marker <span>, and
 * read the span's offset. This is the well-known "textarea-caret" approach.
 */

const MIRROR_PROPS = [
  'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom',
  'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth',
  'borderLeftWidth', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch',
  'fontSize', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
  'textIndent', 'letterSpacing', 'wordSpacing', 'tabSize'
];

export function getCaretCoordinates(textarea, position)
{
  const computed = window.getComputedStyle(textarea);
  const div = document.createElement('div');

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.overflowWrap = 'break-word';
  div.style.top = '0';
  div.style.left = '-9999px';

  for (const prop of MIRROR_PROPS)
  {
    div.style[prop] = computed[prop];
  }

  div.textContent = textarea.value.slice(0, position);

  const span = document.createElement('span');
  // The marker needs at least one character so it has a measurable box.
  span.textContent = textarea.value.slice(position) || '.';
  div.appendChild(span);

  document.body.appendChild(div);
  const top = span.offsetTop + parseInt(computed.borderTopWidth, 10);
  const left = span.offsetLeft + parseInt(computed.borderLeftWidth, 10);
  const height = parseInt(computed.lineHeight, 10) || parseInt(computed.fontSize, 10);
  document.body.removeChild(div);

  return { top, left, height };
}
