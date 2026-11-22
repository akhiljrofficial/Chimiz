# Chimizh Antiques: website

A one-page vintage website with 3D parallax effects. There's no build step: open `index.html` in a browser.

## Sections (top to bottom)
1. **Preloader**: the name centred on aged paper with ornamental corners, three small vessels and a thin progress line; it lifts like a curtain to reveal the site
2. **Hero**: a real-time 3D brass kalasham (Three.js) with layered cutouts that react to the mouse and fly past as you scroll
3. **Tickers**: torn-paper ribbons
4. **Our Story**: words ink in as you read; an oval Victorian frame and a taped note
5. **The Cabinet**: pinned horizontal 3D gallery of vessel forms (showcase images)
6. **Materials**: giant words slide past and fill with metal colour
7. **Services**: tickets that flip in and tilt on hover
8. **Quote**: a wax seal stamps down
9. **Sell to Us**: an appraisal form styled as a letter (works with Netlify Forms)
10. **Visit**: postcard with a sepia map, address and hours
11. **Footer**

> The vessel photos in `img/` are **showcase images only, not the client's products** and not for sale.
> The site labels them "for illustration only".

## Files
| Path | What it is |
|---|---|
| `index.html` | The page |
| `assets/css/style.css` | All styles; colours and fonts are at the top |
| `assets/js/data.js` | **Edit here:** phone, WhatsApp, address, hours, and the showcase list |
| `assets/js/main.js` | Animations (GSAP + ScrollTrigger) |
| `assets/js/vessel3d.js` | The 3D brass vessel |
| `assets/vendor/` | GSAP, ScrollTrigger and Three.js (local copies, so the site also works offline) |
| `assets/img/cutouts/` | Transparent PNG cutouts |

## Common edits
- **Contact details:** `SITE` in `assets/js/data.js`.
- **Logo:** in `index.html`, replace the two spans inside `.nav-brand` with `<img src="assets/img/logo.svg" alt="Chimizh" style="height:48px">`.
- **Add a vessel to the Cabinet:**
  1. Make a cutout (see below) and save it in `assets/img/cutouts/`.
  2. Add an entry to `SHOWCASE` in `data.js`.

## Making cutouts
```
python -c "from rembg import remove; from PIL import Image; im=remove(Image.open('img/NEW.jpeg')); im.crop(im.getbbox()).save('assets/img/cutouts/new-item.png')"
```

## Accessibility and performance
- Visitors whose system is set to reduce motion get a calm, static version of the page.
- If WebGL isn't available, the 3D vessel is replaced by a cutout image.
- The 3D scene and dust only render while the hero is on screen.

## Going live
Drag the `Chimizh` folder onto https://app.netlify.com/drop.
