# 07-14 From trade[XYZ] to Lyquor: Validating Market Updates

Related blog post: `blog/2026-07-14-tradexyz-lyquor-market-operations-layer/index.md`

## English

24/7 asset perps trade beyond market hours. trade[XYZ] uses external prices plus a fallback. In a candidate Lyquor design, local observations may diverge, so state updates need validation and sequencing. What evidence, then, should an update carry?

https://www.moorelabsxyz.dev/blog/2026-07-14-tradexyz-lyquor-market-operations-layer

## Chinese

24/7 传统资产永续合约需要在外部市场闭市后继续定价。trade[XYZ] 通过外部定价和内部备用机制处理这一问题。在 Lyquor 的候选设计中，各节点的本地观测可能不同。因此，共享状态更新必须经过验证和排序——这也带来一个关键问题：一条更新至少应携带哪些证据？

https://www.moorelabsxyz.dev/zh-Hans/blog/2026-07-14-tradexyz-lyquor-market-operations-layer
