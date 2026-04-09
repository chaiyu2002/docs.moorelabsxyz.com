---
slug: /2026-03-24-contract-modeling-and-lyquor-integration
title: 03-24 Engineering Notes on Contract Modeling and Lyquor Integration
date: 2026-03-24
authors: [andy]
tags: [project, progress, architecture]
---

# 03-24 Engineering Notes on Contract Modeling and Lyquor Integration

很多时候，一提到交易系统，大家首先想到的都是性能，比如撮合速度、延迟和吞吐量。这些当然很重要，但这次内部讨论让我感觉，真正值得反复琢磨的，未必只有“快”这一件事。

When people talk about trading systems, performance is usually the first thing that comes to mind: matching speed, latency, and throughput. Those things are certainly important. But this internal discussion made me feel that speed is not the only topic worth revisiting again and again.

<!-- truncate -->

这次大家聊到的内容比较多，包括合约字段设计、ADL 业务用 Rust 重写、系统往 Lyquor 上的集成联调，以及链下共识方案。表面上看，这些话题分散，但放在一起看，其实都在围绕同一个问题：系统怎么才能做得更清楚、更稳定，也更适合继续往前走。

The discussion covered several topics: contract field design, rewriting ADL-related logic in Rust, integration testing while moving the system onto Lyquor, and some early thinking around an off-chain consensus approach. On the surface, these topics seem separate, but taken together they all point to the same question: how can the system become clearer, more stable, and better prepared for the next stage?

先说合约字段。讨论里一个让我印象比较深的点是，不同平台对交易单位的表达方式差异其实很大。像 OKX、BitMEX 这类更早期的平台，很多时候更强调“张”的概念，这种表达方式和传统金融衍生品市场比较接近。而币安、Bybit 在很多场景下，则更倾向于直接让用户面对“标的物数量”这样的概念，把 `lot size`、`face value` 这些约束更多放在系统内部处理。

Starting with contract fields, one of the more interesting points was how differently exchanges express trading units. Earlier platforms such as OKX and BitMEX often emphasize the concept of contract lots, which feels closer to the language of traditional derivatives markets. Binance and Bybit, by contrast, often expose something closer to the underlying asset quantity, while keeping constraints such as `lot size` and `face value` more implicit inside the system.

从用户角度看，这样会更容易理解。普通用户不需要先理解“几张合约”，而是可以直接从数量去认识下单和持仓。某种程度上，这也确实降低了衍生品交易的入门门槛。

From a user perspective, this feels more direct. Users do not need to first build an intuition around “how many contracts” before they can understand an order or a position. In that sense, this design likely lowers the entry barrier for ordinary users.

但从系统实现的角度看，事情反而会更复杂一些。因为越是把复杂度隐藏在内部，越要求系统把 `quantity`、`lot size`、`face value`、`multiplier` 之间的关系处理清楚。这些字段看起来只是定义问题，实际上会影响下单限制、仓位计算、价值换算，甚至后面的风控逻辑。所以大家才会越来越意识到，字段统一这件事并不只是“对接口”，更像是在统一内部的业务语义。

From the system side, however, this often makes things more demanding. The more complexity is hidden from the user, the more carefully the system has to model the relationships between `quantity`, `lot size`, `face value`, and `multiplier`. These fields may look like interface details, but in practice they affect order limits, position calculations, value conversion, and even risk control. That is why field alignment gradually started to feel less like simple API mapping and more like unifying the business semantics inside the system.

另一个重点，是 ADL 相关业务正在推进用 Rust 重写。聊下来会发现，这件事不只是技术迁移，更像是在重新梳理系统理解。因为重写的过程中，大家需要不断确认哪些业务语义必须保留，哪些结构可以借这个机会重新整理。很多旧系统的问题并不是不能运行，而是调用链、命名方式和接口边界在长期迭代中慢慢变得复杂。到了重写阶段，真正重要的也许不是把代码搬过去，而是借这个过程把核心逻辑重新理清楚。

Another major topic was the ongoing Rust rewrite of ADL-related business logic. It feels less like a simple technology migration and more like a chance to reorganize how the system is understood. During a rewrite, the team has to keep asking which business semantics must remain unchanged and which structures can be improved along the way. In many older systems, the issue is not that they fail to run, but that call chains, naming, and interface boundaries become more tangled over time. At that stage, the important part is not merely moving code over, but using the rewrite to clarify the core logic.

还有一个很有代表性的点，是这次在把系统往 Lyquor 上集成时暴露出来的联调问题。当前的方式，是先把 `Clear` 和 `Match` 分别做成两个 `Lyquid`，再去验证它们之间的调用链路。从目前的结果看，下单之后，`Clear` 调用 `Match` 这一步已经能走通，但调用完成之后，并没有拿到预期中的正确返回。这也说明，链路虽然已经接上了，但整个调用闭环还没有真正建立起来。

Another representative issue came from integration testing while moving the system onto Lyquor. The current setup treats `Clear` and `Match` as two separate `Lyquid`s, and the team has been validating the call path between them. So far, the path where `Clear` invokes `Match` after an order is placed can already run, but the expected return value is still not coming back correctly. In other words, the connection exists, but the full execution loop has not truly closed yet.

这类问题在工程里其实很常见。单个模块自己测试时可能都没问题，但一旦进入完整链路，上下游一接起来，很多真实问题才会浮出来，比如日志异常、回调丢失、参数处理不一致，或者模块之间对返回结果的理解并不完全一致。尤其像这种拆成两个 `Lyquid` 来做集成的方式，本身就更容易把跨模块调用中的边界问题暴露出来。

This kind of issue is very common in engineering. A single module may look fine in isolation, but once the full path is connected, more realistic problems start to surface: abnormal logs, missing callbacks, inconsistent parameter handling, or different expectations around returned results. Splitting the logic into two `Lyquid`s makes these cross-module boundaries easier to observe, which is useful, even if it also exposes more friction.

也正因为这样，联调往往不是简单的收尾阶段，而更像是系统第一次在真实路径上被完整检验。很多问题不是代码“不能跑”，而是只有真正接进系统、走完整条链路之后，才会知道返回是否正确、状态是否闭环、上下游是否真的对齐。

That is also why integration work is rarely just a finishing step. It is often the first time the system is tested along a real execution path. Many problems are not about whether the code can run at all, but whether the return path is correct, whether state transitions are complete, and whether upstream and downstream components are truly aligned.

最后一个让我觉得很值得继续观察的点，是关于链下共识方案的讨论。大致思路是，把同一个订单发到多个节点执行，在多数结果一致之后，再继续推进后续流程。这个方向的目标很明确，就是希望在兼顾一致性的同时，把效率尽量做得更好一些。但越往下讨论，越会发现这里面有很多细节值得反复推敲，比如订单顺序怎么保证一致、前端什么时候看到结果、数据是先推送还是先上链。这些问题未必马上有答案，但讨论本身很有价值，因为它会帮助大家逐渐看清系统在性能、一致性和风险控制之间准备怎么平衡。

The last point that felt especially worth watching was the discussion around an off-chain consensus approach. The rough idea is to send the same order to multiple nodes, let them execute independently, and move forward once a majority agrees on the result. The goal is clear: preserve consistency while improving efficiency where possible. But the deeper the discussion goes, the more details need careful thought, such as how order sequencing stays consistent, when the frontend should receive results, and whether data should be pushed before or after on-chain commitment. These questions may not have immediate answers, but discussing them is valuable because it gradually clarifies how the system wants to balance performance, consistency, and risk.

回头看这次讨论，我自己的感受是，系统往前推进的过程中，除了继续做功能，像这样围绕模型、链路和方案边界的讨论，其实同样重要。它们看起来没那么“热闹”，但可能正是系统慢慢变得更稳、更清晰的过程。

Looking back, my impression is that as the system moves forward, discussions like these matter just as much as feature work. They may not look as visible as shipping new functionality, but they are often part of how a system gradually becomes more stable and more understandable.
