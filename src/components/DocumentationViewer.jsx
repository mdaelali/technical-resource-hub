import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import
{
  ChevronDown,
  BookOpen,
  Brain,
  ScrollText,
  CheckCircle2,
  Code2,
  Lightbulb,
  AlertTriangle,
  ListChecks,
  Clock,
  Sparkles
} from 'lucide-react';
import { docCategories } from '../data/docs.js';
import useUserStorage from '../hooks/useUserStorage.js';
import useRecentlyViewed from '../hooks/useRecentlyViewed.js';

const ICONS = {
  algorithms: BookOpen,
  logic: Brain,
  exam: ScrollText
};

const ACCENTS = {
  algorithms: 'text-cyan-300',
  logic: 'text-emerald-300',
  exam: 'text-violet-300'
};

function matchesQuery(card, query)
{
  if (!query)
  {
    return true;
  }
  const q = query.toLowerCase();
  const blob = [
    card.title,
    card.tag,
    card.explanation,
    card.example,
    card.complexity,
    ...(card.bullets || []),
    ...(card.steps || []),
    ...(card.mistakes || []),
    ...(card.tips || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return blob.includes(q);
}

export default function DocumentationViewer({
  searchQuery = '',
  onNavigate,
  initialCategoryId,
  onLogActivity
})
{
  const [activeCategory, setActiveCategory] = useState(
    initialCategoryId && docCategories.some((c) => c.id === initialCategoryId)
      ? initialCategoryId
      : docCategories[0].id
  );
  const [expanded, setExpanded] = useState(() => new Set());
  const [mastered, setMastered] = useUserStorage('mastered', []);
  const [, recordRecent] = useRecentlyViewed();

  useEffect(() =>
  {
    if (initialCategoryId && docCategories.some((c) => c.id === initialCategoryId))
    {
      setActiveCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  const counts = useMemo(() =>
  {
    const map = {};
    for (const cat of docCategories)
    {
      map[cat.id] = cat.cards.filter((c) => matchesQuery(c, searchQuery)).length;
    }
    return map;
  }, [searchQuery]);

  const category = docCategories.find((c) => c.id === activeCategory) || docCategories[0];
  const filteredCards = category.cards.filter((c) => matchesQuery(c, searchQuery));
  const safeMastered = mastered || [];

  function toggleMastered(cardKey)
  {
    setMastered((prev) =>
    {
      const list = prev || [];
      if (list.includes(cardKey))
      {
        return list.filter((k) => k !== cardKey);
      }
      return [...list, cardKey];
    });
    onLogActivity?.();
  }

  function toggleExpanded(cardKey, card, categoryId, categoryTitle)
  {
    setExpanded((prev) =>
    {
      const next = new Set(prev);
      if (next.has(cardKey))
      {
        next.delete(cardKey);
      }
      else
      {
        next.add(cardKey);
        recordRecent({
          key: cardKey,
          title: card.title,
          tag: card.tag,
          categoryId,
          categoryTitle
        });
        onLogActivity?.();
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-wrap gap-2">
        {docCategories.map((cat) =>
        {
          const Icon = ICONS[cat.id];
          const accent = ACCENTS[cat.id];
          const isActive = cat.id === activeCategory;
          const count = counts[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`glass card-hover flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition ${
                isActive ? 'border-violet-400/40 text-white' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-white' : accent} />
              <span>{cat.title}</span>
              {searchQuery && (
                <span
                  className={`pill ${
                    count > 0 ? 'bg-violet-500/30 text-violet-100' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-3"
        >
          <div className={`glass gradient-border rounded-2xl px-4 py-3 bg-gradient-to-r ${category.accent} relative overflow-hidden`}>
            <div className="text-[10px] uppercase tracking-widest text-slate-300">Section</div>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="text-base font-semibold text-white tracking-tight">{category.title}</div>
              {searchQuery && (
                <span className="text-[11px] text-slate-300">
                  {filteredCards.length} of {category.cards.length} match
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{category.description}</p>
          </div>

          {filteredCards.length === 0 ? (
            <div className="glass rounded-2xl px-4 py-8 text-center">
              <Sparkles size={20} className="mx-auto text-slate-500 mb-2" />
              <div className="text-sm text-slate-300">
                No cards in <span className="text-white">{category.title}</span> match "{searchQuery}".
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Try another tab or clear the search.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filteredCards.map((card) =>
              {
                const cardKey = `${category.id}:${card.title}`;
                const isMastered = safeMastered.includes(cardKey);
                const isOpen = expanded.has(cardKey);
                return (
                  <article
                    key={card.title}
                    className="glass card-hover gradient-border rounded-xl px-3.5 py-3 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-violet-300 font-mono text-xs">##</span>
                        <h3 className="text-sm font-semibold text-white tracking-tight">
                          {highlight(card.title, searchQuery)}
                        </h3>
                      </div>
                      <span className="pill bg-white/10 text-slate-200 shrink-0">{card.tag}</span>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300">
                      {highlight(card.explanation, searchQuery)}
                    </p>

                    {card.complexity && (
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <Clock size={12} className="mt-0.5 text-cyan-300 shrink-0" />
                        <span>
                          <span className="text-slate-400">Complexity:</span> {card.complexity}
                        </span>
                      </div>
                    )}

                    {card.example && (
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <Lightbulb size={12} className="mt-0.5 text-amber-300 shrink-0" />
                        <span>
                          <span className="text-slate-400">Example:</span> {card.example}
                        </span>
                      </div>
                    )}

                    {card.bullets && card.bullets.length > 0 && (
                      <ul className="text-[11px] text-slate-300 leading-relaxed flex flex-col gap-0.5">
                        {card.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-1.5">
                            <span className="text-violet-300 mt-1.5 w-1 h-1 rounded-full bg-violet-300 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="more"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-2.5">
                            <Section
                              icon={ListChecks}
                              iconColor="text-cyan-300"
                              title="Step-by-step"
                              items={card.steps}
                              ordered
                            />
                            <Section
                              icon={AlertTriangle}
                              iconColor="text-rose-300"
                              title="Common mistakes"
                              items={card.mistakes}
                            />
                            <Section
                              icon={Lightbulb}
                              iconColor="text-amber-300"
                              title="Practice tips"
                              items={card.tips}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center justify-between pt-1 mt-auto gap-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          onClick={() => toggleMastered(cardKey)}
                          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition ${
                            isMastered
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          <span>{isMastered ? 'Mastered' : 'Mark mastered'}</span>
                        </button>
                        {card.snippetId && onNavigate && (
                          <button
                            onClick={() => onNavigate('playground', { snippetId: card.snippetId })}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg text-slate-400 hover:text-cyan-200 hover:bg-white/[0.04] transition"
                          >
                            <Code2 size={12} />
                            <span>Open snippet</span>
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => toggleExpanded(cardKey, card, category.id, category.title)}
                        className="flex items-center gap-1 text-[11px] text-violet-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.04] transition"
                      >
                        <span>{isOpen ? 'Show less' : 'Read more'}</span>
                        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={12} />
                        </motion.span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Section({ icon: Icon, iconColor, title, items, ordered = false })
{
  if (!items || items.length === 0)
  {
    return null;
  }
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
        <Icon size={11} className={iconColor} />
        <span>{title}</span>
      </div>
      <ListTag
        className={`text-[11px] text-slate-300 leading-relaxed flex flex-col gap-0.5 ${
          ordered ? 'list-decimal pl-4 marker:text-slate-500' : ''
        }`}
      >
        {items.map((item, i) =>
        {
          if (ordered)
          {
            return <li key={i}>{item}</li>;
          }
          return (
            <li key={i} className="flex items-start gap-1.5">
              <span className={`mt-1.5 w-1 h-1 rounded-full bg-current ${iconColor} shrink-0`} />
              <span>{item}</span>
            </li>
          );
        })}
      </ListTag>
    </div>
  );
}

function highlight(text, query)
{
  if (!query || !text)
  {
    return text;
  }
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1)
  {
    return text;
  }
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-violet-500/40 text-white rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
