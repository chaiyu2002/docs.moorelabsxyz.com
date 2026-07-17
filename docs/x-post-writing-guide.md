---
sidebar_position: 2
---

# X Post Writing Guide

This guide defines how MooreLabsxyz turns research and engineering work into X
posts. X is not only a distribution channel for blog links. It is also a place to
test an idea, surface a problem, enter relevant technical discussions, and collect
professional feedback.

The blog remains the canonical long-form record. An X post should select one
useful signal from that record and make it understandable without requiring a
click. It must not mechanically compress every section of the article.

## Research Identity and Claim Boundaries

Moore researches what could be built on Lyquor; it does not speak for the Lyquor
project team. Use `MooreLabsxyz is exploring`, `our analysis suggests`, `if this
were implemented on Lyquor`, or `this remains a design hypothesis` when that is
the actual evidence level.

Do not use `we` or `our` in a way that makes Moore's research sound like a Lyquor
roadmap or product commitment. Do not turn a candidate architecture into a current
capability merely to make the post sound more decisive.

## Choose the Correct Mode

X posts use two distinct modes. Choose one before drafting.

| Mode | Use it for | Best opening | Required ending |
| --- | --- | --- | --- |
| Research communication | Product analysis, mechanism explanation, architecture judgment, experiment | A conflict, counterintuitive claim, hidden responsibility, or concrete question | A specific question, evidence link, or next research step |
| Project progress | A real milestone, test result, implementation decision, or coordinated project update | The change or result; use the date only when the chronology itself matters | The near-term action or why the update matters |

Research communication is the default for Lyquor business analysis. Do not open it
with `On Jul 13, we studied...` or an internal process update. A reader should see
the problem and its significance before seeing Moore's workflow.

Project-progress posts may use chronology, but should still communicate what
changed, what was clarified, and why it matters. They should not read like raw
meeting notes or a list of completed tasks.

## Write One Complete Post

For a single research post, use this structure:

```text
conflict or counterintuitive judgment
  + why it matters
  + evidence, article, or one concrete question
```

Use 180–260 English characters as a common target, not a rigid rule. One post
should make one main judgment and remain valuable if the reader never opens its
link.

Example:

> Putting a prediction-market order book in Lyquor's instance layer may reduce
> latency. It does not solve ordering, finality, data availability, recovery, or
> withdrawal safety. These are the questions an architecture must answer: [link]

For a project-progress post, use:

```text
result or decision
  + two or three supporting technical areas
  + near-term action
  + why the change matters
```

The final sentence should interpret the update, not repeat its first sentence.

## Hooks for Technical Readers

Use precise novelty rather than exaggerated novelty. Reliable hook types include:

### Conflict

> Low-latency matching and safe withdrawal do not require the same execution path.

### Counterintuitive judgment

> Moving the order book into an instance solves latency—not consensus.

### Hidden responsibility

> trade[XYZ]'s harder capability is not matching. It is keeping external markets
> interpretable around the clock.

### Concrete question

> If fills happen in an instance, what makes the resulting DEX block canonical?

Do not use generic claims such as `Everything changes now`, unsupported superlatives,
or manufactured urgency. The body of the post must substantiate the hook.

## Turn a Complex Article into a Thread

Use a thread when the conclusion requires several independent steps. A typical
research thread has four to six posts:

1. State the problem or counterintuitive conclusion.
2. Explain why the common understanding is incomplete.
3. Show one diagram, mechanism, or decisive piece of evidence.
4. Describe Lyquor's candidate design direction.
5. State the unresolved boundary or production risk.
6. Link the blog and ask one concrete question.

Every post must contribute standalone information. Do not divide one long
paragraph at arbitrary character boundaries, repeat the same hook, or make each
post depend on an unexplained pronoun from the previous one.

When a visual is useful, make it express one relationship, use little text, and
check that labels are readable on a phone. Use video only when motion explains a
state transition or workflow better than a static image, and include captions.

## External Reference Posts

When a blog uses Hyperliquid, Polymarket, trade[XYZ], or another product as a
reference, the X post should not become a generic summary of that project. Use
this compression path:

```text
external business pattern
  -> why it works
  -> what requirement or boundary it reveals
  -> Lyquor's candidate design and unresolved question
```

For Hyperliquid, preserve this distinction:

```text
HyperCore = specialized trading infrastructure
Lyquor     = a possible design space for developers to build specialized
             trading infrastructure as coordinated applications
```

Do not reduce HyperEVM to `just EVM`. Explain its real role as a programmable
surface around specialized trading infrastructure, then identify the different
design path Lyquor may offer.

For HyperCall, do not stop at `it is an options venue`. The useful signal is why
options require hedging liquidity, collateral state, margin, liquidation, oracle
workflows, settlement, and market-maker interfaces to remain close to the same
financial system.

When mentioning Lyquor runtime capabilities, keep business applications and
runtime services separate:

```text
Match, Clear, Risk, Oracle, Margin, and Liquidation are Lyquid applications.
Execution, calls, state access, permissions, and integrations are runtime capabilities.
```

## Build a Content Package, Not a Long Summary

One research project may yield several posts with different entry points:

```text
the problem
the mechanism
the incorrect intuition
the diagram
the Lyquor hypothesis
the unresolved boundary
```

A practical package may include:

| Stage | Content | Purpose |
| --- | --- | --- |
| Before publication | One concrete open question | Test the framing and collect cases |
| Publication | A conclusion-led post, blog link, and one visual | Deliver the main result |
| Follow-up | A four-to-six-post technical thread | Expand the reasoning |
| Later follow-up | One risk, state machine, experiment, or counterexample | Provide a second entry point |
| Relevant discussion | A substantive quote post or reply | Apply the research in a real context |
| Chinese follow-up | A localized summary | Reach another reader group without immediate duplication |

This is a menu, not a requirement to publish every item on a fixed schedule. A
follow-up must change the entry point, add information, or serve a different
context. Do not repost the same link and wording.

## Format and Distribution Rules

- Express one main judgment per post.
- Use topic terms such as `CLOB`, `Hyperliquid`, `prediction market`, and `oracle`
  naturally; do not stack keywords.
- Use no hashtag by default. Use at most one when it represents a real event or
  active community topic.
- Mention a project or author only when they are directly relevant to the claim.
- Do not use all caps, engagement bait, `Thoughts?`, or `Like and repost`.
- Make the CTA one concrete question or action.
- Test link placement with Moore's own analytics; do not follow unverified claims
  about external-link penalties or universal best posting times.
- Add consistent UTM parameters to links when measuring a campaign or content
  package, without changing the canonical blog URL.
- Contribute technical substance in replies and quote posts. Do not use unrelated
  replies, mention spam, engagement pods, repetitive posts, or follow/unfollow
  automation.

Consistency of subject matter matters more than chasing generic reach. Keep the
account centered on DEXs, prediction markets, oracles, and financial infrastructure,
and use professional discussion to reach the relevant network.

## English and Chinese

Use English as the primary version when addressing global protocol and financial-
infrastructure developers. A Chinese version must preserve the claim, technical
meaning, evidence boundary, and CTA, but may restructure sentences for clarity.
It is not required to be a word-for-word translation.

Keep established project terms and identifiers consistent, including `swap`,
`clear`, `match`, `Lyquid`, and `Lyquor`. Do not publish nearly identical English
and Chinese posts back to back. Use a later reply, a separate follow-up, or a
weekly Chinese summary when that creates a better reader experience.

## Source-to-Post Verification

Before publishing, compare the X draft with its source material:

| Check | Question |
| --- | --- |
| Core claim | Does the post preserve the article's one-sentence thesis? |
| Evidence | Is every factual statement supported by the article or a primary source? |
| Certainty | Did a hypothesis become a promise during compression? |
| Scope | Did an external reference accidentally become the main subject? |
| Lyquor boundary | Does the wording distinguish a possible design from current implementation? |
| Added value | Is the post useful without a click? |

## Publication Checklist

- [ ] The draft uses the correct mode: research communication or project progress.
- [ ] The first line leads with the problem, result, or judgment—not internal process.
- [ ] The post contains one main claim and has value without the link.
- [ ] The hook is accurate, specific, and supported by the body.
- [ ] Facts, inferences, candidate designs, and open questions keep their source certainty.
- [ ] Wording does not imply that Moore is the Lyquor project team.
- [ ] The external project is a reference case rather than an accidental product summary.
- [ ] The CTA asks one specific question or directs one action.
- [ ] Hashtags and mentions are absent unless directly useful.
- [ ] Any image is quickly understandable on mobile.
- [ ] Any measured link uses consistent UTM parameters.
- [ ] Every thread post contributes independent information.
- [ ] English and Chinese versions preserve the same technical meaning without immediate duplication.
