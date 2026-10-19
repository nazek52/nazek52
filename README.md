# Rymbek Nazerke

**DevOps / Platform Engineering portfolio**

I am building practical projects around reliable delivery, observability, incident workflows, and reproducible model monitoring. Each project below includes a local demonstration, automated checks, design decisions, and explicit limitations.

## Selected engineering projects

| Project | Engineering problem | Evidence |
|---|---|---|
| [Release Guard](https://github.com/nazek52/release-guard) | Prevent unsafe canary promotion when metrics are stale, insufficient, or worse than baseline | Conservative statistical gate; healthy/degraded Docker experiments; retained HTTP reports |
| [Relay Ledger](https://github.com/nazek52/relay-ledger) | Deliver signed webhooks reliably across retries and worker crashes | Durable queue, idempotency, expiring leases, fencing, real 503 → 503 → 200 smoke test |
| [Trace Lens](https://github.com/nazek52/trace-lens) | Inspect distributed request latency without uploading private traces | React/TypeScript, OTLP parsing Worker, waterfall, interval math, browser tests |
| [Shift Ledger](https://github.com/nazek52/shift-ledger) | Transfer incident responsibility without losing ownership or context | Acknowledged handoffs, role checks, optimistic concurrency, atomic audit events |
| [Drift Sentinel](https://github.com/nazek52/drift-sentinel) | Evaluate model degradation without leaking future incident labels | Chronological evaluation, delayed-label cutoffs, baseline comparison, drift diagnostics |

## Infrastructure foundations

- [Service Observability and Recovery Lab](https://github.com/nazek52/service-observability-recovery-lab): PostgreSQL-backed API, Prometheus/Grafana, outage and recovery procedures.
- [Containerized Web Service Delivery Lab](https://github.com/nazek52/containerized-web-service-delivery-lab): a separate container delivery lab.

## How to review this portfolio

Start with **Release Guard** for the DevOps focus. Run the documented scenario, inspect `docs/verification.md`, and read `docs/architecture.md` for tradeoffs. The repositories also include Russian interview walkthroughs with questions and extension exercises.

These are personal learning and engineering projects, developed with AI assistance. Synthetic datasets and controlled failure scenarios are labeled. They are not claims of production employment, customer traffic, or production SLAs.
