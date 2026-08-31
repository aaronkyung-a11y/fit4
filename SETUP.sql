-- ═══════════════════════════════════════════════════════════
--  4주 시작 프로그램 — 동기화 설정
--  Supabase 프로젝트 → SQL Editor 에 통째로 붙여넣고 Run 하세요.
--  한 번만 실행하면 됩니다.
-- ═══════════════════════════════════════════════════════════

create table if not exists public.boards (
  code        text primary key,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- RLS를 켜고 정책은 만들지 않습니다.
-- → anon 키로는 테이블에 직접 접근할 수 없습니다. (전체 조회 차단)
alter table public.boards enable row level security;

revoke all on public.boards from anon, authenticated;

-- 방 코드를 아는 사람만 자기 방을 읽고 쓸 수 있게 하는 함수 두 개.
-- security definer 라서 테이블 권한을 우회하지만,
-- 코드가 일치하는 한 행에만 접근합니다.

create or replace function public.get_board(p_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select data from public.boards where code = p_code;
$$;

create or replace function public.put_board(p_code text, p_data jsonb)
returns jsonb
language sql
security definer
set search_path = public
as $$
  insert into public.boards (code, data)
  values (p_code, p_data)
  on conflict (code)
  do update set data = excluded.data, updated_at = now()
  returning data;
$$;

grant execute on function public.get_board(text) to anon;
grant execute on function public.put_board(text, jsonb) to anon;

-- ═══════════════════════════════════════════════════════════
--  보안 수준에 대해
--
--  방 코드는 16자리 무작위 문자열입니다. 코드를 모르면
--  기록을 읽을 수 없고, 전체 목록도 뽑을 수 없습니다.
--  다만 코드를 아는 사람은 누구나 읽고 쓸 수 있습니다.
--  운동 체크 기록 용도로는 충분하지만, 민감한 정보는
--  넣지 마세요.
-- ═══════════════════════════════════════════════════════════
