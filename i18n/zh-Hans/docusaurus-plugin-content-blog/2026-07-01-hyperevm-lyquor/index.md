---
slug: /2026-07-01-hyperevm-lyquor
title: 07-01 HyperEVM 与 Lyquor 对标
date: 2026-07-01
authors: [andy]
tags: [architecture, strategy, hyperevm, lyquor]
---
## 摘要

HyperEVM 的意义不只是“Hyperliquid 支持 EVM 了”。更准确地说，HyperEVM 是 Hyperliquid 在高性能交易核心之外建立的通用应用层：HyperCore 负责订单簿、清算、资产和核心金融状态，HyperEVM 负责让开发者用熟悉的以太坊工具链部署合约、组合应用，并访问 HyperCore 的部分能力。

如果把这个问题拿来对比 Lyquor，重点不应该是“Lyquor 哪个 VM 等于 HyperEVM”。更合适的对标对象是 Lyquor 的 Lyquid network 层：它同样承担对外应用入口的角色，只是内部不是原生 EVM 合约，而是由 Lyquid/WASM、链上排序入口、节点托管执行和以太坊兼容接口共同完成。

一句话：

```text
HyperEVM: 用 EVM 合约承载 Hyperliquid 的应用层。
Lyquor: 用 Lyquid network 应用承载应用层，再通过以太坊兼容入口对外连接。
```

<!-- truncate -->

## HyperEVM 解决了什么问题

Hyperliquid 的核心优势在 HyperCore。它更像一个高性能金融内核，负责交易、清算、预言机、vault、staking 等关键状态。这个内核非常适合做交易系统，但如果所有外部创新都必须直接围绕 HyperCore API 展开，生态扩展会受到限制。

HyperEVM 的必要性就在这里。它给 Hyperliquid 增加了一个开发者熟悉的编程平面：

- 开发者可以用 EVM 合约、JSON-RPC、钱包、ABI 和现有前端工具进入系统。
- 用户可以用更熟悉的钱包和合约交互方式参与应用。
- 应用可以通过受控接口读取或触发 HyperCore 相关能力。
- HyperCore 不需要承载所有通用应用逻辑，仍然保持专注和高性能。

所以 HyperEVM 不是替代 HyperCore，而是补全 HyperCore。它让 Hyperliquid 从一个强交易系统，进一步变成可以被开发者组合和扩展的金融应用平台。

## 为什么不是只提供 API

API 适合做工具接入，但合约层适合做生态。

如果只有 API，外部开发者可以查询数据、执行操作、构建前端或交易工具。但他们很难把自己的应用变成链上可组合的一部分。EVM 合约层带来的不是单个接口，而是一整套开发者习惯：合约地址、链上状态、钱包签名、前端调用、协议组合和第三方集成。

这就是 HyperEVM 的关键价值。它把 HyperCore 的交易流动性和金融状态，放进以太坊开发者可以理解和复用的应用模型里。

Hyperliquid 的文档也体现了这种分工：HyperEVM 有自己的 RPC、chain ID 和 EVM 交互方式；同时，它又可以通过预编译读取 HyperCore 信息，并通过系统合约向 HyperCore 发送动作。这说明 HyperEVM 不是孤立的“另一条 EVM 链”，而是 Hyperliquid 应用层和核心金融状态之间的连接层。

## Lyquor 应该对标哪一层

从普通读者视角看，Lyquor 最接近 HyperEVM 的不是单独某个 VM 模块，而是 Lyquid network 层整体。

原因很简单：HyperEVM 对外呈现的是“开发者部署合约，用户调用合约，合约状态随交易变化”。而 Lyquor 对外呈现的更像是“开发者部署 Lyquid 应用，链上排序入口给出调用顺序，节点托管执行应用逻辑，network state 形成全网一致状态”。

它们要解决的问题相近：都希望让应用可以被外部用户访问、被链上顺序驱动、被开发者组合，并尽量兼容以太坊生态的入口。

但实现方式不同：

| 维度 | HyperEVM | Lyquor Lyquid network |
| --- | --- | --- |
| 开发者心智 | 部署 EVM 合约 | 部署被节点托管的 Lyquid 应用 |
| 应用执行 | 原生 EVM 合约执行 | Lyquid/WASM 运行时执行 |
| 外部入口 | JSON-RPC、钱包、合约地址 | 以太坊兼容 RPC、合约入口、Lyquor 原生服务入口 |
| 状态模型 | 合约状态 | network state 加节点本地 state |
| 排序方式 | EVM block 给出执行节奏 | 链上排序事件驱动 Lyquid network 执行 |
| 核心能力访问 | 预编译和系统合约 | runtime、跨 Lyquid 调用、认证调用和 host 能力 |

因此，更准确的说法是：

```text
HyperEVM 合约层
~= Lyquid network 方法
 + 链上排序入口
 + 节点托管运行时
 + network state
 + 以太坊兼容 RPC/ABI 接口
```

这不是一比一复制，而是产品角色相近。

## 两种以太坊兼容

HyperEVM 的以太坊兼容更直接。它就是 Hyperliquid 内部的 EVM 环境，开发者和用户可以把它当成一条 EVM 链来理解：有 RPC，有 chain ID，有 gas token，有合约部署和调用。

Lyquor 的以太坊兼容更像“入口兼容”。外部可以通过类似以太坊的合约地址、ABI、RPC 或 sequencer contract 触达应用，但应用内部执行的不是 Solidity/EVM bytecode，而是 Lyquid/WASM。换句话说，Lyquor 不是把自己变成一条普通 EVM 链，而是把以太坊工具链作为外部入口之一。

这会带来不同的取舍：

- HyperEVM 更容易被 EVM 开发者快速理解和迁移。
- Lyquor 的模型解释成本更高，但表达能力更偏向“被节点托管的链上排序应用”。
- HyperEVM 的优势是熟悉和直接；Lyquor 的优势是可以同时表达全网一致状态、节点本地状态和更丰富的运行时能力。

## 对读者意味着什么

如果你关注 Hyperliquid，HyperEVM 的重点不是“又一个 EVM 兼容链”，而是 HyperCore 的开放方式。它让 Hyperliquid 的交易系统可以被合约生态、钱包、前端和 DeFi 应用组合起来。

如果你关注 Lyquor，对标 HyperEVM 时不要急着找一个“等价模块”。Lyquor 更像是把合约入口、排序、托管、运行时和状态模型拆开，再组合成一个应用网络。它对标的不是 HyperEVM 的某个底层部件，而是 HyperEVM 对开发者和用户呈现出来的整个合约应用层。

## 结论

HyperEVM 存在的必要性，可以概括为：

```text
HyperCore = 高性能交易与金融状态核心
HyperEVM = 面向开发者的通用合约层
两者互通 = 把 Hyperliquid 的交易流动性变成可组合生态资产
```

Lyquor 的对应方向，则可以概括为：

```text
Lyquid network = 面向应用的链上排序执行层
以太坊兼容入口 = 面向外部用户和工具的连接层
节点托管运行时 = 面向应用执行和服务能力的基础设施
```

所以，HyperEVM 和 Lyquor 的共同点不是“都在做 EVM”。更准确的共同点是：它们都在寻找一种方式，把底层网络能力转化为外部开发者可以理解、部署和组合的应用层。

## 参考

- HyperEVM docs: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm
- Interacting with HyperCore: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore
- Dual-block architecture: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/dual-block-architecture
