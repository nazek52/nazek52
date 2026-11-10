<p>
  <img src="assets/profile-header.svg" alt="Rymbek Nazerke — DevOps / Platform Engineering. Reliable delivery, observable systems, reproducible experiments." width="100%">
</p>

I build practical tools for **safer releases, reliable services, and clearer incident response**. My projects connect backend engineering with observability and reproducible ML experiments.

**Start here:** [Release Guard](https://github.com/nazek52/release-guard#real-http-demonstration) · [Interactive field lab](https://nazek52.github.io/FloodShield/) · [Русский разбор проекта](https://github.com/nazek52/release-guard/blob/main/docs/INTERVIEW.ru.md)

## Selected work

<table>
<tr>
<td width="50%" valign="top">

### Release Guard
**Safer canary decisions**

A release gate that returns PASS, FAIL, or HOLD from baseline and candidate metrics. Stale or insufficient evidence blocks promotion.

<sub>Python · statistics · Docker · CI/CD</sub>

[Repository](https://github.com/nazek52/release-guard) · [Verification](https://github.com/nazek52/release-guard/blob/main/docs/verification.md)

</td>
<td width="50%" valign="top">

### Relay Ledger
**Reliable webhook delivery**

A durable queue with idempotency, signed payloads, bounded retries, and worker-crash recovery. Every delivery has an inspectable history.

<sub>Python · FastAPI · SQLite · HMAC</sub>

[Repository](https://github.com/nazek52/relay-ledger) · [Architecture](https://github.com/nazek52/relay-ledger/blob/main/docs/architecture.md)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Trace Lens
**Make request latency visible**

Import OTLP JSON, explore a nested waterfall, and investigate error spans. Trace data stays in the browser.

<sub>TypeScript · React · Web Workers · Playwright</sub>

[Repository](https://github.com/nazek52/trace-lens) · [Interface preview](https://github.com/nazek52/trace-lens/blob/main/docs/preview.png)

</td>
<td width="50%" valign="top">

### Shift Ledger
**Incident handoffs with context**

An incident desk with acknowledged ownership transfers, role checks, and a versioned audit trail. Concurrent edits cannot silently overwrite each other.

<sub>Python · FastAPI · SQLite · browser UI</sub>

[Repository](https://github.com/nazek52/shift-ledger) · [Interface preview](https://github.com/nazek52/shift-ledger/blob/main/docs/preview.png)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Drift Sentinel
**Model monitoring without future leakage**

A reproducible experiment with chronological splits, delayed labels, baseline comparisons, and drift diagnostics on synthetic incidents.

<sub>Python · scikit-learn · temporal evaluation</sub>

[Repository](https://github.com/nazek52/drift-sentinel) · [Model card](https://github.com/nazek52/drift-sentinel/blob/main/docs/model-card.md)

</td>
<td width="50%" valign="top">

### FloodShield
**From scenarios to field review**

An interactive research prototype for runoff scenarios, historical flood evidence, and drainage comparisons. Includes a guided browser demo.

<sub>JavaScript · Node.js · GeoJSON</sub>

[Repository](https://github.com/nazek52/FloodShield) · [Live demo](https://nazek52.github.io/FloodShield/)

</td>
</tr>
</table>

## Tools I use

| Area | Technologies |
| :--- | :--- |
| Backend & data | Python, FastAPI, SQLite, PostgreSQL |
| Delivery & observability | Docker, GitHub Actions, Prometheus, Grafana, OpenTelemetry |
| Interfaces & testing | TypeScript, React, Web Workers, pytest, Playwright |
| ML experiments | scikit-learn, PyTorch, LoRA, Triton |

## Also exploring

- **[TuneProof](https://github.com/nazek52/tuneproof)** — a small CPU-runnable LoRA experiment with held-out evaluation and a zero-learning-rate control.
- **[Soup Kernel Lab](https://github.com/nazek52/soup-kernel-lab)** — RMSNorm and cross-entropy kernels, with numerical checks and a reproducible CPU demo. GPU performance is not yet measured.

<details>
<summary><strong>Infrastructure labs & review guide</strong></summary>

- [Service Observability & Recovery](https://github.com/nazek52/service-observability-recovery-lab) — a PostgreSQL-backed API, Prometheus/Grafana, and outage/recovery exercises.
- [Containerized Service Delivery](https://github.com/nazek52/containerized-web-service-delivery-lab) — a focused container delivery lab.

For the DevOps projects, start with the documented local scenario, inspect the verification notes, and read the architecture decisions. Russian walkthroughs are available in the repositories.

</details>

---

<sub>Personal learning and engineering projects, developed with AI assistance. Synthetic data and controlled failure scenarios are labeled. These projects do not represent production employment, customer traffic, or production SLAs. FloodShield is a research prototype, not an operational forecasting or warning system.</sub>
