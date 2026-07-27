# 叮叮记账年轻黄色系色卡实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一张包含 6 套年轻黄色系配色、42 个准确 HEX、小铃铛角色示例和统一迷你界面的高清 PNG 色卡。

**Architecture:** 复用已验证的高级色卡排版语言与本地浏览器渲染工具，新增独立 HTML、内容验证脚本和 PNG。全部文字与 HEX 由 HTML 确定性渲染，不修改原高级配色色卡。

**Tech Stack:** HTML5、CSS、JavaScript、Playwright、PNG

## Global Constraints

- 包含柠檬黄、奶油黄、芥末黄三组，每组两套。
- 每套包含 7 个固定 HEX、统一迷你首页和小铃铛角色示例。
- 黄色主按钮使用深色文字。
- 角色不得遮挡金额、按钮、图表、色值或用途标签。
- 优先推荐奶油薄荷、芥末森林、柠檬宝蓝。
- 输出为独立文件，不覆盖 `premium-color-cards.png`。

---

### Task 1: 创建年轻黄色系色卡页面

**Files:**
- Create: `design/color-cards/young-yellow-color-cards.html`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-27-young-yellow-color-cards-design.md`
- Produces: 包含 6 套色卡的确定性 HTML 页面

- [ ] **Step 1: 录入固定数据**

建立 6 项 `palettes` 数据，每项包含 `group`、`name`、`description`、`recommended` 和 `colors`。`colors` 固定包含 `primary`、`accent`、`background`、`surface`、`text`、`income`、`alert`。

- [ ] **Step 2: 创建三组双列布局**

按“柠檬黄、奶油黄、芥末黄”纵向排列，每组两张宽卡片。每张卡包含名称、说明、推荐标记、迷你界面、小铃铛示例和七个色块。

- [ ] **Step 3: 创建统一迷你界面**

六张卡统一展示：

```html
<div class="mini-app">
  <div class="mini-brand">叮叮记账</div>
  <div class="balance-card"><span>今日支出</span><strong>¥128.50</strong></div>
  <div class="budget-row"><span>本月预算 ¥6,000</span><span>已用 52%</span></div>
  <div class="progress"><i></i></div>
  <div class="states"><span>收入 +¥800</span><span>3天后还款</span></div>
  <button>＋ 记一笔</button>
</div>
```

- [ ] **Step 4: 添加小铃铛角色示例**

使用纯 CSS 绘制小铃铛头像，放在提醒气泡旁并标注“叮叮提醒”。角色尺寸不超过迷你界面宽度的 12%，不覆盖数据。

- [ ] **Step 5: 提交页面**

```powershell
git add design/color-cards/young-yellow-color-cards.html
git commit -m "design: add young yellow color card page"
```

### Task 2: 验证文字与色值

**Files:**
- Create: `design/color-cards/verify-young-yellow-cards.mjs`

**Interfaces:**
- Consumes: `design/color-cards/young-yellow-color-cards.html`
- Produces: 成功输出 `Verified 6 palettes and 42 color values.`

- [ ] **Step 1: 编写内容验证**

检查 6 个名称、42 个预期 HEX、三组标题、三个推荐方案和固定迷你界面文案。任何缺失项必须输出错误并以退出码 1 结束。

- [ ] **Step 2: 运行验证**

```powershell
node design/color-cards/verify-young-yellow-cards.mjs
```

预期输出：

```text
Verified 6 palettes and 42 color values.
```

- [ ] **Step 3: 提交验证脚本**

```powershell
git add design/color-cards/verify-young-yellow-cards.mjs
git commit -m "test: verify young yellow color card content"
```

### Task 3: 渲染与验收

**Files:**
- Create: `design/color-cards/render-young-yellow-cards.mjs`
- Create: `design/generated/young-yellow-color-cards.png`
- Create: `design/qa/young-yellow-color-cards-review.md`

**Interfaces:**
- Consumes: 已验证的黄色系 HTML 和现有 `browser-path.mjs`
- Produces: 高清 PNG 与验收记录

- [ ] **Step 1: 编写渲染脚本**

使用现有 `browserExecutable` 和 Playwright，以 `1800 × 1200` viewport 打开 HTML，等待字体加载并使用 `fullPage: true` 导出 `young-yellow-color-cards.png`。

- [ ] **Step 2: 导出 PNG**

运行渲染脚本，确认输出文件非空、宽度至少 1800px、高度至少 1200px。

- [ ] **Step 3: 视觉检查**

确认 6 张卡片完整、42 个 HEX 可读、黄色按钮使用深色文字、小铃铛不遮挡信息、三个推荐标记正确且页面无裁切。

- [ ] **Step 4: 写入验收记录**

记录图片尺寸、文件大小、内容验证结果和视觉检查结果。

- [ ] **Step 5: 提交**

```powershell
git add design/color-cards/render-young-yellow-cards.mjs design/generated/young-yellow-color-cards.png design/qa/young-yellow-color-cards-review.md
git commit -m "design: render young yellow color card board"
```

