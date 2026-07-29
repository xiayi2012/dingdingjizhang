# 叮叮记账高级配色色卡实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一张包含 9 套高级配色、63 个准确 HEX 色值和 9 个统一迷你界面预览的高清 PNG 色卡。

**Architecture:** 使用单个 HTML 文件进行确定性排版，颜色与文字来自固定 JavaScript 数据，不让图片模型生成文字。使用 Playwright 打开本地 HTML 并导出整页 PNG，再通过脚本核对名称、HEX 数量、图片尺寸和文件完整性。

**Tech Stack:** HTML5、CSS、JavaScript、Playwright、PNG

## Global Constraints

- 色卡包含 9 套配色，分为轻奢柔和、现代冷静、深色点缀三组。
- 每套包含中文名称、说明、7 个用途标签和准确 HEX、统一迷你界面预览。
- 迷你预览统一使用今日支出 `¥128.50`、本月预算 `¥6,000`、已用 `52%` 和“记一笔”按钮。
- 深色点缀组保持浅色页面，只在主卡片、按钮、标题或导航使用深色。
- “深潭青灰”“曜石香槟金”“深海铜棕”显示“推荐”标记。
- 所有文字必须由 HTML 确定性渲染。

---

### Task 1: 创建确定性色卡页面

**Files:**
- Create: `design/color-cards/premium-color-cards.html`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-27-premium-color-cards-design.md`
- Produces: 可在浏览器直接打开的 9 套色卡页面

- [ ] **Step 1: 建立固定配色数据**

在 HTML 中定义 `palettes` 数组，每项使用以下接口：

```js
{
  group: "轻奢柔和",
  name: "香槟燕麦",
  description: "温暖、克制，带轻微酒店与精品生活感",
  recommended: false,
  colors: {
    primary: "#8A6A4A",
    accent: "#C8A46A",
    background: "#F7F3EC",
    surface: "#FFFCF7",
    text: "#2E2924",
    income: "#4E7C67",
    alert: "#B85C54"
  }
}
```

按设计说明完整录入 9 项，不转换或缩写 HEX。

- [ ] **Step 2: 创建 3×3 色卡布局**

页面使用三个分组区块，每组为三列卡片。每张卡片顶部依次呈现名称、说明和可选“推荐”标记，中部呈现统一迷你界面，底部呈现七个色块、用途标签和 HEX。

- [ ] **Step 3: 创建统一迷你界面**

每个预览均使用同一 DOM 结构：

```html
<div class="mini-app">
  <div class="mini-brand">叮叮记账</div>
  <div class="balance-card">
    <span>今日支出</span>
    <strong>¥128.50</strong>
    <small>较昨日下降 24.6%</small>
  </div>
  <div class="budget-row">
    <span>本月预算 ¥6,000</span>
    <span>已用 52%</span>
  </div>
  <div class="progress"><i></i></div>
  <div class="states"><span>收入 +¥800</span><span>提醒 3天后还款</span></div>
  <button>＋ 记一笔</button>
</div>
```

通过每套配色的 CSS 自定义属性改变颜色，不改变结构。

- [ ] **Step 4: 完成高清导出样式**

画布宽度固定为 `1800px`，背景使用中性浅灰；正文使用系统中文字体栈；卡片保持统一圆角、边框和阴影；卡片内关键文字字号不低于 `14px`，HEX 不低于 `13px`。

- [ ] **Step 5: 提交页面**

```powershell
git add design/color-cards/premium-color-cards.html
git commit -m "design: add premium color card page"
```

### Task 2: 验证文字与色值

**Files:**
- Create: `design/color-cards/verify-color-cards.mjs`

**Interfaces:**
- Consumes: `design/color-cards/premium-color-cards.html`
- Produces: 失败时退出码为 1、成功时输出 `Verified 9 palettes and 63 color values.`

- [ ] **Step 1: 编写验证脚本**

脚本读取 HTML，检查 9 个名称、63 个预期 HEX、三组标题、三个推荐方案以及固定迷你界面文案。每个缺失项写入错误输出并设置 `process.exitCode = 1`。

- [ ] **Step 2: 运行验证**

Run:

```powershell
node design/color-cards/verify-color-cards.mjs
```

Expected:

```text
Verified 9 palettes and 63 color values.
```

- [ ] **Step 3: 提交验证脚本**

```powershell
git add design/color-cards/verify-color-cards.mjs
git commit -m "test: verify premium color card content"
```

### Task 3: 渲染与视觉验收

**Files:**
- Create: `design/color-cards/render-color-cards.mjs`
- Create: `design/generated/premium-color-cards.png`
- Create: `design/qa/premium-color-cards-review.md`

**Interfaces:**
- Consumes: 通过内容验证的 HTML 页面
- Produces: 用户可直接查看的高清 PNG 色卡与验收记录

- [ ] **Step 1: 编写渲染脚本**

使用 Playwright Chromium 打开 HTML 的绝对 `file://` 地址，设置 viewport 为 `1800 × 1200`、device scale factor 为 `1`，等待 `document.fonts.ready`，然后使用 `fullPage: true` 截图到 `design/generated/premium-color-cards.png`。

- [ ] **Step 2: 导出 PNG**

Run:

```powershell
node design/color-cards/render-color-cards.mjs
```

Expected: 创建非空的 `design/generated/premium-color-cards.png`。

- [ ] **Step 3: 检查视觉结果**

检查：

- 9 张卡片均完整可见
- 三组标题顺序正确
- 9 个名称和全部 HEX 可读
- 迷你界面结构一致
- 深色点缀组仍为浅色页面
- 三个推荐标记正确
- 没有裁切、重叠或横向滚动

- [ ] **Step 4: 写入验收记录**

在 `design/qa/premium-color-cards-review.md` 记录图片尺寸、文件大小及七项视觉检查结果。

- [ ] **Step 5: 最终验证**

同时运行内容验证、PNG 解码和 Git 状态检查。PNG 宽度必须至少 `1800px`，高度必须至少 `1200px`。

- [ ] **Step 6: 提交色卡**

```powershell
git add design/color-cards/render-color-cards.mjs design/generated/premium-color-cards.png design/qa/premium-color-cards-review.md
git commit -m "design: render premium color card selection board"
```

