---
name: pxczxn-git-guard
description: 破星辰只寻你的专属 Git 仓库治理与提交规范。用于初始化、生成、审查和维护 .gitignore / .gitattributes，识别项目资产与开发现场文件，检查敏感信息、Git 跟踪异常、分支与远程状态，并在提交、推送或创建 PR 前生成有意义、可追溯的提交。
---

# Pxczxn Git Guard v5

## 一、核心目标

保持 Git 仓库：

- 干净：只版本化真正属于项目的资产
- 可重建：源码 + 配置 + 依赖声明即可恢复开发与构建环境
- 可测试：正式测试代码与测试配置属于项目资产
- 可部署：部署、CI、迁移等正式工程链路不得被误删
- 可追溯：提交信息必须说明“改了什么”，不能只写“代码提交”
- 安全：真实秘密、运行数据、AI 工作现场不得进入远程仓库

核心原则：

> 远程 Git 仓库是项目的版本化工程资产库，不是开发现场备份盘。

> Git 只管理项目；AI / Agent 是开发环境，默认不进入项目仓库。

> 判断文件是否提交，优先看“它是不是项目的一部分”，而不是只看目录名、扩展名或模板规则。

---

## 二、规则优先级：项目事实最高

本 Skill 的所有通用规则都是默认策略，不得覆盖真实项目已经建立并使用的工程机制。

判断优先级：

```text
用户当前明确要求
        ↓
项目真实构建 / 运行 / 测试 / CI / 部署 / 发布事实
        ↓
当前仓库已有工程机制与历史约定
        ↓
本 Skill 通用默认
        ↓
模板
```

例如项目已经存在并真实使用：

- 数据库 migration / rollback / verify
- CI / CD 工作流
- 构建脚本
- 发布 / 回滚脚本
- E2E / smoke 测试
- 代码生成器
- API 契约
- 安全扫描脚本
- 必要本地二进制依赖

只要被源码、`package.json`、`pom.xml`、构建配置、CI、部署、测试或正式 README 实际引用，就属于项目工程资产，应保留。

原则：

> 模板只能补默认值，不能推翻项目事实。

---

## 三、平台无关

本 Skill 不绑定 GitHub。

适用于：

- GitHub
- Gitee
- GitLab
- 自建 Git 服务
- 其他标准 Git Remote

说明文本优先使用：

```text
远程 Git 仓库
Git 托管平台
远程仓库
```

只有确认项目正在使用特定平台时，才使用：

```text
GitHub Actions
Gitee Go
GitLab CI
```

不得因为模板习惯默认假定：

- 默认分支一定是 `main`
- 默认分支一定是 `master`
- 远程一定叫 `origin`
- 项目一定使用 GitHub Actions

---

## 四、中文优先规范

在不影响语法、工具识别和第三方约定的前提下，说明性内容优先使用简体中文。

优先中文：

- `.gitignore` 注释
- `.gitattributes` 注释
- Skill 执行结果
- Git 审查说明
- 提交说明
- AI 新增的人工可读非代码说明

保持英文 / 原格式：

- 文件名
- 路径
- 配置键
- 环境变量
- 命令
- API 字段
- 类名、方法名、变量名
- Git / Maven / npm / Docker 等固定关键字
- 第三方框架约定

原则：

> 能中文就中文，但绝不为了中文化破坏技术约定。

---

## 五、触发场景

用户要求以下任一任务时应用本 Skill：

- 初始化 Git 仓库
- 创建 / 修改 `.gitignore`
- 创建 / 修改 `.gitattributes`
- 检查仓库是否干净
- 判断哪些文件应该提交
- 清理 AI / IDE / 构建产物
- 新技术栈接入后的 Git 规则维护
- Git 提交
- Git 推送
- 创建 PR / MR 前检查
- 检查敏感信息
- 检查 tracked-but-ignored 异常
- 审查分支 / 远程配置
- 清理已经误跟踪的文件

---

# 第一部分：仓库识别

## 六、任何 Git 操作前先识别真实仓库

不要直接套模板。

优先检查：

```bash
git rev-parse --show-toplevel
git status --short --branch
git remote -v
git branch -vv
```

需要识别远程默认分支时，可检查：

```bash
git symbolic-ref --quiet --short refs/remotes/origin/HEAD
```

若远程名不是 `origin`，先根据 `git remote -v` 使用真实远程名。

必要时再使用：

```bash
git remote show <remote>
```

在修改 `.gitignore` / `.gitattributes` 前，至少识别：

- 仓库根目录
- 当前分支
- 远程名称
- 主要技术栈
- Monorepo / 单项目结构
- 构建工具
- 测试工具
- CI / 部署方式
- 数据库迁移方式
- 真实生成目录
- 运行时数据目录
- AI / IDE 工作目录

不得仅凭目录树名字做最终判断。

---

## 七、项目资产分类模型

对候选文件分三类：

### A. 项目资产：应提交

满足任一项：

- 项目源码
- 项目运行必需配置
- 构建必需配置
- 测试代码 / 测试配置
- CI / CD 配置
- 部署 / 回滚配置
- 数据库结构 / 正式迁移
- 依赖声明与锁文件
- 正式代码生成定义
- API 契约
- 项目正式维护的文档
- 业务品牌素材 / 插图 / 静态资源
- 项目实际依赖的工程脚本

### B. 开发现场：默认忽略

例如：

- AI / Agent 工作目录
- AI 输出、审查报告、截图
- IDE 私有状态
- 缓存
- 构建产物
- 测试报告
- 运行时日志
- 用户上传内容
- 临时文件
- 本地数据库
- 一次性调试输出

### C. 证据不足：先查再决定

典型目录：

```text
tools/
qa/
e2e/
scripts/
database/
sql/
docs/
doc/
prototype-specs/
assets/
public/
deploy/
config/
```

这些目录不能仅看名字决定提交或忽略。

判断依据：

1. 是否被源码引用
2. 是否被 `package.json` / `pom.xml` / Gradle 引用
3. 是否被 CI / 部署引用
4. 是否参与测试
5. 是否参与构建 / 生成
6. 是否是用户或团队正式维护资产
7. 删除后是否会导致项目无法重建、测试、部署或正确展示

原则：

> “目录名看起来像工具”不是忽略理由；“属于开发现场且与项目无关”才是。

---

# 第二部分：应该提交什么

## 八、源码

默认提交真实业务源码。

常见目录：

```text
src/
app/
pages/
components/
lib/
utils/
hooks/
services/
controller/
service/
mapper/
entity/
domain/
```

常见源码扩展名：

- Java / JVM：`.java` `.kt`
- Python：`.py`
- JavaScript / TypeScript：`.js` `.jsx` `.ts` `.tsx` `.mjs` `.cjs`
- Vue：`.vue`
- Web：`.html` `.css` `.scss` `.less`
- 脚本：`.sh` `.ps1` `.bat` `.cmd`

目录和扩展名只是线索，最终仍看项目职责。

---

## 九、必要配置

默认允许：

```text
pom.xml
build.gradle
settings.gradle
gradle.properties
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
tsconfig*.json
vite.config.*
next.config.*
eslint.config.*
tailwind.config.*
postcss.config.*
application.yml
application.yaml
Dockerfile
docker-compose.yml
.dockerignore
.editorconfig
```

以及项目实际使用的：

- CI 配置
- Nginx 配置
- 构建配置
- 部署配置
- 测试配置
- API 契约
- 代码生成配置

配置文件中如包含真实秘密，则应脱敏或改用环境变量后再提交。

原则：

> 描述“项目如何构建、运行、测试、部署”的配置属于项目本身。

---

## 十、依赖规则

提交：

- 依赖声明
- 依赖版本
- lock 文件

不提交：

- `node_modules/`
- Maven 本地缓存
- Gradle 本地缓存
- 可通过包管理器重新下载的依赖
- 随手下载的 `.jar`

### 10.1 JAR 特殊规则

`.jar` 默认不提交，但必须保留必要例外，例如：

```text
gradle/wrapper/gradle-wrapper.jar
```

以及：

- 无法通过依赖管理器获取但项目运行必需的合法本地依赖
- 用户明确要求版本化保存的必要二进制

如果 `.gitignore` 使用：

```gitignore
*.jar
```

必须检查并放行合法例外。

原则：

> 提交“需要哪些依赖”，不提交“已经下载好的依赖”；不可替代的正式项目二进制除外。

---

## 十一、正式测试属于项目资产

以下内容只要属于可重复测试体系，默认提交：

- 单元测试源码
- 集成测试源码
- E2E 测试源码
- Playwright / Cypress 配置
- 测试 helper
- 测试 fixture（无敏感数据）
- 测试依赖声明与 lock 文件
- CI 调用的测试脚本

典型：

```text
e2e/
src/test/
tests/
__tests__/
```

不得把 `e2e/`、`qa/`、`test/` 整体当作测试产物忽略。

真正应该忽略的是结果：

```text
coverage/
playwright-report/
test-results/
reports/
```

---

## 十二、Markdown 与项目文档

v5 不再使用：

```gitignore
*.md
!/README.md
```

作为通用默认。

也不再默认整体忽略：

```text
docs/
doc/
```

原因：项目文档本身可能是正式项目资产。

### 12.1 默认提交的正式项目文档

例如：

- 根 `README.md`
- 正式架构说明
- 部署说明
- API 使用说明
- 数据库迁移说明
- 贡献规范
- 用户 / 开发者正式手册
- 被项目维护流程引用的设计规范

### 12.2 默认不提交的开发现场文档

例如：

- AI 临时计划
- AI 审查报告
- 一次性 TODO
- 调试记录
- 临时任务拆解
- 临时分析结论
- Agent 输出
- 自动生成但不属于项目交付物的 Markdown

优先通过专属工作目录隔离，例如：

```text
ai-notes/
ai-output/
.agents/
.codex/
```

不要为了过滤 AI 文档而把整个项目的 Markdown 一刀切掉。

原则：

> 文档是否提交，看它是不是项目长期维护资产，不看它是不是 `.md`。

---

## 十三、原型、设计稿、图片与业务素材

区分：

### 项目正式素材：提交

例如：

```text
public/brand/
public/images/
assets/
```

只要实际被界面、构建或品牌展示使用，就属于项目资产。

### 开发审查素材：默认忽略

例如：

```text
.prototype-review/
```

以及 AI / Agent 生成的临时审查截图、比对图、测试截图。

### `prototype-specs/` / `prototype-assets/`

不得通用整目录忽略。

先判断：

- 是正式设计规范？→ 提交
- 被前端页面直接引用？→ 提交
- 只是 AI 工作流缓存 / 裁切中间产物？→ 忽略

原则：

> 正式业务视觉资产属于项目；审查过程和中间产物属于开发现场。

---

# 第三部分：数据库与工程脚本

## 十四、数据库规则

数据库规则：

> 新项目可简洁；已有正式迁移体系时，项目事实绝对优先。

### 14.1 新项目、无迁移体系

数据库尚无不可丢失真实数据，且项目没有正式 migration 体系时，可以维护：

```text
database/
├── schema.sql
└── seed.sql   # 可选
```

不要为了“看起来专业”强制制造大量迁移文件。

### 14.2 已有正式迁移体系

如果项目已经存在：

```text
sql/V001__xxx.sql
database/migrations/
rollback/
verify/
```

且被 CI、部署、脚本、checksum、版本追踪或测试真实使用，则这些文件属于正式源码。

禁止：

- 合并掉正式历史 migration
- 修改已登记为不可变的旧迁移
- 删除 rollback / verify
- 因为还在开发期就退回单 `schema.sql`
- 把整个 `database/` / `sql/` 忽略

### 14.3 seed

只放项目运行必要基础数据，例如：

- 默认角色
- 默认权限
- 系统字典
- 必要初始配置

禁止放：

- 真实用户
- 真实手机号
- 真实订单
- 真实文章 / 评论
- 生产数据
- 大量测试业务数据

### 14.4 本地数据库与 dump

默认忽略：

```text
*.db
*.sqlite
*.sqlite3
database/data/
database/backup/
*.sql.gz
```

不把完整开发 / 生产数据库 dump 当作日常源码提交方式。

核心：

> 数据库结构与正式迁移是源码；数据库真实内容是运行数据。

---

## 十五、scripts / tools / qa 分类

以下目录不能整体默认忽略：

```text
scripts/
tools/
qa/
deploy/
```

### 15.1 项目必要脚本：提交

例如：

- 构建脚本
- 启动脚本
- CI 脚本
- 数据库迁移 / 校验脚本
- 部署 / 回滚脚本
- E2E / smoke 脚本
- 代码生成器
- 项目维护工具
- 安全 / 依赖检查脚本

### 15.2 AI / 个人开发工具：默认忽略

例如：

- 专门调用 Codex / Cursor / Claude 的本地编排工具
- 读取个人任务文件的工具
- 只为 AI 生成审查图的工具
- 仅服务个人工作流且项目本身不依赖的工具

优先把这类内容放到 AI 工作目录，而不是污染项目 `tools/`。

### 15.3 一次性 / 历史脚本

先查引用。

无引用且已被正式机制完全替代时：

- 报告为历史遗留候选
- 建议移除
- 不未经用户许可自动删除

原则：

> `tools/` / `qa/` / `scripts/` 都不是黑名单，也不是无条件白名单；可重复的项目工程职责才是判断依据。

---

# 第四部分：默认忽略

## 十六、构建产物与缓存

常见默认忽略：

### Java / JVM

```text
target/
*.class
*.hprof
```

### Node / Web

```text
node_modules/
dist/
build/
out/
.next/
.vinext/
.wrangler/
.turbo/
.cache/
*.tsbuildinfo
.eslintcache
```

### 测试结果

```text
coverage/
playwright-report/
test-results/
```

不要把“测试源码”和“测试结果”混为一谈。

原则：

> 能通过项目源码 + 配置 + 依赖重新生成的输出，默认不提交。

---

## 十七、运行时数据

默认忽略：

```text
.run/
runtime/
logs/
uploads/
tmp/
temp/

*.log
*.pid
*.tmp
```

用户上传文件、头像、附件、运行日志等不得进入 Git。

---

## 十八、IDE 与 AI / Agent 工作目录

默认忽略：

```text
.idea/
.vscode/
*.iml
.classpath
.project
.settings/

.agents/
.agent/
.codex/
.cursor/
.claude/
.aider/
.windsurf/
.reasonix/
.workbuddy/

ai-notes/
ai-output/
.ai/
```

以及明确属于 AI 过程产物的：

```text
rollout-*.jsonl
.codex-*.png
```

若以后新增 AI 工具：

1. 确认目录只属于 AI / Agent 工作现场
2. 默认加入 ignore
3. 不要求用户逐个解释 AI 内部文件
4. 不扫描其内容来决定项目提交，除非用户明确要求

### 18.1 例外

如果用户明确要求某个 AI / IDE 规则作为团队项目规范提交：

- 只对白名单文件放行
- 不直接放行整个 AI / IDE 目录

原则：

> 默认把 AI 从 Git 项目资产判断中剥离，避免 AI 工作现场反向污染仓库。

---

## 十九、操作系统元数据

默认忽略：

```text
.DS_Store
Thumbs.db
Desktop.ini
```

---

# 第五部分：敏感信息

## 二十、秘密文件

无条件默认忽略：

```text
.env
.env.*
*.pem
*.key
*.p12
*.jks
```

允许：

```text
.env.example
```

但 `.env.example` 也不得包含真实秘密。

### 20.1 配置文件按内容判断

不得只因为文件名叫：

```text
application-local.yml
application-dev.yml
application-test.yml
```

就直接忽略。

没有真实秘密 → 可以提交。

有真实秘密 → 脱敏、环境变量化或忽略具体文件。

### 20.2 严重级：阻断提交

发现疑似真实：

- 密码
- Token
- Access Key
- Secret Key
- Cookie
- 私钥
- 生产数据库凭据
- 第三方服务真实密钥
- 可直接登录 / 调用服务的凭据

必须停止提交该内容，先处理秘密。

### 20.3 警告级：提醒但不直接判泄密

例如：

```yaml
password: ${APP_PASSWORD:123456}
```

或 README 中明确标识为开发环境的默认账号。

处理：

- 标记潜在危险默认值
- 提醒用户检查
- 不自动当成真实生产泄密
- 不自动删除项目配置

原则：

> “开发默认值”不一定是秘密，但仍需要安全审查。

---

# 第六部分：.gitignore / .gitattributes

## 二十一、生成与维护 `.gitignore`

流程：

1. 识别真实技术栈
2. 读取现有 `.gitignore`
3. 找真实依赖目录、构建目录、缓存、运行目录
4. 识别 AI / IDE 工作目录
5. 识别正式测试、数据库、脚本、文档和业务素材
6. 应用通用规则
7. 添加真正存在的项目专属规则
8. 删除明显重复项
9. 修复规则顺序冲突
10. 不复制项目根本不会产生的大而全模板
11. 不扩大忽略范围
12. 用 `git check-ignore` 验证关键规则

### 21.1 去重

例如已经存在：

```gitignore
node_modules/
```

通常不需要再写：

```gitignore
xingyu-admin/node_modules/
xingyu-web/node_modules/
```

同理：

```gitignore
dist/
```

已经覆盖各级普通 `dist/` 时，不重复列出每个子项目。

只有：

- 语义不同
- 需要例外
- 根 / 子目录行为不同

时才保留更具体规则。

### 21.2 关键验证

```bash
git check-ignore -v --no-index <path>
```

不要只看 `.gitignore` 文本猜结果。

### 21.3 禁止仅凭目录名整体忽略

至少包括：

```text
.github/
.gitee/
.gitlab/
database/
sql/
deploy/
scripts/
tools/
qa/
e2e/
config/
src/
docs/
doc/
prototype-specs/
public/
assets/
```

先看真实内容和引用。

---

## 二十二、`.gitattributes`

默认 Windows 开发 + Linux / Docker 运行场景：

```gitattributes
* text=auto eol=lf
```

Windows 专属批处理：

```gitattributes
*.bat text eol=crlf
*.cmd text eol=crlf
```

Shell：

```gitattributes
*.sh text eol=lf
```

PowerShell 默认可统一 LF：

```gitattributes
*.ps1 text eol=lf
```

图片、字体、压缩包、Office、PDF、音视频、编译后二进制应声明 binary。

SVG 保持文本 diff：

```gitattributes
*.svg text
```

修改后可检查：

```bash
git diff --check
```

如果刚引入 / 修改换行规则，必要时再建议：

```bash
git add --renormalize .
```

但只有用户明确要进行换行归一化时才执行，避免无关大 diff。

---

# 第七部分：分支与远程

## 二十三、分支规则

不强制 Git Flow。

先尊重当前项目实际分支策略。

### 23.1 单人 / 小项目

如果当前只有一个长期开发分支，并且没有发布分支需求，不为了“看起来专业”制造：

```text
develop
release/*
hotfix/*
feature/*
```

### 23.2 多人或发布流程

已有团队规范时按项目规范执行。

### 23.3 禁止假定默认分支

任何 CI、push、PR、保护规则说明都不得直接写死：

```text
main
master
```

应先读取真实默认分支。

---

## 二十四、远程规则

提交前 / push 前明确：

- 当前分支
- 目标远程
- 目标远程分支

不得因为用户曾用过某个 remote 名称，就永久假定它存在。

执行 push 前优先展示 / 核对等价信息：

```bash
git status --short --branch
git remote -v
git branch -vv
```

如果当前分支尚无 upstream，只有在用户任务确实要求 push 时，才根据真实远程设置 upstream。

---

# 第八部分：提交规范

## 二十五、Pxczxn Commit 格式

默认格式：

```text
【类型】范围：具体变更
```

范围可省略，但“具体变更”不能为空洞描述。

示例：

```text
【feat】社区Web：首页新增继续阅读与关注更新
【fix】后端：修复文章状态流转校验
【refactor】管理端：重构消息中心交互
【perf】社区Web：优化首页首屏请求
【test】E2E：补充登录与文章审核链路
【db】数据库：新增用户收藏迁移
【ci】CI：增加数据库迁移校验
【build】后端：调整 Maven 构建配置
【docs】README：更新本地启动说明
【chore】仓库：清理无效忽略规则
```

### 25.1 推荐类型

```text
feat      新功能
fix       Bug 修复
refactor  重构，不改变外部行为
perf      性能优化
test      测试代码 / 测试配置
db        数据库结构 / 迁移
ci        CI / CD
build     构建系统 / 依赖构建配置
docs      正式项目文档
style     仅格式 / 样式，不改逻辑
chore     仓库维护 / 杂项
revert    回滚
```

### 25.2 禁止废话提交

禁止：

```text
【feat】代码提交
【fix】修复bug
【chore】更新
修改代码
代码更新
提交一下
update
fix bug
```

提交标题必须回答：

> 这次提交到底改变了什么？

### 25.3 提交标题生成流程

生成 commit message 前：

1. 读取 staged 文件
2. 阅读 staged diff
3. 判断主要变更意图
4. 判断是否需要范围
5. 选择准确类型
6. 用用户能看懂的中文描述具体变化

不得只根据文件数量、目录名或用户一句“提交一下”生成空洞标题。

---

## 二十六、原子提交

按“变更意图”拆分，不按目录机械拆分。

### 应放同一提交

例如一个完整功能同时修改：

- 前端
- 后端
- SQL
- 测试

这些共同构成一个不可分割功能闭环，可放在同一原子提交。

### 应拆分

例如同时存在：

- 首页新功能
- 无关 README 大改
- 独立依赖升级
- 另一个模块 Bug 修复

应分开提交。

原则：

> 一个提交对应一个清晰、可解释、可回滚的变更意图。

---

# 第九部分：暂存、检查、提交、推送

## 二十七、暂存前检查

先看：

```bash
git status --short --branch
git diff --name-status
```

不要为了“清空工作区”无脑：

```bash
git add .
git commit
```

如果使用 `git add .`，必须满足：

- `.gitignore` 已确认正确
- staged files 会再次审查
- 没有用户不想提交的独立改动

更推荐按原子提交意图选择性暂存。

---

## 二十八、提交前强制检查

### 28.1 Staged 文件

```bash
git diff --cached --name-status
```

### 28.2 Staged diff

```bash
git diff --cached
```

大型 diff 可按文件 / 模块检查，但不得完全跳过。

### 28.3 空白与冲突标记检查

```bash
git diff --cached --check
```

出现错误时先处理再提交。

### 28.4 已被跟踪但现在被 ignore 的异常

```bash
git ls-files -ci --exclude-standard
```

有输出时必须报告。

它常用于发现：

- 以前误提交的构建产物
- 以前误提交的 AI 文件
- 已经加入 ignore 但仍被跟踪的目录

### 28.5 Ignore 原因

必要时：

```bash
git check-ignore -v --no-index <path>
```

### 28.6 敏感信息检查

检查 staged 文本内容，而不只是文件名。

重点关注：

- 密钥格式
- Token
- Access Key
- Secret
- 私钥
- Cookie
- 数据库密码
- 云服务凭据
- `.env`

对于 `admin/admin123`、`root/root` 等开发默认值：

- 根据上下文判断
- 默认警告
- 不未经证据直接声称泄密

### 28.7 项目资产误删检查

确认没有因为 `.gitignore` 调整误删 / 误忽略：

- 正式 migration
- E2E 测试
- CI 配置
- 项目脚本
- 正式项目文档
- 业务图片 / 品牌素材
- 代码生成定义

---

## 二十九、提交执行

只有 staged 内容审查完成后再 commit。

提交消息使用本 Skill 第 25 节规范。

提交完成后至少检查：

```bash
git status --short --branch
```

需要验证提交内容时：

```bash
git show --stat --oneline HEAD
```

不得在 commit 失败时假装成功。

---

## 三十、Push 前检查

用户明确要求 push / sync / 上传远程时：

1. 确认本地提交成功
2. 确认当前分支
3. 确认远程
4. 确认目标分支
5. 确认工作区没有被遗漏的本次必要改动
6. 再执行 push

Push 后根据实际命令结果报告成功 / 失败。

不得仅因为 `git commit` 成功就声称已经同步远程。

---

# 第十部分：错误跟踪与危险操作

## 三十一、已被 Git 跟踪的错误文件

`.gitignore` 不会自动停止跟踪已经进入 Git 的文件。

发现 tracked-but-ignored 时先报告。

只有任务明确包含清理，或用户明确同意，才执行类似：

```bash
git rm -r --cached <path>
```

不得删除用户本地实际文件。

如果是大量规则调整，可使用更精确的 path 操作；不要为了省事直接大范围清空 index 再重加，除非确有必要并已说明影响。

---

## 三十二、危险 Git 操作

以下属于高风险操作：

```text
git reset --hard
git clean -fd
git clean -fdx
git checkout -- <file>
git restore --source ...
git push --force
git push --force-with-lease
rebase 已公开历史
删除分支 / tag
覆盖远程历史
```

规则：

- 不为了“清理工作区”自动执行
- 不为了让测试通过丢弃用户改动
- 不为了提交方便强制重写历史
- 需要执行时必须明确任务确实要求它，并说明会影响什么
- 优先选择可恢复、非破坏性方式

原则：

> Git Guard 的职责是保护项目历史，不是为了“看起来干净”牺牲用户改动。

---

# 第十一部分：新技术栈与模板

## 三十三、新技术栈接入

项目增加新技术 / 工具后，检查它是否产生：

- 新依赖目录
- 构建目录
- 缓存
- 测试报告
- 扫描报告
- 本地数据库
- 运行时文件
- 新秘密配置
- 新二进制依赖
- 新 AI 工作目录

只添加项目真实需要的规则。

不要为了“模板完整”加入项目根本不会产生的 50 条 ignore。

---

## 三十四、默认模板

默认模板：

```text
templates/.gitignore
templates/.gitattributes
```

使用原则：

- 模板是起点，不是最终答案
- 已有规则优先审查后增量修改
- 删除明显重复项
- 不机械覆盖项目专属规则
- 不把模板中未使用技术栈强行塞进仓库

---

# 第十二部分：最终决策与输出

## 三十五、最终判断口诀

对任何文件依次判断：

1. 是 AI / Agent / IDE 私有工作现场吗？→ 默认忽略
2. 是真实秘密吗？→ 阻断提交
3. 是项目源码吗？→ 提交
4. 是项目运行 / 构建 / 测试 / 部署必需配置吗？→ 提交
5. 是依赖声明或 lock 吗？→ 提交
6. 是正式测试源码 / 配置吗？→ 提交
7. 是正式数据库结构 / migration 吗？→ 提交
8. 是项目正式工程脚本吗？→ 提交
9. 是长期维护的项目文档吗？→ 提交
10. 是实际使用的品牌 / 业务素材吗？→ 提交
11. 是构建 / 测试结果、缓存或运行数据吗？→ 忽略
12. 能完全重新生成且不属于正式源码吗？→ 忽略
13. 只属于本机或个人工作流吗？→ 忽略
14. 目录职责不清楚吗？→ 查引用，不猜
15. 项目已有正式机制吗？→ 项目事实优先

---

## 三十六、执行结果输出要求

执行本 Skill 后，用简体中文简洁说明：

- 当前仓库 / 技术栈识别结果
- 当前分支与远程
- `.gitignore` 新增、删除、去重或修复了什么
- `.gitattributes` 换行策略
- AI / IDE 工作目录如何处理
- 是否发现构建 / 运行 / 测试产物
- 是否发现敏感信息或危险默认值
- 是否发现 tracked-but-ignored
- 是否发现被粗暴忽略的项目资产
- 是否发现正式 migration / E2E / CI / 工程脚本
- staged 变更对应的提交意图
- 最终 commit message
- push 是否真实成功

不要为了记录执行过程额外创建 Markdown 报告。

不要生成与任务无关的文档。

---

# v5 最重要的五条

1. **Git 管项目资产，AI 工作现场默认全部隔离。**
2. **项目事实 > 通用规则 > 模板。**
3. **`tools/`、`qa/`、`e2e/`、`docs/`、`prototype-specs/` 等不能只凭名字判死刑。**
4. **提交必须从 staged diff 生成具体中文语义，禁止“代码提交 / 更新 / 修复bug”。**
5. **提交前固定检查 `git diff --cached --check` 与 `git ls-files -ci --exclude-standard`。**
