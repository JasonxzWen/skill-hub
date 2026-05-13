# AGENTS.md

这个仓库使用轻量 harness 来支撑长时运行的 coding agent 工作流。目标不是让 agent 记住聊天记录，而是让仓库里的文件成为下一轮会话可以继续工作的事实来源。

## 开工流程

写代码前先做这些事：

1. 用 `pwd` 确认当前目录是仓库根目录。
2. 读取 `harness/README.md`，了解本仓库的 harness 文件分工。
3. 读取 `harness/progress.md`，确认当前已验证状态、最高优先级任务和 blocker。
4. 读取 `harness/feature_list.json`，选择优先级最高且未完成的功能；同一时间只允许一个功能处于 `in_progress`。
5. 用 `git status --short --branch` 和 `git log --oneline -5` 确认分支与近期改动。
6. 运行 `harness/init.sh`，如果基础验证失败，先修基础状态，不要继续叠新功能。

## 工作规则

- 一次只做一个功能，除非用户明确要求批量处理。
- 不要因为代码已经写完就宣告完成；完成必须有验证证据。
- 不要悄悄降低、跳过或删除验证步骤。
- 只修改当前目标需要的文件；发现无关问题时记录，不顺手重构。
- 优先依赖仓库内的持久化文件，不依赖聊天记录保存长期状态。
- 修改 harness 文件时，同时更新对应说明或证据，避免下一轮会话误判。

## 必需文件

- `harness/init.sh`：统一安装依赖、基础验证和启动提示入口。
- `harness/feature_list.json`：功能状态、验证步骤和证据的机器可读清单。
- `harness/progress.md`：跨会话进度日志和当前已验证状态。
- `harness/session-handoff.md`：长会话结束时的交接摘要。
- `harness/clean-state-checklist.md`：收尾前的干净状态检查。
- `harness/evaluator-rubric.md`：阶段性验收或复审用评分表。

## 完成定义

一个功能只有在以下条件都满足时才算完成：

- 目标行为已经实现。
- `harness/feature_list.json` 中对应功能的验证步骤已经真实跑过。
- 验证命令、人工检查或运行截图等证据已经记录在 `harness/feature_list.json` 或 `harness/progress.md`。
- 仓库仍然能按 `harness/init.sh` 或记录的标准验证路径重新开始工作。
- 未解决风险、跳过的路径和 blocker 已明确记录。

## 收尾流程

结束会话前：

1. 更新 `harness/progress.md` 的本轮记录。
2. 更新 `harness/feature_list.json` 的状态、证据和 notes。
3. 如本轮较长，更新 `harness/session-handoff.md`。
4. 运行 `harness/clean-state-checklist.md` 中适用的检查。
5. 只有在工作处于安全可恢复状态后，才提交或交给人工审查。
