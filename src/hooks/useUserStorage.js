import useLocalStorage from './useLocalStorage.js';
import { useAuth } from '../auth/AuthContext.jsx';

/*
 * Same shape as useLocalStorage but scopes the key under the current user id.
 * If the user logs out, the key changes and the hook re-reads from storage,
 * so the next user sees their own data — never the previous user's.
 */
export default function useUserStorage(key, initial)
{
  const { user } = useAuth();
  const scoped = user ? `trh.user.${user.id}.${key}` : `trh.guest.${key}`;
  return useLocalStorage(scoped, initial);
}
