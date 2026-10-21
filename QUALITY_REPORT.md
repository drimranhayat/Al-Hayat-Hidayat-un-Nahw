# Verification report

## Scope

51 source-aligned teaching units with all eight learning tabs: 153 reading sections, 124 rules/illustrations, 304 vocabulary placements, 102 sentence analyses, 204 translation tasks, 204 short Q&As and 255 MCQs. The site is a teaching synthesis, not a complete transcription of the 403-page source or an exhaustive solution of the appendix examination bank.

## Checks completed

- Corrected source-page metadata and source order, including **إن before کان** and **بدل before عطف بیان**.
- Checked JSON structure, unique lesson IDs, all eight content collections, answer indices, four distinct MCQ choices and sentence-token reconstruction.
- Reviewed grammatical roles, case endings and translation consistency across all six content batches, including a second editorial review across all units.
- Checked designated Arabic examples and vocabulary for vowel marks; no unmarked whole words remained in the checked fields.
- DOM tests exercised every unit and tab, all 255 quizzes, feedback/retry, 204 translation tasks, model-answer reveal, stored drafts, self-assessment, word recall, remembered words and stage progression.
- Verified theme controls, about dialog, search, topic filters, blocked/corrupt storage recovery and on-demand lesson loading.
- The production homepage uses a **12,627-byte catalogue** and loads no full lesson initially. A unit is fetched once per session and reused. This is a behavior check, not a network-speed benchmark.
- Checked fourteen main reading-color pairs across light/dark modes; minimum contrast **7.05:1**. All 51 unit accent palettes also passed, with a minimum of 7.60:1. Labels and text accompany colors.
- Local WOFF2 file headers and lengths were verified. HarfBuzz shaping checks passed for Arabic and Urdu samples; all 62 Arabic/Urdu letters and marks used in the checked content are covered by the bundled reading fonts.
- The release excludes PDFs, scanned pages, OCR dumps, temporary authoring files and `node_modules`.

## Limits

Browser-control tooling was unavailable. Real-browser visual layout, device rendering and measured network timing were not tested. DOM checks do not substitute for visual testing. Editorial checks reduce errors but do not guarantee that every linguistic interpretation is beyond disagreement. Free translations are presented as model answers with self-assessment.
