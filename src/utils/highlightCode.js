const JAVA_KEYWORDS = new Set([
  'public', 'private', 'protected', 'static', 'final', 'class', 'interface',
  'extends', 'implements', 'return', 'if', 'else', 'while', 'for', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'this', 'super', 'try',
  'catch', 'finally', 'throw', 'throws', 'package', 'import', 'null',
  'true', 'false', 'void', 'abstract', 'enum', 'instanceof'
]);

const JAVA_TYPES = new Set([
  'int', 'long', 'short', 'byte', 'float', 'double', 'boolean', 'char',
  'String', 'Object', 'Integer', 'Long', 'Double', 'Boolean', 'Node',
  'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet', 'Deque',
  'ArrayDeque', 'Queue', 'LinkedList', 'Stack', 'StringBuilder',
  'Character', 'System', 'Math', 'IllegalStateException',
  'IllegalArgumentException', 'RuntimeException', 'Exception',
  'Iterator', 'Comparable', 'Comparator', 'Main'
]);

const PYTHON_KEYWORDS = new Set([
  'def', 'return', 'if', 'elif', 'else', 'while', 'for', 'in', 'not', 'and',
  'or', 'is', 'lambda', 'class', 'pass', 'break', 'continue', 'import',
  'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield',
  'global', 'nonlocal', 'None', 'True', 'False', 'async', 'await', 'del'
]);

const PYTHON_TYPES = new Set([
  'int', 'str', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'print',
  'range', 'len', 'input', 'open', 'sum', 'min', 'max', 'abs', 'sorted',
  'enumerate', 'zip', 'map', 'filter', 'self'
]);

const CPP_KEYWORDS = new Set([
  'auto', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
  'delete', 'do', 'else', 'enum', 'explicit', 'export', 'extern', 'for',
  'friend', 'goto', 'if', 'inline', 'mutable', 'namespace', 'new',
  'operator', 'private', 'protected', 'public', 'register', 'return',
  'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw',
  'try', 'typedef', 'typeid', 'typename', 'union', 'using', 'virtual',
  'volatile', 'while', 'true', 'false', 'nullptr', 'constexpr', 'override',
  'final', 'noexcept', 'thread_local'
]);

const CPP_TYPES = new Set([
  'int', 'long', 'short', 'char', 'float', 'double', 'bool', 'void',
  'unsigned', 'signed', 'string', 'wstring', 'vector', 'map',
  'unordered_map', 'set', 'unordered_set', 'list', 'deque', 'queue',
  'stack', 'pair', 'tuple', 'array', 'cout', 'cin', 'cerr', 'endl',
  'std', 'size_t', 'uint32_t', 'int32_t', 'int64_t', 'uint64_t'
]);

const TOKEN_REGEX = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\s])/g;

const PYTHON_TOKEN_REGEX = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\s])/g;

const CLASS = {
  comment: 'text-slate-500 italic',
  string: 'text-emerald-300',
  number: 'text-amber-300',
  keyword: 'text-violet-300 font-medium',
  type: 'text-cyan-300',
  punct: 'text-slate-400',
  ident: 'text-slate-100',
  ws: ''
};

function lookups(language)
{
  if (language === 'python')
  {
    return { keywords: PYTHON_KEYWORDS, types: PYTHON_TYPES, regex: PYTHON_TOKEN_REGEX };
  }
  if (language === 'cpp')
  {
    return { keywords: CPP_KEYWORDS, types: CPP_TYPES, regex: TOKEN_REGEX };
  }
  return { keywords: JAVA_KEYWORDS, types: JAVA_TYPES, regex: TOKEN_REGEX };
}

export function tokenize(code, language = 'java')
{
  const { keywords, types, regex } = lookups(language);
  const localRegex = new RegExp(regex.source, regex.flags);
  const tokens = [];
  let match;
  localRegex.lastIndex = 0;

  while ((match = localRegex.exec(code)) !== null)
  {
    const [raw, comment, str, num, word, ws] = match;

    if (comment !== undefined)
    {
      tokens.push({ kind: 'comment', text: raw });
    }
    else if (str !== undefined)
    {
      tokens.push({ kind: 'string', text: raw });
    }
    else if (num !== undefined)
    {
      tokens.push({ kind: 'number', text: raw });
    }
    else if (word !== undefined)
    {
      if (keywords.has(word))
      {
        tokens.push({ kind: 'keyword', text: raw });
      }
      else if (types.has(word))
      {
        tokens.push({ kind: 'type', text: raw });
      }
      else
      {
        tokens.push({ kind: 'ident', text: raw });
      }
    }
    else if (ws !== undefined)
    {
      tokens.push({ kind: 'ws', text: raw });
    }
    else
    {
      tokens.push({ kind: 'punct', text: raw });
    }
  }

  return tokens;
}

export function classFor(kind)
{
  return CLASS[kind] || '';
}
