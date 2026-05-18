## Why

`html-work-reports` 已经具备 JSON 输入、生成器、模板、runtime 渲染和浏览器校验，但它的核心合同仍偏向“组件能渲染”。下一阶段需要把质量重心提升到“读者能更快做判断、追溯证据、理解风险并继续行动”，否则 HTML 只会变成更漂亮的长文档。

这次变更承接对 HTML 汇报、可视化、静态 HTML、安全与 skill 组织的调研：HTML 的价值不是装饰，而是把 agent 输出变成可扫描、可比较、可审计、可交互的轻量工作界面。

## What Changes

- 引入 report intent 合同：生成输入需要表达读者、主要问题、决策目标、时间预算、成功标准和 artifact 类型，生成器据此选择模板和信息架构。
- 引入 claim/evidence 合同：关键结论、数字、趋势、风险和建议需要绑定证据、来源、置信度、时间窗口和已知限制。
- 扩展可视化合同：新增受限 chart spec，用于生成 bar、line、sparkline、bullet、slope、matrix 等常见静态图；每个图必须有文本结论、数据表替代和来源信息。
- 强化 accessibility 合同：图表、控件、导航和富内容必须满足键盘可达、可见 focus、非颜色唯一编码、heading 顺序、文本替代和基本对比度门槛。
- 强化 runtime-cdn 安全合同：CDN runtime 依赖需要 pinned version、可审计 manifest，并优先加入 SRI 校验；高信任或归档场景保留 `pre-rendered` 路线。
- 强化 trust model：报告内容按 trusted generated、mixed-trust、untrusted 区分，生成器和 runtime 必须在正确上下文中 escape/sanitize。
- 增加主动阅读模式：研究解释和决策报告可包含 assumption controls、scenario table、model inspector 等轻量交互，但静态结论仍必须不依赖交互即可理解。
- 更新 `html-work-reports` skill 文档、schema、fixtures、生成器、验证器和项目说明，使后续实现以测试和 AI 自动验收驱动。
- Non-goals:
  - 不把 `html-work-reports` 扩成通用 frontend builder。
  - 不默认引入 React、Tailwind、Vite 或长期运行的 app runtime。
  - 不让所有总结都变成 HTML；短答、一次性命令输出和权限暂停仍走直接聊天。
  - 不在本变更中发布、推送或改变第三方资源。

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `html-work-report-generation`: 把报告生成合同从“可靠渲染 HTML”扩展为“意图驱动、证据绑定、可视化可访问、安全可审计、可自动验收的 HTML 工作汇报”。

## Impact

- Affected skill assets:
  - `.codex/skills/html-work-reports/SKILL.md`
  - `.codex/skills/html-work-reports/references/html-report-patterns.md`
  - `.codex/skills/html-work-reports/references/report-input-schema.json`
  - `.codex/skills/html-work-reports/assets/fixtures/*.json`
  - `.codex/skills/html-work-reports/assets/components/*.css`
  - `.codex/skills/html-work-reports/assets/components/*.js`
  - `.codex/skills/html-work-reports/scripts/create-report.mjs`
  - `.codex/skills/html-work-reports/scripts/validate-html-report.mjs`
- Affected docs:
  - `docs/html-work-reports-decision-quality.md`
  - `docs/skill-routing.md` only if routing wording changes.
  - `docs/codex-skill-feature-inventory.md` only if the user-facing capability summary changes.
- Affected tests:
  - `tests/htmlWorkReportsSkill.test.ts`
  - `tests/fixtures/skill-routing-cases.json` only if trigger wording changes.
- External sources considered:
  - Thariq Shihipar's HTML effectiveness examples, referenced but not copied.
  - Public visualization, accessibility, JSON Schema, SRI, and XSS guidance; implementation should cite or summarize concepts in docs, not vendor large text into skill bodies.
- Validation expectation:
  - `openspec validate advance-html-work-reports-decision-quality`
  - focused `html-work-reports` tests
  - generated fixture validation with browser-required checks where available
  - `scripts/validate-skills.ps1 -SkipExternal`
  - `bun run validate`
