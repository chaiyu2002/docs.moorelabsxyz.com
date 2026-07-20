# 07-18 What Makes a Market Update Auditable?

Related blog post: `blog/2026-07-18-market-operation-receipt/index.md`

## D0 English Main Post

An oracle value is not an auditable market update.

A terminal receipt binds policy, evidence, authorizers, prior state, and the transition.

A single-operator service preserved the same rules. The difference is who can finalize the record.

https://www.moorelabsxyz.dev/blog/2026-07-18-market-operation-receipt

## D+1 English Thread

1/ A request can succeed without making a market update auditable.

An operator must still show which policy applied, which evidence counted or was excluded, who authorized the decision, what changed, and why the result became final.

2/ A terminal receipt is more than a log entry.

A log records what a process says it did. A receipt should be the canonical output of the state transition itself, with accepted, rejected, expired, and cancelled outcomes kept distinct.

3/ Our local Lyquor prototype modeled this path:

local observations
-> versioned policy
-> certified decision
-> ordered state transition
-> one terminal receipt

Replays and stale decisions produced neither a second state change nor a duplicate receipt.

4/ The conventional single-operator service passed the same business checks.

That negative result matters: distributed certification is not required to write correct validation logic.

The difference appears at the authority boundary, not in the rules themselves.

5/ Multi-party certification can constrain who finalizes a result.

It cannot prove the price is true or the policy is economically sound.

Which workflow needs verifiable state changes without trusting one operator's editable database?

Full analysis:

https://www.moorelabsxyz.dev/blog/2026-07-18-market-operation-receipt

## D+3 English Follow-up

Distributed certification does not replace validation logic.

A single operator can enforce policy versions, replay protection, and recovery correctly.

Its value begins when the writer must be constrained and the terminal decision must carry multi-party evidence.

## D0 Chinese Main Post

Oracle 给出数值，不代表市场更新已经可审计。

一条有效的终态回执，应绑定策略、证据、认证主体、变更前状态和最终状态转换。

原型对照发现，单一运营方服务也能守住相同规则。真正的差异，在于谁有权让记录最终生效。

https://www.moorelabsxyz.dev/zh-Hans/blog/2026-07-18-market-operation-receipt

## D+1 Chinese Thread

1/ 请求成功返回，不代表一条市场更新已经可审计。

运营方仍需说明：适用了哪套策略、哪些证据被采纳或排除、谁授权了决策、状态发生了什么变化，以及结果为何最终生效。

2/ 终态回执不只是一条日志。

日志记录的是某个进程声称自己做了什么。回执则应成为状态转换本身的规范化输出，并明确区分接受、拒绝、过期和取消。

3/ 本地 Lyquor 原型验证了这条路径：

local observations
-> versioned policy
-> certified decision
-> ordered state transition
-> one terminal receipt

重放或过期决策都不会造成第二次状态变化，也不会生成重复回执。

4/ 传统单一运营方服务通过了相同的业务检查。

这个负向结果很重要：写出正确的验证逻辑，并不要求分布式认证。

真正的差异出现在权限边界，而不是业务规则本身。

5/ 多方认证可以约束谁有权让共享结果最终生效。

但它不能证明底层价格一定真实，也不能证明业务策略在经济上合理。

那么，什么现实的市场工作流需要多个参与方共同验证状态变化，同时又不能把可信记录完全交给单一运营方控制？

全文：

https://www.moorelabsxyz.dev/zh-Hans/blog/2026-07-18-market-operation-receipt

## D+3 Chinese Follow-up

分布式认证不能替代验证逻辑。

单一运营方同样可以正确处理策略版本、重放保护和恢复。

只有当写入方本身需要受到约束，而且终态决策必须携带多方证据时，它才带来额外价值。
