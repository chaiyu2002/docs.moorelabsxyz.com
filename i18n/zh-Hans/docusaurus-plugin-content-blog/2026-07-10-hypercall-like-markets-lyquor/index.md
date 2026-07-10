---
slug: /2026-07-10-hypercall-like-markets-lyquor
title: "07-10 Lyquor 上的 HyperCall-like Market：network 负责 settlement，instance 负责 matching"
date: 2026-07-10
authors: [andy]
tags: [architecture, hypercall, hyperliquid, lyquor, trading]
---

## 摘要

HyperCall 之所以值得参考，不只是因为它是一个期权产品，而是因为它展示了一个专业市场应用如何接入更大的交易系统。

在 Hyperliquid 上，HyperCall 并没有试图把每一笔期权订单、报价、成交、风控检查和生命周期事件都变成直接的链上合约动作。它更现实的形态是混合式的：HyperCall Backend 负责快速交易场所逻辑，HyperEVM 提供账户和执行边界，HyperCore 提供流动性、清算状态、oracle 数据和 hedge 市场这些金融底座。

对 Lyquor 来说，启发不是照搬这套架构。一个 HyperCall-like market 如果构建在 Lyquor 上，更可能采用另一种分工：

```text
Lyquor network -> settlement、deposit、withdrawal、账户边界、checkpoint
Lyquid instance -> matching、RFQ/RPI-style workflow、quote、order book、快速市场状态
```

这个差异很重要。HyperCall 的快速期权交易场所在很大程度上依赖 operator-run Backend。Lyquor 则可以把高频业务侧变成更开放的应用能力：任何构建 Lyquid 的团队，都可以利用 `instance` 能力实现撮合和其他快速市场流程，同时用 `network` 层锚定需要共享状态、排序和 settlement 的部分。

<!-- truncate -->

## HyperCall 展示了什么

HyperCall 和 Hyperliquid 的关系，才是最重要的模式。

HyperCall 不只是一个 options UI，也不只是一组合约。它是一个构建在 Hyperliquid 现有金融基础设施旁边的市场系统。

从高层看：

```text
HyperCall Backend -> 低延迟交易场所逻辑
HyperEVM -> 可编程账户和 settlement 边界
HyperCore -> 流动性、清算状态、oracle 数据和 hedge execution
```

这个分工是合理的，因为 options market 本身很重。它需要 order book、做市商报价、RFQ、retail price improvement、保证金检查、到期处理、settlement、清算，以及 hedge 流动性。有些部分需要速度，有些部分需要可验证的资产边界，还有一些部分依赖底层 perp 和 spot market。

所以更大的启发不是“把 options 放到链上”，而是：

```text
专业市场需要一个靠近共享金融底座的快速执行面。
```

## Lyquor 上的映射

在 Lyquor 上，同类业务应该从 `network` / `instance` 分工开始设计。

`network` 层更适合承载慢速、最终、共享状态相关的动作：

- deposit 和 withdrawal。
- settlement 规则和最终 accounting。
- 账户边界和资产所有权。
- 来自快速市场层的 checkpoint。
- 市场需要慢路径边界时的治理或 emergency control。

`instance` 层更适合承载高频市场行为：

- 订单接入和撤单。
- matching 和 order book 维护。
- RFQ 或 RPI-style workflow。
- 做市商 quote 处理。
- 快速 portfolio、position 和 market view。

这并不是说 `instance` 层只是另一个中心化 Backend。关键在于，`instance` 是 Lyquid 的应用能力。开发者可以用它定义一个市场的快速路径，同时仍然依赖 `network` 层处理需要共享排序和 settlement 的部分。

这会让 Lyquor 在链下速度和链上 finality 之间有更丝滑的衔接。快速路径不需要等待每一次 network-level state transition，而 settlement 路径也不需要承载每一次 quote、cancel 和 match。

## Lyquor 的不同之处

HyperCall 围绕的是对 Hyperliquid 的特定接入：

```text
Backend + HyperEVM + HyperCore
```

Lyquor 的方向会更接近：

```text
Lyquid instance + Lyquor network
```

这个概念分工更小，但开放性更强。

在 HyperCall 中，快速交易场所主要由 HyperCall Backend 运行。开发者和做市商可以接入它，但他们接入的是一个特定 venue system。

在 Lyquor 上，目标可以更进一步。高频层本身可以成为开发者构建的东西。一个 Lyquid 可以在 `instance` 层定义自己的 matching logic、RFQ flow、quote rule、market-maker interface 和 risk policy。`network` 层则负责锚定资产和 settlement 边界。

这是最关键的架构差异：

```text
Hyperliquid 提供专业交易基础设施。
Lyquor 提供构建专业交易基础设施的能力。
```

对于 HyperCall-like market 来说，这会让 Lyquor 在系统里最关键的部分，也就是快速市场层上更加开放。不同团队可以构建不同的 venue、matching model、liquidity program 或 derivative product，而不必等待基础网络原生支持每一种市场结构。

## 关键边界

难点不在于简单判断某个东西是“链上”还是“链下”。真正重要的是，每一层到底承诺什么。

对 Lyquor market 来说，更有用的边界是：

```text
快速市场状态 -> 由 instance-level market logic 产生
Canonical settlement state -> 由 network 层锚定
```

order、quote、cancel、RFQ 和 matching 应该属于快速侧。deposit、withdrawal、settlement、最终 accounting 和共享 checkpoint 应该属于 network 侧。

这样系统会更诚实。`instance` 层可以跑得快，因为它没有假装每一个市场事件都是最终 settlement。`network` 层可以作为 settlement anchor，因为它没有被每一次高频交互压满。

## 结论

在 Lyquor 上实现 HyperCall-like business，不应该被理解成“重建 HyperCall”。更好的理解方式，是学习它背后的模式。

HyperCall 展示的是：现代金融应用需要一个靠近流动性、账户和 settlement 的快速市场层。Lyquor 可以用不同方式表达同一个模式：用 `instance` 承载 matching 和其他高频流程，用 `network` 承载 settlement、deposit、withdrawal 和 canonical state。

这才是核心 thesis。Lyquor 不需要复制 Hyperliquid 的具体架构。它可以为开发者提供一种更开放的方式，让他们自己构建专业市场基础设施。
