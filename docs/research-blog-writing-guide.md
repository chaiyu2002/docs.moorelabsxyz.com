---
sidebar_position: 3
---

# Research Blog Writing Guide

This guide defines how MooreLabsxyz writes research posts about Lyquor, DEXs,
prediction markets, and financial infrastructure. Hyperliquid, HyperEVM, and
HyperCall remain important reference cases, but the method applies to any mature
product, protocol, or real business problem.

The blog is the canonical long-form research record. It should preserve the full
argument, primary sources, diagrams, evidence, limitations, and open questions.
It is not a changelog, a product announcement channel, or a rewritten version of
another project's documentation.

## Research Identity and Audience

Moore researches what could be built on Lyquor and what business and technical
problems such systems would need to solve. Moore is not the Lyquor project team
and does not publish Lyquor's roadmap, implementation commitments, or official
conclusions.

Use language that preserves that boundary:

- `MooreLabsxyz is exploring...`
- `Our analysis suggests...`
- `If this were implemented on Lyquor...`
- `Lyquor's current model creates a possible design space for...`
- `This remains an open question` or `This is a design hypothesis`.

Without direct evidence, do not write `We are building Lyquor`, `our runtime`,
`Lyquor is launching`, or `Lyquor will support`. A post does not need a repeated
disclaimer, but its pronouns, ownership language, and certainty must not imply
that Moore speaks for Lyquor.

Write first for:

- DEX, protocol, and onchain-infrastructure developers;
- matching, risk, oracle, clearing, and settlement engineers;
- market builders, market makers, and financial-application operators;
- technical product managers and researchers studying financial infrastructure.

Do not optimize the editorial line for price predictions, short-term sentiment,
unsupported grand narratives, generic crypto trends, or project news unrelated
to Moore's Lyquor research.

## Editorial Thesis

The recurring research question is:

```text
How does a mature product or real financial business solve a concrete problem,
and what would be different, unresolved, or newly possible if that business were
implemented on Lyquor?
```

The content path is:

```text
reader problem
  -> how an existing product or service handles it
  -> why that design works and where its boundary lies
  -> what changes on Lyquor
  -> Moore's original judgment
  -> evidence, production gap, and open question
```

The mature product gives readers a familiar entry point. The implementation
differences and open questions hold their attention. Moore's original judgment
builds a distinct research position, while prototypes and verification build
trust.

## Select a Worthwhile Question

Before drafting, fill in a compact topic card:

```text
Target audience:
Reader problem:
One-sentence thesis:
Original artifact:
Primary sources:
Lyquor relevance:
Unresolved boundary:
Desired discussion or CTA:
```

A publishable topic should answer all of these questions:

1. Who specifically needs this analysis, and why now?
2. What judgment does it add beyond summarizing official documentation?
3. Why does the problem matter when building a DEX or financial service on Lyquor?
4. How would the Lyquor implementation differ from an existing product, protocol,
   chain, exchange, or cloud service?
5. Which claims have primary sources, code, design material, or experimental data?
6. Which conclusions remain hypotheses or candidate designs?
7. What concrete discussion or next action should the post create?

If the post has no answer to question 2, it is probably information aggregation.
If it has no answer to questions 3 and 4, it is unlikely to establish Moore's
distinct Lyquor research value.

## One Post, One Main Thesis

Each article should resolve one primary question or defend one primary judgment.
The title should express that question, conflict, or conclusion:

- `What Would It Take to Build a Prediction Market on Lyquor?`
- `Where Should a Prediction-Market Order Book Live?`
- `Putting Matching in an Instance Does Not Solve Finality`
- `What trade[XYZ] Reveals About Market Operations`

Current blog listings display the frontmatter `title` without automatically
adding the date. To remain consistent with existing posts, use a short `MM-DD`
prefix, then keep the rest of the title compact. Do not make one title carry the
date, product, business object, architecture vocabulary, and full conclusion.

## Deliver the Value Early

Within the first 100 English words, state:

```text
the business or technical problem
  -> why the common understanding is incomplete
  -> the article's central judgment
```

Do not open a research post with the date Moore began studying the topic, an
internal project phase, a long product history, or an abstract definition of
Lyquor. Those details can follow after the reader knows why the question matters.

Place one minimal visual model in the first 20% when a relationship is easier to
understand visually. Good candidates include a state machine, fast path versus
slow path, responsibility boundary, mechanism comparison, or the relationship
between data, attestation, and settlement. Each visual should explain one main
relationship and remain legible on mobile.

## Recommended Argument Structure

Use three to five main sections and adapt this sequence to the question:

```text
1. What is the problem?
2. How does a mature product handle it, and why does that design work?
3. Which requirement or failure mode remains unresolved?
4. What design space does Lyquor create?
5. What does current evidence support, what is missing for production,
   and what question comes next?
```

Do not force the business model, protocol mechanics, every architecture detail,
and the commercial model into one post. Split the work when a section introduces
a second thesis.

End with one takeaway and one CTA. The CTA may point to a related Moore analysis,
a prototype or test, relevant Lyquor documentation, one concrete design question,
or a request for a specific case. Do not combine several unrelated requests.

## Evidence and Claim Discipline

Every material claim should be recognizable as one of the following:

| Claim type | How to write it |
| --- | --- |
| External fact | Cite an official or primary source close to the claim |
| Moore observation | State what was observed in code, documentation, data, or a test |
| Inference | Explain how the evidence leads to the judgment |
| Lyquor mapping | Describe a possible implementation without presenting it as current behavior |
| Open question | State the missing evidence, unresolved tradeoff, or production risk |

Prefer primary documentation, repositories, specifications, and direct data. Use
secondary sources for context, not as the sole support for an architectural or
product-capability claim. Check that sources still describe the current product
before publication.

Each article must add at least one original artifact or finding, such as:

- a responsibility or security-boundary table;
- a state machine or minimal architecture diagram;
- a set of unresolved design questions;
- a conclusion produced by cross-checking primary sources;
- code, a test, or a reproducible prototype;
- performance, cost, or reliability evidence;
- a counterexample showing why an intuitive claim fails.

## Causal and Narrative Coherence

Individually accurate sentences can still imply an unsupported causal
relationship when placed together.

Preserve this chain explicitly:

```text
external fact
  -> mechanism or business requirement
  -> Moore inference
  -> Lyquor candidate mapping
  -> unresolved question
```

Do not attribute a behavior introduced by the Lyquor mapping to the external
reference system. If a conclusion depends on an unstated assumption, state the
missing bridge.

At paragraph level, each sentence should state a claim, supply evidence or a
mechanism, explain an implication, or introduce the next question. When the
subject changes from the reference system to Lyquor, name the new subject rather
than relying on adjacency or an ambiguous pronoun.

Use connectors such as `because`, `so`, `therefore`, `but`, and `which raises
the question` only when the preceding sentence supports that relationship.

## Mapping External Systems to Lyquor

Start with the external business shape, not a component-by-component vocabulary
match. Identify:

- the specialized infrastructure the product depends on;
- where liquidity, account state, collateral, risk, and settlement live;
- why an application must be close to the trading or financial system;
- which responsibilities belong to the application layer rather than matching;
- which external integrations developers, market makers, or operators require.

Then map those requirements to Lyquor's model:

```text
Lyquor = sequenced Lyquid network applications
       + shared network state
       + runtime capabilities
```

Keep these concepts separate:

```text
Lyquid applications = business modules such as Match, Clear, Risk, Oracle,
                      Margin, and Liquidation

Runtime capabilities = execution, calls, state access, permissions, and
                       integration services that let applications coordinate
```

Do not reduce Lyquor to another EVM-compatible chain, and do not claim it is better
merely because it is different. Tie every comparison to a concrete requirement:
sequencing, shared state, risk logic, settlement, recovery, data availability,
withdrawal safety, or external integration.

### Hyperliquid Reference Pattern

For Hyperliquid-style applications, preserve this distinction:

```text
HyperCore = specialized trading infrastructure built by Hyperliquid
Lyquor     = a design space in which developers may build specialized
             trading infrastructure as coordinated applications
```

Read HyperEVM fairly: it provides a programmable application surface around
specialized trading infrastructure. The stronger Lyquor argument is not that
HyperEVM is "just EVM," but that a different application and execution model may
place matching, clearing, risk, margin, liquidation, and settlement in ordered,
shared-state modules. The post must still examine the tradeoffs and production
gaps of that direction.

For HyperCall, the important question is not only that it trades options. Options
depend on hedging liquidity, collateral state, margin logic, liquidation, oracle
workflows, settlement, and market-maker interfaces. Analyze those requirements
before proposing a Lyquor mapping.

## Length and Editing

Use length as a consequence of the question, not a quality target:

| Format | Suggested length | Best for |
| --- | ---: | --- |
| Research Note | 500–800 English words | One concept, fact check, or design question |
| Standard Analysis | 1,000–1,600 English words | Product mechanics, architecture mapping, and boundaries |
| Flagship Research | 1,600–2,200 English words | Multiple original artifacts and independent evidence |

If a 2,000-word draft adds no evidence, model, or judgment beyond its 1,000-word
version, shorten it. Remove repeated context, internal process detail, and claims
that do not advance the thesis.

## Frontmatter and Publication Format

English is the source article and belongs in `blog/YYYY-MM-DD/index.md`. The
Chinese translation belongs in
`i18n/zh-Hans/docusaurus-plugin-content-blog/YYYY-MM-DD/index.md`; do not replace
the English source with Chinese.

New or substantially rewritten posts should include:

```yaml
---
slug: a-short-descriptive-slug
title: MM-DD A Compact Question or Judgment
date: YYYY-MM-DD
authors: [andy]
tags: [lyquor, architecture]
description: One page-specific sentence explaining what the reader will learn.
image: /img/blog/topic-social-card.png
keywords: [lyquor, prediction markets, order book]
---
```

Use a page-specific `description`, a distinct and mobile-legible social image, and
only keywords that occur naturally in the article. Add `<!-- truncate -->` after
the opening delivers enough value to work as the blog-list excerpt. Add relevant
internal links so the post has a clear place in Moore's research path.

The Chinese version should preserve the technical meaning, evidence boundaries,
links, and CTA. It may reorganize sentences for Chinese readers rather than
translate word for word. Keep project vocabulary and identifiers consistent.

## Publication Checklist

- [ ] The target reader, reader problem, and one-sentence thesis are explicit.
- [ ] The title states one question or judgment and remains compact after `MM-DD`.
- [ ] The first 100 words explain why the post is worth reading.
- [ ] The post contains at least one original artifact, finding, or verification.
- [ ] External facts use official or primary sources.
- [ ] Facts, observations, inferences, candidate designs, and open questions are distinguishable.
- [ ] Every causal transition is supported; the external reference is not
      credited with behavior introduced only by the Lyquor mapping.
- [ ] Claims about Lyquor match its current evidence and maturity.
- [ ] Pronouns and ownership language do not imply Moore is the Lyquor team.
- [ ] The key difference from the existing product or service is explained.
- [ ] A visual, if used, expresses one relationship and is readable on mobile.
- [ ] Frontmatter includes a specific `description`, `image`, and relevant metadata.
- [ ] `<!-- truncate -->` creates a useful list-page excerpt.
- [ ] Relevant internal links are present.
- [ ] The ending contains one takeaway and one CTA.
- [ ] The CTA follows directly from a problem, finding, or unresolved issue
      established in the preceding section.
- [ ] English and Chinese versions preserve the same technical meaning and boundaries.
