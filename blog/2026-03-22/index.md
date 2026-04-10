---
slug: /2026-03-22-engineering-and-strategy-notes-on-lyquor
title: 03-22 Engineering and Strategy Notes on Lyquor
date: 2026-03-22
authors: [andy]
tags: [project, progress, strategy]
---

# 03-22 Engineering and Strategy Notes on Lyquor

这次 3 月 22 日的周会，讨论的内容比平时更发散一些，但回头看，其实主线很清楚。一条主线是技术上怎么把系统做得更稳定、更适合演示，也更接近可落地的交易基础设施；另一条主线则是，如果项目继续往前推进，应该以什么样的产品定位、公开方式和创业节奏去展开。

The March 22 weekly meeting covered a wider range of topics than usual, but the main direction became fairly clear in hindsight. One thread was technical: how to make the system more stable, more demo-ready, and closer to something that can serve as real trading infrastructure. The other thread was strategic: if the project keeps moving forward, what kind of product positioning, public-facing approach, and startup rhythm should support it.

<!-- truncate -->

先从技术侧说起。一个比较实际的进展，是这周已经尝试用 Lyquid 中的 ERC20 合约连接 MetaMask 做充值测试，整体流程基本已经走通。虽然未来演示时不一定会完全照着这条路径来做，但这至少说明，围绕资产接入和用户侧交互的基础路径，已经开始从概念走向可验证的实现。

On the engineering side, one practical step was the ERC20 deposit test through MetaMask using the contract path inside Lyquid. The overall flow is now mostly working. That may not be the exact form used in future demos, but it does show that the basic path around asset access and user-side interaction is moving from concept toward something verifiable.

这也自然带出了另一个更大的问题：如果系统未来不仅仅停留在单链上，那么底层的执行和共识结构是否可以支撑更灵活的多链接入。会上提到的一个思路，是把不同链上的余额变化统一纳入主系统的共识视角中，再通过后端切换或者兼容 EVM 的方式去扩展。这个方向本身还需要继续细化，但它反映出团队已经不只是把 Lyquor 看成一个单点系统，而是在把它往更通用的执行底座上思考。

That naturally led to a broader question: if the system is not meant to stay on a single chain forever, can the underlying execution and consensus structure support more flexible multi-chain integration? One idea raised in the meeting was to bring balances from different chains into a common consensus view, then extend through backend switching or EVM-compatible paths. The direction still needs refinement, but it shows the team is no longer thinking about Lyquor as a one-off system. It is increasingly being treated as a more general execution base.

另一个重要进展，是交易核心流程的重写和整理继续往前推进。下单、撤单、改单、成交和强平相关的处理已经基本完成，单元自测也做过，并合并到了当前的 clear 侧实现中。真正还在持续消化的部分，不是“功能有没有”，而是如何把原来比较复杂的模型，映射到一个更简洁、也更适合当前系统的表达方式上。

Another important step was the continued rewrite and consolidation of the core trading flow. Order placement, cancellation, amendment, execution, and liquidation-related paths are now largely implemented, with unit-level self-testing already done and merged into the current clear-side implementation. The harder part now is not whether the functions exist, but how to map a previously more complex model into a simpler structure that fits the current system better.

这个讨论和上一篇关于字段建模的思路其实是连在一起的。系统越想靠近更直接、更易理解的外部接口，内部越需要认真处理参数映射、模型压缩和语义统一。简化用户理解，并不意味着简化系统本身，很多时候恰恰相反。

This ties closely to the earlier discussion around contract modeling. The more the system tries to present a cleaner and more intuitive external interface, the more carefully it has to deal with parameter mapping, model reduction, and semantic consistency internally. Making things easier for users does not necessarily simplify the system itself. In many cases, it does the opposite.

会上另一个非常值得注意的点，是推送服务设计的调整。之前的思路是监听区块事件再向用户推送，但如果底层链路本身是一秒一块，那么用户看到结果就天然会有延迟。这对于交易场景来说，很容易让“链上确认”变成影响体验的瓶颈。因此这次讨论开始明显转向一种更偏链下的处理方式：先把后端结果推送给用户，再完成后续上链动作。

Another notable point was the rethink around the push service. The earlier approach was to listen to block events and then notify users, but if the underlying chain produces one block per second, user-facing updates naturally inherit that delay. In a trading context, that quickly turns on-chain confirmation into a product bottleneck. The discussion therefore shifted more clearly toward an off-chain-first design: push backend results to users first, then complete the on-chain part afterward.

这种调整并不是简单地“追求更快”，而是开始正面面对一个交易系统里很现实的取舍：用户需要更快的反馈，但系统也必须防止错误推送、错误状态传播，以及 WebSocket 服务被劫持后带来的风险。所以问题已经不只是推不推，而是如何在速度、可信度和系统边界之间找到一个合适的平衡点。

This is not just a matter of “making things faster.” It is really about facing a practical tradeoff in trading systems: users want immediate feedback, but the system also has to defend against incorrect pushes, invalid state propagation, and even the risk of a compromised WebSocket layer. The question is no longer whether to push earlier, but how to balance speed, trust, and architectural boundaries.

这也和会议里对 Hyperliquid 的研究连了起来。大家讨论到，它宣称很高的 TPS，但链上实际看到的 event 数量却并不多，这意味着它在数据表达和状态记录上，大概率做了相当激进的压缩。这里最有意思的地方，不只是“它做到了什么”，而是这会反过来影响我们怎么理解链上记录、链下执行，以及结果回放之间的关系。

That connects directly to the Hyperliquid research discussed in the meeting. The team noted the gap between the very high TPS claims and the much smaller number of visible on-chain events, which strongly suggests an aggressive form of data or state compression. What matters here is not only what Hyperliquid achieved, but also how that changes the way we think about on-chain records, off-chain execution, and replayability.

在架构层面，这些观察最终又落回到几个很实际的问题上：下单和推送是否都应该是链下服务，clear 和 match 是否要进一步合并，分片能不能作为后续横向扩展的一条路径。这些问题现在未必都有定论，但已经能看出来，团队在思考的不是单个模块怎么补齐，而是整个交易路径的形态应该怎么重新组织。

At the architecture level, these observations eventually came back to a few practical questions: should order handling and pushing both live off-chain, should clear and match move closer together or even merge further, and can sharding become a real path toward horizontal scaling later on? These questions may not have final answers yet, but it is already clear that the team is no longer thinking in terms of patching isolated modules. The shape of the full trading path itself is being reconsidered.

除了技术部分，这次会议还有一条同样重要的主线，就是项目的产品定位和创业方式。一个比较鲜明的观点是，项目更适合被理解为一个 DeFi 产品，而不是沿用传统中心化交易平台的叙事方式。这里面既有合规层面的考虑，也有增长方式上的考虑。

Alongside the engineering side, the meeting also had another major thread: product positioning and startup approach. One strong view was that the project is better understood as a DeFi product rather than framed in the same way as a traditional centralized exchange. That has implications for both compliance and growth strategy.

会议里提到的想法是，如果项目要继续往前推进，与其把大量精力放在一个过早封装的 MVP 上，不如优先把关键业务、架构方向和公开表达打磨清楚。通过直播周会、持续发周报、公开展示进展这些方式，让外部用户和潜在支持者真正看到项目在往哪里走。这种方式和很多传统产品“先闭门做完再拿出来”的路径不太一样，但和当前项目的节奏反而是相匹配的。

The idea raised in the meeting was that, if the project continues forward, it may be better to spend less energy on packaging an overly early MVP and more on clarifying the key business paths, architectural direction, and public communication. Weekly livestreams, regular project notes, and transparent progress updates can make it easier for outside users and potential supporters to understand where the project is going. That is different from the traditional “build in private, reveal later” model, but it may fit the current stage of the project better.

最后还有一个讨论点也很值得记下来，就是 ADL 和保证金逻辑的再理解。这里并不是简单复现某个平台的规则，而是想把触发条件、权益变化、可转资金限制这些东西重新想清楚。因为这些规则表面上像是风险控制细节，实际上会直接影响用户体验，也会影响系统是否稳定。

One final area worth noting was the renewed discussion around ADL and margin logic. The goal here is not just to reproduce another platform’s rules, but to think carefully about liquidation triggers, equity changes, and transfer constraints. These may look like risk-control details on the surface, but they directly affect both user experience and system stability.

回头看这次周会，我自己的感受是，它没有给出一个单点结论，而是把几条关键主线慢慢拉到了一起。技术侧在继续往更稳定、更可展示的交易路径收敛，产品侧则在思考更公开、更持续的推进方式。对一个还在快速形成中的项目来说，这种同时整理工程问题和外部叙事的过程，本身就很重要。

Looking back, my impression is that this meeting did not produce a single headline conclusion. Instead, it gradually pulled several important threads together. On the engineering side, the work is converging toward a more stable and demo-ready trading path. On the product side, the team is thinking through a more public and continuous way of building. For a project that is still taking shape quickly, that process of organizing both the engineering questions and the external narrative is important in itself.
