# 素材清单与接入记录

## 已接入的人类与机器人示范

已将 `assets/videos/` 中可明确对应的示范直接填入 `index.html` 的
**Real-World Trajectory Replay** 区域；浏览器会从 `assets/videos/` 读取视频，
无需复制或重命名文件。

| 操作 | 人类示范 | 机器人示范 | 页面位置 |
| --- | --- | --- | --- |
| Sweep（扫） | `assets/videos/Human_Sweep.mp4` | `assets/videos/Robot_Sweep_v2.mp4` | Real-World Trajectory Replay，第 1 个任务卡片，左 / 右视频框 |
| Put Cap（盖盖） | `assets/videos/Human_cap_3.mp4` | `assets/videos/Robot_Put_Cap.mp4` | 第 2 个任务卡片，左 / 右视频框 |
| Drop（丢弃） | `assets/videos/Human_carton_1.mp4` | `assets/videos/Robot_Drop_Litter_v2.mp4` | 第 3 个任务卡片，左 / 右视频框 |
| Wipe（擦拭） | `assets/videos/Human_eraser_15.mp4` | `assets/videos/Robot_Wipe.mp4` | 第 4 个任务卡片，左 / 右视频框 |
| Nest Cups（套杯） | `assets/videos/Human_cup_1.mp4` | `assets/videos/Robot_Stack_Cup.mp4` | 第 5 个任务卡片，左 / 右视频框 |
| Pour（倾倒） | `assets/videos/Human_Pour.mp4` | `assets/videos/Robot_Pour.mp4` | 第 6 个任务卡片，左 / 右视频框 |
| Place（抓取并放置） | `assets/videos/Human_box_3.mp4` | `assets/videos/Robot_Pick_and_Place.mp4` | 第 7 个任务卡片，左 / 右视频框 |
| Stack Cups（叠杯） | `assets/videos/Human_cup_3.mp4` | `assets/videos/Robot_Stack_Cup_v2.mp4` | 第 8 个任务卡片，左 / 右视频框 |

其余素材保留在 `assets/videos/`，以便后续增加任务或替换示范：
`Human_brush_5.mp4`、`Human_long_brush.mp4`、`Human_pumkin_1.mp4`、
`Human_rolling.mp4`、`Robot_Drop_Litter.mp4`、`Robot_Rolling.mp4`、
`Robot_Sweep.mp4`。这些是尚未展示或未采用的相近操作 / 旧版本素材。

---

## 备用：`static/videos/` 命名约定

当前真实机器人展示已直接引用上方记录的 `assets/videos/` 文件。下面保留的是页面
原有的 `static/videos/` 槽位命名，供日后改用独立转码版本时参考；仿真结果部分仍使用
`static/videos/`。没有对应文件的槽位会显示灰色斜纹占位块。

建议：MP4 / H.264 + `faststart`，720p，5–10 s，无声，剪成能循环的片段。
页面里每个视频框是 16:9 裁切显示（`object-fit: cover`），横屏素材效果最好。

转码示例：

```bash
ffmpeg -i raw.mov -an -c:v libx264 -crf 23 -vf "scale=1280:-2" \
       -movflags +faststart static/videos/real_sweep_human.mp4
```

### 1. 真机复现（Real-World Trajectory Replay，旧槽位文件名）

8 个任务，每个一对：左边人类演示，右边机器人执行。任务名取自论文 Fig. 1。

| 任务 | 人类演示 | 机器人执行 |
| --- | --- | --- |
| Sweep | `real_sweep_human.mp4` | `real_sweep_robot.mp4` |
| Put Cap | `real_put_cap_human.mp4` | `real_put_cap_robot.mp4` |
| Drop | `real_drop_human.mp4` | `real_drop_robot.mp4` |
| Wipe | `real_wipe_human.mp4` | `real_wipe_robot.mp4` |
| Nest Cups | `real_nest_cups_human.mp4` | `real_nest_cups_robot.mp4` |
| Pour | `real_pour_human.mp4` | `real_pour_robot.mp4` |
| Place | `real_place_human.mp4` | `real_place_robot.mp4` |
| Stack Cups | `real_stack_cups_human.mp4` | `real_stack_cups_robot.mp4` |

论文说有 10 类任务、图里展示了 8 类。要把剩下 2 类也放上来的话，
在 `index.html` 里照抄一个 `<div class="task">` 块、改任务名和文件名即可。

## 2. 仿真结果（Simulation Results，当前保留空白槽位）

每条序列一组三栏：人类输入视频 / 重定向后的灵巧手 / RL rollout。
DexYCB 和 TACO 各 3 条；当前页面仅保留这些空白展示框，未导入 `assets/videos/`
中的素材，也不会显示 `VIDEO PENDING`。

| 数据集 | 序列 | 人类视频 | 重定向 | Rollout |
| --- | --- | --- | --- | --- |
| DexYCB | 1 | `sim_dexycb_seq1_human.mp4` | `sim_dexycb_seq1_retarget.mp4` | `sim_dexycb_seq1_rollout.mp4` |
| DexYCB | 2 | `sim_dexycb_seq2_human.mp4` | `sim_dexycb_seq2_retarget.mp4` | `sim_dexycb_seq2_rollout.mp4` |
| DexYCB | 3 | `sim_dexycb_seq3_human.mp4` | `sim_dexycb_seq3_retarget.mp4` | `sim_dexycb_seq3_rollout.mp4` |
| TACO | 1 | `sim_taco_seq1_human.mp4` | `sim_taco_seq1_retarget.mp4` | `sim_taco_seq1_rollout.mp4` |
| TACO | 2 | `sim_taco_seq2_human.mp4` | `sim_taco_seq2_retarget.mp4` | `sim_taco_seq2_rollout.mp4` |
| TACO | 3 | `sim_taco_seq3_human.mp4` | `sim_taco_seq3_retarget.mp4` | `sim_taco_seq3_rollout.mp4` |

`Sequence 1/2/3` 是占位标题，建议在 `index.html` 里换成真实序列名
（如 `taco_brush_brush_1`、`dexycb_20200709_s0_...`），方便读者对照论文。

## 3. 图片（已从 PDF 里裁出，可替换）

`static/images/` 下 5 张图由 `chats/tmp_code/extract_paper_figs.py`
从 `RA_L.pdf` 300 dpi 渲染裁切而来，内容正确但是位图，放大会发虚。
有原始导出图（PDF/SVG/高分辨率 PNG）的话直接同名覆盖即可：

| 文件 | 对应 | 用在哪 |
| --- | --- | --- |
| `background.png` | 你提供的宣传图 | 当前未使用；首屏改用动态帧墙背景 |
| `teaser.png` | Fig. 1 | Hero 下方大图 |
| `pipeline.png` | Fig. 2 | Method 一节主图 |
| `compare_recon.png` | Fig. 4 | Method 轮播第 1 张（重建定性对比） |
| `compare_retarget.png` | Fig. 5 | Method 轮播第 2 张（重定向定性对比） |
| `real_world.png` | Fig. 3 | Method 轮播第 3 张（真机复现分帧） |

轮播用左右箭头 / 下方圆点 / 键盘方向键切换。加一张图 = 在 `index.html` 的
`<div class="slides">` 里再抄一个 `<figure class="slide">`，圆点会自动多一个。

### Hero 背景

当前首屏使用白色纯色背景；`background.png` 保留在素材目录中，尚未接入页面。

## 4. 还需要你确认的文字

- `index.html` 里的 BibTeX 目前是匿名占位（`@article{c2dex2026, author = {Anonymous}}`），
  录用后换成正式条目。
- Hero 区的 arXiv / Code 按钮是灰色禁用状态，匿名期结束后把 `<span class="btn disabled">`
  换成 `<a class="btn" href="...">` 即可。

## 本地预览

```bash
cd web && python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

以后要发 GitHub Pages 的话，整个 `web/` 目录可以直接当站点根（已放 `.nojekyll`，
路径全是相对路径，不用改任何东西）。
