# 07-01 HyperEVM vs Lyquor

Related blog post: `blog/2026-07-01-hyperevm-lyquor/index.md`

## English

HyperEVM should not be understood as just "EVM support for Hyperliquid." Its deeper role is to turn HyperCore's high-performance financial state into a programmable application layer that developers can access through familiar Ethereum tooling. That framing also changes how we compare it with Lyquor. The closest counterpart is not a single Lyquor VM module, but the Lyquid network application layer as a whole: on-chain sequencing, node-hosted Lyquid/WASM execution, shared network state, runtime services, and Ethereum-compatible entry points. The bigger takeaway is that both systems are trying to expose lower-level network capabilities as application layers that outside developers can understand, deploy to, and compose with.

## Chinese

HyperEVM 不应该只被理解成“Hyperliquid 的 EVM 支持”。它更深层的作用，是把 HyperCore 的高性能金融状态变成一个开发者可以通过熟悉的 Ethereum 工具访问的可编程应用层。这个理解也会改变我们比较它和 Lyquor 的方式。更接近的对应物不是某一个 Lyquor VM 模块，而是整个 Lyquid network application layer：链上排序、节点托管的 Lyquid/WASM 执行、共享网络状态、运行时服务，以及 Ethereum-compatible entry points。更大的结论是，两套系统都在尝试把底层网络能力暴露成外部开发者能够理解、部署和组合的应用层。

Original blog post:

https://www.moorelabsxyz.dev/blog/2026-07-01-hyperevm-lyquor
