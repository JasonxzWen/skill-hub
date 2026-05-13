# Harness 使用说明

这个目录保存 agent 工作流需要的状态、验证和交接文件。根目录只保留 `AGENTS.md`，其余文件集中在这里，避免仓库根目录变得杂乱。

## 文件分工

| 文件 | 用途 |
| --- | --- |
| `init.sh` | 进入项目后的标准初始化、验证和启动提示。 |
| `feature_list.json` | 功能清单、状态、验证步骤和证据。 |
| `progress.md` | 跨会话进度日志和当前已验证状态。 |
| `session-handoff.md` | 长会话结束时给下一轮的交接摘要。 |
| `clean-state-checklist.md` | 收尾前检查仓库是否可恢复、可验证。 |
| `evaluator-rubric.md` | 阶段性验收或复审评分表。 |
| `quality-document.md` | 代码库与 harness 质量快照。 |

## 使用方式

1. 先按项目实际情况修改 `init.sh` 顶部的安装、验证和启动命令。
2. 把 `feature_list.json` 里的示例功能替换成真实功能。
3. 每次会话开始先读 `progress.md` 和 `feature_list.json`。
4. 每次会话结束前更新状态和证据，不要留下无法恢复的半成品。

## 状态规则

- `not_started`：还没开始。
- `in_progress`：当前唯一正在做的功能。
- `blocked`：因为已记录 blocker 无法继续。
- `passing`：验证已经通过，证据已经记录。

同一时间只允许一个功能处于 `in_progress`。
