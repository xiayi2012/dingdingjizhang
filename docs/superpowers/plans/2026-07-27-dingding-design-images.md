# 叮叮记账高保真设计图实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成三套结构一致、视觉差异明显的叮叮记账微信小程序高保真设计图，供用户对比选择。

**Architecture:** 先建立所有方案共用的页面内容、尺寸和示例数据，再分别生成薄荷清新、暖橙治愈、雾蓝专业三套视觉稿。每套拆为两张五屏设计板，以保证文字和组件可辨识；最后进行跨方案一致性与视觉质量检查，并集中交付六张设计板。

**Tech Stack:** OpenAI ImageGen、高保真移动端 UI 设计板、微信小程序手机屏幕比例、PNG

## Global Constraints

- 本阶段只生成高保真设计图，不制作可点击原型，不开发小程序。
- 三套方案必须使用相同页面结构、页面内容和示例数据。
- 每套覆盖首页、明细、手动记账、统计、我的、贷款列表、贷款详情、欠款列表、欠款详情、预算设置。
- 聊天和语音记账只通过手动记账页的切换入口表达。
- 设计图保留顶部状态栏和底部五项导航：首页、明细、记账、统计、我的。
- 首页首屏必须出现今日支出、手动/聊天/语音入口和预算摘要。
- 所有统计图表同时使用颜色、文字或形状区分数据。
- 中文应用名固定为“叮叮记账”。
- 金额统一使用人民币符号“¥”，示例日期统一为 7 月。

---

### Task 1: 固定跨方案页面内容与生成规格

**Files:**
- Create: `design/source/screen-content.md`
- Create: `design/source/generation-brief.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-27-dingding-bookkeeping-design.md`
- Produces: 三套设计板共用的页面文案、示例数据、屏幕顺序、尺寸和禁止项

- [ ] **Step 1: 编写十个页面的固定内容表**

在 `design/source/screen-content.md` 中逐屏固定标题、主要数值、卡片顺序和导航状态：

```markdown
# 固定页面内容

1. 首页：今日支出 ¥128.50；已记 3 笔；较昨日下降 24.6%；本月预算 ¥6,000，已用 52%；最近记录为咖啡 ¥25、日用品 ¥68；房贷 3 天后还款；待收欠款 ¥850。
2. 明细：7 月支出 ¥7,400、收入 ¥12,680；按 7 月 27 日和 7 月 26 日分组；包含餐饮、购物、出行、工资记录。
3. 手动记账：支出状态；金额 ¥28.00；分类为餐饮；账户为微信零钱；备注为午餐；顶部提供手动、聊天、语音切换。
4. 统计：本月支出 ¥7,400、收入 ¥12,680、结余 ¥5,280；支出趋势；餐饮 32%、购物 24%、居住 20%；较上月下降 8%。
5. 我的：未登录、本机保存；微信登录并同步；账本、账户、分类、预算、提醒、数据导出入口。
6. 贷款列表：剩余贷款 ¥468,000；房贷、车贷两张卡；显示下次还款日、每期金额和进度。
7. 贷款详情：房贷；剩余本金 ¥420,000；每月应还 ¥3,200；剩余 186 期；还款计划和最近还款记录。
8. 欠款列表：待收 ¥850、待还 ¥300；“别人欠我的”和“我欠别人的”分段；显示联系人、日期和状态。
9. 欠款详情：小林欠我 ¥850；已还 ¥350；剩余 ¥500；约定 8 月 10 日；展示分次还款时间线。
10. 预算设置：月总预算 ¥6,000；餐饮 ¥1,800、购物 ¥1,200、交通 ¥600；80% 与 100% 提醒开关。
```

- [ ] **Step 2: 编写统一生成规格**

在 `design/source/generation-brief.md` 中固定：

```markdown
# 生成规格

- 输出：6 张 PNG 设计板，每张横向排列 5 个完整手机屏幕。
- 分组一：首页、明细、手动记账、统计、我的。
- 分组二：贷款列表、贷款详情、欠款列表、欠款详情、预算设置。
- 每块屏幕保持一致宽高、真实手机 UI 密度、清晰中文层级。
- 禁止：英文主导航、伪 3D 手机外壳、倾斜透视、手持场景、不可读小字、页面内容缺失、风格之间改变布局。
- 允许：少量品牌装饰、空状态插图、符合方案定义的图标差异。
```

- [ ] **Step 3: 核对内容覆盖**

逐项对照设计说明第 3、4、6、8、9、10 节，确认十个页面、三种记账入口、贷款、欠款、预算、同步状态和统计规则均已出现在固定内容表中。

- [ ] **Step 4: 提交固定生成规格**

```powershell
git add design/source/screen-content.md design/source/generation-brief.md
git commit -m "docs: fix content for design image generation"
```

### Task 2: 生成薄荷清新方案

**Files:**
- Create: `design/generated/mint-core.png`
- Create: `design/generated/mint-finance.png`

**Interfaces:**
- Consumes: `design/source/screen-content.md`、`design/source/generation-brief.md`
- Produces: 薄荷清新方案的十个页面

- [ ] **Step 1: 生成核心页面设计板**

使用 ImageGen 生成首页、明细、手动记账、统计、我的五屏设计板。提示词必须包含：

```text
叮叮记账微信小程序高保真 UI 设计板，五个竖向手机屏幕并排，正视图，无手机外壳，无透视。薄荷清新风格：柔和白背景、薄荷绿主色、深墨绿文字、中等圆角、轻描边卡片、极轻阴影、简洁线性图标、小型声波纹品牌元素。依次展示首页、明细、手动记账、统计、我的。严格采用固定示例数据和五项底部导航。中文清晰，信息密度真实，专业产品设计稿。
```

- [ ] **Step 2: 检查核心页面**

确认五屏顺序正确；首页三种记账入口齐全；手动记账金额、分类、账户和模式切换可见；统计图表带文字标签；“我的”显示本机保存和微信登录同步。

- [ ] **Step 3: 生成财务管理设计板**

使用相同视觉定义生成贷款列表、贷款详情、欠款列表、欠款详情、预算设置五屏设计板，不改变导航、圆角、字号层级和品牌元素。

- [ ] **Step 4: 检查财务管理页面**

确认贷款和欠款不会混淆；贷款详情包含本金、每期金额和剩余期数；欠款详情包含已还、剩余和时间线；预算页包含总预算、分类预算和两个提醒阈值。

- [ ] **Step 5: 提交薄荷清新设计板**

```powershell
git add design/generated/mint-core.png design/generated/mint-finance.png
git commit -m "design: add mint UI boards"
```

### Task 3: 生成暖橙治愈方案

**Files:**
- Create: `design/generated/warm-core.png`
- Create: `design/generated/warm-finance.png`

**Interfaces:**
- Consumes: Task 1 的固定内容与 Task 2 的页面布局基准
- Produces: 暖橙治愈方案的十个页面

- [ ] **Step 1: 生成核心页面设计板**

使用 ImageGen 生成五屏设计板。提示词必须包含：

```text
保持薄荷方案完全相同的五屏结构、文案、数值与组件位置，改为暖橙治愈风格：奶油白背景、珊瑚橙主色、鼠尾草绿辅助色、圆润柔软卡片、轻拟物彩色图标、温暖克制的阴影。小铃铛表情角色只出现在成功反馈或提示角落，不遮挡财务数据。中文清晰，无透视，无手机外壳。
```

- [ ] **Step 2: 检查核心页面一致性**

将五个页面与 `mint-core.png` 逐屏对照，确认页面顺序、数据、组件层级和导航完全一致，差异只来自视觉语言。

- [ ] **Step 3: 生成财务管理设计板**

使用相同暖橙视觉定义生成贷款列表、贷款详情、欠款列表、欠款详情、预算设置五屏设计板。

- [ ] **Step 4: 检查暖橙方案可读性**

确认珊瑚橙不会同时表示收入与支出；收入固定使用鼠尾草绿；提醒信息有图标或文字标签；铃铛角色不覆盖按钮、金额或图表。

- [ ] **Step 5: 提交暖橙治愈设计板**

```powershell
git add design/generated/warm-core.png design/generated/warm-finance.png
git commit -m "design: add warm UI boards"
```

### Task 4: 生成雾蓝专业方案

**Files:**
- Create: `design/generated/blue-core.png`
- Create: `design/generated/blue-finance.png`

**Interfaces:**
- Consumes: Task 1 的固定内容与 Task 2 的页面布局基准
- Produces: 雾蓝专业方案的十个页面

- [ ] **Step 1: 生成核心页面设计板**

使用 ImageGen 生成五屏设计板。提示词必须包含：

```text
保持薄荷方案完全相同的五屏结构、文案、数值与组件位置，改为雾蓝专业风格：冷灰白背景、雾蓝主色、藏青文字、琥珀色提醒、充足留白、较平直卡片、精细线性图标、轻量分隔线。抽象铃铛与折线图品牌图形只作为小型标记。中文清晰，无透视，无手机外壳，可信赖的个人财务工具气质。
```

- [ ] **Step 2: 检查核心页面一致性**

将五个页面与 `mint-core.png` 逐屏对照，确认页面顺序、数据、组件层级和导航完全一致。

- [ ] **Step 3: 生成财务管理设计板**

使用相同雾蓝视觉定义生成贷款列表、贷款详情、欠款列表、欠款详情、预算设置五屏设计板。

- [ ] **Step 4: 检查专业方案可读性**

确认雾蓝和冷灰具有足够明度差；琥珀色只用于提醒和临期状态；统计图表用文字或形状补充颜色含义。

- [ ] **Step 5: 提交雾蓝专业设计板**

```powershell
git add design/generated/blue-core.png design/generated/blue-finance.png
git commit -m "design: add blue UI boards"
```

### Task 5: 视觉验收与交付

**Files:**
- Create: `design/qa/design-review.md`
- Modify: 不合格的 `design/generated/*.png`

**Interfaces:**
- Consumes: 三套方案共六张设计板
- Produces: 可供用户直接对比选择的最终设计图与验收记录

- [ ] **Step 1: 检查图片完整性**

确认六张 PNG 均可打开、方向正确、没有裁切，且每张包含五个完整手机屏幕。

- [ ] **Step 2: 逐屏视觉检查**

对每张图片检查以下项目并记录在 `design/qa/design-review.md`：

```markdown
- [ ] 页面数量与顺序正确
- [ ] “叮叮记账”名称正确
- [ ] 中文主标题和关键金额可读
- [ ] 首页包含今日支出、三种记账入口、预算摘要
- [ ] 底部导航为首页、明细、记账、统计、我的
- [ ] 贷款与欠款含义和状态容易区分
- [ ] 图表不只依赖颜色表达
- [ ] 没有透视、手机外壳或遮挡
```

- [ ] **Step 3: 修复不合格设计板**

对任何未通过项目重新生成对应设计板。重新生成时引用原图，只修改失败项，保持其余页面、布局和视觉语言不变。

- [ ] **Step 4: 完成跨方案对比**

确认三套方案的布局、内容和示例数据一致；确认薄荷、暖橙、雾蓝在主色、图标、圆角、卡片和品牌元素上具有明显区别。

- [ ] **Step 5: 提交验收记录**

```powershell
git add design/generated design/qa/design-review.md
git commit -m "design: verify comparison boards"
```

- [ ] **Step 6: 向用户交付**

在最终回复中按“薄荷清新、暖橙治愈、雾蓝专业”分组展示六张图片，并请用户选择一套作为后续深化方向，或指出希望融合的具体元素。

