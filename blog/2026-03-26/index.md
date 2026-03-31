---
slug: /2026-03-26-research-notes-on-exchange-feeds-and-instance-based-execution
title: 03-26 Research Notes on Exchange Feeds and Instance-Based Execution
date: 2026-03-26
authors: [andy]
tags: [project, progress, update]
---

On March 26, we spent time on two connected topics: how exchange feed models differ in practice, and how Lyquid should continue moving toward instance-based execution.

<!-- truncate -->

One part of the discussion focused on comparing feed structures across Hyperliquid, OKX, and Binance. A useful takeaway was that the comparison is less straightforward than it first appears. Hyperliquid does not simply expose “less data.” Instead, many fields are split across different subscriptions, which makes the overall model feel closer to an event stream than to a single bundled push format.

That difference matters because it changes how downstream systems should reason about reconstruction, completeness, and timing. A feed that is spread across multiple subscriptions behaves differently from one that groups more state into a single channel, even if the total information content is similar.

At the same time, we continued discussing Lyquid's shift toward instance-based execution. The practical questions here are no longer limited to code movement alone. They now include how to structure synchronization, how to reduce lock contention, and how to make multi-threaded execution viable without falling back to overly coarse locking.

We also revisited how consensus and downstream state delivery should be modeled. One of the key questions is not just how results are agreed upon, but how much information should be propagated after execution. In particular, sending only small delta-style updates may not always be sufficient. In some paths, richer state transfer may be more robust than minimal payload delivery.

Taken together, these discussions point to the same broader theme: system design depends on both external data models and internal execution models. Understanding exchange feeds more precisely helps shape how execution, consensus, and downstream state handling should evolve inside Lyquid.

I still have the impression that Hyperliquid pushes less data, but that still needs to be verified.
