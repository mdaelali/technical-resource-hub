/*
 * Autocomplete suggestions for the in-browser code editor.
 *
 * Each item is { label, kind, insert?, caret? }:
 *   - label  : text shown in the dropdown and the prefix matched against
 *   - kind   : 'keyword' | 'type' | 'function' | 'snippet' (drives the color)
 *   - insert : text actually inserted (defaults to label)
 *   - caret  : cursor offset within `insert` after insertion (defaults to end).
 *              Use the literal "$0" marker in `insert` instead of caret to mark
 *              the cursor position inline; the editor strips it and places the
 *              caret there.
 */

function kw(label) { return { label, kind: 'keyword' }; }
function ty(label) { return { label, kind: 'type' }; }
function fn(label, insert) { return { label, kind: 'function', insert: insert ?? label }; }
function snip(label, insert) { return { label, kind: 'snippet', insert }; }

const JAVA = [
  kw('public'), kw('private'), kw('protected'), kw('static'), kw('final'),
  kw('class'), kw('interface'), kw('extends'), kw('implements'), kw('return'),
  kw('if'), kw('else'), kw('while'), kw('for'), kw('do'), kw('switch'),
  kw('case'), kw('break'), kw('continue'), kw('new'), kw('this'), kw('super'),
  kw('try'), kw('catch'), kw('finally'), kw('throw'), kw('throws'), kw('import'),
  kw('package'), kw('void'), kw('true'), kw('false'), kw('null'), kw('instanceof'),
  ty('int'), ty('long'), ty('double'), ty('float'), ty('boolean'), ty('char'),
  ty('String'), ty('Object'), ty('Integer'), ty('Double'), ty('Boolean'),
  ty('List'), ty('ArrayList'), ty('Map'), ty('HashMap'), ty('Set'), ty('HashSet'),
  ty('Math'), ty('System'),
  fn('System.out.println()', 'System.out.println($0)'),
  fn('System.out.print()', 'System.out.print($0)'),
  fn('Math.max()', 'Math.max($0)'),
  fn('Math.min()', 'Math.min($0)'),
  fn('Math.abs()', 'Math.abs($0)'),
  snip('sout', 'System.out.println($0);'),
  snip('main', 'public static void main(String[] args)\n{\n    $0\n}'),
  snip('fori', 'for (int i = 0; i < n; i++)\n{\n    $0\n}'),
  snip('forr', 'for (int i = n - 1; i >= 0; i--)\n{\n    $0\n}'),
  snip('foreach', 'for (int x : arr)\n{\n    $0\n}'),
  snip('ifelse', 'if ($0)\n{\n    \n}\nelse\n{\n    \n}'),
  snip('class', 'public class Name\n{\n    $0\n}'),
  snip('arraylist', 'List<Integer> list = new ArrayList<>();$0')
];

const PYTHON = [
  kw('def'), kw('return'), kw('if'), kw('elif'), kw('else'), kw('for'),
  kw('while'), kw('in'), kw('not'), kw('and'), kw('or'), kw('is'), kw('lambda'),
  kw('class'), kw('pass'), kw('break'), kw('continue'), kw('import'), kw('from'),
  kw('as'), kw('try'), kw('except'), kw('finally'), kw('raise'), kw('with'),
  kw('True'), kw('False'), kw('None'), kw('global'), kw('yield'),
  ty('int'), ty('str'), ty('float'), ty('bool'), ty('list'), ty('dict'),
  ty('set'), ty('tuple'),
  fn('print()', 'print($0)'),
  fn('range()', 'range($0)'),
  fn('len()', 'len($0)'),
  fn('input()', 'input($0)'),
  fn('int()', 'int($0)'),
  fn('str()', 'str($0)'),
  fn('sorted()', 'sorted($0)'),
  fn('enumerate()', 'enumerate($0)'),
  snip('main', 'def main():\n    $0\n\n\nif __name__ == "__main__":\n    main()'),
  snip('forr', 'for i in range($0):\n    pass'),
  snip('foreach', 'for x in items:\n    $0'),
  snip('ifelse', 'if $0:\n    pass\nelse:\n    pass'),
  snip('def', 'def name():\n    $0'),
  snip('class', 'class Name:\n    def __init__(self):\n        $0')
];

const CPP = [
  kw('int'), kw('long'), kw('double'), kw('float'), kw('bool'), kw('char'),
  kw('void'), kw('auto'), kw('const'), kw('return'), kw('if'), kw('else'),
  kw('for'), kw('while'), kw('do'), kw('switch'), kw('case'), kw('break'),
  kw('continue'), kw('struct'), kw('class'), kw('public'), kw('private'),
  kw('new'), kw('delete'), kw('using'), kw('namespace'), kw('template'),
  kw('true'), kw('false'), kw('nullptr'),
  ty('string'), ty('vector'), ty('map'), ty('set'), ty('pair'), ty('size_t'),
  ty('std'), ty('cout'), ty('cin'), ty('endl'),
  fn('std::cout', 'std::cout << $0'),
  fn('std::cin', 'std::cin >> $0'),
  fn('push_back()', 'push_back($0)'),
  fn('sort()', 'sort($0)'),
  snip('cout', 'std::cout << $0 << std::endl;'),
  snip('main', 'int main()\n{\n    $0\n    return 0;\n}'),
  snip('fori', 'for (int i = 0; i < n; i++)\n{\n    $0\n}'),
  snip('foreach', 'for (auto& x : v)\n{\n    $0\n}'),
  snip('ifelse', 'if ($0)\n{\n    \n}\nelse\n{\n    \n}'),
  snip('include', '#include <iostream>\nusing namespace std;\n$0'),
  snip('vector', 'vector<int> v;$0')
];

const TABLE = { java: JAVA, python: PYTHON, cpp: CPP };

const KIND_PRIORITY = { snippet: 0, keyword: 1, type: 2, function: 3, local: 4 };

const LOCAL_REGEX = /[A-Za-z_][A-Za-z0-9_]*/g;
const RESERVED = new Set(
  [...JAVA, ...PYTHON, ...CPP].map((c) => c.label.replace(/[^A-Za-z0-9_].*$/, ''))
);

/*
 * Build the suggestion list for a prefix: built-in completions for the
 * language plus "local" identifiers already present in the user's code
 * (so variable/function names they typed earlier autocomplete too).
 */
export function getCompletions(language, prefix, fullText)
{
  if (!prefix)
  {
    return [];
  }
  const lower = prefix.toLowerCase();
  const base = TABLE[language] || JAVA;

  const builtins = base.filter((c) => c.label.toLowerCase().startsWith(lower));

  // Harvest locals from the document, excluding the prefix itself and reserved words.
  const seen = new Set(builtins.map((b) => b.label));
  const locals = [];
  if (fullText)
  {
    const matches = fullText.match(LOCAL_REGEX) || [];
    for (const word of matches)
    {
      if (
        word !== prefix &&
        word.toLowerCase().startsWith(lower) &&
        !seen.has(word) &&
        !RESERVED.has(word) &&
        word.length > 1
      )
      {
        seen.add(word);
        locals.push({ label: word, kind: 'local' });
      }
    }
  }

  const all = [...builtins, ...locals];
  all.sort((a, b) =>
  {
    // Exact prefix-case match first, then by kind priority, then alphabetical.
    const ap = a.label.startsWith(prefix) ? 0 : 1;
    const bp = b.label.startsWith(prefix) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    const ak = KIND_PRIORITY[a.kind] ?? 9;
    const bk = KIND_PRIORITY[b.kind] ?? 9;
    if (ak !== bk) return ak - bk;
    return a.label.localeCompare(b.label);
  });

  return all.slice(0, 8);
}

export const KIND_CLASS = {
  keyword: 'text-violet-300',
  type: 'text-cyan-300',
  function: 'text-amber-300',
  snippet: 'text-emerald-300',
  local: 'text-slate-300'
};
