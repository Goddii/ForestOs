# Bett's thoughts

**Branch:** `bett-v2-presentation` · **Updated:** 2026-09-17

> Working notes, not a spec. What I'm thinking, where the branch is, and what
> I'm still stuck on. Read the top two sections if you only have a minute.
>
> `betts-thoughts.html` sits next to this file and renders it in a browser, so
> this is the only thing to edit. It is a standalone viewer — not part of the
> app, not built, not deployed.

---

## Where the branch is

v2 is a **stakeholder explainer**, not a product build. Everything is mock data
on purpose. The job is to make the *argument* legible so NTZDC can correct us.

Working tree only so far — nothing committed. Lint and build are clean.

**The through-line I'm building toward:** we are not asking anyone to trust a
badge. Here is the number, here is what it decomposes into, here is who
independently checks it, here is what we can't prove, and here is the person
whose name is on it.

---

## What changed in v2

**Consumer — repeat engagement made real**
- Passport is now durable (`src/lib/visitorPassport.js`), survives reload, spans
  communities. Re-scanning a pack you own counts as a re-scan, not a new item.
- Status ladder: Visitor → Landscape Explorer → Guardian → Custodian.
- Second tenant `/qr-experience/rangers` on its own real batch (`733`,
  Cherangany). "Scan another" walks you to the other community and carries the
  passport across — that's the proof the front end is swappable.

**Phase 1 — the hole Edwin flagged**
- New Collection Centre role `/dashboard/centre`. Record Delivery captures all
  nine of his Q2 fields, with the farmer's SMS shown as exact text.
- Farmer Quality `/dashboard/centre/quality` — rejection rate per farmer (Q11).
- Farmer Training rebuilt (Q12): the data decides who needs help, and the
  before/after rejection rate decides whether it worked. Trained-and-no-better
  escalates instead of re-enrolling.

**Forest Line integration**
- `contracts/shapes.js` now declares the six records Forest Line emits:
  `WorkTicket`, `MusterRecord`, `DayLot`, `PaymentRecord`, `SurvivalCheck`,
  `SignOff`. The two repos are one contract now, not two proposals.
- New Evidence Chain module `/dashboard/evidence` — the sign-off gate, day-lot
  reconciliation (with one deliberately flagged lot), work tickets, payments
  with SMS-receipt status, survival vs planting, the corroboration table, and
  the limits we state before an auditor finds them.

---

## Decisions I made — argue with these

| Decision | Why | Cost to reverse |
| --- | --- | --- |
| Second tenant club is **fictional** (Kapsara Rangers FC) | A real club's name on a mock conservation record is a false claim about a real organisation, and this gets shown outside the team | Low — one config block |
| Gate shows a **failing** day lot | A control nobody has seen fail isn't credible | Low |
| Passport is device-only (localStorage) | No backend; stated on screen rather than hidden | Medium — needs `ownerContact` |
| Re-scan ≠ new collection item | Inflating the collection would be the dishonest version of repeat engagement | Low |
| Price per kg not editable at the centre | A centre paying its own number breaks the fair-pay claim | Low |
| Satellite kept prominent | Edwin's Q13 deprioritises it, but it's our most legible proof surface | Low |

---

## Open — needs someone else

**For NTZDC / Edwin**
- [ ] **The modelling conflict (biggest one).** My Record Delivery models a
      *farmer delivering their own leaf*; Forest Line models a *worker plucking
      assigned buffer land*, weighed by a supervisor. Two different events, two
      record shapes, and ForestOS currently holds both without saying how they
      relate. Does the belt have both populations, or is one model wrong?
- [ ] **Vocabulary.** Zone → block → plot → section (Forest Line) vs block/plot
      (ForestOS). It's in every identifier. Cheap now, expensive after build.
- [ ] Factory segregation — Chain A ends at the factory gate without it.
- [ ] Identity at onboarding — neither repo has registration. Phase 1, no owner.
- [ ] Are the rate figures (KES 210 / 14 / 3) safe to show? Q10 says nothing is
      agreed; right now they read as settled.

**For the team**
- [ ] **Do we build the commercial model into the app?** Q6 names subscription +
      verification fee + commission + ESG programme fee. Nothing in the app says
      who pays what. I think it's the highest-value gap since ESG companies are
      the primary payer — but it means a prototype that has avoided commercials
      starts making revenue claims. *Asked twice, still unanswered.*
- [ ] Should the presentation re-sequence to lead with Phase 1? Honest to the
      client's plan, but our weakest surfaces.

---

## Next up (my queue)

1. Resolve or at least frame the farmer/worker modelling conflict.
2. Commercial model surface — *if* the team says yes.
3. "Not agreed / illustrative" markers on every rate figure (Q10).
4. QR issuance — Phase 1 item, currently just an icon.
5. Dispute resolution: I now *show* a disputed ticket, but nothing resolves it.

---

## Notes

- Demo path: `/dashboard/evidence` → `/dashboard/centre` → `/dashboard/ops/training`
  → `/qr-experience` → Belong → Scan another.
- Nobody has looked at any of this in a browser yet. Verified by lint, build,
  route checks and direct logic tests only. **Someone please click through it.**
- Reset the consumer demo with "Reset demo" on the Belong screen — the passport
  persists across reloads now, so a stale collection will follow you into a
  presentation.
- Forest Line lives at `../Forest-Line-App`, branch `presentation-v2`. Its
  `designs/docs/01-alignment.md` is the one to read first.

---

<small>Editing: this file is the only source. Headings, lists, `[ ]` checkboxes,
tables, links, bold/italic, code, blockquotes and `---` all render. Save and
refresh the viewer. To open the viewer: `python3 -m http.server` in this folder,
then visit `localhost:8000/betts-thoughts.html`.</small>
