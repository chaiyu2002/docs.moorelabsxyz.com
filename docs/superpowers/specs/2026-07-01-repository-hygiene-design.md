# Repository Hygiene Design

Date: 2026-07-01

## Goal

Clean up the Docusaurus documentation repository so future reviews and deploys are easier to trust. The change is intentionally limited to repository hygiene and template cleanup, not a redesign of the site or a rewrite of project content.

## Scope

- Add a repository line-ending policy so text files normalize to LF and stop producing whole-file CRLF diffs.
- Normalize existing text files after the policy is added.
- Keep npm as the canonical package manager because the GitHub Pages workflow already uses `npm ci` and `npm run build`.
- Update README commands to match npm.
- Remove Docusaurus sample authors and sample tags that are not used by the MooreLabsxyz posts.
- Replace placeholder homepage metadata with MooreLabsxyz-specific title and description.

## Out Of Scope

- Adding new site sections or changing the visual design.
- Rewriting blog post content.
- Changing the deployment target, domain, analytics ID, or Docusaurus version.
- Removing `yarn.lock` unless implementation confirms it is safe and consistent with the npm-only decision.

## Implementation Notes

Use a minimal `.gitattributes` file to set text normalization. After adding it, re-normalize tracked text files so the diff reflects real content changes instead of line-ending churn. Keep edits small and reviewable.

For author and tag metadata, keep `andy` and the tags currently referenced by blog posts. Remove unused Docusaurus template entries such as example authors and placeholder tags.

For homepage metadata, keep the current simple hero and Lyquor link. Only replace the generic `Hello from...` title and placeholder description used in the `Layout` component.

## Verification

- Run `git diff --check` to catch whitespace and line-ending problems.
- Run `npm ci` if dependencies are missing or incomplete.
- Run `npm run build` to verify Docusaurus can produce the static site.
- Inspect `git diff --stat` to confirm the final diff is explainable and not dominated by accidental line-ending churn.
