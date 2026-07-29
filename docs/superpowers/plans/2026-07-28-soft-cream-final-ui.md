# 叮叮记账柔和奶油最终 UI 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking。

**Goal:** 将最终选定的“柔和奶油”配色应用到叮叮记账十个核心页面，输出两张五屏高保真设计板。

**Architecture:** 以已验收的薄荷清新两张设计板作为布局和内容参考，通过图像编辑保持页面结构、数据、导航和组件位置不变，仅替换视觉系统。核心页面与财务管理页面分别生成，最后执行文件、结构和视觉一致性验收。

**Tech Stack:** OpenAI ImageGen、PNG、高保真微信小程序 UI

## Global Constraints

- 主色 `#F1D37A`，薄荷辅助 `#7FAE9A`，背景 `#FFFAEC`，卡片 `#FFFDF8`，正文 `#2C3833`，收入 `#4D806B`，提醒 `#D9786C`。
- 黄色面积约 10%–15%，薄荷约 8%–12%，中性色至少 70%。
- 黄色按钮必须使用深色文字。
- 小铃铛主体使用主黄，帽扣或铃舌使用薄荷辅助色。
- 保持现有十个页面的结构、数据和五项导航不变。

---

### Task 1: 生成核心页面设计板

**Files:**
- Create: `design/generated/soft-cream-core.png`

**Interfaces:**
- Consumes: `design/generated/mint-core.png`、柔和奶油最终色值
- Produces: 首页、明细、手动记账、统计、我的五屏设计板

- [ ] **Step 1: 使用 ImageGen 编辑布局参考**

引用 `mint-core.png`，要求只替换配色、卡片材质、图标色和小铃铛细节，保留五屏结构、中文、金额、图表和导航。

- [ ] **Step 2: 检查核心页面**

确认首页三种记账入口、预算、提醒完整；手动记账和统计数据可读；未登录与微信同步状态存在。

- [ ] **Step 3: 保存并提交**

```powershell
git add design/generated/soft-cream-core.png
git commit -m "design: add soft cream core UI board"
```

### Task 2: 生成财务管理设计板

**Files:**
- Create: `design/generated/soft-cream-finance.png`

**Interfaces:**
- Consumes: `design/generated/mint-finance.png`、`design/generated/soft-cream-core.png`
- Produces: 贷款列表、贷款详情、欠款列表、欠款详情、预算设置五屏设计板

- [ ] **Step 1: 使用 ImageGen 编辑财务布局参考**

引用 `mint-finance.png` 保持结构和数据，引用 `soft-cream-core.png` 保持最终视觉系统。

- [ ] **Step 2: 检查财务页面**

确认贷款、欠款、预算名称与主要金额可读，贷款和欠款通过标签与图标区分，提醒色仅用于临期或待还状态。

- [ ] **Step 3: 保存并提交**

```powershell
git add design/generated/soft-cream-finance.png
git commit -m "design: add soft cream finance UI board"
```

### Task 3: 最终验收

**Files:**
- Create: `design/qa/soft-cream-ui-review.md`

**Interfaces:**
- Consumes: 两张柔和奶油设计板
- Produces: 尺寸、页面覆盖和视觉一致性验收记录

- [ ] **Step 1: 验证图片**

确认两张 PNG 可解码、每张包含五个完整页面、宽度至少 1600px、高度至少 900px。

- [ ] **Step 2: 视觉验收**

确认十个页面齐全、配色统一、黄色按钮使用深色文字、小铃铛不遮挡财务信息、导航一致。

- [ ] **Step 3: 提交验收记录**

```powershell
git add design/qa/soft-cream-ui-review.md
git commit -m "design: verify soft cream final UI"
```

