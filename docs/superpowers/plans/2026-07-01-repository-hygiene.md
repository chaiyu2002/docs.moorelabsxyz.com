# Repository Hygiene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up repository hygiene for the MooreLabsxyz Docusaurus site while keeping the site behavior and content stable.

**Architecture:** This is a configuration and metadata cleanup. The repository will use `.gitattributes` for deterministic LF line endings, npm as the documented package-management path, and trimmed Docusaurus metadata files that only contain project-owned entries.

**Tech Stack:** Docusaurus 3.9.2, React 19, npm, GitHub Pages, Markdown/YAML/CSS/JavaScript.

---

## File Structure

- Create: `.gitattributes` — repository line-ending policy for text and binary files.
- Modify: tracked text files — normalize line endings to LF after `.gitattributes` is added.
- Modify: `README.md` — replace yarn commands with npm commands.
- Modify: `blog/authors.yml` — keep only the MooreLabsxyz author entry used by posts.
- Modify: `blog/tags.yml` — keep only tags referenced by current posts.
- Modify: `src/pages/index.js` — replace placeholder `Layout` metadata.
- Inspect: `package.json`, `package-lock.json`, `yarn.lock`, `.github/workflows/deploy.yml` — confirm npm remains the canonical path and decide whether `yarn.lock` should remain untouched.

### Task 1: Add Line-Ending Policy

**Files:**
- Create: `.gitattributes`

- [ ] **Step 1: Add `.gitattributes`**

Create `.gitattributes` with this content:

```gitattributes
* text=auto eol=lf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.webp binary
*.ico binary
*.pdf binary
```

- [ ] **Step 2: Normalize tracked files**

Run:

```bash
git add --renormalize .
```

Expected: Git stages line-ending normalization according to `.gitattributes`.

- [ ] **Step 3: Inspect staged line-ending effect**

Run:

```bash
git diff --cached --stat
git diff --cached --check
```

Expected: `git diff --cached --check` exits with code 0. The stat may include many files once, because this task intentionally removes the current CRLF churn.

- [ ] **Step 4: Commit line-ending policy**

Run:

```bash
git add .gitattributes
git commit -m "Normalize repository line endings"
```

Expected: Commit contains `.gitattributes` and normalized tracked text files.

### Task 2: Align README With npm

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update install command**

Change:

```markdown
yarn
```

to:

```markdown
npm ci
```

- [ ] **Step 2: Update local development command**

Change:

```markdown
yarn start
```

to:

```markdown
npm run start
```

- [ ] **Step 3: Update build command**

Change:

```markdown
yarn build
```

to:

```markdown
npm run build
```

- [ ] **Step 4: Update deployment command**

Change:

```markdown
yarn deploy
```

to:

```markdown
npm run deploy
```

- [ ] **Step 5: Verify README diff**

Run:

```bash
git diff -- README.md
```

Expected: Diff only changes package-manager commands.

- [ ] **Step 6: Commit README update**

Run:

```bash
git add README.md
git commit -m "Document npm workflow"
```

Expected: Commit contains only `README.md`.

### Task 3: Remove Docusaurus Template Metadata

**Files:**
- Modify: `blog/authors.yml`
- Modify: `blog/tags.yml`

- [ ] **Step 1: Replace `blog/authors.yml` content**

Use this exact content:

```yaml
andy:
  name: Andy
  page: true
```

- [ ] **Step 2: Replace `blog/tags.yml` content**

Use this exact content:

```yaml
architecture:
  label: Architecture
  permalink: /architecture
  description: Architecture notes and tradeoffs

project:
  label: Project
  permalink: /project
  description: Project updates and notes

progress:
  label: Progress
  permalink: /progress
  description: Progress logs

strategy:
  label: Strategy
  permalink: /strategy
  description: Strategy notes

update:
  label: Update
  permalink: /update
  description: General updates
```

- [ ] **Step 3: Verify current post tags are covered**

Run:

```bash
rg -n "^tags:" blog
```

Expected: Every tag used by blog posts is one of `architecture`, `project`, `progress`, `strategy`, or `update`.

- [ ] **Step 4: Commit metadata cleanup**

Run:

```bash
git add blog/authors.yml blog/tags.yml
git commit -m "Remove template blog metadata"
```

Expected: Commit contains only `blog/authors.yml` and `blog/tags.yml`.

### Task 4: Replace Homepage Placeholder Metadata

**Files:**
- Modify: `src/pages/index.js`

- [ ] **Step 1: Update `Layout` metadata**

Change:

```jsx
<Layout
  title={`Hello from ${siteConfig.title}`}
  description="Description will go into a meta tag in <head />">
```

to:

```jsx
<Layout
  title={siteConfig.title}
  description="MooreLabsxyz documents project progress and research notes for a new DEX path with Lyquor.">
```

- [ ] **Step 2: Verify homepage diff**

Run:

```bash
git diff -- src/pages/index.js
```

Expected: Diff only changes `Layout` metadata.

- [ ] **Step 3: Commit homepage metadata**

Run:

```bash
git add src/pages/index.js
git commit -m "Update homepage metadata"
```

Expected: Commit contains only `src/pages/index.js`.

### Task 5: Verify npm Build Path

**Files:**
- Inspect: `package.json`
- Inspect: `package-lock.json`
- Inspect: `yarn.lock`
- Inspect: `.github/workflows/deploy.yml`

- [ ] **Step 1: Confirm workflow uses npm**

Run:

```bash
sed -n '24,35p' .github/workflows/deploy.yml
```

Expected: Output includes `cache: npm`, `npm ci`, and `npm run build`.

- [ ] **Step 2: Install dependencies if needed**

Run:

```bash
npm ci
```

Expected: Dependencies install from `package-lock.json`. If network or proxy blocks this command, record the exact error and do not claim build verification succeeded.

- [ ] **Step 3: Build the site**

Run:

```bash
npm run build
```

Expected: Docusaurus build exits with code 0 and writes static output under `build/`.

- [ ] **Step 4: Final whitespace check**

Run:

```bash
git diff --check
```

Expected: Exit code 0.

- [ ] **Step 5: Final diff review**

Run:

```bash
git status --short
git diff --stat
```

Expected: Remaining uncommitted changes, if any, are explainable. If all task commits were made successfully, working tree may only contain generated or ignored files.
