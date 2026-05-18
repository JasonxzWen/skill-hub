## Context

`html-work-reports` 当前已经完成第一阶段工程化：它不是手写 HTML 技巧，而是由 `SKILL.md` 路由、`report-input-schema.json` 输入、`create-report.mjs` 生成、`validate-html-report.mjs` 校验、模板/组件/fixtures 支撑的单文件 HTML 汇报能力。

上一轮 `polish-html-work-reports-runtime-quality` 已经把重点放在 runtime-cdn、富内容渲染、分组导航、浏览器校验和诊断脱敏上。本轮不重复这些工作，而是补上更上层的产品合同：汇报应该先服务读者判断，再决定是否需要图表、代码、Mermaid、tabs 或交互。

调研输入来自三类资料：

- HTML artifact 思路：Thariq Shihipar 的 HTML effectiveness examples 强调 HTML 可以承载比较、计划、PR review、解释、状态汇报和小型编辑界面。
- 可视化和认知原则：优先使用读者熟悉的 bar/line/table 等形式；图表只能承载一个主要信息；颜色不能是唯一编码；核心结论不能依赖 hover 或点击。
- 静态 HTML 工程约束：单文件 artifact、schema 驱动、上下文 escape/sanitize、runtime dependency pinning、SRI、browser validation、可访问性和可审计 fallback。

## Goals / Non-Goals

**Goals:**

- 让 report input 显式表达读者、任务、问题、决策、时间预算和成功标准。
- 让关键结论、数字、趋势、风险和建议可追溯到 evidence/source，而不是只靠视觉权威感。
- 为常见可视化提供受限、可校验、可访问的 chart spec，避免任意手写 SVG 成为默认路径。
- 把可访问性、安全和 trust model 写入生成与验证合同，而不是靠人工审阅补救。
- 让 AI 自动验收可以从 tasks/spec 推导：生成 fixtures、运行 validator、检查报告结构、审查 diff、给出 pass/fail。
- 保持 skill progressive loading：`SKILL.md` 只保留触发边界和核心 workflow，复杂规则放到 `references/`、`assets/`、`scripts/`。

**Non-Goals:**

- 不实现通用 dashboard 产品，也不把 `html-work-reports` 改造成 `frontend-design` 或 `web-artifacts-builder` 的替代品。
- 不默认引入 React、Tailwind、Vite、shadcn 或长期运行的 app runtime。
- 不要求所有 chat 总结生成 HTML；只有当 HTML 明显降低阅读、比较、审查或继续行动成本时才使用。
- 不在本规划阶段修改实现代码；实现需要后续明确启动 OpenSpec apply。
- 不复制外部文章或指南的大段内容进 skill；只提炼规则并保留来源链接。

## Decisions

### Decision 1: 增加 report intent，而不是只扩展 section types

新增顶层 report intent 字段，建议包括：

- `audience`: 读者角色或预期技术背景。
- `primaryQuestion`: 这份报告要回答的一个主问题。
- `decision`: 读者看完后要做的判断或动作。
- `timeBudget`: 例如 `30s`、`3m`、`8m`，用于约束密度。
- `artifactKind`: `handoff`、`review`、`status`、`research`、`decision`、`explainer`、`editor` 等。
- `successCriteria`: 读者判定报告有效的条件。

Rationale: 第一性原理上，汇报的价值是降低判断成本。先定义读者任务，才能决定该用一句话、表格、图表、代码证据还是交互控件。

Alternative considered: 继续增加 `summary-cards`、`chart`、`tabs` 等组件类型。这个方向会让组件库变丰富，但不会保证报告更好读。

### Decision 2: 增加 claim/evidence 模型

新增 `claims[]`，每个 claim 建议包含：

- `id`
- `statement`
- `kind`: `conclusion`、`risk`、`metric`、`trend`、`recommendation`、`assumption`
- `evidenceIds`
- `confidence`
- `dateRange`
- `knownLimits`

扩展 `evidence[]`，支持 `sourceUrl`、`sourceTitle`、`sourceType`、`accessedAt`、`command`、`filePath`、`line`、`extractDate`、`trustLevel`。

Rationale: HTML 很容易制造“看起来可信”的错觉。证据绑定把报告从视觉陈述提升为可审计判断。

Alternative considered: 只在 Markdown 正文里写引用链接。这样更轻，但不利于 validator 和 AI 自动验收确认关键结论是否有支撑。

### Decision 3: 图表使用受限 chart spec，并自动生成替代表格

新增 `chart` section，但限定在小型解释性图表：

- bar: 类别比较。
- line: 时间趋势。
- sparkline: 紧凑趋势提示。
- bullet: 当前值、目标和区间。
- slope: 两点变化。
- matrix: 风险、优先级或选项比较。

每个 chart 必须包含：

- `title`
- `takeaway`
- `data`
- `encoding`
- `source`
- `altText`
- `tableFallback`

Rationale: 对汇报场景，常见图表加明确结论比复杂可探索图更稳定。受限 spec 可测试、可访问、可降级。

Alternative considered: 默认引入 Vega-Lite runtime。Vega-Lite 很适合作为 grammar 参考，但默认 runtime 会增加依赖和安全面；本轮先实现受限静态 SVG/HTML 图表。

### Decision 4: 可访问性是生成合同，不是附加检查

生成器和 validator 需要覆盖：

- heading 顺序和 landmark。
- 所有交互控件有文本或 `aria-label`。
- 键盘可 focus、focus ring 可见、tab 顺序不混乱。
- 图表有 `altText`、文本 takeaways 和表格替代。
- 不用颜色作为唯一状态编码。
- 基本颜色对比度检查。
- `prefers-reduced-motion` 覆盖动画/transform。

Rationale: 汇报通常会被分享、复查、存档。可访问性同时也是可用性，尤其对密集工程报告和小屏阅读。

Alternative considered: 只做视觉截图人工检查。人工检查容易漏掉 keyboard、screen reader 和颜色编码问题，也不适合 AI 自动验收。

### Decision 5: runtime-cdn 继续允许，但升级为供应链可审计

runtime-cdn 依赖必须：

- 固定库名和版本。
- 声明 URL、用途和加载状态。
- 优先带 `integrity` 和 `crossorigin="anonymous"`。
- 在 validator 中检查缺失的 integrity 或记录明确豁免。

`pre-rendered` 继续作为高信任、离线、归档或受限网络场景的显式模式。

Rationale: 允许 CDN 是实用选择，但不能让第三方脚本成为不可追踪的隐性依赖。SRI 是浏览器原生供应链校验方式。

Alternative considered: 完全禁止 CDN。这样更安全但会降低 Codex 内即时富渲染质量，并回到手写渲染器复杂度。

### Decision 6: 引入 trust model，避免把所有输入当作同等可信

报告输入和 section 可以标注：

- `trusted-generated`: 由本地生成器或受控常量产生。
- `mixed-trust`: agent 汇总、命令输出、外部引用、用户提供 Markdown。
- `untrusted`: 日志、issue 内容、网页摘录、第三方文本。

不同 trust level 进入不同 sink 时必须使用不同 escape/sanitize 策略。validator 需要检查危险协议、事件属性、raw script、unsafe `innerHTML` 用法和诊断泄漏。

Rationale: OWASP XSS 防护的核心是按输出上下文处理数据，而不是全局过滤一次。

Alternative considered: 全部统一 DOMPurify。DOMPurify 很重要，但不能替代 HTML attribute、URL、JS、CSS 等不同上下文的编码边界。

### Decision 7: 主动阅读模式必须有静态结论

研究解释、决策矩阵和 scenario 报告可以增加：

- assumption controls
- scenario table
- model inspector
- copyable decision brief

但报告必须在不交互时仍能读懂主结论、默认假设和推荐动作。

Rationale: 好的 explorable explanation 是让读者验证和调整假设，不是把读者丢进一个没有叙事的沙盒。

Alternative considered: 把复杂内容都做成交互 editor。editor 有价值，但会提高实现、验证和可访问性成本，不适合作为普通汇报默认形态。

### Decision 8: AI 自动验收使用 fixture-driven acceptance

本变更实现时应新增至少三类 fixture：

- concise handoff: 验证没有不必要组件噪音。
- decision report: 验证 intent、claims、evidence、decision matrix、actions。
- chart/accessibility stress: 验证 chart、alt/table fallback、keyboard、contrast、source data。

AI 自动验收提示词应要求执行：

- 读取 OpenSpec change 和 docs。
- 实现前先运行 baseline focused tests。
- 按 tasks 顺序小步实现并勾选。
- 生成报告 fixture。
- 运行 validator 和 browser-required check。
- 运行 repo-level validation。
- 做 diff review，确认没有扩大 skill 路由或引入 product UI builder 行为。

## Risks / Trade-offs

- [Risk] schema 变复杂导致 agent 输入成本上升 -> Mitigation: intent/claims 字段先可选，提供最小示例和自动推断默认值。
- [Risk] chart spec 过早泛化 -> Mitigation: 只支持少量常见图表，禁止默认任意 SVG/Canvas。
- [Risk] accessibility validator 误报或覆盖不足 -> Mitigation: 先做结构性检查和关键规则，复杂 a11y 工具作为后续可选增强。
- [Risk] SRI hash 维护成本增加 -> Mitigation: runtime 依赖集中声明，升级版本时测试和 hash 一起更新。
- [Risk] 新增 trust model 与现有 sanitizer 重叠 -> Mitigation: 文档明确 sanitizer 是一种 sink 策略，不是唯一安全边界。
- [Risk] 当前还有一个 complete 但未归档的 html-work-reports change -> Mitigation: 本变更只添加后续 delta，不修改既有 complete change；实现前应重新检查 active changes。

## Migration Plan

1. 创建 OpenSpec proposal、design、spec delta、tasks 和项目说明文档。
2. 后续实现前先确认 `polish-html-work-reports-runtime-quality` 是否需要归档或保持并行。
3. 实现阶段先加 failing/expected tests 和 fixtures，不先改生成器。
4. 扩展 schema 与 generator 的默认推断，保持旧输入兼容。
5. 增加 chart rendering、claim/evidence rendering、a11y/security validation。
6. 更新 `SKILL.md` 与 `html-report-patterns.md`，把详细规则放入 references。
7. 运行 focused tests、OpenSpec validation、skill validation、repo validation。

Rollback strategy:

- 新字段保持可选；旧 fixtures 和旧报告输入继续生成。
- 若 chart generator 不稳定，保留 schema 和 docs，暂时禁用 chart section 渲染并返回 degraded fallback。
- 若 SRI 获取或 CDN 响应不稳定，validator 可先记录 warning，但 runtime manifest 仍必须存在。

## Open Questions

- 是否在本轮实现中引入 `axe-core`，还是先保持轻量自研 a11y checks？
- chart SVG 是否全部由本地生成器静态输出，还是允许 runtime-cdn enhancement？默认建议先静态输出。
- SRI hash 是否由脚本自动抓取和更新，还是手工维护在 runtime dependency 常量中？默认建议脚本辅助、常量落库。
- 是否需要在 generated HTML 中提供“导出 Markdown brief”统一按钮？这对汇报复用有价值，但不应阻塞 P0。
