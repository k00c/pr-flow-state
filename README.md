# PR Flow State

Can PR reviews be enjoyable?

## The Problem

### What breaks flow in current PR reviews
- PRs lack embedded context.
- Review process disconnects from original intent.
- Automated checks overwhelm signal with noise.
- Every change is forced through the same heavy PR workflow, even when the risk or impact doesn’t justify it.
- Big, high‑impact changes often get jammed together with smaller fixes, creating oversized PRs that are harder to review and more error‑prone.
- AI‑generated PRs frequently include superfluous debug or temporary files, which creates cleanup overhead and distracts from the meaningful changes.

### Real examples from my experience
- When experimenting in repos for learning, I often return to PRs with little context and end up “ticking boxes” rather than meaningfully reviewing.
- Even trivial changes (docs, config tweaks) get pushed through the same PR ceremony, which creates overhead without adding value.
- “While I’m here” fixes cascade into larger PRs, pulling in many files and making reviews more complex than they need to be.
- AI‑assisted branches often contain leftover debug artifacts, adding noise and forcing reviewers to mentally filter out irrelevant files.

### Why this matters for team velocity
- As AI becomes a co‑developer, traditional PR workflows break down even further. There’s a growing risk of implementations drifting away from the plan.
- Flow breaks → reviews stall → features stall → teams disengage.  
- Review fatigue sets in when low‑risk changes demand the same attention as high‑impact ones, draining energy from the reviews that actually matter.
- Oversized PRs increase cognitive load, slow down feedback, and raise the chance of subtle issues slipping through.
- PR pollution from debug or temporary files wastes reviewer energy and delays delivery.

### What flow would look like
- An enjoyable PR review would surface intent first, highlight meaningful changes, and feel like contributing to delivery rather than policing.
- The level of ceremony would match the level of risk: trivial changes flow through lightly, while high‑impact changes get the deep collaborative review they deserve.
- PRs would stay scoped and coherent, so reviewers can focus on the *story of the change* rather than untangling unrelated edits.
- Noise‑free by default: irrelevant artifacts never reach the reviewer’s eyes — they’re flagged or quarantined so cleanup happens before collaboration begins.
- This repo explores whether we can prototype workflows that make that vision real.

## The Vision

PR reviews should feel like collaboration, not compliance.  
The aim is to design workflows where reviewing code is part of delivering value, not a bottleneck.

### Core Principles
- **Intent first**: Every review begins with *why* the change exists, not just *what* changed.
- **Right‑sized ceremony**: The level of review matches the level of risk — trivial changes flow lightly, high‑impact changes get deep collaboration.
- **Context packaged**: Reviewers see the relevant story, design decision, or risk area without hunting for it.
- **Signal over noise**: Automated checks summarize outcomes and highlight only what needs human judgment.
- **Scoped and coherent**: PRs stay focused on a single story, avoiding the “while I’m here” sprawl that creates oversized, tangled reviews.
- **Noise‑free by default**: Debug files, temporary artifacts, and generated cruft are automatically quarantined so reviewers only see what matters, and submitters can clean up without human prompting.
- **Flow‑preserving**: Reviews fit naturally into deep work, rather than pulling developers out of it.
- **Shared ownership**: A PR review should feel like helping ship the feature, not gatekeeping it.

### What Success Looks Like
- Reviews are faster *and* more meaningful.
- Developers feel energized by reviews, not drained.
- AI and human reviewers collaborate seamlessly, each doing what they’re best at.
- Teams experience fewer stalls, less drift from intent, and more confidence in delivery.
- PRs become a trusted unit of collaboration, not a source of friction.

### This Repo’s Purpose
This project is a lab for exploring whether PR reviews can be redesigned to achieve this vision.  
Through small experiments, prototypes, and reflections, I’ll test ways to make PR reviews enjoyable and flow‑inducing.

## Experiments
### Weekend Sprint 1: 26/10/25
- **Goal**: PR Noise Detector - A bot that identifies superfluous files in a PR.
### Steps to Implement
1. **Create a GitHub Action**
   - Add a workflow file: `.github/workflows/pr-noise-detector.yml`
   - Trigger on `pull_request` events (open, synchronize)
   - Check out the PR branch

2. **Write the detection logic**
   - Script scans for common noise patterns:
     - Debug files: `*.log`, `debug.*`, `tmp/*`
     - IDE artifacts: `.vscode/`, `.idea/`
     - Build outputs: `dist/`, `build/`, `*.pyc`
     - Test artifacts: `coverage/`, `.pytest_cache/`
   - Output a list of flagged files

3. **Comment on the PR**
   - Use GitHub’s API to post a comment
   - Format:  
     ```
     ⚠️ Found 3 potentially superfluous files:
     - debug.log
     - tmp/output.txt
     - .vscode/settings.json
     ```
   - Provide rationale so submitters can clean up without reviewer prompting

4. **Make it configurable**
   - Support a `.pr-noise-ignore` file in the repo
   - Allow teams to customize what counts as “noise”

## Outcome
- **What I tried**: 
- **What I learned**:
- **Artifacts**: [Links to code/diagrams]

## The Bigger Pattern
How this connects to platform thinking and developer experience

## Next Steps
