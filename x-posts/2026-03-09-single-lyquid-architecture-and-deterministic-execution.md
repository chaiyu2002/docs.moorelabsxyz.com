# 03-09 Single-Lyquid Architecture and Deterministic Execution

Related blog post: `blog/2026-03-09/index.md`

## English

On March 9, we aligned on a more unified direction for the architecture: instead of splitting responsibilities across multiple Lyquid instances, the system is moving toward a single Lyquid design that can host multiple roles while sharing the same underlying state. That shift also makes deterministic execution much more important, which is why issues like UUIDs, timestamps, and randomness can no longer be treated as small implementation details. At the same time, index-price-related logic is becoming part of the core architecture itself rather than just an external data feed. The bigger takeaway is that architecture is not only about where features live, but also about what assumptions are safe inside a replicated execution model.

## Chinese

3 月 9 日，我们在架构方向上进一步收敛了共识：不再继续把不同职责拆到多个 Lyquid 实例里，而是转向一个共享底层状态、可承载多个角色的单一 Lyquid 设计。这个变化也让确定性执行变得更重要，所以像 UUID、时间戳、随机数这类问题，已经不能再被当成小的实现细节来看。与此同时，指数价格相关逻辑也不再只是一个外部数据输入，而是在逐步成为核心架构的一部分。更大的结论是，架构不仅仅是决定功能放在哪里，也是在决定哪些假设可以安全地存在于一个可复制执行的系统里。

Original blog post:

https://www.moorelabsxyz.dev/blog/2026-03-09-single-lyquid-architecture-and-deterministic-execution
