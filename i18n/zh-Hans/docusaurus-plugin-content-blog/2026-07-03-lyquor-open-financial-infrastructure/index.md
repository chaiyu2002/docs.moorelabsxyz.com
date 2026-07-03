---
slug: /2026-07-03-lyquor-open-financial-infrastructure
title: 07-03 Lyquor 与开放金融基础设施
date: 2026-07-03
authors: [andy]
tags: [architecture, strategy, hyperliquid, lyquor]
---

## Summary

HyperCore 和 Lyquor 最清楚的区别，不只是性能、EVM 兼容性，或者应用是否可以部署在交易系统周围。更深层的区别是：金融基础设施到底由谁定义。

HyperCore 把专用金融基础设施作为 Hyperliquid 系统的一部分来提供。订单簿、撮合、清算、保证金、强平和核心账户状态，都属于链级交易环境的一部分。Lyquor 走的是另一条路：它把构建专用金融基础设施的能力开放给开发者和用户，让这些能力可以作为带有排序、共享状态和 runtime 能力的 Lyquid network applications 来实现。

一句话概括：

```text
HyperCore provides specialized financial infrastructure.
Lyquor provides the capability to build specialized financial infrastructure.
```

<!-- truncate -->

## HyperCore 的模式

HyperCore 的强大之处在于，它给 Hyperliquid 提供了一个专门构建的交易核心。核心金融服务已经在那里：订单簿、撮合、清算、保证金、强平、oracle-driven state、vaults、assets 和账户状态。围绕 Hyperliquid 构建的应用，可以依赖这个已有的金融引擎，而不是从零开始搭建。

这种设计形成了很强的产品形态。流动性、账户状态和结算彼此接近。交易应用可以集成到一个共享的金融环境中。HyperEVM 再在这个环境周围增加一个可编程应用层，让开发者可以使用 Ethereum-compatible 的 contracts、wallets、ABIs、JSON-RPC workflows 和生态集成方式。

这也是为什么 Hyperliquid 正在变成不只是 perp 交易所。HyperCore 给它提供专用交易基建，HyperEVM 则让这套基建更可编程。

但边界也很重要。核心金融基础设施仍然是由 Hyperliquid 提供的。外部应用可以访问它、围绕它组合、在它附近构建产品，但它们并不是主要在自己定义底层的撮合、清算、风控、保证金或结算系统。

## Lyquor 的模式

Lyquor 从另一个前提出发。它不是把交易核心看成固定的链级服务，而是把金融基础设施看成开发者可以构建的 network applications。

在 Lyquor 的模型里，撮合、清算、风控、保证金、强平、oracle settlement 和账户管理等模块，都可以表达成 Lyquid applications。这些应用由 sequencing 排序，由节点执行，并通过共享网络状态和 runtime 能力进行协同。

这改变了平台的产品含义。Lyquor 不只是一个让开发者围绕既有交易核心部署 contracts 的环境。它是一个让开发者可以构建交易核心本身的环境。

一个简化的 Lyquor 交易系统可以是：

```text
Match Lyquid:
Order submission, cancellation, matching, fills, and strategy execution

Clear Lyquid:
Accounts, balances, positions, collateral, margin, and settlement

Risk Lyquid:
Portfolio margin, stress scenarios, liquidation thresholds, and market-maker protections

Oracle / Settlement Lyquid:
Price updates, settlement rules, expiry workflows, and market definitions
```

这些不是协议外部漂浮的 backend services。它们可以成为被统一排序驱动的 Lyquid network applications。关键在于，金融基础设施变成了可以在应用层被构建、检查、升级和组合的东西。

## 为什么这个差异重要

对简单应用来说，这个区别听起来可能有些抽象。但对复杂金融系统来说，它非常关键。

金融应用不只是余额之上的用户界面。它们经常需要自己的基础设施逻辑：订单优先级、撮合规则、保证金模型、强平机制、结算价格、market-maker protections、跨产品风险和带权限的运营流程。

如果基础设施内置在链里，应用继承的是一个强大的共享底座。这是 HyperCore 的模式。它给开发者一个高性能金融系统，让开发者在附近构建，但最底层的金融规则仍然属于一个专用核心。

如果基础设施可以作为应用来构建，开发者就可以定义金融系统本身。这是 Lyquor 的模式。它给开发者的是创造市场结构的工具，而不只是集成一个现有市场结构的接口。

更清晰的对比如下：

| Dimension | HyperCore | Lyquor |
| --- | --- | --- |
| Core role | Built-in specialized trading infrastructure | Capability to build specialized trading infrastructure |
| Financial logic | Provided by the Hyperliquid core system | Defined by Lyquid application developers |
| Application layer | HyperEVM contracts around HyperCore | Sequenced Lyquid network applications |
| State model | Core financial state exposed through controlled interfaces | Shared network state coordinated by runtime capabilities |
| Main strength | Unified high-performance trading environment | Open construction of custom financial infrastructure |

## 透明性

这也解释了透明性上的区别。

Lyquor 是透明的，因为金融逻辑可以被定义为 application logic。撮合规则、清算规则、保证金模型、强平逻辑、oracle settlement 和风险参数，都可以表达成可部署模块。开发者和用户可以检查一个金融系统如何运行，因为这个系统是由可见的应用组件构建出来的。

HyperCore 从外部看相对不透明，因为最重要的金融机制属于专用核心。用户和开发者可以观察行为、使用 API、围绕它构建应用，但核心金融引擎并不是每个开发者都可以定义和重组的 application。

这不应该被写成简单的缺点。HyperCore 的一体化设计也正是它能够提供统一、高效交易环境的原因。它的 tradeoff 是：用户获得一套强大的金融基础设施；而 Lyquor 给用户的是构建这套基础设施的路径。

## 产品论点

所以 Lyquor 的产品论点不是：

```text
Lyquor is another chain for financial applications.
```

更准确的说法是：

```text
Lyquor is a platform for building financial infrastructure as sequenced network applications.
```

这个 framing 很重要，因为现代交易应用需要的不只是 contracts 和 APIs。它们需要 ordered execution、shared state、自定义风险逻辑、oracle workflows、margin systems、liquidation processes，以及面向 market makers、users、wallets 和 external protocols 的 integration surfaces。

Hyperliquid 当前的业务形态证明了专用交易基础设施是有价值的。HyperCore 直接提供这套基础设施。HyperEVM 把它变成一个可编程应用环境。

Lyquor 的不同赌注在于：这类基础设施应该作为 construction surface 向开发者开放。撮合、清算、风控、保证金、强平和结算，不应该只是链提供的服务。它们也可以成为开发者构建、运行、验证和组合的应用。

## Conclusion

HyperCore 和 Lyquor 代表了链上金融系统的两条不同路径。

HyperCore 把金融基础设施集中在一个专用的链级交易核心中。这为交易产品和应用层集成提供了一个强大、高效、统一的底座。

Lyquor 则开放了把这类金融基础设施构建成 sequenced Lyquid network applications 的能力。这让基础设施更明确、更可检查，也更开放给开发者定义不同的市场结构。

最简洁的总结是：

```text
HyperCore gives users a specialized financial system.
Lyquor gives users the capability to build specialized financial systems.
```

这就是关键差异：HyperCore 提供基础设施；Lyquor 暴露构建基础设施的能力。
