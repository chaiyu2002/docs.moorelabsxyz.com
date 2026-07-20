---
slug: /2026-07-14-tradexyz-lyquor-market-operations-layer
title: "07-14 从 trade[XYZ] 到 Lyquor：如何验证市场更新"
date: 2026-07-14
authors: [andy]
tags: [lyquor, hyperliquid, trade-xyz, architecture, oracles]
description: "为什么 24/7 传统资产永续合约需要独立的市场运营层，以及 Lyquor 如何把外部观测与有序共享状态分开。"
image: /img/blog/tradexyz-market-operations-layer.jpg
keywords: [lyquor, tradeXYZ, 市场运营, oracle, 传统资产永续合约]
---

让传统资产永续合约保持 24/7 交易，首要难题并不是撮合。标的资产所在市场闭市后，运营方必须判断哪些数据仍然有效、如何验证新的价格，以及价格更新何时可以影响资金费率计算、风险控制或市场生命周期状态。trade[XYZ] 揭示了这层通常隐藏在交易系统背后的市场运营能力。

我们的分析提出一个更具体的 Lyquor 方向：重点不是重建 HyperCore，也不是把 Relayer 当作单体系统原样复制，而是明确分开两类信息：各节点对外部市场可能存在差异的观测结果，以及经过认证和排序后写入共享状态的市场更新。

```text
外部观测 -> 应用级验证 -> certified call
        -> 排序 -> 最终生效的共享市场状态
```

<!-- truncate -->

![外部市场观测经过验证与排序后写入共享市场状态](/img/blog/tradexyz-market-operations-layer.jpg)

## trade[XYZ] 揭示的是运营问题

[trade\[XYZ\] 架构文档](https://docs.trade.xyz/)将 XYZ 描述为一个 HIP-3 DEX：它定义可交易市场、预言机数据源、杠杆上限和其他市场参数；Hyperliquid 负责交易执行与结算；trade[XYZ] 界面只是访问 XYZ 市场的一种方式。

这层分工很重要。正如我们在[上一篇 trade\[XYZ\] 分析](/zh-Hans/blog/2026-07-13-tradexyz-hyperliquid-market-control-plane)中指出的，HyperCore 提供专用交易基础设施，XYZ 运营方则必须让这套基础设施在外部市场闭市后仍能处理这些传统资产。

官方[预言机价格规范](https://docs.trade.xyz/perp-mechanics/oracle-price)说明了难点：外部市场开盘时，Relayer 使用外部市场推导的价格；外部输入不可用时，预言机从最后一个外部价格出发，通过受约束的订单簿机制继续更新。运营方还要处理各类资产的数据源、交易时段、[节假日休市](https://docs.trade.xyz/consolidated-resources/holiday-closures)和[期货换月](https://docs.trade.xyz/consolidated-resources/roll-schedules)。

这套机制能够运行，是因为外部市场在开盘时为预言机提供锚点，受约束的内部机制则让闭市期间的价格发现得以继续。问题在于，本地订单簿会参与推动一个同时影响资金费率和标记价格计算的预言机。备用定价期间，预言机更新依赖该订单簿的冲击价格。我们的判断是，当流动性较薄时，评估这些输入的质量和抗操纵性就成为风险管理的一部分，而不再只是切换数据源。

真正需要划清的并不是简单的“链下与链上”边界，而是：

| 外部观测 | 应用级决策 | 最终生效的共享状态 |
| --- | --- | --- |
| 数据源响应与时间戳 | 数据源白名单、时效性与异常值规则 | 预言机价格与观测时间 |
| 交易场所与交易时段状态 | 外部、内部或备用定价策略 | 当前生效的定价模式 |
| 候选公允价值计算结果 | 节点门限、聚合与价格边界 | 带版本号的参考价格 |
| 数据源健康状况或生命周期证据 | 权限与生命周期策略 | 停牌、换月或结算操作 |

外部信息可能不完整、延迟、受到许可限制，甚至彼此冲突；共享市场状态仍须按照一套获得授权的规则，以可复现的顺序更新。

## 一套 Lyquor 边界模型

Lyquor 当前的 [LDK 状态模型](https://docs.lyquor.dev/docs/ldk/)提供了划分这条边界所需的基础机制。Instance state 是节点本地状态，可以支持外部 I/O 或非确定性计算；network state 是由共识驱动的共享状态，network function 会在托管同一 Lyquid 的节点上确定性地更新该状态。

类似 trade[XYZ] 的市场运营方可以探索下面这套候选工作流：

```text
传统交易场所、交易日历与参考数据
                    |
                    v
Instance functions：获取、标准化、计算、检查新鲜度
                    |
                    v
Instance state：本地观测 + 数据源健康证据
                    |
                    v
预言机策略：提议、聚合、验证目标调用
                    |
                    v
证书 + sequencing backend
                    |
                    v
Network function：更新最终生效的价格或生命周期状态
                    |
                    v
风险模块、市场服务、钱包与监控系统
```

[Lyquor 预言机框架](https://docs.lyquor.dev/docs/ldk/oracles/)支持两种模式：直接验证一个目标调用，或先聚合多个节点的本地观测，再验证聚合结果。文档示例会等待足够的节点输入、取中位数、形成 certified call，并提交到 sequencing backend。Runtime 负责协议元数据、签名、证书聚合与目标绑定；应用级验证策略仍由开发者负责。

这是一种候选映射，不表示 Lyquor 当前已经提供生产级传统资产预言机。真实实现仍要定义允许使用的数据源、时间戳规则、异常值处理、节点门限、回退机制、更新者权限，以及证书究竟授权哪一种状态转换。

这套工作流也不会提供交易执行场所或流动性。生产市场仍然需要撮合、抵押品与清算基础设施、做市商，以及一套明确接口，把最终生效的运营状态交给实际使用它的交易系统。

## 应用模块不等于 Runtime 能力

这套工作流还依赖另一项设计区分：业务模块属于 Lyquid 应用；执行与协调则是 Runtime 提供的能力。

| 业务职责 | 可能的 Lyquid 应用逻辑 | 使用的 Lyquor 能力 |
| --- | --- | --- |
| 市场数据 | 数据源适配器、标准化、交易时段逻辑 | Instance function、本地状态、HTTP 访问 |
| 预言机策略 | 节点门限、聚合与验证规则 | 预言机认证与排序 |
| 风险策略 | 敞口上限与参数更新 | 确定性 network function 和 network state |
| 生命周期 | 节假日、换月、停牌与结算条件 | Instance function、certified call、有序的网络状态更新 |
| 外部访问 | 状态、监控、钱包或机器人接口 | [HTTP 或 Ethereum ABI 导出接口](https://docs.lyquor.dev/docs/ldk/external/) |

这张表不表示每项职责都要拆成一个独立 Lyquid。一个 Lyquid 可以同时包含多个 instance function 和 network function。如果数据接入、风险策略和生命周期逻辑由同一团队负责，且共享状态不变量、发布周期和故障响应流程，把它们放在一个应用中可能更合理。

当某条边界需要独立权限、升级、故障隔离、扩缩容或复用时，拆分可能更合理。服务多个市场的定价服务可能适合成为独立应用；特定市场的停牌策略则可能更适合与其他生命周期规则放在一起。拆分的代价，是应用之间必须显式协调，而不能直接访问同一 Lyquid 内多个函数所共享的状态。

如果为了复用而独立拆分，候选定价 Lyquid 就不再只是内部辅助模块：它可以把经确认的价格和数据源健康状况证据作为服务，提供给多个市场应用。复用也会把依赖关系传递给下游应用，调用方仍需面对接口版本、显式权限，以及定价应用不可用或降级时的行为定义。

## 哪些内容可以验证，哪些仍然不能？

这套候选架构可以提高关键边界的可见性，却不会自动让每项输入和政策变得可信。

| 层次 | 可以建立的证据 | 仍未解决的问题 |
| --- | --- | --- |
| 外部采集 | 哪个数据源在何时返回了什么数值 | 数据使用权、交易场所质量、隐性故障 |
| 应用级验证 | 哪套节点门限与领域规则接受了提议 | 定价方法在经济上是否合理 |
| 认证与排序 | 谁授权了调用，它被放入排序序列的哪个位置 | 被授权的策略本身是否正确 |
| 网络执行 | 哪个确定性状态转换得到执行 | 流动性、市场操纵和参数质量 |
| 运营 | 监控、版本与事件记录 | 恢复目标与应急权限归属 |

右栏列出的正是距生产可用仍有的缺口。认证可以证明一条既定验证路径授权了某个具体调用；确定性执行可以让节点一致应用这个调用。但二者都无法证明闭市期间的公允价值一定正确、薄订单簿一定适合参与定价，或备用定价策略应该继续生效。

因此，我们探索的是一个更有限、也更容易验证的判断：Lyquor 可能让开发者把市场运营表达为状态和权限边界清晰、可检查的应用。它是否比专用 Relayer 更安全，仍取决于应用层的策略、证据、运营模型和恢复流程。

## 下一步研究问题

我们对 trade[XYZ] 的分析表明，连接外部交易场所和共享交易基础设施的市场运营层，可能是最难构建的能力之一。Lyquor 可能提供一条路径，让这层能力可编程，同时不把 Runtime 提供的基础机制当作金融判断的替代品。

核心结论可以压缩为：

```text
Instance 层可以观测外部现实；
只有经过验证并按明确顺序执行的状态转换，才应写入共享市场状态。
```

下一步需要回答一个具体问题：**一条传统资产价格更新至少应携带哪些证据，并遵循怎样的备用策略，才能通过 certified call 影响风险或结算？** 这应该是下一轮原型验证的边界。

## 参考资料

- [TradeXYZ Architecture](https://docs.trade.xyz/)
- [TradeXYZ Oracle Price](https://docs.trade.xyz/perp-mechanics/oracle-price)
- [TradeXYZ Holiday Closures](https://docs.trade.xyz/consolidated-resources/holiday-closures)
- [TradeXYZ Roll Schedules](https://docs.trade.xyz/consolidated-resources/roll-schedules)
- [Lyquor LDK Overview](https://docs.lyquor.dev/docs/ldk/)
- [Lyquor Oracles and Certified Calls](https://docs.lyquor.dev/docs/ldk/oracles/)
- [Lyquor External Access](https://docs.lyquor.dev/docs/ldk/external/)
