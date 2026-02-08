# create-imagine

Scaffold a new Imagine project (React → scientific figures).

## Usage

```bash
# Recommended
npx create-imagine@latest my-figures

# Also works (because the package name is create-imagine)
npm create imagine@latest my-figures
```

## Templates

- `blank`: minimal starter project (no preview images)
- `example`: full starter project (includes example figures + preview PNGs)

## Options

```bash
create-imagine [targetDir]

--template blank|example
--pm npm|pnpm|yarn|bun
--install / --no-install
--skills / --no-skills
--yes
--force
--help
```

## Optional: install agent skills

This scaffolder can optionally install the `imagine-best-practices` skill into your project (under `.agents/skills/`):

```bash
npx skills add https://github.com/midhunxavier/imagine-skills --skill imagine-best-practices --agent codex
```
