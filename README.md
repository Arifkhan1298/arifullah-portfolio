# Arifullah — Premium 3D Futuristic Portfolio Website

A fast, responsive, and modern 3D portfolio website crafted for **Arifullah (Software Engineer | Web & App Developer)**.

---

## 🌟 Key Features

1. **Zero-Build & GitHub Ready (Flat Root Directory)**:
   - All HTML, CSS, JavaScript, and asset files are located directly in the root directory.
   - Ideal for instant upload to GitHub (`arifkhan1298`) and 1-click deployment on GitHub Pages.
   - Simply double-click `index.html` in any web browser to run the entire website.

2. **Original Photo 3D Frame**:
   - The Hero section displays your original photo inside a futuristic 3D glass card with holographic backlighting, cybernetic corner brackets, and interactive 3D mouse parallax tilt.
   - Uses your image `ChatGPT Image Aug 17, 2026, 04_33_54 AM.png` directly in root.

3. **Lightweight 3D WebGL Engine (`three-scene.js`)**:
   - Interactive 3D particle constellation and starfield network powered by Three.js.
   - Features an automatic 2D canvas fallback for low-spec devices.

4. **Live GitHub API Integration (`github-api.js`)**:
   - Automatically fetches and displays public repositories from your GitHub account: **`arifkhan1298`**.
   - Includes fallback project showcase if offline or rate-limited.

5. **Interactive Dark / Light Mode Switch**:
   - Seamlessly toggle between dark cyber obsidian and clean light modes.

6. **Interactive CV & Print Engine (`cv.html`)**:
   - Dedicated clean, professional CV page with full education, skill competencies, and language breakdown.

7. **Centralized Configuration (`config.js`)**:
   - Update your email, phone, social media links, projects, and bio in a single file.

---

## 📁 File Structure (Flat Root for Direct GitHub Upload)

```
My profile/
├── index.html                           # Main portfolio website
├── cv.html                              # Printable / Downloadable CV template
├── style.css                            # Core design tokens, variables & typography
├── components.css                       # Navigation, cards, modals, 3D frame, forms
├── responsive.css                       # Mobile, tablet, high-DPI & print styles
├── config.js                            # Centralized profile data & links
├── three-scene.js                       # Lightweight 3D particles & Canvas 2D fallback
├── github-api.js                        # Live GitHub repository fetcher (arifkhan1298)
├── tilt.js                              # 3D mouse tilt & parallax engine
├── app.js                               # Main controller: theme, modals, navigation, forms
├── favicon.svg                          # Glowing cybernetic monogram favicon
├── profile-placeholder.svg              # Default avatar placeholder
├── ChatGPT Image Aug 17, 2026...png    # Your original photograph
└── README.md                            # Documentation
```
