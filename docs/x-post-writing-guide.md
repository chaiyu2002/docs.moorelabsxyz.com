---
sidebar_position: 2
---

# X Post Writing Guide

This guide explains how to turn a long MooreLabsxyz blog post into a short X post.
The X post should not copy the article mechanically. It should compress the article
into a public-facing summary that preserves the core technical meaning.

## Relationship Between Blog Posts and X Posts

The blog post is the canonical long-form record. It keeps the full context, meeting
details, architectural reasoning, and technical background.

The X post is the short public-facing version. It should extract the main signal
from the blog post, make the topic easy to understand quickly, and point readers
toward the larger project narrative.

The relationship is usually:

```text
internal discussion / project progress
-> blog post as long-form record
-> X post as concise public summary
```

This does not mean every paragraph in the blog needs to appear in the X post. The X
post should select the most important themes and turn them into a compact update.

## Recommended Structure

Use this structure for most project-progress X posts:

1. Start with the date and main alignment topic.
2. Name two or three concrete technical areas covered by the post.
3. Mention the near-term engineering action or architectural direction.
4. End with a broader takeaway that explains why the work matters.

For example, the February 27 blog post becomes:

```text
On Feb 27, we aligned across contract testing, execution semantics, and system
architecture.
```

This opening maps the long article into three clear themes instead of listing every
meeting detail.

## Example: February 27 Post

Source article:

```text
02-27 Contract Testing and Architecture Tradeoffs
```

The X post summarizes the article through these mappings:

| X post phrase | Blog post source idea |
| --- | --- |
| contract testing | devnet reset, ERC20 deployment, swap contract validation |
| execution semantics | order placement, order-status queries, and the unclear meaning of `new` |
| swap contract behavior | token A enters the swap contract, output token B is calculated and transferred |
| atomicity assumptions | a contract transaction succeeds or fails as a whole |
| split `clear` and `match` | near-term plan to make them separate Lyquid components |
| progress depends on alignment | broader lesson from testing, estimates, status semantics, and architecture |

The final sentence should usually be an interpretation, not a direct quote. For
the February 27 post, the public takeaway is:

```text
progress depends not just on code moving forward, but on getting execution models,
status meanings, and architectural assumptions aligned.
```

That sentence condenses several parts of the article into one higher-level point.

## Bilingual Pattern

When writing both English and Chinese versions, treat the Chinese version as an
equivalent translation of the English post, not as a separate article.

Keep technical terms in English when they are part of the project vocabulary:

- `swap`
- `new`
- `clear`
- `match`
- `Lyquid`
- `Lyquor`

This keeps the bilingual versions aligned and avoids introducing slightly different
technical meanings.

## What To Avoid

Avoid copying the first paragraph of the blog post as the X post. The first
paragraph often introduces context, but the X post needs a sharper summary.

Avoid including too many implementation details. If a detail does not support the
main public takeaway, leave it in the blog post.

Avoid making the X post sound like a changelog. It should communicate what changed,
what was clarified, and why that clarification matters.

Avoid inventing claims that are not supported by the article. The X post can
interpret, but it should stay grounded in the blog content.

## Checklist

Before publishing an X post, check:

- Does it clearly map to one blog post or one project update?
- Does it mention the main technical themes?
- Does it include the near-term action or architectural direction when relevant?
- Does the final sentence explain the broader significance?
- Do the English and Chinese versions say the same thing?
- Are project terms written consistently?
