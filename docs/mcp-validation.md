# MCP Validation Notes

Date: 2026-05-07

The project-local Codex config at `.codex/config.toml` defines six MCP entries from the ECC reference baseline.

## Configured MCP Servers

| Server | Config style | Validation result |
|---|---|---|
| GitHub | `npx -y @modelcontextprotocol/server-github` | npm package resolves: `2025.4.8` |
| Context7 | `npx -y @upstash/context7-mcp@latest` | npm package resolves: `2.2.4` |
| Exa | remote URL `https://mcp.exa.ai/mcp` | endpoint reachable; GET/HEAD return `405`, which means the host is reachable but expects MCP-compatible requests |
| Memory | `npx -y @modelcontextprotocol/server-memory` | npm package resolves: `2026.1.26` |
| Playwright | `npx -y @playwright/mcp@latest --extension` | npm package resolves: `0.0.74` |
| Sequential Thinking | `npx -y @modelcontextprotocol/server-sequential-thinking` | npm package resolves: `2025.12.18` |

## Local Tooling

| Tool | Result |
|---|---|
| Node.js | Available: `v22.15.0` |
| npx | Available: `10.9.2` |
| Python | Available: `3.13.3` |
| OpenSpec | Available outside the sandbox: `1.2.0` |
| Codex CLI | `codex.exe` is present but access is denied in this desktop sandbox |

## Notes

- Starting MCP servers directly from validation scripts is misleading because many MCP processes are long-running and will appear to hang.
- The local validator therefore checks TOML syntax, npm package resolution, and endpoint reachability rather than trying to run each server indefinitely.
- Credentials still need to be supplied by the user's environment where applicable, especially GitHub and Exa.
