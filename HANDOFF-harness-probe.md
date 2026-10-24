# HANDOFF · harness-probe

> 目的：用三個「類似難度」的單檔 Three.js 題目，在不同 surface 上跑同一套協定，量出「聊天介面 / agent harness / 裸 API」的邊界在哪。
> 這份文件給 Claude Code 讀。你（Claude Code）負責 **Claude Code 這一欄**；其他 surface 由人手動跑，但協定相同。
> 結果之後會寫成一篇報告，所以 **記錄比成品重要**：每一輪的 token、回合數、失敗方式，都是報告的素材。

---

## 0. 背景一句話

Google 2026-10-23 的「5 builders with Gemini 4 Argon」文章裡，水上飛機和哥德式馬車兩個案例看起來像「聊天介面一次生成」，但文章沒寫用了什麼 surface、迭代幾輪、燒了多少 token。這個實驗要補那一欄。

我們要驗的假設：

- H1 聊天介面（Gemini app / Claude web）在輸出長度與回合數限制內做不完，或做完是 slop。
- H2 有回圈的 harness（Claude Code）做得完，但 token 與 wall-clock 成本不低，而且 N（迭代次數）遠大於 demo 暗示的 1。
- H3 題目是否踩在 Three.js 官方 examples 的 scaffold 上（Water.js / Sky.js）會顯著影響成功率——所以第三題刻意避開 scaffold。
- H4 有圖片輸入的題目（馬車）在各 surface 的表現差異最大。

---

## 1. 固定規則（所有 surface 一律相同）

### 1.1 產出格式
- **單一 HTML 檔**，Three.js 從 CDN 載入，版本固定 `three@0.170.0`（importmap 用 `https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js`，addons 用 `.../examples/jsm/`）。
- 允許使用 Three.js 自帶的 `examples/jsm` addons（OrbitControls、Water、Sky 等）。**不允許**任何其他函式庫（不准 cannon-es / rapier / ammo / tween / gsap）。
- **不允許載入外部 3D 模型檔**（GLB/OBJ/FBX）。所有幾何都要程序式生成。
- 不准讀取或參考那五位 builder 的任何程式碼或影片。我們複製的是題目類型，不是作品。

### 1.2 人的介入規則
- 人只能做三件事：(a) 貼上初始 prompt；(b) 回報「跑不起來 + console 錯誤全文」或「截圖 + 一句話描述哪裡不對」；(c) 說 `stop`。
- 人**不能**改程式碼、不能提示實作方法、不能貼參考程式。
- 每次 (b) 算一個回合。

### 1.3 預算與停止條件
| Surface | 回合上限 | 時間上限 | 其他 |
|---|---|---|---|
| Gemini app（Argon，Pro 訂閱） | 8 回合 | 45 分鐘 | 記錄是否被輸出長度截斷、是否要求「繼續」 |
| Claude web（這個 chat/工作區合併版） | 8 回合 | 45 分鐘 | 同上 |
| Claude Code | 回合不限 | **60 分鐘 wall-clock** | 自行迭代；每輪 commit；超時即停 |
| Argon API（long decode，選配） | 1 次 | — | 一次生成，不修；記錄輸出 token 數 |

停止條件（任一成立即停）：達上限；功能清單全過；連續三回合沒有可見進步（人判定）。

### 1.4 每次 run 必記的欄位
```
surface, model, task, date,
turns (人介入次數), agent_iterations (Claude Code 自己的 run-check-fix 輪數),
tokens_in, tokens_out, wall_minutes,
file_lines, file_kb,
runs_without_console_error (bool), console_error_count,
checklist_pass (n/6), subjective_1to5,
failure_mode (free text: 截斷 / 忘記前段變數 / 黑畫面 / 跑得動但醜 / 物理假 / 其他),
screenshots: t0.png t3s.png t8s.png, gif(optional)
```
Claude Code 的 token 用 `/cost` 或 session 結束時的統計；其他 surface 用介面顯示的數字，沒有就記「N/A」並估算（輸出字元數 ÷ 3.5）。

---

## 2. 三個題目

難度對齊原則：每題六項功能清單、至少三個互相連動的運動子系統、一個光影要求、一個互動要求。第三題刻意不踩 Three.js examples 的現成 scaffold。

### Task A · 水上飛機（踩 scaffold：Water + Sky）
**Prompt（英文，各 surface 一字不改）：**
```
Build a single-file HTML page using Three.js (import from https://cdn.jsdelivr.net/npm/three@0.170.0/ via importmap; you may use addons from examples/jsm). No other libraries, no external model files — all geometry must be procedural.

Scene: a seaplane taxiing and taking off from a lake at golden hour.
Requirements:
1. Animated water surface with reflections and visible wave motion.
2. Sky with a sun; lighting should be warm, with the plane casting a shadow on the water.
3. The seaplane is built from primitives: fuselage, wings, tail, two floats, a spinning propeller.
4. Takeoff sequence loops: taxi (floats create a wake / spray), accelerate, lift off, climb, bank in a wide circle, descend and land again. The wake must stop when airborne.
5. Propeller speed, pitch of the plane and camera all respond to the flight phase.
6. OrbitControls plus a key (Space) to pause/resume the sequence.
Output the complete HTML in one block. It must run with zero console errors.
```
功能清單：①水面動 ②反射 ③影子落在水面 ④起降循環完整 ⑤尾浪只在水面階段出現 ⑥Space 暫停有效。

### Task B · 哥德式馬車，從一張圖開始（圖片輸入；無 scaffold）
**圖片**：到 Wikimedia Commons 找一張 **public domain** 的 19 世紀封閉式馬車照片或版畫（搜 "Victorian carriage" / "brougham" / "hearse 19th century"），存成 `inputs/carriage.jpg`，在 `inputs/SOURCE.md` 記下 URL 與授權。**所有 surface 用同一張圖。**

**Prompt：**
```
[attach inputs/carriage.jpg]
Using this image as the only reference, build a single-file HTML page using Three.js (import from https://cdn.jsdelivr.net/npm/three@0.170.0/ via importmap; addons from examples/jsm allowed). No other libraries, no external model files — all geometry must be procedural.

Requirements:
1. A 3D carriage whose proportions and silhouette clearly follow the reference image: body, roof, four spoked wheels, driver's seat, two side lamps.
2. Both doors open and close on click; windows are translucent.
3. The two lamps flicker like oil flames and cast light on the body.
4. The carriage rolls forward on a cobbled road; wheels rotate correctly for the speed.
5. The body is on a suspension: it rocks and bounces in reaction to bumps in the road (bumps must be visible geometry, not random noise).
6. Night scene with fog; OrbitControls; key R resets the carriage to the start.
Output the complete HTML in one block. It must run with zero console errors.
```
功能清單：①輪廓像參考圖 ②門可點開關 ③燈火閃爍且有照亮 ④輪速與前進一致 ⑤懸吊對可見的凸起有反應 ⑥R 重置有效。

### Task C · 鋼珠軌道（控制組：無 scaffold、需自寫碰撞）
**Prompt：**
```
Build a single-file HTML page using Three.js (import from https://cdn.jsdelivr.net/npm/three@0.170.0/ via importmap; addons from examples/jsm allowed). No other libraries, no physics engine, no external model files — all geometry procedural and all physics hand-written.

Scene: a tabletop marble run.
Requirements:
1. A track with at least three distinct mechanisms in sequence: a funnel/vortex, a seesaw that tips when a marble lands on it, and a spiral ramp.
2. Marbles are rigid spheres with gravity, rolling, and collision against the track and against each other (no tunnelling at 60 fps).
3. Click a button to release a new marble at the top; up to 20 marbles active at once.
4. Marbles that reach the bottom land in a tray and stack plausibly.
5. Studio lighting with soft shadows; the track casts shadows on the table.
6. OrbitControls; key R clears all marbles; an on-screen counter shows marbles in play.
Output the complete HTML in one block. It must run with zero console errors.
```
功能清單：①三機關都動 ②無穿透 ③加珠上限 20 ④底盤堆疊不爆開 ⑤影子 ⑥R 清空＋計數正確。

> 備案（如果 C 明顯比 A/B 難太多，難度對齊失敗）：改成「貓空式纜車」——地形、鋼纜懸垂、車廂隨風擺、經過支架時減速、上下站開門。只有在跑完 C 第一次 run 後、由人決定才換。

---

## 3. Claude Code 這一欄的執行步驟

### 3.1 repo 結構
```
harness-probe/
  HANDOFF-harness-probe.md   # 本文件
  inputs/carriage.jpg, inputs/SOURCE.md
  prompts/A.md B.md C.md     # 上面三段 prompt，原文
  runs/
    claude-code/A/  B/  C/
      index.html               # 最終版
      iterations.md            # 每輪：做了什麼、跑了沒、console 錯誤、截圖檔名
      t0.png t3s.png t8s.png
      cost.json                # tokens_in/out, wall_minutes, agent_iterations
    gemini-app/A/ ...          # 人工跑完後塞進來，同結構
    claude-web/A/ ...
    argon-api/A/ ...           # 選配
  tools/
    check.mjs                  # 外部裁判：Playwright 開 index.html，收 console error，截 t0/t3/t8
    sweep.sh                   # 對 runs/**/index.html 跑 check.mjs，輸出 RESULTS.csv
  RESULTS.csv
  RESULTS.md                   # 由 sweep 生成的表 + 人工填 checklist/subjective
```

### 3.2 順序
1. `git init`；把三段 prompt 寫進 `prompts/`；找馬車圖，記授權。
2. **先寫 `tools/check.mjs`**（Playwright，headless Chromium）：載入檔案，等 8 秒，收集 `console.error` 與 `pageerror`，在 0/3/8 秒各截一張 1280×720，輸出 JSON。這是外部裁判，先於任何題目存在。
3. 跑 Task A：
   - 以 `prompts/A.md` 原文為第一輪輸入（不要「改善」prompt——改了就不可比）。
   - 每一輪：寫檔 → `node tools/check.mjs runs/claude-code/A/index.html` → 讀 console error 與截圖 → 修。**用截圖判斷視覺是否達標**，不要只看沒報錯就當完成。
   - 每輪 `git commit -m "A iter N: <一句話>"`，並在 `iterations.md` 追加一行。
   - 達到功能清單全過，或 60 分鐘 wall-clock 到，即停。超時就停在當下版本，**不要為了交差而放寬清單**。
4. 同樣跑 B（記得把圖片當輸入讀進來）、C。
5. 每題結束寫 `cost.json`；三題跑完跑 `tools/sweep.sh` 產 `RESULTS.csv`，再手寫 `RESULTS.md` 把 checklist 的人工判定欄留空給人填。
6. 最後把 `iterations.md` 裡「每一輪卡在什麼」整理成 `runs/claude-code/FAILURE-MODES.md`——這會是報告裡最有用的一節。

### 3.3 不要做的事
- 不要把三題合併成一個共用的工具庫再各自 import；每題都要是獨立單檔（題目條件）。
- 不要在第一輪就開 subagent 平行跑三題；順序跑，才有可比的 wall-clock。
- 不要去搜尋那五個 builder 的作品。
- 不要為了過 `check.mjs` 而 try/catch 吞掉錯誤。
- 不要在 prompt 裡偷加「think step by step」「先規劃」之類的字——其他 surface 沒有這些。

---

## 4. 人工跑其他 surface 時的備忘（給自己）

- Gemini app：用 Argon，Pro 訂閱；每一回合把輸出整個存檔（`iter-N.html`），記錄有沒有被截斷、有沒有要求「繼續」。截斷算一個 failure_mode。
- Claude web：同上。這個 surface 其實後面有工作區，所以如果它自己跑了程式或開了頁面，記在 `notes.md`——這正是要量的東西。
- Argon API（選配）：一支 20 行的 Node 腳本，開 long decode，`max_output_tokens` 給到 200k，一次生成，不修；記 usage。價格 $2 / $10 per M（至 2026-11-30）。
- 每個 surface 跑完就把資料夾塞進 `runs/<surface>/<task>/`，然後跑 `tools/sweep.sh`，裁判是同一支。

---

## 5. 完成的定義

三題在 Claude Code 上各有一個最終 `index.html`、完整的 `iterations.md`、`cost.json`、三張截圖，`RESULTS.csv` 有 Claude Code 這三列，`FAILURE-MODES.md` 存在。其他 surface 的欄位空著沒關係，人會補。

交回來的時候，附一段 200 字以內的「這三題各卡在哪、N 是多少、總共燒了多少」——那就是報告的第一段素材。
