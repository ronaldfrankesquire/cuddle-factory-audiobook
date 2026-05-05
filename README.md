# Cuddle Factory Audiobook

Static web audiobook reader for the 12 illustrated pages and matching narration clips.

## Run Locally

```sh
python3 -m http.server 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

## Asset Layout

- `assets/cover/cover.png` is the cover/title image.
- `assets/pages/1.png` through `assets/pages/12.png` are the story pages.
- `assets/audio/1.m4a` through `assets/audio/12.m4a` are the matching narration files.

Replacing any page or narration file with the same filename will update the reader automatically.
