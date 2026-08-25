# chrono-pi — Agent loop

> How the implementation agent reports and how follow-up happens during the build.

## Strictness level

**Chosen level:** `solo`

**Motivation:** One operator, no external contributors. Reporting is lightweight and lands in chat; there is no team ceremony.

## Loop structure

**Cadence:** Per step. `spec-first` mode requires the agent to narrate each pre-approved step, so the loop is fine-grained.

**Cycle:**
```
[init] → [start step → execute → commit → report] → [operator glance] → [next step]
```

The operator does not gate every step in real time; the narration exists so a long autonomous run is auditable and a stall is visible. The operator reviews at natural breakpoints (end of a phase, the release PR).

## Report format

**Format:** Short chat lines per step. No `status.json` is required at `solo`, but a one-line-per-step trail is mandatory in `spec-first` mode.

Per step:
- **Start:** `Step N — <what is about to happen>`.
- **End:** `Step N done — <what was produced>` plus the commit hash.

## Reporting channel

Chat with the operator. An external channel (e.g. a notification) can be added later for unattended overnight runs, but is not required for v1.0.

## Frequency and triggers

- At the start and end of each step.
- On a blocker.
- On a failed CI run.
- At the end of each phase, a short summary against that phase's "done when".

## Escalation rules

| Situation | Action |
|-----------|--------|
| Blocker (cannot continue) | Report directly, wait for the operator |
| Two failed attempts | Pause, escalate with a brief summary |
| Unclear requirement | Ask one specific question, do not guess |
| A contract in 03 cannot be honoured as written | Stop, escalate before deviating — do not silently redesign an interface |
| Produced date conflicts with the reference table | Record the variance (date, calendar, both values); do not edit the table to match the code |
| Critical file missing | Report which one and why, wait |
| Data-loss risk | Stop immediately, escalate |

## Operator's follow-up rhythm

The operator reviews at each phase boundary and at the release PR. Responsibilities: confirm phase completion, resolve blockers, and approve the release PR.

## Termination criteria

The loop ends when:
- [ ] All steps in `03-short-horizon.md` (and the later phases as expanded) are done.
- [ ] The reference-table regression suite is green.
- [ ] The historical and next collisions are reproduced.
- [ ] The site builds and deploys; the Google sync runs idempotently over the lifetime window.
- [ ] CI is green on `main`.
- [ ] The operator acknowledges v1.0.

## Error handling at loop level

| Scenario | Handling |
|----------|----------|
| Agent stuck | Pause, report, wait for input |
| Operator absent | Finish the current step cleanly, document state, stop without leaving `main` red |
| Conflict between documents 01–06 | Escalate, ask which document applies |
| External dependency down (Google API) | Report, retry after a short interval, escalate after two attempts |
