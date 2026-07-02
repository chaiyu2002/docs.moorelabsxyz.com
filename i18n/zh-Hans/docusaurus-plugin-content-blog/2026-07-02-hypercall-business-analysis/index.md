---
slug: /2026-07-02-hypercall-business-analysis
title: 07-02 Hyperliquid 应用形态与 Lyquor
date: 2026-07-02
authors: [andy]
tags: [strategy, hyperevm, hyperliquid, hypercall, options]
---

## 摘要

HyperCall 不只是一个期权交易场所案例，它更适合作为观察 Hyperliquid 业务形态的窗口。Hyperliquid 已经不只是一个高性能 perp 交易所。随着 HyperCore、HyperEVM，以及 HyperCall 这类应用层产品出现，它正在变成一个金融应用平台：底层有交易和流动性核心，中间有可编程结算和应用层，上层有贴近金融状态的专业交易应用。

对 Lyquor 来说，关键问题不是“怎么复制 HyperEVM”。更好的问题是：如果这些 Hyperliquid-style 业务放到 Lyquor 上，会有什么不同？哪些能力会更自然？哪些地方会形成自己的优势？

<!-- truncate -->

简短概括：

```text
Hyperliquid 的模式:
金融核心 + 可编程应用层 + 专业交易应用。

Lyquor 的机会:
被排序驱动的交易所应用 + 共享网络状态 + 更丰富的 runtime services。
```

## Hyperliquid 的业务形态

Hyperliquid 的核心产品能力是市场结构。HyperCore 提供高性能交易和金融状态：订单簿、spot/perp 流动性、清算、资产、vault、staking，以及 oracle-driven state。这给活跃金融应用提供了很强的底层。

HyperEVM 在这个基础上增加了可编程层。它的作用不只是“支持 EVM”。它是在 HyperCore 旁边给开发者一个熟悉的合约界面，让应用既能使用 Ethereum-style 工具链，又能贴近 Hyperliquid 的流动性和账户状态。

HyperCall 说明了为什么这件事重要。期权交易所不能只是一个前端，也不能只是一个 public API integration。它需要：

- 做市商可以围绕深度 spot/perp 流动性做 hedge。
- 可靠的账户、抵押品、保证金、结算和清算状态。
- oracle 和 settlement price 流程。
- RFQ、RPI、多腿策略和做市商保护。
- 给钱包、API、机器人和未来协议使用的标准集成接口。

所以 HyperCall 的战略价值不只是“SpaceX options” 或 “SP500 options”。它展示的是：专业衍生品应用如何贴着 Hyperliquid 的金融核心构建。

## 为什么 HyperEVM 适合 HyperCall

HyperCall 采用混合架构。链下系统处理撮合、做市商交互、RFQ/RPI、行情接入和部分风控。链上组件处理账户、存取款、结算、清算拍卖和关键状态迁移。

HyperEVM 的价值，是让可编程结算层靠近 HyperCore。如果 HyperCall 把结算放在外部链，而自然的对冲场所仍然是 Hyperliquid，系统会被拆开：

- 期权成交、抵押品和结算在一个环境。
- perp 和 spot hedge 在另一个环境。
- 资产需要跨桥移动。
- 极端行情下结算依赖跨链时延。
- 做市商承担额外资金、延迟和运营风险。

把结算放在 HyperEVM，可以减少这种割裂。HyperCall 可以保持 Hyperliquid-native，同时继续暴露 EVM-compatible contracts、addresses、ABIs、wallet signatures 和 JSON-RPC workflows。

这套架构可以概括为：

```text
HyperCore:
高性能订单簿、spot/perp 流动性、清算、资产和核心金融状态

HyperEVM:
可编程账户、抵押品状态、结算逻辑、清算流程、权限控制和可验证状态迁移

HyperCall backend:
撮合、RFQ/RPI 流程、风控计算、行情接入和做市商交互
```

这是一个务实分工。HyperEVM 不替代撮合引擎，也不替代 HyperCore。它给混合交易所提供可编程结算边界。

## 这对 Lyquor 的启发

Lyquor 的对比不应该从 EVM compatibility 开始，而应该从业务需求开始：这类产品需要有序执行、共享状态、可靠结算、复杂风控逻辑和外部集成能力。

Lyquor 对应的形态不是 “EVM contracts next to HyperCore”，而是运行在共享网络状态和 runtime services 旁边的 sequenced Lyquid network applications。

```text
HyperCall on HyperEVM:
用 EVM 合约作为账户、保证金、结算和清算层，贴近 HyperCore 流动性。

HyperCall-like app on Lyquor:
用 Lyquid network applications 作为账户、保证金、结算、风控和交易所服务层，
通过链上 sequencing 保证订单和状态迁移顺序。
```

这很重要，因为很多交易系统功能更像交易所服务，而不是简单智能合约。Portfolio margin、多腿期权策略执行、清算流程、oracle-driven settlement 和做市商保护，都是复杂、持续演进、强状态的系统。把这些逻辑全部塞进 Solidity 合约，会让系统变贵、变硬，也更难升级。

Lyquor 可以把这些功能表达成节点托管的 Lyquid applications，同时用 sequencing 保证状态迁移有序、可复现。

## 基于 Lyquor 的可能设计

如果用 Lyquor 构建一个类似 HyperCall 的交易场所，更自然的拆分方式是：

```text
Option Match Lyquid:
订单、RFQ、RPI、撮合和多腿策略执行

Option Clear Lyquid:
账户、余额、期权仓位、抵押品、保证金、清算和结算

Oracle / Settlement Lyquid:
标的价格、TWAP、到期结算价和市场定义规则

Risk Lyquid:
Portfolio margin、压力场景、做市商保护和风控参数
```

关键点是，这些不是漂在系统外面的独立后端服务，而是被共享 sequencing model 驱动的 Lyquid applications。下单、撤单、成交、保证金更新、oracle 更新、清算触发和到期结算，都进入一个有序流。节点按照这个顺序执行应用逻辑，并更新 network state。

这会让 Lyquor 具备不同的产品特点：

- 可以把交易所建模成一组可组合应用，而不是一个合约。
- 可以让复杂风控逻辑更接近普通系统工程。
- 可以暴露 shared network state，而不是孤立 contract state。
- 可以支持外部 Ethereum-compatible entry points，但内部不被 EVM 限制。
- 可以让撮合、清算、风控和结算作为独立但协同的 Lyquid 组件演进。

## Lyquor 可能更强的地方

第一个潜在优势是更丰富的执行模型。成熟期权交易场所需要很多在 EVM 约束下很别扭的计算：Greeks、压力场景、组合抵消、跨产品保证金、清算阈值和做市商库存控制。Lyquor 的 runtime model 可以让这些更像交易所核心逻辑，而不是 gas-optimized contract code。

第二个优势是更清楚的排序模型。交易系统需要确定性顺序。Lyquor 显式拆开 sequencing 和 execution：链或排序入口决定顺序，节点执行应用逻辑。这和下单、撤单、成交、保证金更新、清算、oracle 更新、结算等交易所事件非常匹配。

第三个优势是服务拆分。HyperEVM 里最熟悉的单位是 contract。Lyquor 更自然的单位是 Lyquid application。这让复杂交易场所更容易拆成 match、clear、risk、oracle 等组件，同时仍然处在同一个 network execution model 下。

第四个优势是内部灵活性。外部用户仍然可以通过 Ethereum-compatible address、ABI-like interface、JSON-RPC、wallet signature 或 sequencing contract 交互。内部产品则可以使用 Lyquid/WASM 和 runtime services，而不是受 Solidity 和 EVM execution 限制。

第五个优势是更接近交易所运行基础设施。HyperEVM 给 Hyperliquid 应用提供合约结算层。Lyquor 有机会承载更多交易所栈本身：撮合协调、清算、保证金、风控、强平、oracle settlement 和账户状态，都可以成为 sequenced network applications。

## 权衡

代价是熟悉度。HyperEVM 对现有 EVM 开发者和 DeFi 集成方更容易理解。Contract address、wallet、ABI、explorer 和 Solidity code 都是熟悉的。

Lyquor 需要更多解释。它的价值不是“另一条 EVM 链”，而是把应用逻辑作为被排序驱动的 network services 来运行。这对复杂金融系统更强，但也要求更好的产品教育、开发者工具和集成示例。

另一个权衡是成熟度。Hyperliquid 已经有真实流动性和可见的交易用户基础。Lyquor 版本需要证明自己的流动性路径、做市商接入、运行可靠性和外部集成能力。

## 结论

Hyperliquid 当前方向展示了一个有参考价值的产品模式：

```text
Liquidity core -> programmable settlement/application layer -> specialized financial applications
```

HyperCall 是这个模式的一个例子。它使用 HyperEVM，是因为期权需要贴近 HyperCore 的流动性、对冲、保证金、结算和账户状态。

对 Lyquor 来说，机会不同，而且可能更宽：

```text
Sequencing layer -> Lyquid network applications -> shared exchange state and runtime services
```

如果说 HyperEVM 让 Hyperliquid 的金融核心可以通过 contracts 被编程，那么 Lyquor 可以让交易所逻辑本身成为 sequenced network applications。也就是说，一个 HyperCall-like 产品放在 Lyquor 上，不只是拥有一个结算层。它可以把撮合、清算、风控、保证金、强平和 oracle-driven settlement 都表达成协同的 Lyquid applications。

这才是主要产品启发：Lyquor 的优势不是复制 HyperEVM 的 EVM 表面，而是把复杂交易所服务变成有序、共享状态、runtime-powered 的网络应用。

## 参考资料

- HyperCall 官网: https://hypercall.xyz/
- HyperCall 文档: https://docs.hypercall.xyz/
- HyperCall 架构: https://docs.hypercall.xyz/docs/introduction/architecture/
- HyperCall 场所规则: https://docs.hypercall.xyz/docs/venue-rules/
- HyperCall 费用规则: https://docs.hypercall.xyz/docs/venue-rules/fees/
- SpaceX options launch: https://blog.hypercall.xyz/hypercall-is-live-spacex-options/
- SP500 options launch: https://blog.hypercall.xyz/sp500-options-are-live/
- HyperEVM docs: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm
- Interacting with HyperCore: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore
