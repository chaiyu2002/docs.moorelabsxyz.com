---
slug: /2026-07-18-market-operation-receipt
title: "07-18 What Makes a Market Update Auditable?"
date: 2026-07-18
authors: [andy]
tags: [lyquor, architecture, oracles, auditability]
description: "What a market-operation receipt must prove, and what a Lyquor prototype reveals when compared with a single-operator coordination service."
image: /img/blog/market-operation-receipt.jpg
keywords: [lyquor, market operation receipt, certified call, oracle, market operations]
---

A market update is not complete merely because an oracle returned a value or a request succeeded. An operator must still be able to show which policy governed the update, which evidence was accepted or excluded, who certified the decision, what state existed before it, and why the new state became final.

Our `Market Operation Receipt v0` prototype tested a narrower judgment: **the useful unit of market operations is not the observation or certificate alone, but a unique terminal receipt that binds evidence, authority, and the resulting state transition.** A local Lyquor implementation expressed that boundary clearly. A conventional single-operator coordination service preserved the same business rules more cheaply, but could not provide the same multi-party authorization boundary.

```text
local observations
       |
       v
versioned policy -> certified decision -> ordered state transition
                                             |
                                             v
                         one terminal receipt per round
```

<!-- truncate -->

![Multiple observations bound into a terminal receipt before an ordered state update](/img/blog/market-operation-receipt.jpg)

## A Receipt Is More Than a Log Entry

Our [previous market-operations analysis](/blog/2026-07-14-tradexyz-lyquor-market-operations-layer) ended with a question: what minimum evidence and fallback policy should a market update carry before it can affect risk or settlement? The prototype turned that question into an executable state machine for one `BTC/USD` index-price update.

The word *receipt* matters because ordinary logs are observations made by a process. They may explain what the process says it did, but they do not necessarily constrain what state it was allowed to change. The prototype instead treated a receipt as the canonical output of a terminal state transition.

Each round captured the governing policy, the preceding state, the evidence considered, the participating authorities, and the terminal outcome. Its receipt then answered:

| Question | Receipt evidence |
| --- | --- |
| What operation was decided? | Operation identity and terminal state |
| Which rules applied? | Policy identity and version |
| What changed? | State before and after the decision |
| Which inputs counted? | Accepted evidence |
| Which inputs did not count, and why? | Excluded evidence and reasons |
| Who authorized it? | Participating certifiers |
| Why did it terminate? | Accepted, rejected, expired, or cancelled reason |

The terminal states were intentionally distinct. `Rejected` meant enough signed evidence existed to certify that the business policy could not accept the update. `Expired` meant liveness failed before any accepted or rejected decision could be certified, so an authorized operator closed the round without changing the price. Conflating those cases would hide whether the data was bad or the committee was unavailable.

## What We Tested

The prototype ran in a local multi-node environment with controlled data sources. It modeled one index-price update, required a quorum of node observations and more than one independent source, and deliberately excluded live markets, real funds, and public-network deployment.

Each node could observe a different external result. Application policy determined whether the collected evidence was sufficient, and only a certified decision could change shared state. The final state retained one receipt for the operation.

This maps directly to Lyquor's documented boundary. [Instance functions may perform local computation and external I/O while network functions update shared state deterministically](https://docs.lyquor.dev/docs/ldk/). [Two-phase oracle flows collect node inputs, aggregate them, and authorize a certified network call](https://docs.lyquor.dev/docs/ldk/oracles/). The framework handles protocol signatures, certificate aggregation, and target binding; the application remains responsible for its policy.

The decision logic was checked against different input orders and valid quorum compositions. This mattered because asynchronous arrival can otherwise turn “take the first quorum” into an unstated source of nondeterminism.

The fault matrix covered normal updates, outliers, unavailable or stale sources, malformed input, excessive price movement, insufficient quorum, unavailable nodes, replayed decisions, policy changes during an open operation, proposer failover, node recovery, and consecutive rounds.

Three results were especially useful:

- Replaying the same certified decision produced neither a second state change nor a second receipt.
- A decision from an old operation could not modify state after a later operation had completed.
- A recovering node caught up to the accepted state without duplicating the receipt.

Success was based on the resulting state and receipt, not on whether a request merely returned successfully. The checks required a consistent terminal outcome, an unchanged prior value when a decision failed, and no duplicate receipt.

## The Coordination Service Passed Too—and That Is the Point

To avoid comparing Lyquor with a deliberately weak alternative, we built a conventional coordination service controlled by one operator. It collected observations, applied the same business rules, decided whether state should change, and recorded a receipt.

The coordination service also preserved the intended business invariants, including replay protection, policy changes, recovery, and consecutive operations. This is an important negative result: **distributed certification is not required to write correct validation logic.**

The actual difference appeared at the authority boundary:

| Boundary | Lyquor prototype | Single-operator coordination service |
| --- | --- | --- |
| Business rules | Deterministic validation policy | Same validation policy |
| Finalization authority | Certified update to shared state | One trusted writer |
| Replay protection | Enforced against shared terminal state | Enforced by the service and its storage |
| Recovery | Nodes converge on shared state | Process and storage recovery |
| Audit evidence | Receipt plus multi-party authorization evidence | Receipt plus operator-controlled records |
| Mutation boundary | One operator cannot unilaterally create a certified result | The trusted writer ultimately controls the record |

In this limited sense, Lyquor was more transparent: it made the authorizing parties and the accepted shared state easier to verify independently. That does not mean the underlying price was truer, the policy was economically correct, or the system no longer required trust. Several nodes can still certify a bad result if they depend on the same faulty source or apply a flawed policy. Trust is redistributed rather than removed. The stronger claim holds only when operators are meaningfully independent, the policy is inspectable, and the evidence can be traced.

The coordination service was materially lighter and faster to operate in the local environment. Those local timings are not meaningful production benchmarks, but the cost direction is clear: Lyquor's value here is not execution speed. It is the stronger authority and evidence boundary.

For an internal job controlled by one team, a single-operator coordination service is the more direct design. Existing storage access control, signed logs, or an append-only audit service may be sufficient. The Lyquor path becomes interesting when several parties must agree on what may change, or when no single operator should be able to rewrite an accepted result silently.

## What the Prototype Does Not Prove

The prototype supported the technical hypothesis conditionally. It showed that Lyquor can express divergent local observations, a certified decision, a unique terminal receipt, replay protection, and multi-node recovery. It did not show that the tested price policy was economically sound.

It also did not test public-network latency or cost, real exchange APIs, source licensing, adversarial operators, production key management, denial-of-service resistance, monitoring, or customer willingness to adopt the workflow. When a quorum could not form, the operation still required an authorized expiry path; certification did not remove the need for an explicit liveness and recovery policy.

So the result is not “Lyquor is a better oracle.” The more defensible conclusion is:

```text
Use a single-operator coordination service when one trusted writer is the intended authority.
Use a certified shared-state design when the authority itself must be constrained
and the terminal decision must carry multi-party evidence.
```

The next step is therefore not another market feature. It is to test the demand side: **which real market workflow has multiple parties that need to verify a state change without trusting one operator's editable database?** That is the requirement that could justify the extra system.

## References

- [Lyquor LDK Overview](https://docs.lyquor.dev/docs/ldk/)
- [Lyquor State Model](https://docs.lyquor.dev/docs/ldk/state/)
- [Lyquor Oracles and Certified Calls](https://docs.lyquor.dev/docs/ldk/oracles/)
- [From trade\[XYZ\] to Lyquor: Validating Market Updates](/blog/2026-07-14-tradexyz-lyquor-market-operations-layer)
