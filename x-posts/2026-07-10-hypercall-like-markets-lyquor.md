# 07-10 HyperCall-like Markets on Lyquor

Related blog post: `blog/2026-07-10-hypercall-like-markets-lyquor/index.md`

## English

On Jul 10, we looked at what HyperCall's relationship with Hyperliquid suggests for HyperCall-like markets on Lyquor. HyperCall is shaped by a hybrid stack: Backend for fast venue logic, HyperEVM for account and execution boundaries, and HyperCore for liquidity, clearing state, oracle data, and hedge markets. On Lyquor, the more natural split is different: `instance` can carry matching, RFQ/RPI-style workflows, quotes, and other high-frequency market behavior, while `network` anchors settlement, deposits, withdrawals, checkpoints, and canonical state. The core point is openness: Lyquor does not just integrate with specialized trading infrastructure; it gives builders a way to create that infrastructure themselves.

## Chinese

7 月 10 日，我们从 HyperCall 之于 Hyperliquid 的关系，思考 Lyquor 上的 HyperCall-like market。HyperCall 是 Backend + HyperEVM + HyperCore 的混合架构：Backend 负责快速交易场所逻辑，HyperEVM 提供账户和执行边界，HyperCore 提供流动性、清算状态、oracle 数据和 hedge 市场。在 Lyquor 上，更自然的分工是：`instance` 承载 matching、RFQ/RPI-style workflow、quote 等高频市场逻辑，`network` 锚定 settlement、deposit、withdrawal、checkpoint 和 canonical state。核心区别是开放性：Lyquor 不只是接入专业交易基础设施，而是让开发者可以自己构建这类基础设施。

Original blog post:

https://www.moorelabsxyz.dev/blog/2026-07-10-hypercall-like-markets-lyquor
