import { useMemo, useRef } from 'react';
import { tokenize, classFor } from '../utils/highlightCode.js';

// Characters whose typing should auto-insert the matching closer.
const PAIR_OPENERS = {
  '{': '}',
  '[': ']',
  '(': ')',
  '"': '"',
  "'": "'"
};
const PAIR_CLOSERS = new Set(['}', ']', ')', '"', "'"]);

export default function CodeEditor({ value, onChange, language = 'java' })
{
  const textareaRef = useRef(null);
  const tokens = useMemo(() => tokenize(value, language), [value, language]);
  const lineCount = Math.max(value.split('\n').length, 1);

  function handleKeyDown(event)
  {
    const el = textareaRef.current;
    if (!el)
    {
      return;
    }

    // ── Auto-pair openers ────────────────────────────────────────────────
    // Typing {, [, (, ", or ' inserts the matching closer and parks the
    // cursor between them. Skipped when text is selected (so the user can
    // still overwrite a selection) and when typing a quote right after an
    // alphanumeric character (probably writing English in a comment).
    if (PAIR_OPENERS[event.key])
    {
      const { selectionStart, selectionEnd } = el;
      const isQuote = event.key === '"' || event.key === "'";
      const prevChar = value[selectionStart - 1] || '';
      const looksLikeEnglish = isQuote && /\w/.test(prevChar);
      if (selectionStart === selectionEnd && !looksLikeEnglish)
      {
        event.preventDefault();
        const opener = event.key;
        const closer = PAIR_OPENERS[opener];
        const next = value.slice(0, selectionStart) + opener + closer + value.slice(selectionEnd);
        onChange(next);
        requestAnimationFrame(() =>
        {
          const pos = selectionStart + 1;
          el.selectionStart = pos;
          el.selectionEnd = pos;
        });
        return;
      }
    }

    // ── Skip over an existing closer ────────────────────────────────────
    // If the user types `}` and the next char already is `}`, just step the
    // cursor forward instead of inserting a duplicate. Same for ], ), ", '.
    if (PAIR_CLOSERS.has(event.key))
    {
      const { selectionStart, selectionEnd } = el;
      if (selectionStart === selectionEnd && value[selectionStart] === event.key)
      {
        event.preventDefault();
        requestAnimationFrame(() =>
        {
          const pos = selectionStart + 1;
          el.selectionStart = pos;
          el.selectionEnd = pos;
        });
        return;
      }
    }

    if (event.key === 'Tab')
    {
      event.preventDefault();
      const { selectionStart, selectionEnd } = el;
      const next = value.slice(0, selectionStart) + '    ' + value.slice(selectionEnd);
      onChange(next);
      requestAnimationFrame(() =>
      {
        el.selectionStart = selectionStart + 4;
        el.selectionEnd = selectionStart + 4;
      });
      return;
    }

    if (event.key === 'Enter')
    {
      // Real editors don't drop the cursor to column 0 — they match the
      // current line's leading whitespace, and add an extra indent inside a
      // freshly opened block. Browsers' default textarea behavior is the
      // opposite of what every IDE does, hence this override.
      event.preventDefault();
      const { selectionStart, selectionEnd } = el;
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);

      const lineStart = before.lastIndexOf('\n') + 1;
      const currentLineBefore = before.slice(lineStart);
      const indent = currentLineBefore.match(/^[ \t]*/)[0];

      const prevChar = before.replace(/[ \t]+$/, '').slice(-1);
      const nextChar = after.replace(/^[ \t]+/, '').charAt(0);
      const opens = prevChar === '{' || prevChar === '[' || prevChar === '(';
      const closes =
        (prevChar === '{' && nextChar === '}') ||
        (prevChar === '[' && nextChar === ']') ||
        (prevChar === '(' && nextChar === ')');

      let insertion;
      let cursorOffset;
      if (closes)
      {
        // Cursor sits between an opener and its matching closer:
        //   { | }   →   {\n    |\n}
        const inner = indent + '    ';
        insertion = '\n' + inner + '\n' + indent;
        cursorOffset = 1 + inner.length;
      }
      else if (opens)
      {
        // Just opened a block:
        //   {\n        →   {\n    |
        const inner = indent + '    ';
        insertion = '\n' + inner;
        cursorOffset = insertion.length;
      }
      else
      {
        // Plain line — match current indent.
        insertion = '\n' + indent;
        cursorOffset = insertion.length;
      }

      const next = before + insertion + after;
      onChange(next);
      requestAnimationFrame(() =>
      {
        const pos = selectionStart + cursorOffset;
        el.selectionStart = pos;
        el.selectionEnd = pos;
      });
      return;
    }

    if (event.key === 'Backspace')
    {
      const { selectionStart, selectionEnd } = el;
      if (selectionStart !== selectionEnd || selectionStart === 0)
      {
        return;
      }

      // Pair deletion: cursor sits between an opener and its matching closer.
      // Deleting the opener removes the closer too — saves a second Backspace.
      const prev = value[selectionStart - 1];
      const nextCh = value[selectionStart];
      if (prev && PAIR_OPENERS[prev] === nextCh)
      {
        event.preventDefault();
        const next = value.slice(0, selectionStart - 1) + value.slice(selectionStart + 1);
        onChange(next);
        requestAnimationFrame(() =>
        {
          const pos = selectionStart - 1;
          el.selectionStart = pos;
          el.selectionEnd = pos;
        });
        return;
      }

      // Indent dedent: if the cursor is at the end of a pure-whitespace
      // indent, delete 4 spaces in one keypress instead of forcing the user
      // to press Backspace four times.
      const before = value.slice(0, selectionStart);
      const lineStart = before.lastIndexOf('\n') + 1;
      const currentLineBefore = before.slice(lineStart);
      if (currentLineBefore.length === 0 || !/^[ \t]+$/.test(currentLineBefore))
      {
        return;
      }
      const stripLen = currentLineBefore.length % 4 === 0 ? 4 : currentLineBefore.length % 4;
      event.preventDefault();
      const next = value.slice(0, selectionStart - stripLen) + value.slice(selectionStart);
      onChange(next);
      requestAnimationFrame(() =>
      {
        const pos = selectionStart - stripLen;
        el.selectionStart = pos;
        el.selectionEnd = pos;
      });
    }
  }

  return (
    <div className="flex bg-[#0a0c14] font-mono text-xs leading-[1.55] min-h-0 flex-1 overflow-auto">
      <div className="select-none px-3 py-3 text-right text-slate-600 border-r border-white/5 shrink-0">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative flex-1 min-w-0">
        <pre
          aria-hidden="true"
          className="m-0 px-3 py-3 whitespace-pre-wrap break-words pointer-events-none"
        >
          <code>
            {tokens.map((tok, i) =>
            {
              if (tok.kind === 'ws')
              {
                return tok.text;
              }
              return (
                <span key={i} className={classFor(tok.kind)}>
                  {tok.text}
                </span>
              );
            })}
            {'\n'}
          </code>
        </pre>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="absolute inset-0 w-full h-full px-3 py-3 bg-transparent text-transparent caret-white resize-none focus:outline-none whitespace-pre-wrap break-words font-mono text-xs leading-[1.55] selection:bg-violet-500/40"
        />
      </div>
    </div>
  );
}
