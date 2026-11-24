import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { tokenize, classFor } from '../utils/highlightCode.js';
import { getCompletions, KIND_CLASS } from '../data/completions.js';
import { getCaretCoordinates } from '../utils/caretCoordinates.js';

// Characters whose typing should auto-insert the matching closer.
const PAIR_OPENERS = {
  '{': '}',
  '[': ']',
  '(': ')',
  '"': '"',
  "'": "'"
};
const PAIR_CLOSERS = new Set(['}', ']', ')', '"', "'"]);

const CLOSED_AC = { open: false, items: [], index: 0, top: 0, left: 0, wordStart: 0 };

export default function CodeEditor({ value, onChange, language = 'java' })
{
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightedCodeRef = useRef(null);
  const blurTimer = useRef(null);
  const tokens = useMemo(() => tokenize(value, language), [value, language]);
  const lineCount = Math.max(value.split('\n').length, 1);
  const [ac, setAc] = useState(CLOSED_AC);

  function closeAc()
  {
    setAc((a) => (a.open ? CLOSED_AC : a));
  }

  function refreshAutocomplete()
  {
    const el = textareaRef.current;
    if (!el)
    {
      return;
    }
    if (el.selectionStart !== el.selectionEnd)
    {
      closeAc();
      return;
    }
    const pos = el.selectionStart;
    const before = el.value.slice(0, pos);
    const match = before.match(/[A-Za-z_][A-Za-z0-9_]*$/);
    if (!match)
    {
      closeAc();
      return;
    }
    const prefix = match[0];
    const items = getCompletions(language, prefix, el.value);
    if (items.length === 0)
    {
      closeAc();
      return;
    }
    const wordStart = pos - prefix.length;
    // Use getBoundingClientRect for fixed positioning so the dropdown
    // escapes any overflow:hidden parent and appears over the entire page.
    const textareaRect = el.getBoundingClientRect();
    const coords = getCaretCoordinates(el, wordStart);
    const scrollTop = el.scrollTop;
    const scrollLeft = el.scrollLeft;
    const rawTop = textareaRect.top + coords.top - scrollTop + coords.height + 4;
    const rawLeft = textareaRect.left + coords.left - scrollLeft;
    // Clamp so the dropdown never goes off the right or bottom edge.
    const dropdownWidth = 288; // max-w-72 = 18rem = 288px
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const left = Math.min(rawLeft, vpW - dropdownWidth - 8);
    const top = rawTop + 224 > vpH ? rawTop - coords.height - 228 : rawTop;
    setAc({
      open: true,
      items,
      index: 0,
      top,
      left: Math.max(8, left),
      wordStart
    });
  }

  function acceptCompletion(item)
  {
    const el = textareaRef.current;
    if (!el || !item)
    {
      return;
    }
    const caret = el.selectionStart;
    const start = ac.wordStart;
    const raw = item.insert ?? item.label;
    const markerIdx = raw.indexOf('$0');
    const text = raw.replace('$0', '');
    const next = value.slice(0, start) + text + value.slice(caret);
    onChange(next);
    const cursorPos = start + (markerIdx >= 0 ? markerIdx : text.length);
    setAc(CLOSED_AC);
    requestAnimationFrame(() =>
    {
      el.focus();
      el.selectionStart = cursorPos;
      el.selectionEnd = cursorPos;
    });
  }

  function handleKeyDown(event)
  {
    const el = textareaRef.current;
    if (!el)
    {
      return;
    }

    // в”Ђв”Ђ Autocomplete navigation (only when the dropdown is open) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
    if (ac.open && ac.items.length > 0)
    {
      if (event.key === 'ArrowDown')
      {
        event.preventDefault();
        setAc((a) => ({ ...a, index: (a.index + 1) % a.items.length }));
        return;
      }
      if (event.key === 'ArrowUp')
      {
        event.preventDefault();
        setAc((a) => ({ ...a, index: (a.index - 1 + a.items.length) % a.items.length }));
        return;
      }
      if (event.key === 'Enter' || event.key === 'Tab')
      {
        event.preventDefault();
        acceptCompletion(ac.items[ac.index]);
        return;
      }
      if (event.key === 'Escape')
      {
        event.preventDefault();
        closeAc();
        return;
      }
    }

    // в”Ђв”Ђ Auto-pair openers в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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
        closeAc();
        requestAnimationFrame(() =>
        {
          const pos = selectionStart + 1;
          el.selectionStart = pos;
          el.selectionEnd = pos;
        });
        return;
      }
    }

    // в”Ђв”Ђ Skip over an existing closer в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
    if (PAIR_CLOSERS.has(event.key))
    {
      const { selectionStart, selectionEnd } = el;
      if (selectionStart === selectionEnd && value[selectionStart] === event.key)
      {
        event.preventDefault();
        closeAc();
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
        const inner = indent + '    ';
        insertion = '\n' + inner + '\n' + indent;
        cursorOffset = 1 + inner.length;
      }
      else if (opens)
      {
        const inner = indent + '    ';
        insertion = '\n' + inner;
        cursorOffset = insertion.length;
      }
      else
      {
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

  // Close the dropdown if the user scrolls the page (portal position would be stale).
  useEffect(() =>
  {
    if (!ac.open)
    {
      return undefined;
    }
    const close = () => closeAc();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () =>
    {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [ac.open]);

  function handleKeyUp(event)
  {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key))
    {
      refreshAutocomplete();
    }
  }

  function handleChange(event)
  {
    onChange(event.target.value);
    requestAnimationFrame(refreshAutocomplete);
  }

  function handleEditorScroll(event)
  {
    // Keep the syntax layer and line numbers in step with the textarea. The
    // editor then needs only one vertical scrollbar instead of two nested ones.
    const offset = `translateY(-${event.currentTarget.scrollTop}px)`;
    if (lineNumbersRef.current) lineNumbersRef.current.style.transform = offset;
    if (highlightedCodeRef.current) highlightedCodeRef.current.style.transform = offset;
  }

  function handleBlur()
  {
    // Delay so a mousedown on a dropdown item is registered before we close.
    blurTimer.current = window.setTimeout(closeAc, 120);
  }

  return (
    <div className="flex bg-[var(--code-bg)] font-mono text-xs leading-[1.55] min-h-0 flex-1 overflow-hidden">
      <div ref={lineNumbersRef} className="select-none px-3 py-3 text-right text-[var(--gutter-text)] border-r border-[var(--border-color)] shrink-0 will-change-transform">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative flex-1 min-w-0">
        <pre
          ref={highlightedCodeRef}
          aria-hidden="true"
          className="m-0 px-3 py-3 whitespace-pre-wrap break-words pointer-events-none min-h-full will-change-transform"
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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onScroll={handleEditorScroll}
          onBlur={handleBlur}
          wrap="soft"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="code-editor-input absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden px-3 py-3 bg-transparent text-transparent caret-white resize-none focus:outline-none whitespace-pre-wrap break-words font-mono text-xs leading-[1.55] selection:bg-[var(--accent-soft)]"
        />

        {ac.open && createPortal(
          <ul
            className="fixed z-[9999] min-w-44 max-w-72 max-h-56 overflow-auto rounded-lg border border-white/10 bg-[#0b0f1e] shadow-glass py-1 text-xs"
            style={{ top: ac.top, left: ac.left }}
          >
            {ac.items.map((item, i) => (
              <li key={item.label}>
                <button
                  type="button"
                  // mousedown fires before blur вЂ” prevent default so the
                  // textarea keeps focus while we insert the completion.
                  onMouseDown={(e) =>
                  {
                    e.preventDefault();
                    if (blurTimer.current)
                    {
                      window.clearTimeout(blurTimer.current);
                    }
                    acceptCompletion(item);
                  }}
                  onMouseEnter={() => setAc((a) => ({ ...a, index: i }))}
                  className={`w-full flex items-center justify-between gap-3 px-2.5 py-1 text-left ${
                    i === ac.index ? 'bg-[var(--accent-soft)]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`font-mono ${KIND_CLASS[item.kind] || 'text-slate-200'}`}>
                    {item.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 shrink-0">
                    {item.kind}
                  </span>
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
      </div>
    </div>
  );
}
