/*
 * Piston API client. Replaces Judge0 because the Piston public endpoint at
 * emkc.org is faster, more reliable, doesn't require an API key, and uses
 * plain JSON instead of base64. The previous judge0.js is kept in the repo
 * unused so it can be diff'd or restored.
 *
 *   POST https://emkc.org/api/v2/piston/execute
 *   { language, version, files: [{ name, content }], stdin }
 *
 *   →  { language, version, run: { stdout, stderr, code, signal, output }, compile?: { ... } }
 */

const ENDPOINT = 'https://emkc.org/api/v2/piston/execute';

export const MAX_SOURCE_LENGTH = 10000;
export const MAX_STDIN_LENGTH = 4000;

export const LANGUAGES = [
  {
    key: 'java',
    name: 'Java',
    extension: 'java',
    pistonLang: 'java',
    pistonVersion: '*',
    entryFile: 'Main.java',
    starter: `public class Main
{
    public static void main(String[] args)
    {
        System.out.println("Hello, World!");

        for (int i = 1; i <= 5; i++)
        {
            System.out.println("Counter: " + i);
        }
    }
}
`
  },
  {
    key: 'python',
    name: 'Python 3',
    extension: 'py',
    pistonLang: 'python',
    pistonVersion: '*',
    entryFile: 'main.py',
    starter: `def main():
    print("Hello, World!")
    for i in range(1, 6):
        print(f"Counter: {i}")


if __name__ == "__main__":
    main()
`
  },
  {
    key: 'cpp',
    name: 'C++',
    extension: 'cpp',
    pistonLang: 'cpp',
    pistonVersion: '*',
    entryFile: 'main.cpp',
    starter: `#include <iostream>
using namespace std;

int main()
{
    cout << "Hello, World!" << endl;

    for (int i = 1; i <= 5; i++)
    {
        cout << "Counter: " << i << endl;
    }

    return 0;
}
`
  }
];

export class CompilerError extends Error
{
  constructor(code, message)
  {
    super(message);
    this.name = 'CompilerError';
    this.code = code;
  }
}

function findLanguage(key)
{
  return LANGUAGES.find((l) => l.key === key) || null;
}

/*
 * runCode is intentionally shaped to be a drop-in replacement for the previous
 * Judge0 client. The returned object has the same fields (stdout, stderr,
 * compileOutput, statusId, statusDescription, …) so CodeCompiler.jsx doesn't
 * need to know which backend it's talking to.
 */
export async function runCode({ languageKey, source, stdin = '' })
{
  const lang = findLanguage(languageKey);
  if (!lang)
  {
    throw new CompilerError('UNSUPPORTED', 'Language not supported.');
  }
  if (typeof source !== 'string' || source.length === 0)
  {
    throw new CompilerError('EMPTY', 'Source code is empty.');
  }
  if (source.length > MAX_SOURCE_LENGTH)
  {
    throw new CompilerError(
      'TOO_LONG',
      `Source code exceeds ${MAX_SOURCE_LENGTH} characters.`
    );
  }
  const safeStdin = typeof stdin === 'string' ? stdin.slice(0, MAX_STDIN_LENGTH) : '';

  const body = {
    language: lang.pistonLang,
    version: lang.pistonVersion,
    files: [{ name: lang.entryFile, content: source }],
    stdin: safeStdin
  };

  let response;
  try
  {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }
  catch
  {
    throw new CompilerError(
      'NETWORK',
      'Could not reach the runtime. Check your internet connection and try again.'
    );
  }

  if (response.status === 429)
  {
    throw new CompilerError(
      'RATE_LIMIT',
      'Too many requests. Wait a few seconds and try again.'
    );
  }

  if (!response.ok)
  {
    let detail = '';
    try
    {
      const errBody = await response.json();
      detail = errBody.message || errBody.error || '';
    }
    catch
    {
      /* ignore */
    }
    throw new CompilerError(
      'HTTP_' + response.status,
      `Runtime returned HTTP ${response.status}${detail ? ' — ' + detail : ''}.`
    );
  }

  let data;
  try
  {
    data = await response.json();
  }
  catch
  {
    throw new CompilerError('PARSE', 'Could not parse runtime response.');
  }

  const compile = data.compile || {};
  const run = data.run || {};

  // Map Piston's response onto the Judge0-style status the UI already knows.
  let statusId;
  let statusDescription;
  if (compile.code && compile.code !== 0)
  {
    statusId = 6;
    statusDescription = 'Compilation Error';
  }
  else if (run.signal === 'SIGKILL' || run.signal === 'SIGTERM')
  {
    statusId = 5;
    statusDescription = 'Time Limit Exceeded';
  }
  else if (run.code !== 0)
  {
    statusId = 7;
    statusDescription = 'Runtime Error';
  }
  else
  {
    statusId = 3;
    statusDescription = 'Accepted';
  }

  return {
    stdout: run.stdout || '',
    stderr: run.stderr || '',
    compileOutput: compile.stderr || compile.stdout || '',
    message: '',
    statusId,
    statusDescription,
    time: null,
    memory: null,
    languageVersion: data.version
  };
}
