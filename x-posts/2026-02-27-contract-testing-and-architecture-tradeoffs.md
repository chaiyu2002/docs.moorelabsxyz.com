# 02-27 Contract Testing and Architecture Tradeoffs

Related blog post: `blog/2026-02-27/index.md`

## English

On Feb 27, we aligned across contract testing, execution semantics, and system architecture. Recent validation helped clarify swap contract behavior, atomicity assumptions, and where status semantics like `new` still need sharper definition. On the architecture side, the near-term plan is to split `clear` and `match` into two separate Lyquid components and complete the Lyquor integration around that structure. More broadly, the discussion reinforced a simple point: progress depends not just on code moving forward, but on getting execution models, status meanings, and architectural assumptions aligned.

## Chinese

2 月 27 日，我们围绕合约测试、执行语义和系统架构做了一次更集中的对齐。近期的验证工作帮助我们进一步明确了 swap 合约的交互流程、原子性假设，以及像 `new` 这样的状态语义还有哪些地方需要继续厘清。在架构层面，短期计划是把 `clear` 和 `match` 拆成两个独立的 Lyquid 组件，并完成围绕这套结构的 Lyquor 集成。更重要的是，这次讨论再次说明了一点：项目推进不只是代码往前写，更在于把执行模型、状态定义和架构假设真正对齐。

Original blog post:

https://www.moorelabsxyz.dev/blog/2026-02-27-contract-testing-and-architecture-tradeoffs
