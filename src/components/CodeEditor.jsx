import { useMemo, useRef } from 'react';
import { tokenize, classFor } from '../utils/highlightCode.js';

export default function CodeEditor({ value, onChange, language = 'java' })
{
  const textareaRef = useRef(null);
  const tokens = useMemo(() => tokenize(value, language), [value, language]);
  const lineCount = Math.max(value.split('\n').length, 1);

  function handleKeyDown(event)
  {
    if (event.key !== 'Tab')
    {
      return;
    }
    event.preventDefault();
    const el = textareaRef.current;
    if (!el)
    {
      return;
    }
    const { selectionStart, selectionEnd } = el;
    const next = value.slice(0, selectionStart) + '    ' + value.slice(selectionEnd);
    onChange(next);
    requestAnimationFrame(() =>
    {
      el.selectionStart = selectionStart + 4;
      el.selectionEnd = selectionStart + 4;
    });
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
