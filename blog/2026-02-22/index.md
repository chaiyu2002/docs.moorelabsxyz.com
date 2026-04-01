---
slug: /2026-02-22-service-migration-and-performance-plan
title: 02-22 Service Migration and Performance Plan
date: 2026-02-22
authors: [andy]
tags: [project, progress, architecture]
---

The February 22 discussion narrowed the project down to a practical migration sequence: validate the current system in a realistic environment first, then move service by service toward Lyquid without breaking the existing operational model. The emphasis was not on a big architectural rewrite, but on establishing a baseline, preserving comparability, and reducing uncertainty as each layer is adapted.

<!-- truncate -->

From there, the migration path was framed as a sequence rather than a full rewrite. The plan is to deploy the updated Java implementation first, measure the effect of the latest product-logic and performance changes, then move the implementation into Rust, and finally evolve it toward Lyquid. In practice, this means Lyquid is not being treated as an isolated replacement effort, but as something that should be integrated step by step into the current system so performance changes can be observed throughout the transition.

That same staged approach shaped the service-level migration plan. The current view is to begin with `clear` (account clearing service) and `order` (API order placement service) as single-node services (Lyquid), and only afterward move on to more demanding components such as `match` (matching service). At this stage, Kafka-based communication should remain in place. The intention is to preserve a familiar Web 2.0-style architecture where it reduces migration risk, rather than forcing every component into a new model at once.

We also clarified what code adaptation for Lyquid actually requires. The migration work was described as three core steps: defining state, implementing a proper entry function, and ensuring idempotency. If the `f_750` branch fully removes Kafka transactions while preserving idempotent behavior, then part of the adaptation cost disappears and the remaining work becomes more focused on state definition and execution entry points. A related open question is Lyquid's consensus mechanism, which still needs deeper alignment with the Lyquor team before the implementation path can be finalized.

Beyond engineering mechanics, the meeting also set expectations for coordination. Questions for the Lyquor team should be consolidated in advance, regular alignment meetings should resume after the holiday period, and each weekly meeting should be followed by a concise written summary so external stakeholders can track progress without needing to join every technical discussion.

The product goal for early April was framed deliberately in terms of capability rather than polish. The target is to show a version in which the basic trade functionality runs in a decentralized way. High-end frontend quality and maximum performance are not the immediate priority. What matters first is proving that the architecture works end to end with a basic interface.

One final theme was implementation strategy. The team is open to running an AI-assisted migration path in parallel with a manually developed one and then comparing the performance gap before committing to a long-term direction. There was also a suggestion to reconnect the earlier C++ matching version to Kafka and run it on-chain, while first translating the Rust version to preserve functional completeness before later optimization. The consistent message across these ideas is that correctness and migration continuity should come before aggressive tuning.
