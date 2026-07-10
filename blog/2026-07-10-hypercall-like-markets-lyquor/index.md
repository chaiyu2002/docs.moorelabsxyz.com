---
slug: /2026-07-10-hypercall-like-markets-lyquor
title: "07-10 HyperCall-Like Markets on Lyquor: Network Settlement, Instance Matching"
date: 2026-07-10
authors: [andy]
tags: [architecture, hypercall, hyperliquid, lyquor, trading]
---

## Summary

HyperCall is useful as a reference case because it shows how a specialized market application attaches itself to a larger trading system.

On Hyperliquid, HyperCall does not try to make every options order, quote, fill, risk check, and lifecycle event a direct on-chain contract action. Its practical shape is hybrid: the HyperCall Backend handles the fast venue logic, HyperEVM provides the account and execution boundary, and HyperCore supplies the financial base of liquidity, clearing state, oracle data, and hedge markets.

The Lyquor lesson is not to copy that architecture one-to-one. A HyperCall-like market on Lyquor would likely use a different split:

```text
Lyquor network -> settlement, deposits, withdrawals, account boundaries, checkpoints
Lyquid instance -> matching, RFQ/RPI-style workflows, quotes, order books, fast market state
```

That difference matters. HyperCall depends on an operator-run Backend for much of the fast options venue. Lyquor can make the high-frequency side a more open application surface: anyone building a Lyquid can use `instance` capabilities to implement matching and other fast market workflows, while the `network` layer anchors the parts that need shared state, ordering, and settlement.

<!-- truncate -->

## What HyperCall Shows

HyperCall's relationship with Hyperliquid is the important pattern.

HyperCall is not just an options UI, and it is not simply a set of contracts. It is a market system built close to Hyperliquid's existing financial infrastructure.

At a high level:

```text
HyperCall Backend -> low-latency venue logic
HyperEVM -> programmable account and settlement boundary
HyperCore -> liquidity, clearing state, oracle data, and hedge execution
```

This split is reasonable because options markets are operationally heavy. They need order books, market-maker quoting, RFQ flows, retail price improvement, margin checks, expiration handling, settlement, liquidation, and hedge liquidity. Some of that needs speed. Some of it needs a verifiable asset boundary. Some of it depends on the underlying perp and spot market.

So the broader lesson is not "put options on-chain." The broader lesson is:

```text
Specialized markets need a fast execution surface close to a shared financial base.
```

## The Lyquor Mapping

On Lyquor, the same class of business should start from the `network` / `instance` split.

The `network` layer is the natural place for slow, canonical, and shared-state actions:

- Deposits and withdrawals.
- Settlement rules and final accounting.
- Account boundaries and asset ownership.
- Checkpoints from the fast market layer.
- Governance or emergency controls when the market needs a slow-path boundary.

The `instance` layer is the natural place for high-frequency market behavior:

- Order intake and cancellation.
- Matching and book maintenance.
- RFQ or RPI-style workflows.
- Market-maker quote handling.
- Fast portfolio, position, and market views.

This does not mean the `instance` layer becomes "just another centralized Backend." The key point is that `instance` is a Lyquid application capability. A builder can use it to define the fast path of a market, while still relying on the `network` layer for the parts that require shared ordering and settlement.

That gives Lyquor a smoother handoff between off-chain-style speed and on-chain-style finality. The fast path does not have to wait for every network-level state transition, and the settlement path does not have to carry every quote, cancel, and match as a full network transaction.

## Where Lyquor Is Different

HyperCall is built around a specific integration with Hyperliquid:

```text
Backend + HyperEVM + HyperCore
```

Lyquor's direction would be closer to:

```text
Lyquid instance + Lyquor network
```

That is a smaller conceptual split, but a more open one.

In HyperCall, the fast venue is largely operated by the HyperCall Backend. Developers and market makers can integrate with it, but they are integrating with a specific venue system.

On Lyquor, the ambition is broader. The high-frequency layer can be something developers build. A Lyquid can define its own matching logic, RFQ flow, quote rules, market-maker interface, and risk policy at the `instance` level. The `network` layer then anchors the asset and settlement boundary.

This is the main architectural difference:

```text
Hyperliquid provides specialized trading infrastructure.
Lyquor provides the capability to build specialized trading infrastructure.
```

For a HyperCall-like market, that could make Lyquor more open in the most important part of the system: the fast market layer. Different teams could build different venues, matching models, liquidity programs, or derivative products without waiting for the base network to natively support each market structure.

## The Boundary That Matters

The hard part is not choosing whether something is "on-chain" or "off-chain." The hard part is choosing what each layer promises.

For a Lyquor market, the useful boundary is:

```text
Fast market state -> produced by instance-level market logic
Canonical settlement state -> anchored by the network layer
```

Orders, quotes, cancels, RFQs, and matching belong on the fast side. Deposits, withdrawals, settlement, final accounting, and shared checkpoints belong on the network side.

This keeps the system honest. The `instance` layer can move quickly because it is not pretending every market event is final settlement. The `network` layer can remain a settlement anchor because it is not being overloaded with every high-frequency interaction.

## Conclusion

A HyperCall-like business on Lyquor should not be framed as "rebuilding HyperCall." The better framing is to learn the pattern.

HyperCall shows that modern financial applications need a fast market layer close to liquidity, accounts, and settlement. Lyquor can express the same pattern differently: use `instance` for matching and other high-frequency workflows, and use `network` for settlement, deposits, withdrawals, and canonical state.

That is the core thesis. Lyquor does not need to copy Hyperliquid's exact architecture. It can expose a more open way for builders to create specialized market infrastructure themselves.
