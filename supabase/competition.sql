-- Opt-in weekly CS game league. Apply in Supabase SQL Editor.
-- Ranked game scores are derived and stored only by server-side functions.
create table if not exists public.competition_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  alias text not null check (char_length(alias) between 3 and 20 and alias = btrim(alias) and alias ~ '^[[:alnum:] _.-]{3,20}$'),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.competition_profiles enable row level security;
revoke all on public.competition_profiles from public, anon;
grant select, insert, update, delete on public.competition_profiles to authenticated;
create unique index if not exists competition_profiles_alias_unique
  on public.competition_profiles (lower(alias));
drop policy if exists "Users manage their competition profile" on public.competition_profiles;
create policy "Users manage their competition profile"
  on public.competition_profiles for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Private, durable eligibility state: one optional practice before the first ranked round.
create table if not exists public.competition_game_eligibility (
  user_id uuid primary key references auth.users(id) on delete cascade,
  practice_used_at timestamptz,
  first_ranked_at timestamptz
);
alter table public.competition_game_eligibility enable row level security;
revoke all on public.competition_game_eligibility from public, anon, authenticated;

-- Timed rounds are server-scored: the client can see answer choices, never the key.
create table if not exists public.competition_game_questions (
  question_id text primary key,
  topic text not null,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  correct_index smallint not null check (correct_index between 0 and 3),
  active boolean not null default true
);

insert into public.competition_game_questions(question_id, topic, prompt, options, correct_index) values
('g01','Expressions','What does 17 / 5 evaluate to when both operands are int?','["3","3.4","2","4"]',0),
('g02','Strings','What is returned by "computer".substring(1, 4)?','["com","omp","ompu","mpu"]',1),
('g03','Selection','What is printed? int x = 8; if (x % 2 == 0) System.out.print("E"); else System.out.print("O");','["E","O","EO","Nothing"]',0),
('g04','Iteration','How many times does the loop body run? for (int i = 2; i < 10; i += 3)','["2","3","4","8"]',1),
('g05','Arrays','What is the last valid index of an array named values with length 6?','["4","5","6","Depends on its values"]',1),
('g06','ArrayList','After add("A"), add("B"), add(1,"C"), what is the list?','["[A, B, C]","[A, C, B]","[C, A, B]","[A, B]"]',1),
('g07','Methods','What must a non-void method do on every reachable path?','["Print a value","Return a compatible value","Be static","Have no parameters"]',1),
('g08','Classes','Which statement about a constructor is true?','["It has the class name and no return type","It returns int","It must be static","It is called with dot notation"]',0),
('g09','Boolean logic','What is the value of !(true && false)?','["true","false","0","It does not compile"]',0),
('g10','2D arrays','For int[][] grid, what does grid.length give?','["Number of columns in every row","Number of rows","Total cells","Last row index"]',1),
('g11','Expressions','What is printed? int a = 4; System.out.print(a + 3 * 2);','["14","10","20","9"]',1),
('g12','Iteration','What is printed? int n = 1; for (int i=0;i<3;i++) n *= 2; System.out.print(n);','["4","6","8","16"]',2),
('g13','Strings','What does "banana".indexOf("na") return?','["1","2","3","4"]',1),
('g14','ArrayList','Which call replaces the element at index 0 with "X"?','["list.add(0, \"X\")","list.set(0, \"X\")","list.remove(0, \"X\")","list.replace(0, \"X\")"]',1),
('g15','Arrays','What is printed? int[] a={2,5,7}; System.out.print(a[0]+a[2]);','["7","9","12","14"]',1),
('g16','Methods','If a method parameter is int x, which call passes the value 9?','["method(x=9)","method(9)","method(int 9)","method"]',1),
('g17','2D arrays','How many elements are in {{1,2},{3,4},{5,6}}?','["3","4","5","6"]',3),
('g18','Selection','What is printed? int x=3; System.out.print(x > 5 || x == 3);','["true","false","3","Compile error"]',0),
('g19','Classes','A private instance variable is directly accessible from which code?','["Any class","Only methods in its declaring class","Only constructors","Any subclass"]',1),
('g20','Iteration','How many times? for (int i=5; i>0; i--)','["4","5","6","0"]',1)
on conflict (question_id) do nothing;

create table if not exists public.competition_game_sessions (
  session_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  ranked boolean not null default true,
  question_order text[] not null check (cardinality(question_order) = 10),
  current_position smallint not null default 1 check (current_position between 1 and 11),
  current_question_started_at timestamptz not null default now(),
  score integer not null default 0 check (score >= 0),
  correct_count smallint not null default 0,
  current_streak smallint not null default 0,
  last_answered_question_id text,
  last_response jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists competition_game_sessions_week_idx
  on public.competition_game_sessions (week_start, user_id, score desc);
create index if not exists competition_game_sessions_daily_limit_idx
  on public.competition_game_sessions (user_id, week_start, created_at);

-- Preserve existing participants' status when moving from the old auto-practice rules.
-- The old client silently labeled later rounds as practice. Promote completed rounds
-- from this active week so students keep credit for points earned before this change.
update public.competition_game_sessions
set ranked = true
where week_start = date_trunc('week', now() at time zone 'utc')::date
  and ranked = false and completed_at is not null;

insert into public.competition_game_eligibility as existing(user_id, practice_used_at, first_ranked_at)
select s.user_id,
  min(s.created_at) filter (where not s.ranked),
  min(s.created_at) filter (where s.ranked)
from public.competition_game_sessions s
group by s.user_id
on conflict (user_id) do update set
  practice_used_at = coalesce(existing.practice_used_at, excluded.practice_used_at),
  first_ranked_at = coalesce(existing.first_ranked_at, excluded.first_ranked_at);

create table if not exists public.competition_game_awards (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  award_type text not null check (award_type in ('champion','runner_up','third_place')),
  score integer not null,
  awarded_at timestamptz not null default now(),
  primary key (user_id, week_start),
  unique (week_start, award_type)
);
create table if not exists public.competition_game_closed_weeks (
  week_start date primary key,
  finalized_at timestamptz not null default now()
);

alter table public.competition_game_questions enable row level security;
alter table public.competition_game_sessions enable row level security;
alter table public.competition_game_awards enable row level security;
alter table public.competition_game_closed_weeks enable row level security;
revoke all on public.competition_game_questions, public.competition_game_sessions, public.competition_game_awards, public.competition_game_closed_weeks from public, anon, authenticated;

create or replace function public._start_cs_sprint(p_ranked boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_session uuid;
  v_ids text[];
  v_q record;
  v_eligibility public.competition_game_eligibility%rowtype;
  v_daily_count integer;
  v_week date := date_trunc('week', now() at time zone 'utc')::date;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.competition_profiles where user_id = v_user and enabled = true) then
    raise exception 'Join the opt-in study league before starting a round';
  end if;
  insert into public.competition_game_eligibility(user_id) values (v_user) on conflict (user_id) do nothing;
  select * into v_eligibility from public.competition_game_eligibility where user_id = v_user for update;
  select count(*) into v_daily_count
    from public.competition_game_sessions where user_id = v_user
      and week_start = v_week
      and created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc';
  if v_daily_count >= 12 then raise exception 'Daily game limit reached'; end if;
  if not p_ranked and (v_eligibility.practice_used_at is not null or v_eligibility.first_ranked_at is not null) then
    raise exception 'The optional practice round is only available once, before your first ranked round';
  end if;
  select array_agg(question_id order by random()) into v_ids
    from (select question_id from public.competition_game_questions where active order by random() limit 10) q;
  if cardinality(v_ids) <> 10 then raise exception 'The question bank is not ready'; end if;
  if p_ranked then
    update public.competition_game_eligibility set first_ranked_at = coalesce(first_ranked_at, clock_timestamp()) where user_id = v_user;
  else
    update public.competition_game_eligibility set practice_used_at = clock_timestamp() where user_id = v_user;
  end if;
  insert into public.competition_game_sessions(user_id, week_start, ranked, question_order)
    values (v_user, v_week, p_ranked, v_ids) returning session_id into v_session;
  select question_id, topic, prompt, options into v_q
    from public.competition_game_questions where question_id = v_ids[1];
  return jsonb_build_object('sessionId', v_session, 'questionNumber', 1, 'totalQuestions', 10,
    'seconds', 12, 'ranked', p_ranked, 'question', jsonb_build_object('id', v_q.question_id, 'topic', v_q.topic, 'prompt', v_q.prompt, 'options', v_q.options));
end;
$$;

-- Ranked rounds are always ranked; practice is a separate, explicit one-time choice.
create or replace function public.start_cs_sprint()
returns jsonb
language sql
security definer
set search_path = ''
as $$ select public._start_cs_sprint(true); $$;

create or replace function public.start_cs_sprint_practice()
returns jsonb
language sql
security definer
set search_path = ''
as $$ select public._start_cs_sprint(false); $$;

create or replace function public.get_cs_sprint_status()
returns table(practice_available boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.competition_profiles p
    left join public.competition_game_eligibility e on e.user_id = p.user_id
    where p.user_id = auth.uid() and p.enabled = true
      and e.practice_used_at is null and e.first_ranked_at is null
  );
$$;

create or replace function public.answer_cs_sprint(p_session_id uuid, p_question_id text, p_answer integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_game public.competition_game_sessions%rowtype;
  v_q record;
  v_elapsed numeric;
  v_correct boolean;
  v_awarded integer := 0;
  v_next record;
  v_response jsonb;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_question_id is null then raise exception 'Question is required'; end if;
  if p_answer is not null and p_answer not between 0 and 3 then raise exception 'Invalid answer'; end if;
  select * into v_game from public.competition_game_sessions
    where session_id = p_session_id and user_id = v_user for update;
  if not found then raise exception 'Game session not found'; end if;
  if p_question_id = v_game.last_answered_question_id and v_game.last_response is not null then
    return v_game.last_response;
  end if;
  if v_game.completed_at is not null then
    return jsonb_build_object('complete', true, 'score', v_game.score, 'correct', v_game.correct_count, 'total', 10, 'ranked', v_game.ranked);
  end if;
  if v_game.week_start <> date_trunc('week', now() at time zone 'utc')::date then
    update public.competition_game_sessions set completed_at = clock_timestamp() where session_id = p_session_id;
    return jsonb_build_object('complete', true, 'expired', true, 'score', v_game.score, 'correct', v_game.correct_count, 'total', 10, 'ranked', v_game.ranked);
  end if;
  if v_game.question_order[v_game.current_position] <> p_question_id then raise exception 'Question is not active'; end if;
  select question_id, topic, prompt, options, correct_index into v_q
    from public.competition_game_questions where question_id = p_question_id and active;
  if not found then raise exception 'Question is unavailable'; end if;
  v_elapsed := extract(epoch from (clock_timestamp() - v_game.current_question_started_at));
  v_correct := p_answer is not null and p_answer = v_q.correct_index and v_elapsed <= 12;
  if v_correct then
    v_awarded := greatest(0, 100 - floor(v_elapsed * 5)::integer) + least(v_game.current_streak, 5) * 5;
  end if;
  update public.competition_game_sessions set
    score = score + v_awarded,
    correct_count = correct_count + case when v_correct then 1 else 0 end,
    current_streak = case when v_correct then current_streak + 1 else 0 end,
    current_position = current_position + 1,
    current_question_started_at = clock_timestamp(),
    last_answered_question_id = p_question_id,
    completed_at = case when current_position = 10 then clock_timestamp() else null end
    where session_id = p_session_id returning * into v_game;
  if v_game.completed_at is not null then
    v_response := jsonb_build_object('complete', true, 'score', v_game.score, 'correct', v_game.correct_count, 'total', 10, 'earned', v_awarded, 'ranked', v_game.ranked);
    update public.competition_game_sessions set last_response = v_response where session_id = p_session_id;
    return v_response;
  end if;
  select question_id, topic, prompt, options into v_next
    from public.competition_game_questions where question_id = v_game.question_order[v_game.current_position];
  v_response := jsonb_build_object('complete', false, 'score', v_game.score, 'correct', v_game.correct_count,
    'earned', v_awarded, 'questionNumber', v_game.current_position, 'totalQuestions', 10,
    'seconds', 12, 'ranked', v_game.ranked, 'question', jsonb_build_object('id', v_next.question_id, 'topic', v_next.topic, 'prompt', v_next.prompt, 'options', v_next.options));
  update public.competition_game_sessions set last_response = v_response where session_id = p_session_id;
  return v_response;
end;
$$;

create or replace function public.finalize_weekly_game_awards()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_week date := date_trunc('week', now() at time zone 'utc')::date;
  v_period record;
  v_winner record;
begin
  for v_period in
    select distinct week_start from public.competition_game_sessions
      where week_start < v_week and not exists (
        select 1 from public.competition_game_closed_weeks c where c.week_start = competition_game_sessions.week_start
      )
  loop
    for v_winner in
      with best as (
        select distinct on (s.user_id) s.user_id, s.score, s.correct_count, s.completed_at
        from public.competition_game_sessions s
        join public.competition_profiles p on p.user_id = s.user_id and p.enabled
        where s.week_start = v_period.week_start and s.completed_at < (s.week_start + interval '7 days') at time zone 'utc' and s.ranked
        order by s.user_id, s.score desc, s.correct_count desc, s.completed_at asc
      ), ranked as (
        select user_id, score, row_number() over(order by score desc, correct_count desc, completed_at asc) as place
        from best
      ) select * from ranked where place <= 3
    loop
      insert into public.competition_game_awards(user_id, week_start, award_type, score)
      values (v_winner.user_id, v_period.week_start,
        case v_winner.place when 1 then 'champion' when 2 then 'runner_up' else 'third_place' end,
        v_winner.score)
      on conflict do nothing;
    end loop;
    insert into public.competition_game_closed_weeks(week_start) values (v_period.week_start)
      on conflict do nothing;
  end loop;
  -- The durable award table preserves achievements; raw answer sessions are not student history.
  delete from public.competition_game_sessions where week_start < v_week - 90;
end;
$$;

create or replace function public.get_weekly_game_standings()
returns table(place bigint, alias text, points integer, correct_answers integer, is_self boolean, awards text[])
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_week date := date_trunc('week', now() at time zone 'utc')::date;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  perform public.finalize_weekly_game_awards();
  return query
    with best as (
      select distinct on (s.user_id) s.user_id, s.score, s.correct_count, s.completed_at
      from public.competition_game_sessions s
      join public.competition_profiles p on p.user_id = s.user_id and p.enabled
      where s.week_start = v_week and s.completed_at < (s.week_start + interval '7 days') at time zone 'utc' and s.ranked
      order by s.user_id, s.score desc, s.correct_count desc, s.completed_at asc
    ), ranked as (
      select row_number() over(order by b.score desc, b.correct_count desc, b.completed_at asc)::bigint as rank_no,
        b.user_id, p.alias, b.score, b.correct_count, b.user_id = auth.uid() as self
      from best b join public.competition_profiles p on p.user_id = b.user_id
    )
    -- Cast every expression to the declared RETURNS TABLE type. Existing projects may
    -- have created alias or score with a different compatible SQL type before this
    -- migration was updated; PL/pgSQL RETURN QUERY requires exact type matches.
    select r.rank_no::bigint, r.alias::text, r.score::integer,
      r.correct_count::integer, r.self::boolean,
      coalesce((select array_agg(a.award_type order by a.week_start desc)
        from public.competition_game_awards a
        where a.user_id = r.user_id and a.week_start < v_week), array[]::text[])::text[]
    from ranked r where r.rank_no <= 50 or r.self order by r.rank_no;
end;
$$;

create or replace function public.get_my_game_awards()
returns table(award_type text, week_start date, score integer)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  perform public.finalize_weekly_game_awards();
  return query
    select a.award_type, a.week_start, a.score
    from public.competition_game_awards a where a.user_id = auth.uid()
    order by a.week_start desc;
end;
$$;

create or replace function public.get_public_game_awards()
returns table(alias text, award_type text, week_start date, score integer)
language sql
stable
security definer
set search_path = ''
as $$
  select p.alias, a.award_type, a.week_start, a.score
  from public.competition_game_awards a
  join public.competition_profiles p on p.user_id = a.user_id and p.enabled = true
  order by a.week_start desc,
    case a.award_type when 'champion' then 1 when 'runner_up' then 2 else 3 end
  limit 30;
$$;

revoke all on function public._start_cs_sprint(boolean) from public, anon, authenticated;
revoke all on function public.start_cs_sprint() from public, anon;
revoke all on function public.start_cs_sprint_practice() from public, anon;
revoke all on function public.get_cs_sprint_status() from public, anon;
revoke all on function public.answer_cs_sprint(uuid, text, integer) from public, anon;
revoke all on function public.finalize_weekly_game_awards() from public, anon, authenticated;
revoke all on function public.get_weekly_game_standings() from public, anon;
revoke all on function public.get_my_game_awards() from public, anon;
revoke all on function public.get_public_game_awards() from public, anon;
grant execute on function public.start_cs_sprint() to authenticated;
grant execute on function public.start_cs_sprint_practice() to authenticated;
grant execute on function public.get_cs_sprint_status() to authenticated;
grant execute on function public.answer_cs_sprint(uuid, text, integer) to authenticated;
grant execute on function public.get_weekly_game_standings() to authenticated;
grant execute on function public.get_my_game_awards() to authenticated;
grant execute on function public.get_public_game_awards() to authenticated;
