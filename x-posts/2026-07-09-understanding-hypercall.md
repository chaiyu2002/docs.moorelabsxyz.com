# 07-09 Understanding HyperCall

Related blog post: `blog/2026-07-09-understanding-hypercall/index.md`

## English

HyperCall is useful to study not just as an options venue, but as a signal of the business shape forming around Hyperliquid: specialized trading logic close to liquidity, account state, oracle data, margin, settlement, and a programmable on-chain boundary. From Lyquor's perspective, the deeper question is how this class of financial application should be built. Matching, clearing, risk, margin, liquidation, and settlement do not have to be split between isolated contracts and opaque backends. On Lyquor, they can become sequenced Lyquid network applications that share state and coordinate through runtime capabilities.

## Chinese

HyperCall 值得分析，不只是因为它是一个期权交易场所，而是因为它展示了 Hyperliquid 周围正在形成的业务形态：专业交易逻辑贴近流动性、账户状态、oracle 数据、保证金、结算，以及可编程链上边界。从 Lyquor 的视角看，更深的问题是这类金融应用应该如何构建。撮合、清算、风控、保证金、强平和结算，不一定要被拆成孤立合约和不透明 Backend。它们可以在 Lyquor 上成为被统一排序驱动的 Lyquid network applications，共享状态，并通过 runtime capabilities 协同运行。

Original blog post:

https://www.moorelabsxyz.dev/blog/2026-07-09-understanding-hypercall
