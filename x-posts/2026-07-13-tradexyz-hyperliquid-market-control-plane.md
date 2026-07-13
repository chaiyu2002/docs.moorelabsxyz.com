# 07-13 trade[XYZ] on Hyperliquid

Related blog post: `blog/2026-07-13-tradexyz-hyperliquid-market-control-plane/index.md`

## English

On Jul 13, we studied how trade[XYZ] operates 24/7 traditional-asset perps on Hyperliquid. HyperCore provides the shared execution layer: order books, matching, margin, and liquidation. The harder, market-specific work lies elsewhere: cross-market pricing methods, a production-grade Relayer, and continuous operation of risk parameters and market lifecycles. For Lyquor, the useful lesson is not to copy HIP-3, but to ask whether these capabilities can become coordinated Lyquid applications over sequenced, shared state. Market operation is an application layer of its own.

## Chinese

7 月 13 日，我们研究了 trade[XYZ] 如何基于 Hyperliquid 运营 24/7 传统资产永续市场。HyperCore 提供共享执行层，包括订单簿、撮合、保证金和清算；更难复制的市场专用能力则位于另一层：跨市场定价方法、生产级 Relayer，以及风险参数和市场生命周期的持续运营。对 Lyquor 来说，真正有价值的不是复制 HIP-3，而是思考这些能力能否基于被排序的共享状态，成为相互协调的 Lyquid applications。市场运营本身就是一个应用层。

Original blog post:

https://www.moorelabsxyz.dev/blog/2026-07-13-tradexyz-hyperliquid-market-control-plane
