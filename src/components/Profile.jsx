import { useEffect, useMemo, useRef, useState } from 'react';
import
{
  Camera,
  Pencil,
  Save,
  X,
  Flame,
  Trophy,
  Sparkles,
  Award,
  History,
  ChevronRight,
  Trash2,
  GraduationCap,
  ScanLine,
  LogOut,
  Mail,
  AlertCircle,
  Loader2,
  Maximize2,
  ShieldAlert
} from 'lucide-react';
import useUserStorage from '../hooks/useUserStorage.js';
import useRecentlyViewed from '../hooks/useRecentlyViewed.js';
import { docCategories } from '../data/docs.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { uploadAvatar } from '../api/profileService.js';

const TOTAL_TOPICS = docCategories.reduce((sum, c) => sum + c.cards.length, 0);

const BADGES = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Master your first topic.',
    earn: ({ mastered }) => mastered.length >= 1
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Reach a 3-day study streak.',
    earn: ({ streak }) => streak.count >= 3
  },
  {
    id: 'consistency',
    name: 'Consistency',
    description: 'Maintain a 7-day study streak.',
    earn: ({ streak }) => streak.count >= 7
  },
  {
    id: 'algorithms-explorer',
    name: 'Algorithms Explorer',
    description: 'Master every Algorithms card.',
    earn: ({ mastered }) =>
      docCategories.find((c) => c.id === 'algorithms').cards.every((card) =>
        mastered.includes(`algorithms:${card.title}`))
  },
  {
    id: 'logic-solver',
    name: 'Logic Solver',
    description: 'Master every Logic Problems card.',
    earn: ({ mastered }) =>
      docCategories.find((c) => c.id === 'logic').cards.every((card) =>
        mastered.includes(`logic:${card.title}`))
  },
  {
    id: 'exam-ready',
    name: 'Exam Ready',
    description: 'Master every Exam Prep card.',
    earn: ({ mastered }) =>
      docCategories.find((c) => c.id === 'exam').cards.every((card) =>
        mastered.includes(`exam:${card.title}`))
  },
  {
    id: 'master-student',
    name: 'Master Student',
    description: 'Master all 18 topics.',
    earn: ({ mastered }) => mastered.length >= TOTAL_TOPICS
  },
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    description: 'Read more on at least 5 different topics.',
    earn: ({ recent }) => recent.length >= 5
  }
];

export default function Profile({ onNavigate })
{
  const { user, profile, signOut, updateProfile, deleteAccount } = useAuth();
  const [mastered] = useUserStorage('mastered', []);
  const [streak] = useUserStorage('streak', { count: 0, last: null });
  const [recent, , clearRecent] = useRecentlyViewed();

  const safeMastered = mastered || [];
  const safeStreak = streak || { count: 0, last: null };

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftBio, setDraftBio] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() =>
  {
    if (!lightboxOpen)
    {
      return undefined;
    }
    function onKey(event)
    {
      if (event.key === 'Escape')
      {
        setLightboxOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    // Lock body scroll while the lightbox is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () =>
    {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  // Escape closes the delete-account modal if it isn't actively deleting.
  useEffect(() =>
  {
    if (!deleteModalOpen)
    {
      return undefined;
    }
    function onKey(event)
    {
      if (event.key === 'Escape' && !deleting)
      {
        closeDeleteModal();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteModalOpen, deleting]);

  function openDeleteModal()
  {
    setDeleteConfirmText('');
    setDeleteError(null);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal()
  {
    if (deleting)
    {
      return;
    }
    setDeleteModalOpen(false);
    setDeleteConfirmText('');
    setDeleteError(null);
  }

  async function handleDeleteAccount()
  {
    if (deleting)
    {
      return;
    }
    setDeleteError(null);
    setDeleting(true);
    const result = await deleteAccount();
    setDeleting(false);
    if (!result.ok)
    {
      setDeleteError(result.error || 'Could not delete account.');
      return;
    }
    // AuthContext has already cleared state — AppRoot will rerender to LoginPage.
  }

  // Keep the edit drafts in sync when the profile data arrives or changes.
  useEffect(() =>
  {
    if (!editing)
    {
      setDraftName(user?.name || '');
      setDraftBio(profile?.bio || '');
    }
  }, [user?.name, profile?.bio, editing]);

  const earnedBadges = useMemo(
    () => BADGES.filter((b) => b.earn({ mastered: safeMastered, streak: safeStreak, recent })),
    [safeMastered, safeStreak, recent]
  );

  function startEdit()
  {
    setDraftName(user?.name || '');
    setDraftBio(profile?.bio || '');
    setEditing(true);
  }

  function cancelEdit()
  {
    setEditing(false);
  }

  async function saveEdit()
  {
    setSavingEdit(true);
    const result = await updateProfile({ name: draftName, bio: draftBio });
    setSavingEdit(false);
    if (result.ok)
    {
      setEditing(false);
    }
    else
    {
      setUploadError(result.error || 'Could not save profile.');
    }
  }

  function openFilePicker()
  {
    setUploadError(null);
    if (fileRef.current)
    {
      fileRef.current.value = '';
      fileRef.current.click();
    }
  }

  async function handleAvatarChange(event)
  {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user)
    {
      return;
    }
    setUploadError(null);
    setUploading(true);
    try
    {
      const url = await uploadAvatar(user.id, file);
      const result = await updateProfile({ avatarUrl: url });
      if (!result.ok)
      {
        setUploadError(result.error || 'Could not save avatar.');
      }
    }
    catch (err)
    {
      setUploadError(err.message || 'Could not upload image.');
    }
    finally
    {
      setUploading(false);
    }
  }

  async function removeAvatar()
  {
    setUploading(true);
    const result = await updateProfile({ avatarUrl: null });
    setUploading(false);
    if (!result.ok)
    {
      setUploadError(result.error || 'Could not remove avatar.');
    }
  }

  const displayName = editing ? draftName : (user?.name || 'Student');
  const displayBio = editing ? draftBio : (profile?.bio || '');
  const avatarUrl = profile?.avatarUrl || null;

  const initials = (displayName || 'CS')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    : '—';

  const studentId = useMemo(() => formatUserId(user?.id), [user?.id]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <div className="relative h-20 sm:h-24 bg-gradient-to-r from-violet-600 via-cyan-500 to-amber-300 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 8px)'
              }}
            />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 text-white/90 text-[10px] font-medium uppercase tracking-widest">
              <ScanLine size={11} />
              <span>Student ID</span>
            </div>
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-md bg-white/15 backdrop-blur grid place-items-center border border-white/20">
                <GraduationCap size={14} className="text-white" />
              </div>
              <span className="text-white/95 text-xs font-semibold tracking-tight">Resource Hub</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start -mt-10 sm:-mt-12">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="group w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center overflow-hidden border-2 border-white/20 shadow-glass hover:ring-2 hover:ring-violet-400/40 transition cursor-zoom-in relative"
                aria-label="View profile picture"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-white">{initials}</span>
                )}
                <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 grid place-items-center transition pointer-events-none">
                  {uploading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                  ) : (
                    <Maximize2 size={20} className="text-white" />
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white/15 backdrop-blur border border-white/30 grid place-items-center text-white hover:bg-white/25 transition disabled:opacity-60"
                aria-label="Upload avatar"
              >
                {uploading ? <Loader2 size={11} className="animate-spin" /> : <Camera size={12} />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 w-full pt-2 sm:pt-10">
              {editing ? (
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">Display name</span>
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      maxLength={60}
                      className="input-field"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">Bio</span>
                    <textarea
                      value={draftBio}
                      onChange={(e) => setDraftBio(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="input-field resize-none"
                    />
                  </label>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button onClick={saveEdit} className="btn-primary" disabled={savingEdit}>
                      {savingEdit ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      <span>{savingEdit ? 'Saving' : 'Save'}</span>
                    </button>
                    <button onClick={cancelEdit} className="btn-ghost" disabled={savingEdit}>
                      <X size={12} />
                      <span>Cancel</span>
                    </button>
                    {avatarUrl && (
                      <button
                        onClick={removeAvatar}
                        disabled={uploading}
                        className="flex items-center gap-1 text-[11px] text-rose-300 px-2 py-1.5 rounded-lg hover:bg-rose-500/10 transition ml-auto"
                      >
                        <Trash2 size={11} />
                        <span>Remove avatar</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{displayName}</h2>
                    <span className="pill bg-white/10 text-slate-300 border border-white/10">
                      <GraduationCap size={10} className="inline mr-1 -mt-0.5" />
                      Student
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{displayBio}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-1">
                    <IdField label="Student ID" value={studentId} mono />
                    <IdField label="Member" value={memberSince} />
                    <IdField label="Email" value={user?.email} icon={Mail} />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button onClick={startEdit} className="btn-ghost">
                      <Pencil size={11} />
                      <span>Edit profile</span>
                    </button>
                    <button onClick={signOut} className="btn-ghost text-rose-300 hover:text-rose-200 hover:bg-rose-500/10">
                      <LogOut size={11} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="glass rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 flex items-start gap-2 text-[11px] text-rose-200">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-300 hover:text-white shrink-0"
            aria-label="Dismiss error"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <PremiumStat
          icon={Flame}
          label="Study Streak"
          value={`${safeStreak.count}`}
          unit={`day${safeStreak.count === 1 ? '' : 's'}`}
          accent="amber"
        />
        <PremiumStat
          icon={Trophy}
          label="Topics Mastered"
          value={`${safeMastered.length}`}
          unit={`/ ${TOTAL_TOPICS}`}
          accent="emerald"
        />
        <PremiumStat
          icon={Award}
          label="Badges Earned"
          value={`${earnedBadges.length}`}
          unit={`/ ${BADGES.length}`}
          accent="violet"
        />
      </div>

      <div className="glass gradient-border rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-violet-300" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Achievements</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {earnedBadges.length} of {BADGES.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {BADGES.map((badge) =>
          {
            const earned = earnedBadges.some((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`glass card-hover rounded-xl px-3 py-2.5 flex flex-col gap-1 border ${
                  earned ? 'border-violet-400/40' : 'border-white/5 opacity-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg grid place-items-center ${
                    earned
                      ? 'bg-gradient-to-br from-violet-500 to-cyan-400'
                      : 'bg-white/[0.04]'
                  }`}
                >
                  <Award size={13} className="text-white" />
                </div>
                <div className="text-xs font-semibold text-white">{badge.name}</div>
                <div className="text-[10.5px] text-slate-400 leading-tight">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <History size={14} className="text-cyan-300" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Recently Viewed Topics</h3>
          </div>
          {recent.length > 0 && (
            <button
              onClick={clearRecent}
              className="text-[11px] text-slate-400 hover:text-white transition"
            >
              Clear
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="text-xs text-slate-400 py-3 flex flex-wrap items-center gap-x-1 gap-y-2">
            <span>Your recently viewed topics will appear here.</span>
            <button
              type="button"
              onClick={() => onNavigate?.('docs')}
              className="inline-flex items-center gap-1 text-violet-300 hover:text-white underline-offset-2 hover:underline transition"
            >
              Open Documentation
              <ChevronRight size={11} />
            </button>
            <span>and tap <span className="text-slate-300">Read more</span> on a card to start tracking.</span>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recent.map((entry) => (
              <li key={entry.key}>
                <button
                  onClick={() => onNavigate?.('docs', { categoryId: entry.categoryId })}
                  className="glass card-hover rounded-xl px-3 py-2 w-full text-left flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400">
                      {entry.categoryTitle}
                    </div>
                    <div className="text-sm font-semibold text-white truncate">{entry.title}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="pill bg-white/10 text-slate-200">{entry.tag}</span>
                    <ChevronRight
                      size={13}
                      className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* DANGER ZONE */}
      <div className="glass rounded-2xl px-4 py-3 border-rose-400/30 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-start gap-2 min-w-0">
          <ShieldAlert size={16} className="text-rose-300 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white tracking-tight">Delete account</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Permanently removes your profile, streak, mastered topics, recent activity, and
              uploaded avatars. This cannot be undone.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openDeleteModal}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-rose-200 px-3 py-1.5 rounded-lg border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-100 transition"
        >
          <Trash2 size={12} />
          <span>Delete my account</span>
        </button>
      </div>

      {deleteModalOpen && (
        <div
          onClick={closeDeleteModal}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Delete account confirmation"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="glass gradient-border rounded-2xl p-5 w-full max-w-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-rose-500/15 border border-rose-400/30 grid place-items-center">
                <ShieldAlert size={16} className="text-rose-300" />
              </div>
              <h2 className="text-base font-semibold text-white tracking-tight">Delete account permanently?</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This wipes your auth record, profile, learning state, recently viewed list, and every
              avatar you uploaded. <span className="text-rose-200 font-medium">There is no undo.</span>
            </p>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400">
                Type your email <span className="font-mono text-slate-300">{user?.email}</span> to confirm
              </span>
              <input
                type="email"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={deleting}
                className="input-field"
                autoComplete="off"
                autoFocus
              />
            </label>
            {deleteError && (
              <div className="flex items-start gap-2 text-[11px] text-rose-200 bg-rose-500/10 border border-rose-400/30 rounded-lg px-3 py-2">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={
                  deleting ||
                  !user?.email ||
                  deleteConfirmText.trim().toLowerCase() !== user.email.toLowerCase()
                }
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e 0%, #b91c1c 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 14px rgba(225, 29, 72, 0.35), 0 1px 2px rgba(0,0,0,0.25)'
                }}
              >
                {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                <span>{deleting ? 'Deleting...' : 'Permanently delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md grid place-items-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Profile picture preview"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-w-2xl w-full flex flex-col items-center"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                decoding="async"
                className="w-full max-h-[80vh] object-contain rounded-2xl border border-white/15 shadow-glass"
              />
            ) : (
              <div className="w-full aspect-square max-h-[80vh] rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center border border-white/15 shadow-glass">
                <span className="text-7xl sm:text-8xl font-bold text-white">{initials}</span>
              </div>
            )}
            <div className="text-center mt-3">
              <div className="text-sm font-semibold text-white">{displayName}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Click anywhere or press Esc to close
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur border border-white/30 grid place-items-center text-white hover:bg-white/25 transition"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function IdField({ label, value, mono = false, icon: Icon })
{
  return (
    <div className="flex flex-col">
      <span className="text-[9.5px] uppercase tracking-widest text-slate-500">{label}</span>
      <span className={`text-[11px] text-slate-200 truncate flex items-center gap-1 ${mono ? 'font-mono' : ''}`}>
        {Icon && <Icon size={10} className="text-slate-400 shrink-0" />}
        {value || '—'}
      </span>
    </div>
  );
}

const ACCENT_STYLES = {
  amber: {
    bg: 'from-amber-400/30 via-amber-500/10 to-rose-500/15',
    text: 'from-amber-200 via-amber-300 to-rose-300',
    glow: 'bg-amber-400/15',
    iconColor: 'text-amber-200'
  },
  emerald: {
    bg: 'from-emerald-400/25 via-emerald-500/10 to-cyan-500/15',
    text: 'from-emerald-200 via-emerald-300 to-cyan-200',
    glow: 'bg-emerald-400/15',
    iconColor: 'text-emerald-200'
  },
  violet: {
    bg: 'from-violet-400/25 via-violet-500/10 to-cyan-400/20',
    text: 'from-violet-200 via-violet-300 to-cyan-200',
    glow: 'bg-violet-400/15',
    iconColor: 'text-violet-200'
  }
};

function PremiumStat({ icon: Icon, label, value, unit, accent = 'amber' })
{
  const a = ACCENT_STYLES[accent];
  return (
    <div className={`glass card-hover gradient-border rounded-2xl px-4 py-3 bg-gradient-to-br ${a.bg} relative overflow-hidden`}>
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${a.glow} blur-2xl pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-slate-300">{label}</span>
          <Icon size={14} className={a.iconColor} />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span
            className={`text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-br ${a.text} bg-clip-text text-transparent leading-none`}
          >
            {value}
          </span>
          {unit && <span className="text-xs text-slate-300">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function formatUserId(id)
{
  if (!id)
  {
    return '—';
  }
  // Supabase user ids are UUIDs; show the first 8 chars as a friendly student id.
  return id.replace(/-/g, '').slice(0, 8).toUpperCase().match(/.{1,4}/g).join('-');
}
