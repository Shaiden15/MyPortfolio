# Project screenshots

Drop screenshots here and the cards pick them up automatically — no code changes.

## Filenames

Each card looks for one exact filename. Until the file exists, the card shows a
tinted placeholder with the project's initials, so a missing screenshot never
looks broken.

| Project | File |
|---|---|
| PayITSmart | `payitsmart.png` |
| Biometrics24-7 | `biometrics24-7.png` |
| BuzzTicket | `buzzticket.png` |
| WhizzFleet | `whizzfleet.png` |
| AwehPay | `awehpay.png` |
| MediIntel | `mediintel.png` |
| GovGuide SA | `govguide-sa.png` |
| AI Learning Adventure | `ai-learning-adventure.png` |
| NexusOS | `nexusos.png` |
| Facial Recognition Attendance | `facial-recognition-attendance.png` |
| SVG Converter | `svg-converter.png` |
| Peer-to-Peer Tutoring | `peer-to-peer-tutoring.png` |

## What to capture

- **1600×1000** or similar 16:10 ratio. Cards crop from the top, so put the most
  interesting part of the UI in the upper portion.
- Keep them under ~300KB each — run them through [squoosh.app](https://squoosh.app)
  if they're heavy. They lazy-load, but the lightbox shows them full size.
- **Blur or replace any real data.** PayITSmart shows real payslips,
  Biometrics24-7 shows real employees, and WhizzFleet shows a real client's fleet.
  Use demo/seed data or redact before publishing anything publicly.
- Screenshot in dark mode if the app supports it — it sits better with the site.

## Adding a new project

Set the `<img src>` in the card to `assets/shots/<your-slug>.png`. Any filename
works; the table above is just what the current cards expect.
