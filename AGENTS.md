# Universal Agent Rules

Keep global rules small. Project-specific instructions belong in the repo `AGENTS.md` or a skill.

## Defaults

- Follow Apple-first design principles when working on iOS or mobile UI.
- Use Bun instead of npm unless a repo explicitly requires another tool.
- Do not start dev servers unless the user explicitly asks; inspect existing sessions instead.

## Git

- Commit frequently after each logical change.
- Use `committer "message" file1 file2`; never use raw `git add && git commit`.
- Never pass `.` to `committer`; list every intended file explicitly.
- Never push unless explicitly asked.
- Never amend, reset, rebase, force-push, or rewrite history unless explicitly asked.
- Dirty worktrees are normal. Commit only files intentionally changed for the task and do not revert unrelated changes.

## Efficiency

- Prefer focused validation over repo-wide checks while iterating.
- Run heavier checks at task boundaries, before shipping, or when the repo instructions require them.
