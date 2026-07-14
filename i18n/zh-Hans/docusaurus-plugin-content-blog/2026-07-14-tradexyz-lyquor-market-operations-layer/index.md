---
slug: /2026-07-14-tradexyz-lyquor-market-operations-layer
title: "07-14 从 trade[XYZ] 到 Lyquor：用 Lyquid 构建市场运营层"
date: 2026-07-14
authors: [andy]
tags: [lyquor, hyperliquid, trade-xyz, architecture, oracles]
---

## 摘要

trade[XYZ] 表明，传统资产 perpetual market 所需要的远不只是订单簿。围绕 HyperCore，它还要运营一层特定于市场的能力，包括外部数据、定价、oracle 更新、风险参数和生命周期事件。

这种业务形态为 Lyquor 提供了一个值得探索的方向：

```text
市场运营不必始终封装在一套封闭的 Relayer 系统中，
它可以被表达为一组具有明确状态和执行边界、可部署的 Lyquid。
```

在 Lyquor 上，市场运营可以被构建为一套完整的 Lyquid 应用：instance 侧连接外部世界，network 侧承载经过验证且有序的状态变化，各项能力再根据实际的治理、复用和隔离需求进行组合或拆分。

<!-- truncate -->

## 从市场控制平面到开放的构建能力

[我们对 trade\[XYZ\] 的分析](/zh-Hans/blog/2026-07-13-tradexyz-hyperliquid-market-control-plane) 区分了两个层次：

```text
HyperCore  -> 共享执行、保证金、清算和结算
trade[XYZ] -> 特定于资产的定价、Relayer 运营、风险参数和生命周期控制
```

这是一种有效的分工方式。HyperCore 提供专用交易引擎，XYZ deployer 和 Relayer 则让传统资产可以在其上运行。

它也揭示了一个更普遍的开发问题：市场运营层需要组合两类性质完全不同的工作：

- 外部工作：获取 venue 数据、跟踪 session 与 holiday、维护 futures roll，以及监控数据源健康状态。
- 确定性工作：按照可复现的顺序接受已确认价格、修改风险参数、暂停市场或执行生命周期结算。

传统 Relayer 可以同时承担这两类工作，但状态管理、结果验证和运营规则通常紧密耦合在一套应用专用系统中。Lyquor 提供了另一种组织方式：将外部计算、验证过程和确定性状态更新放入边界清晰的应用模型中。

## 从外部市场信息到可信的市场状态

市场运营需要解决两类不同的问题。第一类是理解外部世界：采集价格、跟踪交易时段、检查数据时效性，并应用特定于资产的定价方法。第二类是把已经确认的结果转化为市场 action，并让所有参与者按照相同顺序看到这些变化。

Lyquor 对这两类职责进行了清晰划分：

- Instance 侧连接外部数据源、执行计算，并保存各节点自己的观测结果。
- Network 侧接收经过验证的结果，再有序更新价格、参数和生命周期状态。

这样，未经验证的外部输入就不会直接改变共享市场状态。数据需要先经过采集和验证，只有被接受的结果才会成为 network update。

对于传统资产市场，这层关系可以概括为：

```text
外部市场信息 -> 采集与验证 -> 被接受的市场状态
```

这种划分的价值在于让运营流程更加清晰：开发者可以明确看到外部信息从哪里进入、在哪里接受检查，以及何时转化为真正影响市场的 action。

## 价格如何从外部数据变成市场状态

以一个每日收盘、但 perpetual market 持续交易的现金指数为例。基于 Lyquid 的工作流可以是：

```text
外部 venues
      ↓
Instance functions：获取、标准化、计算并检查时效性
      ↓
Instance state：保存节点本地观测值和数据源健康状态
      ↓
Oracle 或 UPC 工作流：在多个节点间提议、验证和聚合
      ↓
Certified call + sequencing
      ↓
Network function：接受更新并修改 network state
      ↓
风险、生命周期和外部应用接口
```

其中每一步承担不同职责：

1. Recurring trigger 触发 instance 侧数据采集。
2. 每个参与节点获取被允许的数据源，应用该资产的定价方法，并保存自己的观测结果。
3. Lyquor 的 [oracle framework](https://docs.lyquor.dev/docs/ldk/oracles/) 或 [Unified Peer Calls](https://docs.lyquor.dev/docs/ldk/upc/) 在多个 instance 之间协调提议、验证和聚合。
4. 生成的 certified call 进入 sequencing 流程。
5. 确定性的 network function 校验调用结构，并更新该 Lyquid 的 network state。
6. 其他 function 可以使用已接受的数值执行风险或生命周期 action，外部应用则可以通过 [HTTP 或 Ethereum-compatible exports](https://docs.lyquor.dev/docs/ldk/external/)访问。

[Lyquor Oracle 文档](https://docs.lyquor.dev/docs/ldk/oracles/)中的价格示例展示了相同模式：多个节点提交各自的本地观测值，聚合逻辑在收到足够输入后取中位数形成结果，生成的 certified call 经过验证和排序执行后，再更新共享价格状态。

这只是一个架构示例，而不是 TradeXYZ 生产系统的完整替代品。传统资产仍然需要获得授权的数据输入、session 逻辑、futures fair-value 方法、roll schedule、fallback policy 和生产服务水平。

## 应该使用一个 Lyquid，还是多个？

一种直观画法，是分别为 Data、Oracle、Risk 和 Lifecycle 画一个框，然后把每个框都称为 Lyquid。但这不一定是正确设计。

单个 Lyquid 可以包含多个 instance 和 network function。如果 pricing、oracle acceptance、risk parameters 和 lifecycle policy 共享所有权与发布周期，初期的市场运营方可以先把它们保留在一个内聚的应用中。

只有当边界真实存在时，拆分才更有价值：

| 适合放在一起的条件 | 适合拆分的条件 |
| --- | --- |
| 共享状态不变量 | 需要独立的所有权或权限 |
| 共享升级周期 | 需要独立部署和升级 |
| 共享故障处理 | 需要独立扩缩容或故障隔离 |
| 共享运营责任 | 需要被多个市场复用 |

如果这些能力被拆开，每个 Lyquid 仍然管理自己的 network state，而不是共享一套全局状态。它们通过明确的 inter-Lyquid call 交换信息并协调状态变化。

因此，架构拆分应该是一项产品决策，而不只是画图：一个 Lyquid 对应一个内聚的运营域；只有独立治理、复用或隔离能够证明额外协调成本合理时，才进一步拆分。

## 市场运营不只包括 Oracle

Oracle delivery 是最清晰的例子，但 trade[XYZ] 表明，运营层的范围远大于此：

| 市场职责 | 在 Lyquor 上的可能表达方式 |
| --- | --- |
| 数据源采集和定价方法 | Instance functions、HTTP 访问、本地状态和 recurring triggers |
| 多节点价格验证 | Oracle certification 或 UPC aggregation |
| 已接受价格和市场参数 | 经过排序的 network functions 和带版本的 network state |
| 风险策略执行 | 基于已接受状态运行的确定性 network functions |
| Holiday、roll、halt 和 settlement | Instance 侧识别，再发起经过认证与排序的生命周期 action |
| 与其他金融模块协调 | 明确的 inter-Lyquid calls |
| 钱包、bot 或服务集成 | Ethereum-compatible 和 HTTP exports |

同一结构可以支持多个产品。Pricing Lyquid 可以服务多个市场，Lifecycle Lyquid 可以编码交易日历与 roll rules，Risk Lyquid 可以提供可复用的策略引擎，用于 leverage limits、exposure caps 或 stress checks。

这些能力可以成为业务模块，而不只是内部辅助工具。开发者可以把专业的金融运营能力封装成服务，供其他 Lyquid 或外部应用调用，同时让已接受状态和权限边界在应用层保持可见。

## Lyquor 为开发者开放了什么

HyperCore 提供完整的交易核心和原生市场部署接口。它的价值在于，开发者无需重新构建撮合、保证金和清算，就能上线市场。

Lyquor 的出发点不同。它的开发界面旨在让开发者把专用基础设施本身构建成应用：

- 在一个 Lyquid package 中组合外部服务与确定性逻辑。
- 持久化节点本地运营状态，同时不把它误认为 network consensus。
- 将多个节点的观测结果转化为 certified network action。
- 对状态转换进行排序，并协调应用调用。
- 对外提供熟悉的 HTTP 或 Ethereum-compatible 接口，同时不让内部执行受限于 EVM。

对于类似 trade[XYZ] 的业务，这意味着市场运营层可以成为一组可编程服务，而不是一个不透明的 Relayer 边界。进一步看，相同模型还可以延伸到风险、清算、结算和其他由开发者构建的金融基础设施。

## 这套架构不会自动解决什么

Lyquor 提供执行和协调原语，但不会自动生成一个可靠市场。

开发者仍然需要获得数据使用权，选择可辩护的定价方法，运营冗余数据源，保护权限，监控故障并定义应急流程。他们也仍然需要执行 venue 和提供流动性的市场参与者。认证和确定性执行可以保证结果按照既定规则产生并得到一致执行，但不能保证定价方法和风险参数本身合理。

因此，实际主张应该比“把 Relayer 放到 Lyquor 上”更准确：

```text
Lyquor 可以让市场运营层成为可编程能力，
并将外部计算与经过认证、排序的状态转换明确分开。
```

这会形成更清晰的开发者构建界面，但生产质量仍来自构建在这些能力之上的工程与运营纪律。

## 结论

trade[XYZ] 让市场运营层变得可见，因为它最困难的工作发生在传统 venue 与 HyperCore 之间：它必须把碎片化的外部现实转化为杠杆市场可使用的价格、参数和生命周期 action。

Lyquor 为这类工作提供了一套架构语言：

```text
instance execution 处理外部现实
+ multi-node validation 建立可信度
+ sequencing 保证状态转换顺序
+ network state 保存已接受结果
+ application calls 协调金融模块
```

核心区别是：

```text
HyperCore 提供专用交易基础设施；
Lyquor 为开发者提供构建专用金融基础设施的能力。
```

对于类似 trade[XYZ] 的产品，第一个机会不是重建整套交易所，而是把市场运营层转化为边界明确、可部署、可组合的 Lyquid applications。

## 参考资料

- [Lyquor LDK Overview](https://docs.lyquor.dev/docs/ldk/)
- [Lyquor Groups and Unified Peer Calls](https://docs.lyquor.dev/docs/ldk/upc/)
- [Lyquor Oracles and Certified Calls](https://docs.lyquor.dev/docs/ldk/oracles/)
- [Lyquor External Access](https://docs.lyquor.dev/docs/ldk/external/)
- [TradeXYZ Architecture](https://docs.trade.xyz/)
- [TradeXYZ Perp Mechanics](https://docs.trade.xyz/perp-mechanics/overview)
