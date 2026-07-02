---
sidebar_position: 3
---

# Hyperliquid and Lyquor Analysis Guide

This guide records the main analytical direction for posts that use Hyperliquid,
HyperEVM, or HyperCall as reference cases for Lyquor.

The goal is not to introduce Hyperliquid products for their own sake. The goal is
to study the business pattern behind them, then use that pattern to explain what
Lyquor can do differently.

## Core Thesis

The main thesis is:

```text
Use Hyperliquid's current business shape as a reference pattern,
then argue what the same class of financial applications could look like on Lyquor.
```

For the July 2 Hyperliquid/Lyquor article, the argument is:

```text
Hyperliquid is moving from a perp exchange toward a financial application platform:
HyperCore provides the financial core, HyperEVM provides the programmable
application layer, and HyperCall shows how specialized trading applications can
be built close to liquidity and account state.

Lyquor's corresponding opportunity is not to copy HyperEVM's EVM surface. It is
to make exchange logic itself run as sequenced Lyquid network applications with
shared state and richer runtime services.
```

## What To Analyze First

Start from the business shape, not from the implementation detail.

For Hyperliquid-style applications, identify:

- What financial core the product depends on.
- Where liquidity, account state, collateral, and settlement live.
- Why the product needs to be close to the underlying trading system.
- Which parts are application-layer logic rather than core matching logic.
- Which parts need external developer or market-maker integration.

For HyperCall, this means the important point is not only "it trades options."
The important point is that options need deep hedging liquidity, collateral state,
margin logic, settlement, liquidation, oracle workflows, and market-maker
interfaces close to the same financial system.

## How To Map It To Lyquor

After extracting the business pattern, map it to Lyquor's own model.

Do not frame Lyquor as:

```text
Lyquor = another EVM-compatible chain
```

Frame it as:

```text
Lyquor = sequenced Lyquid network applications + shared network state + runtime services
```

The comparison should move from Hyperliquid's components to Lyquor's corresponding
capabilities:

| Hyperliquid pattern | Lyquor direction |
| --- | --- |
| HyperCore provides liquidity and core financial state | Lyquor needs shared network state for exchange applications |
| HyperEVM provides a programmable application layer | Lyquor provides sequenced Lyquid network applications |
| HyperCall stays close to liquidity for options hedging and settlement | Lyquor can keep matching, clearing, risk, and settlement inside coordinated Lyquid applications |
| EVM compatibility gives a standard external surface | Lyquor can expose Ethereum-compatible entry points while using Lyquid/WASM internally |

## Argument Structure

Use this structure for long-form analysis:

1. Describe the external business pattern.
2. Explain why that pattern works technically.
3. Identify the real product requirement behind the implementation.
4. Map the requirement to Lyquor's architecture.
5. Explain where Lyquor could be stronger or different.
6. State the tradeoff honestly.

For the Hyperliquid example:

```text
External pattern:
Financial core + programmable application layer + specialized trading applications.

Technical reason:
Applications need to stay close to liquidity, account state, margin, settlement,
and developer integration surfaces.

Lyquor mapping:
Sequencing layer + Lyquid network applications + shared exchange state and
runtime services.

Lyquor advantage:
Complex exchange services can become ordered, shared-state, runtime-powered
network applications instead of being forced entirely into EVM contracts.
```

## What Lyquor Should Emphasize

When making the Lyquor argument, emphasize these points:

- Lyquor can model exchange services as applications, not just contracts.
- Sequencing gives order to state transitions such as submit, cancel, fill,
  margin update, liquidation, oracle update, and settlement.
- Runtime services can support complex financial logic such as portfolio margin,
  stress scenarios, liquidation thresholds, and market-maker protections.
- Shared network state is more suitable for coordinated exchange components than
  isolated contract state.
- Ethereum-compatible entry points can remain useful without making EVM the
  internal execution limit.

## What To Avoid

Avoid making the post sound like a Hyperliquid product review. Hyperliquid is the
reference case, not the final subject.

Avoid arguing that Lyquor wins merely because it is different. The argument should
be tied to concrete financial application requirements: sequencing, shared state,
runtime execution, risk logic, settlement, and external integration.

Avoid reducing HyperEVM to "just EVM." The fair reading is that HyperEVM turns
Hyperliquid's financial core into a programmable application layer. Lyquor's
argument becomes stronger when it acknowledges that role and then explains a
different design path.

## One-Sentence Direction

The intended direction can be summarized as:

```text
Reference Hyperliquid's business pattern to show why modern exchange ecosystems
need a programmable application layer, then argue that Lyquor can express that
layer as sequenced Lyquid network applications with shared state and richer
runtime services.
```
