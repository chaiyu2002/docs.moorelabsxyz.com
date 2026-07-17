---
slug: /2026-07-14-tradexyz-lyquor-market-operations-layer
title: "07-14 trade[XYZ] 揭示了怎样的市场运营难题？"
date: 2026-07-14
authors: [andy]
tags: [lyquor, hyperliquid, trade-xyz, architecture, oracles]
description: "为什么 24/7 传统资产永续合约需要独立的市场运营层，以及 Lyquor 如何把外部观测与有序共享状态分开。"
image: /img/blog/tradexyz-market-operations-layer.png
keywords: [lyquor, tradeXYZ, 市场运营, oracle, 传统资产永续合约]
---

让传统资产永续合约保持 24/7 交易，首先不是撮合问题。当 underlying venue 闭市后，运营方必须判断哪些数据仍可使用、新价格如何通过验证，以及它何时可以影响 funding、风险或生命周期状态。trade[XYZ] 让这层常被隐藏的市场运营能力变得可见。

我们的分析提出一个更具体的 Lyquor 方向：重点不是重建 HyperCore，也不是把整套 Relayer 原样搬过来，而是把各节点可能不同的外部市场观测，与经过认证和排序的共享市场状态更新明确分开。

```text
外部观测 -> 应用级验证 -> certified call
        -> sequencing -> 被接受的市场状态
```

<!-- truncate -->

## trade[XYZ] 揭示的是运营问题

[trade\[XYZ\] 架构文档](https://docs.trade.xyz/)将 XYZ 描述为一个 HIP-3 DEX：它定义市场列表、oracle 来源、杠杆上限和其他市场参数；Hyperliquid 负责交易、执行与结算；trade[XYZ] 界面只是访问 XYZ markets 的一种方式。

这层分工很重要。正如我们在[上一篇 trade\[XYZ\] 分析](/zh-Hans/blog/2026-07-13-tradexyz-hyperliquid-market-control-plane)中指出的，HyperCore 提供专用交易基础设施，XYZ 运营方则需要让传统资产在这套基础设施中持续保持可解释性。

官方 [oracle price 规范](https://docs.trade.xyz/perp-mechanics/oracle-price)说明了难点：外部市场开盘时，Relayer 使用外部市场推导的价格；外部输入不可用时，oracle 从最后一个外部价格出发，通过受约束的订单簿机制继续更新。运营方还要处理特定于资产的数据源、交易时段、[节假日休市](https://docs.trade.xyz/consolidated-resources/holiday-closures)和[期货换月](https://docs.trade.xyz/consolidated-resources/roll-schedules)。

这套机制能够运行，是因为外部 venue 在开盘时为 oracle 提供锚点，受约束的内部机制则让闭市期间的价格发现得以继续。它的边界在于，本地订单簿会参与推动一个同时影响 funding 和 mark-price calculation 的 oracle；当流动性较薄时，价格系统会更加反身，fallback policy 也就不再只是数据源切换，而是风险管理的一部分。

真正困难的边界并不是简单的“offchain 与 onchain”，而是：

| 外部观测 | 应用级决策 | 被接受的共享状态 |
| --- | --- | --- |
| 数据源响应与时间戳 | 数据源 allowlist、新鲜度与异常值规则 | Oracle value 与观测时间 |
| Venue 与 session 状态 | External、internal 或 fallback 定价政策 | 当前生效的定价模式 |
| 候选 fair-value 计算结果 | Quorum、聚合与价格边界 | 带版本的 reference price |
| 数据源健康或生命周期证据 | 权限与 lifecycle policy | Halt、roll 或 settlement action |

外部信息可能不完整、延迟、受授权限制，甚至彼此冲突；共享市场状态仍然必须依据一套被授权的政策，按照一个可复现的顺序更新。

## 一套 Lyquor 边界模型

Lyquor 当前的 [LDK 状态模型](https://docs.lyquor.dev/docs/ldk/)提供了适合表达这条边界的原语。Instance state 属于节点本地，可以支持外部 I/O 或非确定性计算；network state 是由共识驱动的共享状态，network function 会在托管同一 Lyquid 的节点上确定性地更新它。

类似 trade[XYZ] 的市场运营方可以探索下面这套候选工作流：

```text
传统 venue、交易日历与参考数据
                    |
                    v
Instance functions：获取、标准化、计算、检查新鲜度
                    |
                    v
Instance state：本地观测 + 数据源健康证据
                    |
                    v
Oracle policy：提议、聚合、验证目标调用
                    |
                    v
Certificate + sequencing backend
                    |
                    v
Network function：更新已接受价格或生命周期状态
                    |
                    v
风险模块、市场服务、钱包与监控系统
```

[Lyquor oracle framework](https://docs.lyquor.dev/docs/ldk/oracles/)支持两种模式：直接验证一个目标调用，或先聚合多个节点的本地观测，再验证聚合结果。文档示例会等待足够的节点输入、取中位数、形成 certified call，并提交到 sequencing backend。Runtime 负责协议 metadata、签名、证书聚合与 target binding；应用级验证政策仍由开发者负责。

这是一种候选映射，不表示 Lyquor 当前已经运营生产级传统资产 oracle。真实实现仍要定义允许使用的数据源、时间戳规则、异常值处理、quorum、fallback 行为、updater 权限，以及 certificate 究竟授权哪一种状态转换。

这套工作流也不会提供执行 venue 或流动性。生产市场仍然需要撮合、抵押品与清算基础设施、market maker，以及一套明确接口，把被接受的运营状态交给实际使用它的交易系统。

## 应用模块不等于 Runtime 能力

从这套工作流还可以得到第二个设计边界：业务模块属于 Lyquid application；执行与协调属于 runtime capability。

| 业务职责 | 可能的 Lyquid 应用逻辑 | 使用的 Lyquor capability |
| --- | --- | --- |
| 市场数据 | 数据源 adapter、标准化、session logic | Instance functions、本地状态、HTTP access |
| Oracle policy | Quorum、聚合与验证规则 | Oracle certification 与 sequencing |
| 风险策略 | Exposure cap 与参数更新 | 确定性 network functions 和 network state |
| 生命周期 | Holiday、roll、halt、settlement 条件 | Instance functions、certified calls、有序 network updates |
| 外部访问 | 状态、监控、钱包或 bot 接口 | [HTTP 或 Ethereum ABI exports](https://docs.lyquor.dev/docs/ldk/external/) |

这张表不表示每项职责都要拆成一个独立 Lyquid。一个 Lyquid 可以同时包含多个 instance 和 network function。如果数据接受、风险政策和生命周期逻辑共享所有权、状态不变量、发布周期和故障响应，把它们放在一个应用中可能更合理。

只有当某条边界需要独立权限、升级、故障隔离、扩缩容或复用时，拆分才有充分理由。服务多个市场的 pricing service 可能适合成为独立应用；特定市场的 halt policy 则可能更适合与其他 lifecycle rule 放在一起。拆分的代价，是应用之间必须显式协调，而不能直接访问同一 Lyquid 内多个 function 所共享的状态。

因此，候选 pricing Lyquid 不只是内部辅助模块：它可以把已接受价格和数据源健康证据作为服务，提供给多个市场应用。复用也会传递依赖，调用方仍需面对接口版本、显式权限，以及 pricing application 不可用或降级时的行为定义。

## 哪些内容可以验证，哪些仍然不能？

这套候选架构可以提高关键边界的可见性，却不会自动让每项输入和政策变得可信。

| 层次 | 可以建立的证据 | 仍未解决的问题 |
| --- | --- | --- |
| 外部采集 | 哪个数据源在何时返回了什么数值 | 数据权利、venue 质量、隐性故障 |
| 应用级验证 | 哪套 quorum 与 domain rule 接受了提议 | 定价方法在经济上是否合理 |
| 认证与排序 | 谁授权了调用，它在何处进入顺序 | 被授权的政策本身是否正确 |
| Network execution | 哪个确定性状态转换得到执行 | 流动性、市场操纵和参数质量 |
| 运营 | 监控、版本与事件记录 | 恢复目标与应急权限归属 |

这张表就是生产差距。Certification 可以证明一条既定验证路径授权了某个具体调用；确定性执行可以让节点一致应用这个调用。但二者都无法证明闭市 fair value 一定正确、薄订单簿一定适合参与定价，或 fallback 应该继续生效。

因此，MooreLabsxyz 探索的是一个更收敛的判断：Lyquor 可能让开发者把市场运营表达为状态和权限边界明确、可检查的应用。它是否比专用 Relayer 更安全，仍取决于其上的政策、证据、运营模型和恢复流程。

## 下一步研究问题

trade[XYZ] 表明，真正困难的产品是位于外部 venue 与共享交易基础设施之间的市场运营层。Lyquor 的相关机会，是让这层能力可编程，同时不把 runtime primitive 误写成金融判断的替代品。

核心结论可以压缩为：

```text
Instance execution 可以观测外部现实；
只有经过验证并进入明确顺序的转换，才应改变被接受的市场状态。
```

下一步需要回答一个具体问题：**一条传统资产价格更新至少应携带哪些证据与 fallback policy，才允许它通过 certified call 影响风险或结算？** 这应该是下一轮原型验证的边界。

## 参考资料

- [TradeXYZ Architecture](https://docs.trade.xyz/)
- [TradeXYZ Oracle Price](https://docs.trade.xyz/perp-mechanics/oracle-price)
- [TradeXYZ Holiday Closures](https://docs.trade.xyz/consolidated-resources/holiday-closures)
- [TradeXYZ Roll Schedules](https://docs.trade.xyz/consolidated-resources/roll-schedules)
- [Lyquor LDK Overview](https://docs.lyquor.dev/docs/ldk/)
- [Lyquor Oracles and Certified Calls](https://docs.lyquor.dev/docs/ldk/oracles/)
- [Lyquor External Access](https://docs.lyquor.dev/docs/ldk/external/)
