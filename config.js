/* ──────────────────────────────────────────────────────────
   동기화 설정

   여기를 비워두면 앱은 그대로 작동합니다. 기록이 이 기기에만
   저장될 뿐입니다. 두 폰의 기록을 맞추고 싶을 때만 채우세요.

   값을 얻는 곳: Supabase 프로젝트 → Settings → API
     - Project URL      → SUPABASE_URL
     - anon public key  → SUPABASE_ANON_KEY

   anon 키는 공개돼도 되는 키입니다. 다만 SETUP.sql 을 먼저
   실행해야 방 코드를 모르는 사람이 기록을 볼 수 없습니다.
   ────────────────────────────────────────────────────────── */

window.FIT4_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
};
