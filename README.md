# ارشاد النحو — تدریسی مطالعہ

**ڈاکٹر عمران حیات کی تدریسی پیشکش**  
الحیات مرکز علوم اسلامیہ · [drimranhayat.com](https://drimranhayat.com/)

An Urdu teaching companion aligned to **ارشاد النحو، شرح اردو ہدایۃ النحو** by **مولانا ارشاد احمد**. It follows the source topic sequence while grouping related subtopics into 51 teaching units. The original book and author remain attributed. These are newly authored teaching explanations and activities, not a word-for-word book transcription.

## Learning experience

Every unit contains eight tabs:

1. **سبق (مضمون):** three numbered explanations, learning objectives and bilingual examples.
2. **عربی قواعد مع امثلہ:** rules, conditions and worked examples.
3. **الفاظ معانی:** Arabic/Urdu/English cards with grammatical classification, explanation, semantic icons, filters and recall mode.
4. **تراکیب اور ان کے معانی:** word roles, case explanations and stepwise sentence assembly.
5. **عربی سے اردو مشقیں:** writing space, model translations and grammatical reasoning.
6. **اردو سے عربی مشقیں:** writing space, fully vocalized model answers and self-assessment.
7. **مختصر سوالات و جوابات:** expandable conceptual answers with examples.
8. **کثیرالانتخابی سوالات:** feedback, reasons, score and retry.

The package contains **153 reading sections, 124 rule illustrations, 304 vocabulary placements, 102 sentence analyses, 204 translation tasks, 204 short Q&As and 255 MCQs**. Recurring terms are counted as placements across units.

Each unit has its own accent palette. Semantic colors remain consistent: blue for Arabic, green for Urdu meanings, amber for grammatical explanations and burgundy for questions. Amiri renders Arabic; Jameel Noori Nastaleeq renders Urdu with a local Nafees fallback. Fonts and runtime assets are local. Day/night mode, reading-size controls, keyboard navigation, mobile lesson navigation and browser-saved progress are included.

## Publish with GitHub Pages

1. Extract the ZIP and upload its **contents** to the repository root.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your branch and **/(root)**.
4. Save and open the URL provided by GitHub.

No build, server, API key or database is needed. `.nojekyll` is included. Do not upload `node_modules`; it is only used for development tests. You may also open `index.html` directly in a browser.

## Source coverage

The uploaded source has 403 scanned pages. The contents and selected teaching pages were inspected to establish the topic sequence and representative explanations. Front matter and advertising are excluded from the learning route. Closely related subtopics are consolidated; detailed disagreements and all source footnotes are not reproduced. The appendix unit explains application through new examples and **does not claim to solve the complete source examination bank**.

The site's exercises are new teaching activities. They should not be presented as a transcription of every original book exercise. Free translation permits multiple valid answers; self-assessment compares the learner's work with a model rather than pretending to grade arbitrary Urdu/Arabic automatically.

See `COVERAGE.md` for unit-by-unit page alignment and sample-inspection notes, `CONTENT_REVIEW.md` for the editorial corrections, and `QUALITY_REPORT.md` for the verification limits.

## Edit and verify

`data/course.json` is the editable source. After editing:

```sh
python3 scripts/sync.py
npm ci
npm run check
```

The sync script regenerates the small homepage catalogue, one JavaScript chunk per unit and the coverage map. Preserve unit IDs when updating content so existing learner progress remains associated with the same units. The homepage does not preload all reading and answer data; each unit loads when opened.

Browser storage holds drafts, recalled words, quiz attempts, reading-size preference and completed stages. Clearing that storage removes progress. If storage is blocked, learning remains available and a notice explains that progress is not being saved. There is no analytics or user account system.
