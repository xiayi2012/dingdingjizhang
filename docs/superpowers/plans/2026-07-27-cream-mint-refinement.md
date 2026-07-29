# 叮叮记账奶油薄荷微调对比图实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成原版奶油薄荷与柔和奶油、清爽薄荷、品牌平衡三套微调方案的高清并排对比图。

**Architecture:** 使用独立 HTML 确定性渲染四个相同首页组件，仅通过 CSS 变量改变颜色。通过 Node 脚本验证四套名称、28 个 HEX 和固定文案，再使用现有 Playwright 浏览器路径工具导出 PNG。

**Tech Stack:** HTML5、CSS、JavaScript、Playwright、PNG

## Global Constraints

- 四套方案组件、数据、小铃铛角色和排版完全一致。
- 每套包含 7 个固定 HEX，共 28 个。
- 黄色按钮使用深色文字。
- 品牌平衡显示“推荐”标记。
- 输出不覆盖现有高级色卡和黄色系色卡。

---

### Task 1: 建立内容验证

**Files:**
- Create: `design/color-cards/verify-cream-mint-refinement.mjs`

**Interfaces:**
- Consumes: `design/color-cards/cream-mint-refinement.html`
- Produces: 成功输出 `Verified 4 variants and 28 color values.`

- [ ] **Step 1: 编写失败优先的验证脚本**

页面缺失时输出 `Missing cream mint refinement page.` 并以退出码 1 结束。页面存在时检查四套名称、28 个 HEX、统一示例文案和唯一推荐标记。

- [ ] **Step 2: 运行并确认失败**

```powershell
node design/color-cards/verify-cream-mint-refinement.mjs
```

预期：`Missing cream mint refinement page.`

### Task 2: 创建四套对比页面

**Files:**
- Create: `design/color-cards/cream-mint-refinement.html`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-27-cream-mint-refinement-design.md`
- Produces: 四列并排的确定性对比页面

- [ ] **Step 1: 录入四套固定色值**

每项包含 `name`、`description`、`recommended` 和 `colors`；`colors` 固定包含 `primary`、`accent`、`background`、`surface`、`text`、`income`、`alert`。

- [ ] **Step 2: 创建统一首页预览**

每列展示今日支出、三种记账入口、预算进度、收入、还款提醒、“记一笔”按钮和小铃铛。

- [ ] **Step 3: 标注颜色占比**

每套显示“主黄 10–15% / 薄荷 8–12% / 中性色 70%+”，并列出七个用途色块。

- [ ] **Step 4: 运行验证**

```powershell
node design/color-cards/verify-cream-mint-refinement.mjs
```

预期：`Verified 4 variants and 28 color values.`

- [ ] **Step 5: 提交页面与验证**

```powershell
git add design/color-cards/verify-cream-mint-refinement.mjs design/color-cards/cream-mint-refinement.html
git commit -m "design: add cream mint refinement comparison"
```

### Task 3: 渲染与验收

**Files:**
- Create: `design/color-cards/render-cream-mint-refinement.mjs`
- Create: `design/generated/cream-mint-refinement.png`
- Create: `design/qa/cream-mint-refinement-review.md`

**Interfaces:**
- Consumes: 已验证的对比页面与 `browser-path.mjs`
- Produces: 高清 PNG 和验收记录

- [ ] **Step 1: 创建渲染脚本**

使用 Playwright、现有 `browserExecutable`、`1800 × 1200` viewport、字体等待和整页截图。

- [ ] **Step 2: 导出 PNG**

输出 `design/generated/cream-mint-refinement.png`，宽度至少 1800px、高度至少 1200px。

- [ ] **Step 3: 视觉检查**

确认四列完整、组件一致、品牌平衡推荐标记正确、黄色按钮为深色文字、小铃铛不遮挡信息、28 个 HEX 可读。

- [ ] **Step 4: 记录并提交**

```powershell
git add design/color-cards/render-cream-mint-refinement.mjs design/generated/cream-mint-refinement.png design/qa/cream-mint-refinement-review.md
git commit -m "design: render cream mint refinement board"
```

