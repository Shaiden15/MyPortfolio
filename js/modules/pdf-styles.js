/* Print stylesheet for the exported PDF.

   Self-contained and light-themed on purpose: the export is a document, not
   a screenshot of the site, and it has to read on paper. */

export const PDF_CSS = `
@page { margin: 18mm; }

body {
  font: 11pt/1.6 -apple-system, "Segoe UI", system-ui, sans-serif;
  color: #15161a;
  margin: 0;
}

header {
  border-bottom: 2px solid #0f766e;
  padding-bottom: 11px;
  margin-bottom: 24px;
}
.doc-kicker {
  font-size: 8.5pt; text-transform: uppercase; letter-spacing: .12em;
  color: #0f766e; font-weight: 700; margin: 0 0 6px;
}
h1 { font-size: 21pt; margin: 0 0 3px; letter-spacing: -.02em; }
.role { color: #0f766e; font-size: 10.5pt; margin: 0 0 12px; font-weight: 500; }
.meta { margin: 0; font-size: 9pt; color: #5c5f66; line-height: 1.75; }
.meta strong { color: #15161a; font-weight: 600; }
.generated { margin: 6px 0 0; font-size: 8.5pt; color: #9a9ca2; }

h2 {
  font-size: 10pt; text-transform: uppercase; letter-spacing: .1em;
  color: #7b7d84; margin: 0 0 12px; font-weight: 600;
}

ul { padding: 0; margin: 0; list-style: none; }
li { position: relative; padding-left: 16px; margin-bottom: 9px; color: #35373d; }
li::before {
  content: ""; position: absolute; left: 0; top: .62em;
  width: 5px; height: 5px; border-radius: 50%; background: #0f766e;
}
code {
  font-family: ui-monospace, Menlo, monospace; font-size: .88em;
  background: #f0efec; padding: .1em .34em; border-radius: 3px;
}

.diagram { max-width: 460px; }
.layer { border: 1.5px solid #cfd6d4; border-radius: 9px; padding: 11px 13px; }
.layer:nth-child(1) { border-color: #0f766e; background: #f0f7f5; }
.layer-label {
  font-size: 8pt; text-transform: uppercase; letter-spacing: .1em;
  color: #0f766e; font-weight: 700; margin: 0 0 7px;
}
.chips { display: flex; flex-wrap: wrap; gap: 5px; }
.chip {
  border: 1px solid #d8dddb; border-radius: 20px; padding: 2px 9px;
  font-size: 8.5pt; background: #fff; color: #35373d;
}
.arrow { text-align: center; color: #0f766e; font-size: 13pt; line-height: 1; margin: 5px 0; }

.tree {
  font-family: ui-monospace, Menlo, "Courier New", monospace;
  font-size: 8pt; line-height: 1.65; color: #35373d;
  background: #f7f7f5; border: 1px solid #e3e2dd; border-radius: 6px;
  padding: 12px 14px; white-space: pre; overflow: hidden;
  page-break-inside: avoid; margin: 0;
}

.stack { font-size: 9pt; color: #7b7d84; margin-top: 22px; }
footer {
  margin-top: 30px; padding-top: 10px; border-top: 1px solid #e3e2dd;
  font-size: 8.5pt; color: #9a9ca2;
}
`;
