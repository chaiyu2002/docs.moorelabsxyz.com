---
slug: /2026-03-30-project-progress
title: 03-30 Project Progress
date: 2026-03-30
authors: [andy]
tags: [project, progress, update]
---

Initially, we refactored `clear-lyquid` and `match-lyquid` so that they are now invoked through a `Lyquor` instance as the entry point. All state has been converted to instance-level state. The general idea is that multiple instances first initiate a form of local consensus for a transaction, and then the result is committed on-chain.

<!-- truncate -->

At this point, we encountered an issue: every state access involves read-write locking, which indicates the presence of race conditions. This suggests there may be a multi-threaded design involved.

So the question is: how should we leverage the multi-threading capabilities provided by `Lyquor` in this context?
