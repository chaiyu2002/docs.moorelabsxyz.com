---
slug: /2026-07-09-understanding-hypercall
title: "07-09 Understanding HyperCall: Backend, HyperEVM, and HyperCore"
date: 2026-07-09
authors: [andy]
tags: [architecture, hyperevm, hyperliquid, hypercall, options]
---

## Summary

HyperCall is easiest to misunderstand if it is treated as a pure on-chain options protocol. Its current design is more practical and more hybrid: a professional off-chain options trading system, a HyperEVM contract layer for accounts and verifiable execution boundaries, and HyperCore as the underlying source of spot/perp liquidity, clearing state, oracle data, and future margin integration.

In one sentence:

```text
HyperCall backend handles speed and options market structure.
HyperEVM contracts handle ownership, custody boundaries, settlement, and on-chain actions.
HyperCore provides the financial base: perps, spot, clearing, oracle data, and hedge liquidity.
```

That split is the main point. HyperCall does not try to push every options order, risk check, quote, and fill directly into HyperEVM contracts. Instead, it keeps the high-frequency and market-structure-heavy parts off-chain, while using HyperEVM and HyperCore to anchor the parts that need ownership, settlement, asset movement, and integration with Hyperliquid's financial state.

<!-- truncate -->

The rest of this post walks through the mental model, the three-layer architecture, and the main flows that connect HyperCall to the Hyperliquid financial stack.

## The Mental Model

The simplest way to model HyperCall is as three connected layers:

```text
Trader / Market Maker / Integrator
        |
        | REST / WebSocket / EIP-712 signed messages
        v
HyperCall Backend
  - options order book
  - RPI and RFQ workflows
  - pre-trade risk checks
  - positions, fills, portfolio views
  - market data and volatility inputs
  - liquidation and settlement orchestration
        |
        | signed commands / state sync / user actions
        v
HyperEVM Contracts
  - Exchange
  - Account
  - Processor
  - Registry
  - option tokens
  - RSM command execution
        |
        | ActionCaster / CoreWriter-style dispatch
        v
HyperCore
  - spot and perp order books
  - clearinghouse state
  - balances and positions
  - oracle, mark, and index prices
```

Each layer has a different job.

The HyperCall backend is where the options venue lives operationally. It receives orders, runs matching logic, manages RPI and RFQ flows, checks margin before admitting orders, tracks positions, publishes WebSocket updates, and coordinates risk events.

HyperEVM is the contract and account boundary. It is where HyperCall can express ownership, deposits, withdrawals, account permissions, option token registration, settlement-related actions, liquidation auctions, and signed risk commands in an EVM-compatible form.

HyperCore is the financial base under Hyperliquid. It is where spot and perp order books, clearing state, balances, positions, and oracle-driven prices live. HyperCall uses that base for hedging, data, settlement references, and future deeper margin integration.

## Why HyperCall Needs This Split

Options venues are not just token wrappers. A serious options venue needs order books, market-maker quoting, RFQ for multi-leg packages, retail price improvement, margin checks, volatility surfaces, settlement rules, liquidation handling, and reliable integration with hedge markets.

That is a lot of state and a lot of event flow. Some of it needs speed and operational flexibility. Some of it needs a clear custody and settlement boundary. Some of it depends on external financial state, especially the perp market used by market makers to hedge delta.

HyperCall's architecture reflects that split:

```text
Low-latency venue logic -> HyperCall backend
Verifiable account and execution boundary -> HyperEVM contracts
Hedge venue and financial state -> HyperCore
```

This is why HyperCall should not be described as "options fully implemented on HyperEVM." HyperEVM is important, but it is not the whole venue. It is the programmable on-chain boundary around a broader exchange system.

It is also not simply a frontend to HyperCore. HyperCore does not natively provide the options venue logic HyperCall needs. HyperCall adds the options-specific layer around Hyperliquid's existing trading infrastructure.

## The Three Layers

### HyperCall Backend

The backend is responsible for the parts of the system that look most like a professional exchange engine:

- Options order admission and matching.
- Single-leg order book execution.
- RPI workflows, where market makers get a short opportunity to improve execution before fallback to the book.
- RFQ workflows for multi-leg packages.
- Pre-trade margin checks.
- Real-time fills, positions, and portfolio state.
- Market data, implied volatility inputs, and operational reconciliation.
- Liquidation and settlement orchestration.

This does not mean the backend is just a convenience layer. It is a core part of the current trust and execution model. In Mainnet Alpha, individual options matches are not recorded on-chain one by one. The backend is where the live options venue is operated.

That design gives HyperCall room to support market structures that are hard to express cleanly as simple Solidity contracts: RFQ, RPI, multi-leg packages, market-maker protection, volatility-driven risk logic, and real-time portfolio views.

### HyperEVM Contracts

HyperCall's on-chain components are deployed on HyperEVM. The important contracts and roles can be understood without memorizing every address:

- `Exchange` is the main entry point for accounts, funds, auctions, RSM commands, and HyperCore-facing actions.
- `Account` represents the user's on-chain account boundary.
- `Processor` verifies signatures and encodes actions.
- `Registry` and option token contracts manage supported option assets.
- Manager and agent permissions separate high-authority account actions from trading signatures.

The key idea is that HyperEVM gives HyperCall a programmable ownership and execution boundary near HyperCore. Users can have EVM-style accounts, signatures, contract calls, token flows, and verifiable state transitions without moving the whole venue away from Hyperliquid.

### HyperCore

HyperCore is not owned by HyperCall. It is Hyperliquid's core trading and financial state layer. For HyperCall, it matters in several ways.

First, it is the hedge venue. HyperCall's options liquidity thesis depends on market makers being able to hedge delta against deep Hyperliquid perp liquidity.

Second, it is a data source. Hyperliquid oracle, mark, index, balance, clearinghouse, and position data are important inputs for pricing, settlement, risk views, and future portfolio margin.

Third, it is an execution target. HyperCall can route certain signed perp or asset actions through its HyperEVM contract path into HyperCore using an ActionCaster/CoreWriter-style flow.

Fourth, it is the long-term integration target. The roadmap points toward deeper cross-margin and eventually options being recognized more directly inside the HyperCore margin system. That is not the same as the current Mainnet Alpha state, but it explains the direction.

## Main Flows

### 1. Account and Permission Flow

HyperCall separates account ownership from trading authority.

A manager, usually the user's main wallet, controls the account. The manager can perform high-authority actions such as withdrawals, transfers, and agent management. An agent or API wallet can sign trading-related messages, but should not have the same authority as the manager.

This matters because an options venue has different risk profiles for different actions. Placing and canceling orders should be operationally convenient. Moving funds or changing account control should be much more protected.

At a high level:

```text
Manager wallet
  -> creates or controls Account through Exchange
  -> authorizes trading agents
  -> signs high-authority account actions

Agent / API wallet
  -> signs trading messages
  -> places or cancels orders through the allowed interface
```

### 2. Options Trading Flow

The options trading path starts with a signed user intent, but the matching itself is handled by the HyperCall backend.

```text
User or market maker signs an order
  -> HyperCall backend verifies and checks risk
  -> order enters order book, RPI, or RFQ flow
  -> fills update backend positions and portfolio state
  -> user observes state through REST and WebSocket
  -> selected state or commands are synchronized to the on-chain boundary
```

The important point is that the options order book, RFQ, and RPI workflows are part of HyperCall's venue layer. They are not the same thing as HyperCore's native perp and spot order books.

This is a pragmatic design. Options market structure is more complex than simple single-product order placement. Multi-leg packages, market-maker quote response, portfolio views, and volatility-driven checks are easier to operate in a specialized venue backend.

### 3. HyperCore Action Flow

Perp and asset actions follow a different path. HyperCall can accept signed instructions and route them through the HyperEVM contract system toward HyperCore.

Conceptually:

```text
Signed user or agent action
  -> Exchange verifies permission and nonce
  -> Processor encodes the action
  -> ActionCaster / CoreWriter-style dispatch
  -> HyperCore executes the perp order, cancel, or asset action
```

This flow is where HyperEVM and HyperCore directly meet. HyperEVM provides the contract verification and encoding boundary. HyperCore remains the place where the underlying perp or asset action is executed.

At the architecture level, the useful mental model is that ActionCaster is HyperCall's abstraction for turning verified HyperCall-side intent into HyperCore-compatible actions.

### 4. Settlement and Liquidation Flow

Options need lifecycle rules. They expire, settle, and sometimes trigger liquidation.

HyperCall options are European-style and cash-settled. At expiry, new orders are rejected, open orders are canceled, a settlement price is determined from Hyperliquid oracle data, and positions are closed based on intrinsic value.

Liquidation is more involved. The backend risk system monitors account health, while the on-chain contract system provides the boundary for liquidation auctions and RSM command execution. RSM means Risk and Settlement Manager. It is the mechanism that turns risk or settlement decisions into commands that can be executed through the contract layer.

In simple terms:

```text
Risk system detects a required action
  -> RSM command is produced and signed
  -> HyperEVM contracts verify and execute supported action
  -> liquidation, settlement, repay, or rebalance result becomes visible on-chain
```

This is also one of the most important trust boundaries in the current system.

## Trust Boundary

HyperCall Mainnet Alpha has real on-chain components and real funds, but it should not be read as a fully trustless options exchange.

The on-chain-verifiable side includes:

- Account ownership and manager addresses.
- Account contract deployment.
- Deposits and withdrawals.
- Supported settlement and liquidation actions.
- RSM command execution.
- HyperCore-facing actions that pass through the contract path.

The operator-trust side still includes:

- Options matching fairness.
- Market data ingestion.
- Margin calculation and position tracking.
- Liquidation trigger timing.
- RSM command issuance.
- Operational response during incidents.

This is not a minor detail. It is the core of the current architecture. HyperCall uses contracts to define custody and execution boundaries, but the live options venue still depends on an operator-run backend for matching, risk, data, and orchestration.

The roadmap points toward reducing that trust through RSM decentralization, broader margin support, writer access, physical settlement, and deeper HyperCore margin integration. But current architecture and future roadmap should not be collapsed into the same thing.

## Why This Matters

HyperCall is useful because it shows a concrete application pattern around Hyperliquid:

```text
Specialized financial application
  + programmable on-chain boundary
  + access to a high-performance financial core
```

That pattern is different from ordinary DeFi applications deployed on a general-purpose chain. HyperCall is built close to a venue where hedge liquidity, oracle data, clearing state, and user assets already exist.

It is also different from a fully centralized exchange. HyperEVM accounts, contract calls, settlement paths, and HyperCore actions provide verifiable boundaries that a traditional exchange backend would not naturally expose.

The result is a hybrid exchange design:

```text
Centralized where latency and market structure demand it.
On-chain where ownership, settlement, and execution boundaries matter.
HyperCore-native where liquidity, hedging, and financial state matter.
```

That is the right way to understand HyperCall today.

## Conclusion

HyperCall can be summarized as:

```text
HyperCall Backend:
options venue logic, matching, RPI, RFQ, margin checks, positions, market data, and orchestration

HyperEVM Contracts:
accounts, permissions, deposits, withdrawals, option tokens, settlement, liquidation, and verified action paths

HyperCore:
spot/perp liquidity, clearinghouse state, oracle data, balances, positions, and hedge execution
```

The important architecture lesson is not that every part of options trading has moved on-chain. It is that HyperCall puts a specialized options venue next to Hyperliquid's financial core, then uses HyperEVM to draw a programmable and verifiable boundary around accounts, assets, settlement, and selected execution flows.

That makes HyperCall a useful case study for how application-layer financial products may develop around Hyperliquid: not as isolated smart contracts, and not as ordinary centralized services, but as hybrid systems built around a specialized on-chain financial stack.

## References

- HyperCall docs: https://docs.hypercall.xyz/
- HyperCall architecture: https://docs.hypercall.xyz/docs/introduction/architecture/
- HyperCall contracts: https://docs.hypercall.xyz/docs/contracts/
- HyperCall margining: https://docs.hypercall.xyz/docs/margining/
- HyperCall venue rules: https://docs.hypercall.xyz/docs/venue-rules/
- Hyperliquid HyperEVM docs: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm
- Interacting with HyperCore: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore
- HyperCore overview: https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview
