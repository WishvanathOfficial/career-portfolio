# Wishvanath Sah — Portfolio

A static, dependency-free portfolio site (HTML + CSS + vanilla JavaScript). No build step.

## Structure

```
portfolio-deploy/
├── index.html                  # the single-page site
├── 404.html                    # not-found page
├── favicon.svg
├── robots.txt
├── .nojekyll                   # tells GitHub Pages to serve files as-is
└── assets/
    ├── css/style.css           # all styles (light + dark themes)
    ├── js/main.js              # theme toggle, tabs, filters, animations
    ├── img/profile.jpg         # profile photo
    └── resume/Wishvanath_Sah_Resume.pdf
```

## Preview locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

**GitHub Pages (recommended)**
1. Put the *contents* of this folder in the root of your Pages repository (for example `career-portfolio`).
2. Repo → Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

**Netlify / Vercel / Cloudflare Pages:** drag-and-drop this folder (or connect the repo). No build command; publish directory is the folder root.

## Customise

- Text and links: edit `index.html`.
- Colours and fonts: the CSS variables at the top of `assets/css/style.css`.
- Resume: replace `assets/resume/Wishvanath_Sah_Resume.pdf` (keep the same file name).
- Project links: the `Visit project` buttons in the Projects section of `index.html`. XCHANGE MONSTER and SkyMap GIS Solutions have no link yet.

## Notes

- Fonts (Inter, JetBrains Mono) load from Google Fonts; the site falls back to system fonts if offline.
- For social-sharing previews, add `<meta property="og:image">` pointing to an absolute URL of a 1200×630 image once the site is live.
