# 微信云开发配置

叮叮记账默认以本地模式运行。完成以下配置后，“我的”页面会启用微信登录和自动同步。

## 1. 填写小程序 AppID

在微信公众平台注册小程序后，将 `project.config.json` 中的 `appid` 从 `touristappid` 改为实际 AppID。

## 2. 创建云环境

使用微信开发者工具打开项目，在“云开发”中创建环境。复制环境 ID，填写到 `config/env.js` 的 `CLOUD_ENV_ID`。

## 3. 创建数据库集合

在云开发控制台创建以下集合：

- `books`
- `transactions`
- `accounts`
- `categories`
- `budgets`
- `loans`
- `loanPayments`
- `debts`
- `debtPayments`
- `syncMeta`

集合权限设置为“仅数据创建者可读写”。云函数通过 `_openid` 再次限制数据归属。

## 4. 部署云函数

在开发者工具中分别右键：

- `cloudfunctions/login`
- `cloudfunctions/sync`

选择“上传并部署：云端安装依赖”。部署完成后重新编译小程序。

## 5. 验证

进入“我的”，点击“微信登录”。首次登录会上传本机待同步数据并拉取云端数据。成功后状态显示“云端已同步”；网络异常时显示“待同步”，本地记账不受影响。

同步冲突默认保留 `updatedAt` 较新的记录。删除采用 `deleted: true` 标记，避免旧设备恢复已删除内容。
