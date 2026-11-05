# Open blanks (nothing here is filled, softened or invented)

Every item below stays visible on the review build exactly as the source text has it.
`build.py --publish` refuses while any of them (or any `CHECK` marker, `TODO(founder)`) remains.

## Privacy policy (source: founder's v2, app PR #358)
| Where | Blank | Who fills it |
|---|---|---|
| Top | `**Effective date:** [DATE]` | founder (publication day) |
| § 9 Data Retention | `**Security logs and report retention:** [CONFIRM APPLICABLE RETENTION PERIODS OR CRITERIA]` | founder + lawyer |
| § 9 Data Retention | `within [7] days` (backups; a bracketed value in the v2 text, and the same paragraph says there are no scheduled backups) | founder: confirm or drop |
| § 16 Contact Us | `Mailing address or additional contact details: [COMPLETE IF REQUIRED FOLLOWING LEGAL REVIEW]` | lawyer |

## Terms of service (source: the #295 draft, `docs/legal/terms-draft.md`)
| Where | Blank |
|---|---|
| Top | `_Last updated: [DATE]_` |
| § 2 and § 16 | `[NAME / ENTITY]` (the policy names Mehmet Aydin as an individual; the terms still need the entity decided) |
| § 16 | `[POSTAL ADDRESS]` |
| § 15 Governing law | `[STATE]` (the draft wrote `[REGION]` here; see the note in the PR) |
| § 7 | `[REPORT DAYS]` (report-copy retention) |
| Footer of all pages | `© … [ENTITY NAME]` |
| § 2 ×2, 4, 5, 6 ×5, 7 ×4, 8, 9, 10, 11, 14, 15 ×4 | every `**CHECK:**` marker (counsel decisions), kept as written |

## Support
| Where | Blank |
|---|---|
| Bottom | `TODO(founder): confirm these support instructions against the current build` |
