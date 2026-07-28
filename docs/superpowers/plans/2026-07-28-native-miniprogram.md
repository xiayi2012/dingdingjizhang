# 叮叮记账微信原生小程序实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可导入微信开发者工具的叮叮记账原生 JavaScript 小程序，实现 10 个页面、本地完整记账能力以及可配置的微信云同步。

**Architecture:** 页面通过领域服务访问统一仓储，仓储默认读写微信本地存储；云环境启用后，同步服务负责首次上传和增量合并。金额计算、日期范围、统计、贷款、欠款和同步冲突均放入不依赖微信运行时的 CommonJS 纯函数模块，以便使用 Node.js 内置测试运行器执行测试驱动开发。

**Tech Stack:** 微信原生小程序、JavaScript、WXML、WXSS、微信云开发、Node.js 22 内置测试运行器

## Global Constraints

- 主色 `#F1D37A`，薄荷辅助 `#7FAE9A`，背景 `#FFFAEC`，卡片 `#FFFDF8`，正文 `#2C3833`，收入 `#4D806B`，提醒 `#D9786C`。
- 金额持久化为整数分；日期为 `YYYY-MM-DD`；时间为 ISO 8601 字符串。
- 当前未提供 AppID 和云环境 ID，默认必须完整运行在本地模式。
- 页面不得直接读写本地存储或云数据库。
- 聊天与语音记账只展示入口和未开放说明。
- 每个生产模块必须先有失败测试，再写最小实现。

---

## 文件结构

```text
app.js                         小程序启动、配置和全局状态
app.json                       页面注册和窗口配置
app.wxss                       全局视觉令牌与公共样式
project.config.json            微信开发者工具工程配置
config/env.js                  AppID、云环境和能力开关
components/                   可复用视觉组件
custom-tab-bar/               五项底部导航
pages/                        10 个业务页面
services/repository.js        本地仓储统一接口
services/sync-service.js      登录、上传、拉取和合并
domain/                       纯业务规则
data/seed.js                  首次启动示例数据
utils/                        标识、日期和微信适配
cloudfunctions/login/         获取微信身份
cloudfunctions/sync/          云端批量同步
tests/                        Node.js 业务测试
docs/cloud-setup.md           AppID、云环境和集合配置
```

---

### Task 1: 工程骨架与配置

**Files:**
- Create: `package.json`
- Create: `project.config.json`
- Create: `sitemap.json`
- Create: `app.js`
- Create: `app.json`
- Create: `app.wxss`
- Create: `config/env.js`
- Create: `tests/project-structure.test.js`

**Interfaces:**
- Produces: `getRuntimeConfig(): { cloudEnabled: boolean, cloudEnvId: string }`
- Produces: 可被微信开发者工具导入并注册全部页面的工程

- [ ] **Step 1: 编写失败的工程结构测试**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('registers all ten product pages', () => {
  const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  assert.equal(app.pages.length, 10);
  assert.ok(app.pages.includes('pages/home/index'));
  assert.ok(app.pages.includes('pages/budget/index'));
});

test('keeps cloud disabled without an environment id', () => {
  const { getRuntimeConfig } = require('../config/env');
  assert.deepEqual(getRuntimeConfig(), { cloudEnabled: false, cloudEnvId: '' });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- tests/project-structure.test.js`

Expected: FAIL，提示 `app.json` 或 `config/env.js` 不存在。

- [ ] **Step 3: 创建最小工程配置**

`config/env.js`：

```js
const CLOUD_ENV_ID = '';

function getRuntimeConfig() {
  return {
    cloudEnabled: Boolean(CLOUD_ENV_ID),
    cloudEnvId: CLOUD_ENV_ID,
  };
}

module.exports = { getRuntimeConfig };
```

`package.json`：

```json
{
  "name": "dingding-bookkeeping",
  "private": true,
  "scripts": {
    "test": "node --test",
    "check": "node --test"
  }
}
```

`app.json` 注册首页、明细、记账、统计、我的、贷款列表、贷款详情、欠款列表、欠款详情和预算设置，并启用 `custom-tab-bar`。

- [ ] **Step 4: 运行测试并确认通过**

Run: `npm test -- tests/project-structure.test.js`

Expected: PASS，2 tests，0 failures。

- [ ] **Step 5: 提交**

```powershell
git add package.json project.config.json sitemap.json app.js app.json app.wxss config tests/project-structure.test.js
git commit -m "feat: scaffold native miniprogram"
```

---

### Task 2: 金额、日期与统计领域模块

**Files:**
- Create: `domain/money.js`
- Create: `domain/date-range.js`
- Create: `domain/statistics.js`
- Create: `tests/money.test.js`
- Create: `tests/date-range.test.js`
- Create: `tests/statistics.test.js`

**Interfaces:**
- Produces: `yuanToCents(value): number`
- Produces: `formatCents(cents): string`
- Produces: `getDateRange(period, now): { start: string, end: string }`
- Produces: `summarizeTransactions(transactions, range): Summary`

- [ ] **Step 1: 编写金额转换失败测试**

```js
test('converts decimal yuan to integer cents', () => {
  assert.equal(yuanToCents('28.50'), 2850);
  assert.equal(yuanToCents('0.01'), 1);
});

test('formats integer cents as yuan', () => {
  assert.equal(formatCents(2850), '28.50');
});
```

- [ ] **Step 2: 运行金额测试并确认失败**

Run: `npm test -- tests/money.test.js`

Expected: FAIL，提示 `yuanToCents` 尚未定义。

- [ ] **Step 3: 实现金额模块并确认通过**

```js
function yuanToCents(value) {
  const normalized = String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error('请输入正确金额');
  const [yuan, decimal = ''] = normalized.split('.');
  return Number(yuan) * 100 + Number(decimal.padEnd(2, '0'));
}
```

Run: `npm test -- tests/money.test.js`

Expected: PASS。

- [ ] **Step 4: 为日期范围和统计汇总重复红绿循环**

测试必须覆盖自然周、自然月、自然年、删除记录不参与统计、转账不计收支、收入、支出、结余、分类排行和按日趋势。

```js
const result = summarizeTransactions(records, {
  start: '2026-07-01',
  end: '2026-07-31',
});
assert.equal(result.expenseCents, 740000);
assert.equal(result.incomeCents, 1268000);
assert.equal(result.balanceCents, 528000);
```

- [ ] **Step 5: 运行领域测试**

Run: `npm test -- tests/money.test.js tests/date-range.test.js tests/statistics.test.js`

Expected: PASS，0 failures。

- [ ] **Step 6: 提交**

```powershell
git add domain tests
git commit -m "feat: add bookkeeping domain calculations"
```

---

### Task 3: 默认数据、本地仓储与迁移

**Files:**
- Create: `data/seed.js`
- Create: `services/repository.js`
- Create: `utils/id.js`
- Create: `utils/storage.js`
- Create: `tests/repository.test.js`

**Interfaces:**
- Produces: `createRepository(storage): Repository`
- `Repository.list(entity, filters): Array<object>`
- `Repository.get(entity, id): object | null`
- `Repository.save(entity, value): object`
- `Repository.remove(entity, id): object`
- `Repository.getSnapshot(): object`

- [ ] **Step 1: 编写仓储失败测试**

```js
test('seeds a personal book on first load', () => {
  const repo = createRepository(memoryStorage());
  assert.equal(repo.list('books').length, 1);
  assert.equal(repo.list('transactions').length > 0, true);
});

test('marks edited records pending and removed records deleted', () => {
  const repo = createRepository(memoryStorage());
  const item = repo.save('transactions', validExpense);
  assert.equal(item.syncStatus, 'pending');
  const removed = repo.remove('transactions', item.id);
  assert.equal(removed.deleted, true);
});
```

- [ ] **Step 2: 运行并确认因仓储缺失而失败**

Run: `npm test -- tests/repository.test.js`

Expected: FAIL，提示无法加载 `services/repository.js`。

- [ ] **Step 3: 实现版本化本地快照**

根存储键使用 `dingding.bookkeeping.v1`。首次启动写入默认账本、账户、分类和与设计稿一致的示例数据。仓储接受注入的 `storage`，测试使用内存实现，小程序运行时使用 `wx` 适配器。

- [ ] **Step 4: 补充迁移和筛选测试并通过**

覆盖旧版本缺失字段补全、按日期排序、关键词筛选、类型筛选和删除记录隐藏。

Run: `npm test -- tests/repository.test.js`

Expected: PASS，0 failures。

- [ ] **Step 5: 提交**

```powershell
git add data services/repository.js utils tests/repository.test.js
git commit -m "feat: add local bookkeeping repository"
```

---

### Task 4: 预算、贷款与欠款规则

**Files:**
- Create: `domain/budget.js`
- Create: `domain/loan.js`
- Create: `domain/debt.js`
- Create: `tests/budget.test.js`
- Create: `tests/loan.test.js`
- Create: `tests/debt.test.js`

**Interfaces:**
- Produces: `calculateBudgetUsage(budget, transactions): BudgetUsage`
- Produces: `applyLoanPayment(loan, payment): Loan`
- Produces: `applyDebtPayment(debt, payment): Debt`

- [ ] **Step 1: 编写预算阈值失败测试**

```js
test('reports warning at eighty percent and exceeded at one hundred percent', () => {
  assert.equal(calculateBudgetUsage({ limitCents: 10000 }, expenses(8000)).status, 'warning');
  assert.equal(calculateBudgetUsage({ limitCents: 10000 }, expenses(10000)).status, 'exceeded');
});
```

- [ ] **Step 2: 运行测试确认失败，再实现最小预算计算**

Run: `npm test -- tests/budget.test.js`

Expected before implementation: FAIL。Expected after implementation: PASS。

- [ ] **Step 3: 以相同红绿循环实现贷款还款**

测试验证剩余本金不小于零、增加已还期数、可选生成支出记录且不会重复生成。

- [ ] **Step 4: 以相同红绿循环实现欠款分次还款**

测试验证“别人欠我的”还款可生成收入、“我欠别人的”还款可生成支出、余额为零自动变为 `settled`。

- [ ] **Step 5: 运行全部规则测试**

Run: `npm test -- tests/budget.test.js tests/loan.test.js tests/debt.test.js`

Expected: PASS，0 failures。

- [ ] **Step 6: 提交**

```powershell
git add domain tests
git commit -m "feat: add budget loan and debt rules"
```

---

### Task 5: 公共视觉组件与底部导航

**Files:**
- Create: `components/app-header/index.{js,json,wxml,wxss}`
- Create: `components/amount-card/index.{js,json,wxml,wxss}`
- Create: `components/progress-bar/index.{js,json,wxml,wxss}`
- Create: `components/status-tag/index.{js,json,wxml,wxss}`
- Create: `components/empty-state/index.{js,json,wxml,wxss}`
- Create: `components/bell-mark/index.{js,json,wxml,wxss}`
- Create: `custom-tab-bar/index.{js,json,wxml,wxss}`
- Create: `tests/style-tokens.test.js`

**Interfaces:**
- Produces: 颜色与间距令牌
- Produces: 页面可声明使用的六个公共组件
- Produces: 首页、明细、记账、统计、我的五项导航

- [ ] **Step 1: 编写视觉令牌失败测试**

测试读取 `app.wxss`，断言七个最终色值、深色按钮文字类和页面背景存在。

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/style-tokens.test.js`

Expected: FAIL，提示缺少最终色值或样式类。

- [ ] **Step 3: 实现视觉令牌和组件**

使用 CSS 变量定义最终色板。小铃铛用 WXML 与 WXSS 基础形状绘制，不使用整屏位图；中央记账按钮使用主黄和正文深色。

- [ ] **Step 4: 验证样式测试通过**

Run: `npm test -- tests/style-tokens.test.js`

Expected: PASS。

- [ ] **Step 5: 提交**

```powershell
git add app.wxss components custom-tab-bar tests/style-tokens.test.js
git commit -m "feat: add soft cream UI system"
```

---

### Task 6: 首页、明细和手动记账

**Files:**
- Create: `services/bookkeeping-service.js`
- Create: `pages/home/index.{js,json,wxml,wxss}`
- Create: `pages/records/index.{js,json,wxml,wxss}`
- Create: `pages/entry/index.{js,json,wxml,wxss}`
- Create: `tests/bookkeeping-service.test.js`

**Interfaces:**
- Produces: `createBookkeepingService(repository)`
- Produces: `getHomeViewModel(date): HomeViewModel`
- Produces: `listRecordGroups(filters): Array<RecordGroup>`
- Produces: `saveTransaction(form): Transaction`

- [ ] **Step 1: 编写首页汇总和记账校验失败测试**

```js
test('builds home totals from repository records', () => {
  const vm = service.getHomeViewModel('2026-07-27');
  assert.equal(vm.todayExpenseCents, 12850);
  assert.equal(vm.todayCount, 3);
});

test('requires amount category and account', () => {
  assert.throws(() => service.saveTransaction({ amount: '' }), /金额/);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npm test -- tests/bookkeeping-service.test.js`

Expected: FAIL，提示业务服务不存在。

- [ ] **Step 3: 实现业务服务与三个页面**

首页从服务读取摘要；明细使用关键词和类型筛选；记账表单保存真实记录。聊天与语音标签展示明确说明。删除记录调用系统确认框后再调用服务。

- [ ] **Step 4: 运行服务与全量测试**

Run: `npm test`

Expected: PASS，0 failures。

- [ ] **Step 5: 提交**

```powershell
git add services/bookkeeping-service.js pages/home pages/records pages/entry tests/bookkeeping-service.test.js
git commit -m "feat: implement core bookkeeping flow"
```

---

### Task 7: 统计、我的与预算页面

**Files:**
- Create: `services/insights-service.js`
- Create: `pages/statistics/index.{js,json,wxml,wxss}`
- Create: `pages/profile/index.{js,json,wxml,wxss}`
- Create: `pages/budget/index.{js,json,wxml,wxss}`
- Create: `tests/insights-service.test.js`

**Interfaces:**
- Produces: `createInsightsService(repository)`
- Produces: `getStatistics(period, now): StatisticsViewModel`
- Produces: `getBudgetViewModel(month): BudgetViewModel`
- Produces: `saveBudget(input): Budget`

- [ ] **Step 1: 编写统计与预算视图模型失败测试**

断言本月支出 `740000` 分、收入 `1268000` 分、结余 `528000` 分，并验证预算分类进度来源于实际记录。

- [ ] **Step 2: 运行确认失败**

Run: `npm test -- tests/insights-service.test.js`

Expected: FAIL，提示统计服务不存在。

- [ ] **Step 3: 实现服务和三个页面**

趋势图使用 WXML 柱形结构，分类占比同时显示标签、百分比和颜色。我的页面展示本地保存状态和未配置云环境说明。预算页可编辑总预算、分类预算和两个提醒开关。

- [ ] **Step 4: 运行全量测试**

Run: `npm test`

Expected: PASS，0 failures。

- [ ] **Step 5: 提交**

```powershell
git add services/insights-service.js pages/statistics pages/profile pages/budget tests/insights-service.test.js
git commit -m "feat: add insights profile and budgets"
```

---

### Task 8: 贷款与欠款页面

**Files:**
- Create: `services/finance-service.js`
- Create: `pages/loans/index.{js,json,wxml,wxss}`
- Create: `pages/loan-detail/index.{js,json,wxml,wxss}`
- Create: `pages/debts/index.{js,json,wxml,wxss}`
- Create: `pages/debt-detail/index.{js,json,wxml,wxss}`
- Create: `tests/finance-service.test.js`

**Interfaces:**
- Produces: `createFinanceService(repository)`
- Produces: `listLoans(): Array<LoanViewModel>`
- Produces: `recordLoanPayment(input): LoanPayment`
- Produces: `listDebts(direction): Array<DebtViewModel>`
- Produces: `recordDebtPayment(input): DebtPayment`

- [ ] **Step 1: 编写贷款和欠款联动失败测试**

验证登记房贷还款后剩余本金更新，并在用户选择时生成一条支出；验证欠款分次还款后余额与状态更新。

- [ ] **Step 2: 运行确认失败**

Run: `npm test -- tests/finance-service.test.js`

Expected: FAIL，提示财务服务不存在。

- [ ] **Step 3: 实现服务和四个页面**

贷款和欠款使用不同标题、图标、方向标签与字段。详情页展示还款记录时间线。删除操作必须二次确认。

- [ ] **Step 4: 运行全量测试**

Run: `npm test`

Expected: PASS，0 failures。

- [ ] **Step 5: 提交**

```powershell
git add services/finance-service.js pages/loans pages/loan-detail pages/debts pages/debt-detail tests/finance-service.test.js
git commit -m "feat: implement loans and debts"
```

---

### Task 9: 微信登录与云同步

**Files:**
- Create: `domain/sync.js`
- Create: `services/sync-service.js`
- Create: `utils/cloud.js`
- Create: `cloudfunctions/login/index.js`
- Create: `cloudfunctions/login/package.json`
- Create: `cloudfunctions/sync/index.js`
- Create: `cloudfunctions/sync/package.json`
- Create: `tests/sync.test.js`
- Create: `tests/sync-service.test.js`
- Create: `docs/cloud-setup.md`

**Interfaces:**
- Produces: `mergeEntity(local, remote): MergeResult`
- Produces: `createSyncService({ repository, cloud, config })`
- Produces: `loginAndSync(): Promise<SyncResult>`
- Produces: `syncPending(): Promise<SyncResult>`

- [ ] **Step 1: 编写冲突合并失败测试**

```js
test('keeps the newer entity and preserves tombstones', () => {
  assert.equal(mergeEntity(olderLocal, newerRemote).winner, 'remote');
  assert.equal(mergeEntity(activeLocal, newerDeletedRemote).entity.deleted, true);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npm test -- tests/sync.test.js`

Expected: FAIL，提示同步领域模块不存在。

- [ ] **Step 3: 实现纯同步规则并通过测试**

以 `updatedAt` 较新者为准；时间相同且内容不同保留本地并返回 `conflict: true`；墓碑参与相同规则。

- [ ] **Step 4: 编写同步服务失败测试**

使用注入的伪云适配器，验证云环境关闭时不调用云端、首次登录上传 pending 数据、失败时保留 pending、成功后更新游标和 synced 状态。

- [ ] **Step 5: 实现同步服务和云函数**

`login` 云函数返回 `OPENID`。`sync` 云函数按集合批量接收变更，通过 `_openid + id` 定位实体，合并后返回游标之后的变更。客户端无环境 ID 时返回 `{ mode: 'local' }`。

- [ ] **Step 6: 编写云配置文档**

文档明确说明填写 `project.config.json` 的 AppID、填写 `config/env.js` 的环境 ID、部署两个云函数、创建十个集合及设置仅创建者可读写的权限。

- [ ] **Step 7: 运行全量测试**

Run: `npm test`

Expected: PASS，0 failures。

- [ ] **Step 8: 提交**

```powershell
git add domain/sync.js services/sync-service.js utils/cloud.js cloudfunctions tests docs/cloud-setup.md
git commit -m "feat: add optional cloud synchronization"
```

---

### Task 10: 工程验收与发布准备

**Files:**
- Create: `scripts/validate-project.js`
- Create: `tests/navigation.test.js`
- Create: `README.md`
- Create: `docs/qa/native-miniprogram-review.md`

**Interfaces:**
- Produces: 可重复执行的结构、页面注册、资源引用和配置校验
- Produces: 导入、运行、测试和云配置说明

- [ ] **Step 1: 编写导航失败测试**

验证五个导航项的路径、中央记账按钮、全部页面 JSON 和 WXML 文件存在，且页面路径与 `app.json` 一致。

- [ ] **Step 2: 运行确认失败**

Run: `npm test -- tests/navigation.test.js`

Expected: FAIL，直到所有导航和页面资源完整。

- [ ] **Step 3: 实现工程校验脚本并补齐说明**

校验不存在未注册页面、缺失组件、无效相对资源路径和未替换的阻断配置。README 提供微信开发者工具导入步骤，并说明无 AppID 时可使用测试号或本地模式预览。

- [ ] **Step 4: 执行最终自动验证**

Run: `npm run check`

Expected: 全部测试 PASS，0 failures，0 warnings。

Run: `node scripts/validate-project.js`

Expected: 输出 `Project validation passed: 10 pages, 5 tabs, cloud optional.`

- [ ] **Step 5: 在微信开发者工具中执行视觉检查**

依次检查 10 个页面，记录 375px 与常见较窄屏幕下的布局、表单保存、页面刷新、删除确认、预算联动、还款联动和云环境缺失状态。将结果写入 `docs/qa/native-miniprogram-review.md`。

- [ ] **Step 6: 提交**

```powershell
git add scripts tests/navigation.test.js README.md docs/qa/native-miniprogram-review.md
git commit -m "test: verify native miniprogram"
```

