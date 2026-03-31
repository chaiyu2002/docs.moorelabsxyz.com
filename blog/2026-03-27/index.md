---
slug: /2026-03-27-engineering-and-operations-notes
title: 03-27 Engineering and Operations Notes
date: 2026-03-27
authors: [andy]
tags: [project, progress, update]
---

On March 27, we aligned on several practical directions across engineering, infrastructure, and content operations.

<!-- truncate -->

On the engineering side, the discussion focused on Lyquid's instance-based execution, synchronization, and multi-threading. One of the recurring themes was the shift from a network-centric implementation model toward an instance-centric one, with more attention on how synchronization, locking, and multi-threading should work in a production-grade path. The broader goal is not just to make the current code compile and run, but to understand how an instance-based design can support a more efficient consensus (consensus among participating instances) and validation pipeline.

We also reviewed testing progress. Most of the test cases had already been translated and organized around the current call chain, with only a smaller portion still pending. That gave us a better view of where the codebase is already stable enough for comparison testing and where more refinement is still needed before broader validation.
