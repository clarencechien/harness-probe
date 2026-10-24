#!/usr/bin/env bash
# Runs tools/check.mjs on every runs/<surface>/<task>/index.html and writes RESULTS.csv.
# Machine-fillable columns come from check.json and cost.json; human columns are left blank.
set -u
cd "$(dirname "$0")/.."
OUT=RESULTS.csv
echo "surface,model,task,date,turns,agent_iterations,tokens_in,tokens_out,wall_minutes,file_lines,file_kb,runs_without_console_error,console_error_count,checklist_pass,subjective_1to5,failure_mode,screenshots" > "$OUT"
for f in runs/*/*/index.html; do
  [ -f "$f" ] || continue
  dir=$(dirname "$f"); task=$(basename "$dir"); surface=$(basename "$(dirname "$dir")")
  echo "== $surface/$task" >&2
  node tools/check.mjs "$f" > /dev/null 2>&1
  node - "$dir" "$surface" "$task" >> "$OUT" <<'JS'
const fs = require('fs'), path = require('path');
const [dir, surface, task] = process.argv.slice(2);
const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return {}; } };
const c = rd('check.json'), k = rd('cost.json');
const q = v => v === undefined || v === null ? '' : /[,"\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v);
const shots = Object.values(c.screenshots || {}).map(p => path.basename(p)).join(' ');
console.log([surface, k.model, task, k.date, k.turns, k.agent_iterations, k.tokens_in, k.tokens_out, k.wall_minutes,
  c.file_lines, c.file_kb, c.runs_without_console_error, c.console_error_count, k.checklist_pass, k.subjective_1to5, k.failure_mode, shots].map(q).join(','));
JS
done
echo "wrote $OUT" >&2
cat "$OUT"
