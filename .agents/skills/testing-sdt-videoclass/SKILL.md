---
name: testing-sdt-videoclass
description: Test the SDT VideoClass React/Vite frontend end-to-end. Use when verifying course video, comments, question submission, or teacher panel changes.
---

# SDT VideoClass testing

## Devin Secrets Needed

None for the current frontend-only app. The deployed preview and local Vite app are public/static and do not require login.

## Setup

- Install dependencies with `npm install`.
- Run local dev server with `npm run dev`.
- Validate code with `npm run lint` and `npm run build`.
- A public static preview can be tested directly when available.

## End-to-end smoke flow

1. Open the app in a browser.
2. Click `Ver mis cursos` or scroll to the courses section.
3. Select a course card and verify the video panel, lesson title, duration pill, and comments change to that course.
4. In `Preguntas al profesor`, type a specific question and attach a small image or video file.
5. Click `Enviar pregunta`.
6. Scroll to `Vista profesor` and verify the new question appears with:
   - student `Tú`
   - status `Nueva`
   - selected lesson title
   - exact submitted text
   - attachment chip (`Imagen · <filename>` or `Video · <filename>`)
   - `Responder / dar review` button

## Notes

- Current question/comment storage is browser state only; do not refresh before checking the teacher panel.
- If using the file picker in the VM, place a small test media file in `/home/ubuntu` so it is easy to select from the Home folder.
