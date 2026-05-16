/*
 * Judge0 API client.
 *
 * Defaults to the public CE endpoint at ce.judge0.com (free, rate-limited).
 * To use a RapidAPI proxy with a personal key, create .env.local with:
 *   VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
 *   VITE_JUDGE0_HOST=judge0-ce.p.rapidapi.com
 *   VITE_JUDGE0_KEY=<your RapidAPI key>
 */

const RAW_URL_BASE = (import.meta.env.VITE_JUDGE0_URL || 'https://ce.judge0.com').replace(/\/$/, '');
const HOST = import.meta.env.VITE_JUDGE0_HOST || '';
const KEY = import.meta.env.VITE_JUDGE0_KEY || '';

// Security: only allow HTTPS endpoints. If a non-https URL is configured, refuse to use it.
const URL_BASE = RAW_URL_BASE.startsWith('https://') ? RAW_URL_BASE : null;

export const LANGUAGES = [
  {
    id: 62,
    key: 'java',
    name: 'Java',
    extension: 'java',
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
    id: 71,
    key: 'python',
    name: 'Python 3',
    extension: 'py',
    starter: `def main():
    print("Hello, World!")
    for i in range(1, 6):
        print(f"Counter: {i}")


if __name__ == "__main__":
    main()
`
  },
  {
    id: 54,
    key: 'cpp',
    name: 'C++',
    extension: 'cpp',
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

function encodeBase64(str)
{
  return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(str)
{
  if (!str)
  {
    return '';
  }
  try
  {
    return decodeURIComponent(escape(atob(str)));
  }
  catch
  {
    return str;
  }
}

function buildHeaders()
{
  const headers = { 'Content-Type': 'application/json' };
  if (KEY)
  {
    headers['X-RapidAPI-Key'] = KEY;
    headers['x-rapidapi-key'] = KEY;
  }
  if (HOST)
  {
    headers['X-RapidAPI-Host'] = HOST;
    headers['x-rapidapi-host'] = HOST;
  }
  return headers;
}

export const MAX_SOURCE_LENGTH = 10000;
export const MAX_STDIN_LENGTH = 4000;

export async function runCode({ languageId, source, stdin = '' })
{
  if (!URL_BASE)
  {
    throw new CompilerError(
      'INSECURE_URL',
      'Judge0 endpoint must use HTTPS. Update VITE_JUDGE0_URL in .env.local.'
    );
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
    source_code: encodeBase64(source),
    language_id: languageId,
    stdin: safeStdin ? encodeBase64(safeStdin) : ''
  };

  let response;
  try
  {
    response = await fetch(
      `${URL_BASE}/submissions?base64_encoded=true&wait=true`,
      {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body)
      }
    );
  }
  catch (networkError)
  {
    throw new CompilerError(
      'NETWORK',
      'Could not reach the Judge0 service. Check your internet connection or configure VITE_JUDGE0_URL / VITE_JUDGE0_KEY in .env.local.'
    );
  }

  if (response.status === 401 || response.status === 403)
  {
    throw new CompilerError(
      'AUTH',
      'Judge0 rejected the request (HTTP ' + response.status + '). Set VITE_JUDGE0_KEY and VITE_JUDGE0_HOST in .env.local with a free RapidAPI Judge0 CE key.'
    );
  }

  if (response.status === 429)
  {
    throw new CompilerError(
      'RATE_LIMIT',
      'Judge0 rate limit reached. Wait a moment and try again, or use your own RapidAPI key for a higher quota.'
    );
  }

  if (!response.ok)
  {
    throw new CompilerError(
      'HTTP_' + response.status,
      `Judge0 returned HTTP ${response.status} ${response.statusText}.`
    );
  }

  const data = await response.json();

  return {
    stdout: decodeBase64(data.stdout),
    stderr: decodeBase64(data.stderr),
    compileOutput: decodeBase64(data.compile_output),
    message: decodeBase64(data.message),
    statusId: data.status?.id ?? 0,
    statusDescription: data.status?.description ?? 'Unknown',
    time: data.time,
    memory: data.memory
  };
}

export class CompilerError extends Error
{
  constructor(code, message)
  {
    super(message);
    this.name = 'CompilerError';
    this.code = code;
  }
}
