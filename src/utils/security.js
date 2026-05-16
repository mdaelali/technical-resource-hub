/*
 * Security helpers — password hashing, token generation, validation, sanitization.
 * SHA-256 via Web Crypto with per-user salt. Not as slow as bcrypt, but acceptable
 * for a client-only demo and dramatically better than plaintext.
 */

export async function sha256Hex(input)
{
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password, salt)
{
  return sha256Hex(`${salt}::${password}`);
}

function randomHex(byteLen)
{
  const arr = new Uint8Array(byteLen);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt()
{
  return randomHex(16);
}

export function generateToken()
{
  return randomHex(32);
}

export function generateId()
{
  return randomHex(8);
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function validateEmail(email)
{
  if (!email || typeof email !== 'string')
  {
    return { valid: false, reason: 'Email is required.' };
  }
  const trimmed = email.trim();
  if (trimmed.length > 254)
  {
    return { valid: false, reason: 'Email is too long.' };
  }
  if (!EMAIL_REGEX.test(trimmed))
  {
    return { valid: false, reason: 'Enter a valid email address.' };
  }
  return { valid: true, value: trimmed.toLowerCase() };
}

export function passwordStrength(password)
{
  if (!password)
  {
    return { score: 0, label: 'Empty', requirements: [] };
  }
  const checks = [
    { id: 'length', label: 'At least 8 characters', pass: password.length >= 8 },
    { id: 'number', label: 'Contains a number', pass: /\d/.test(password) },
    { id: 'special', label: 'Contains a special character', pass: /[^A-Za-z0-9]/.test(password) },
    { id: 'upper', label: 'Contains an uppercase letter', pass: /[A-Z]/.test(password) },
    { id: 'lower', label: 'Contains a lowercase letter', pass: /[a-z]/.test(password) }
  ];
  const score = checks.filter((c) => c.pass).length;
  const labels = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong', 'Excellent'];
  return { score, label: labels[score], requirements: checks };
}

export function validatePassword(password)
{
  if (!password || password.length < 8)
  {
    return { valid: false, reason: 'Password must be at least 8 characters.' };
  }
  if (!/\d/.test(password))
  {
    return { valid: false, reason: 'Password must contain at least one number.' };
  }
  if (!/[^A-Za-z0-9]/.test(password))
  {
    return { valid: false, reason: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

const CONTROL_CHAR_REGEX = new RegExp('[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]', 'g');

/*
 * Sanitize free-text user input. React already escapes interpolated strings,
 * so this strips control characters and enforces a max length to prevent
 * abusive payloads in stored data.
 */
export function sanitizeText(input, { maxLength = 240 } = {})
{
  if (typeof input !== 'string')
  {
    return '';
  }
  const cleaned = input.replace(CONTROL_CHAR_REGEX, '').trim();
  if (cleaned.length > maxLength)
  {
    return cleaned.slice(0, maxLength);
  }
  return cleaned;
}

/*
 * Escape HTML for the rare case where we need to render user content as HTML.
 * In practice React handles this automatically — kept here for defense in depth.
 */
export function escapeHtml(str)
{
  if (typeof str !== 'string')
  {
    return '';
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function ensureHttps(url)
{
  if (typeof url !== 'string')
  {
    return false;
  }
  return url.startsWith('https://');
}

export const CODE_MAX_LENGTH = 10000;

export function clampCodeLength(code)
{
  if (typeof code !== 'string')
  {
    return '';
  }
  if (code.length > CODE_MAX_LENGTH)
  {
    return code.slice(0, CODE_MAX_LENGTH);
  }
  return code;
}

/*
 * Inspect the first 12 bytes of a file to determine its real image format.
 * Browsers report `file.type` based on the file extension which is trivially
 * spoofed — magic numbers are the only reliable check before sending bytes
 * to a public bucket.
 *
 * Returns the canonical MIME string or null if the file isn't a supported image.
 */
export async function detectImageMimeType(file)
{
  if (!file || typeof file.slice !== 'function')
  {
    return null;
  }
  const buf = await file.slice(0, 12).arrayBuffer();
  const b = new Uint8Array(buf);
  if (b.length < 4)
  {
    return null;
  }
  // JPEG: FF D8 FF
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF)
  {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47)
  {
    return 'image/png';
  }
  // GIF: "GIF87a" or "GIF89a"
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38)
  {
    return 'image/gif';
  }
  // WebP: bytes 0-3 = "RIFF", bytes 8-11 = "WEBP"
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
  {
    return 'image/webp';
  }
  return null;
}
