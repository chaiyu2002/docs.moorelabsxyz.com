---
slug: /2026-07-09-understanding-hypercall
title: "07-09 理解 HyperCall：Backend、HyperEVM 与 HyperCore"
date: 2026-07-09
authors: [andy]
tags: [architecture, hyperevm, hyperliquid, hypercall, options]
---

## 摘要

如果把 HyperCall 理解成一个纯链上期权协议，很容易误判它的真实结构。它当前更像一个务实的混合系统：链下专业期权交易系统、HyperEVM 上的账户和可验证执行边界，以及作为底层金融状态的 HyperCore，包括 spot/perp 流动性、清算状态、oracle 数据和未来保证金整合基础。

一句话概括：

```text
HyperCall Backend 负责速度和期权市场结构。
HyperEVM 合约负责所有权、资金边界、结算和链上动作。
HyperCore 提供金融底座：perp、spot、清算、oracle 数据和 hedge 流动性。
```

这个分工是理解 HyperCall 的关键。HyperCall 并没有把每一笔期权订单、每一次风控检查、每个报价和每次成交都直接塞进 HyperEVM 合约。它把高频、复杂、市场结构相关的部分放在链下，同时用 HyperEVM 和 HyperCore 锚定所有权、结算、资产流转，以及和 Hyperliquid 金融状态的连接。

<!-- truncate -->

下面从心智模型、三层架构和主要流程三个角度，拆解 HyperCall 如何连接 Hyperliquid 的金融底座。

## 心智模型

理解 HyperCall 最简单的方式，是把它拆成三个连接在一起的层：

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

每一层承担的职责不同。

HyperCall Backend 是期权交易场所实际运行的地方。它接收订单、执行撮合逻辑、管理 RPI 和 RFQ 流程、在订单进入市场前检查保证金、跟踪仓位、推送 WebSocket 更新，并协调风险事件。

HyperEVM 是合约和账户边界。HyperCall 可以在这里表达所有权、充值、提现、账户权限、option token 注册、结算相关动作、清算拍卖，以及带签名的风险指令。

HyperCore 是 Hyperliquid 的底层金融状态。Spot 和 perp 订单簿、清算状态、余额、仓位，以及 oracle-driven prices 都在这里。HyperCall 使用这个底座来做 hedge、取数据、确定结算参考，并为未来更深的保证金整合铺路。

## 为什么需要这种分工

期权交易场所不只是 token wrapper。一个严肃的期权交易场所需要订单簿、做市商报价、面向多腿组合的 RFQ、retail price improvement、保证金检查、波动率曲面、结算规则、清算处理，以及和 hedge 市场的可靠连接。

这意味着大量状态和大量事件流。有些部分需要速度和运营灵活性。有些部分需要清晰的资金和结算边界。有些部分依赖外部金融状态，尤其是做市商用来对冲 delta 的 perp 市场。

HyperCall 的架构正是在反映这种分工：

```text
低延迟交易场所逻辑 -> HyperCall Backend
可验证账户和执行边界 -> HyperEVM 合约
Hedge 场所和金融状态 -> HyperCore
```

所以不应该把 HyperCall 描述成“完全在 HyperEVM 上实现的期权”。HyperEVM 很重要，但它不是整个交易场所。它是围绕更大交易系统建立的可编程链上边界。

它也不只是 HyperCore 的一个前端。HyperCore 并不原生提供 HyperCall 需要的期权交易场所逻辑。HyperCall 是在 Hyperliquid 已有交易基础设施旁边增加了期权专用层。

## 三个层次

### HyperCall Backend

Backend 负责系统中最像专业交易所引擎的部分：

- 期权订单接入和撮合。
- 单腿订单簿执行。
- RPI 流程，让做市商有短时间机会改善执行价格，然后再 fallback 到订单簿。
- 面向多腿组合的 RFQ 流程。
- 预交易保证金检查。
- 实时成交、仓位和 portfolio state。
- 行情数据、隐含波动率输入和运营对账。
- 清算和结算编排。

这不意味着 Backend 只是一个方便层。它是当前信任模型和执行模型的核心部分。在 Mainnet Alpha 中，期权逐笔撮合并不会逐笔记录到链上。Backend 是实时期权交易场所运行的地方。

这种设计让 HyperCall 可以支持一些很难用简单 Solidity 合约表达的市场结构：RFQ、RPI、多腿组合、做市商保护、volatility-driven risk logic，以及实时 portfolio view。

### HyperEVM 合约

HyperCall 的链上组件部署在 HyperEVM 上。理解它们时不需要记住每个地址，关键是分清角色：

- `Exchange` 是账户、资金、拍卖、RSM 指令和面向 HyperCore 动作的主入口。
- `Account` 代表用户的链上账户边界。
- `Processor` 负责验签和动作编码。
- `Registry` 和 option token 合约管理受支持的期权资产。
- Manager 和 agent 权限把高权限账户动作与交易签名分开。

核心点是，HyperEVM 给 HyperCall 提供了一个贴近 HyperCore 的可编程所有权和执行边界。用户可以使用 EVM-style 账户、签名、合约调用、token 流转和可验证状态迁移，同时不需要把整个交易场所从 Hyperliquid 旁边搬走。

### HyperCore

HyperCore 不属于 HyperCall。它是 Hyperliquid 的核心交易和金融状态层。对 HyperCall 来说，它有几层意义。

第一，它是 hedge 场所。HyperCall 的期权流动性 thesis 依赖做市商能够围绕 Hyperliquid 深度 perp 流动性对冲 delta。

第二，它是数据源。Hyperliquid 的 oracle、mark、index、balance、clearinghouse 和 position 数据，都是定价、结算、风险视图和未来 portfolio margin 的重要输入。

第三，它是执行目标。HyperCall 可以接收某些签名后的 perp 或资产动作，并通过 HyperEVM 合约路径把它们送入 HyperCore。

第四，它是长期整合目标。路线图指向更深的 cross-margin，以及未来让 options 更直接地被 HyperCore margin system 识别。这不是当前 Mainnet Alpha 的状态，但它解释了方向。

## 主要流程

### 1. 账户和权限流程

HyperCall 把账户所有权和交易权限分开。

Manager 通常是用户主钱包，控制账户。Manager 可以执行提现、转账、agent 管理等高权限动作。Agent 或 API wallet 可以签交易相关消息，但不应该拥有和 manager 一样的权限。

这很重要，因为期权交易场所里不同动作的风险完全不同。下单和撤单需要足够方便。移动资金或改变账户控制权则必须受到更强保护。

大致流程是：

```text
Manager wallet
  -> 通过 Exchange 创建或控制 Account
  -> 授权 trading agents
  -> 签署高权限账户动作

Agent / API wallet
  -> 签署交易消息
  -> 通过被允许的接口下单或撤单
```

### 2. 期权交易流程

期权交易路径从用户签名意图开始，但撮合本身由 HyperCall Backend 处理。

```text
用户或做市商签署订单
  -> HyperCall Backend 验签并检查风险
  -> 订单进入 order book、RPI 或 RFQ 流程
  -> 成交更新 Backend 中的仓位和 portfolio state
  -> 用户通过 REST 和 WebSocket 观察状态
  -> 选定状态或指令同步到链上边界
```

关键点是，期权 order book、RFQ 和 RPI 都属于 HyperCall 的交易场所层。它们不是 HyperCore 原生 perp 和 spot 订单簿的一部分。

这是一个务实设计。期权市场结构比简单单品种下单复杂得多。多腿组合、做市商报价响应、portfolio view 和 volatility-driven checks，更适合在专门的交易场所 Backend 中运行。

### 3. HyperCore 动作流程

Perp 和资产动作走另一条路径。HyperCall 可以接收签名后的指令，并通过 HyperEVM 合约系统把它们送向 HyperCore。

概念上可以这样理解：

```text
用户或 agent 签名动作
  -> Exchange 验证权限和 nonce
  -> Processor 编码动作
  -> ActionCaster / CoreWriter-style dispatch
  -> HyperCore 执行 perp order、cancel 或 asset action
```

这条流程是 HyperEVM 和 HyperCore 直接相遇的地方。HyperEVM 提供合约验签和编码边界。HyperCore 仍然是底层 perp 或资产动作真正执行的地方。

从架构层面看，更有用的心智模型是：ActionCaster 是 HyperCall 把经过验证的 HyperCall-side intent 转成 HyperCore-compatible actions 的抽象。

### 4. 结算和清算流程

期权需要生命周期规则。它们会到期、结算，有时还会触发清算。

HyperCall options 是 European-style、cash-settled。到期时，新订单被拒绝，open orders 被取消，结算价由 Hyperliquid oracle 数据确定，仓位按照 intrinsic value 关闭。

清算更复杂。Backend 风险系统监控账户健康状态，链上合约系统则为清算拍卖和 RSM 指令执行提供边界。RSM 是 Risk and Settlement Manager，可以理解成把风险或结算决策转成可通过合约层执行的指令机制。

简单说：

```text
风险系统发现需要执行的动作
  -> 生成并签署 RSM command
  -> HyperEVM 合约验证并执行受支持动作
  -> 清算、结算、repay 或 rebalance 结果在链上可见
```

这也是当前系统最重要的信任边界之一。

## 信任边界

HyperCall Mainnet Alpha 有真实链上组件，也涉及真实资金，但不应该被理解成完全 trustless 的期权交易所。

链上可验证的一侧包括：

- 账户所有权和 manager 地址。
- Account 合约部署。
- 充值和提现。
- 受支持的结算和清算动作。
- RSM command execution。
- 通过合约路径进入 HyperCore 的动作。

仍然需要信任 operator 的一侧包括：

- 期权撮合公平性。
- 行情数据接入。
- 保证金计算和仓位跟踪。
- 清算触发时点。
- RSM command issuance。
- 事故期间的运营响应。

这不是一个小细节，而是当前架构的核心。HyperCall 用合约定义资金和执行边界，但实时期权交易场所仍然依赖 operator-run Backend 来完成撮合、风控、数据和编排。

路线图指向通过 RSM decentralization、更广的保证金支持、writer access、physical settlement 和更深的 HyperCore margin integration 来降低这种信任。但当前架构和未来路线图不应该被混在一起理解。

## 为什么这件事重要

HyperCall 有价值，是因为它展示了 Hyperliquid 周围一种具体的应用形态：

```text
专业金融应用
  + 可编程链上边界
  + 高性能金融核心
```

这种形态不同于部署在通用链上的普通 DeFi 应用。HyperCall 构建在 hedge 流动性、oracle 数据、清算状态和用户资产已经存在的交易环境旁边。

它也不同于完全中心化交易所。HyperEVM 账户、合约调用、结算路径和 HyperCore 动作，提供了传统交易所后端通常不会自然暴露的可验证边界。

结果是一种混合交易所设计：

```text
在延迟和市场结构要求高的地方中心化。
在所有权、结算和执行边界重要的地方链上化。
在流动性、hedge 和金融状态重要的地方 HyperCore-native。
```

这是今天理解 HyperCall 更合适的方式。

## 结论

HyperCall 可以概括为：

```text
HyperCall Backend:
期权交易场所逻辑、撮合、RPI、RFQ、保证金检查、仓位、行情数据和编排

HyperEVM Contracts:
账户、权限、充值、提现、option tokens、结算、清算和经过验证的动作路径

HyperCore:
spot/perp 流动性、clearinghouse state、oracle 数据、余额、仓位和 hedge execution
```

最重要的架构启发不是“期权交易的每个部分都已经上链”。更准确地说，HyperCall 把一个专业期权交易场所放在 Hyperliquid 金融核心旁边，再用 HyperEVM 围绕账户、资产、结算和部分执行流程画出可编程、可验证的边界。

这让 HyperCall 成为观察 Hyperliquid 应用层金融产品如何发展的一个有用案例：它不是孤立智能合约，也不是普通中心化服务，而是围绕专业链上金融栈构建的混合系统。

## 参考资料

- HyperCall docs: https://docs.hypercall.xyz/
- HyperCall architecture: https://docs.hypercall.xyz/docs/introduction/architecture/
- HyperCall contracts: https://docs.hypercall.xyz/docs/contracts/
- HyperCall margining: https://docs.hypercall.xyz/docs/margining/
- HyperCall venue rules: https://docs.hypercall.xyz/docs/venue-rules/
- Hyperliquid HyperEVM docs: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm
- Interacting with HyperCore: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore
- HyperCore overview: https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview
