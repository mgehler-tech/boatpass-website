# Hero-Videos

Liegt hier ein Clip, ersetzt er im Hero automatisch das Foto der Szene (HeroPhoto.astro,
src/scripts/hero-stage.ts). Fehlt er, bleibt das Foto stehen. Es gibt nichts weiter einzutragen.

## Dateinamen

`{szene}-{licht}.mp4` für 2:3 (Paneel am Desktop und Band am Handy) und
`{szene}-{licht}-wide.mp4` für 16:9 (Band zwischen 640 und 1023 px).

- szene: `binnen` (SBF Binnen, UBI), `see` (SBF See), `funk` (SRC, LRC)
- licht: `day` (Hellmodus), `dusk` (Dunkelmodus)

Beispiel: `see-dusk.mp4`, `see-dusk-wide.mp4`. Zusätzlich darf es dieselbe Datei als `.webm`
geben; der Browser nimmt dann die kleinere WebM und fällt auf MP4 zurück.

## Vorgaben

- 8–10 s, nahtloser Loop, feste Kamera, keine Tonspur
- erster Frame = das vorhandene Foto in src/assets/images/hero/ (Bild-zu-Video)
- Bildmitte und unteres Drittel ruhiges Wasser, dort steht das Handy
- Web-Fassung: 2:3 in 1080 × 1620, 16:9 in 1920 × 1080, H.264, rund 1–2 MB je Clip
  (z. B. `ffmpeg -i roh.mp4 -an -vf scale=1080:-2 -c:v libx264 -crf 26 -preset slow -movflags +faststart binnen-day.mp4`)

Die Prompts zum Erzeugen stehen im Mockup zur Hero-Richtung (Abschnitt „Video-Prompts“).
