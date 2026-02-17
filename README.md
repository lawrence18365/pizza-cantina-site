# Pizza Cantina Launch Site

Production-ready static website for Pizza Cantina (Toronto Junction), built with:

- Mobile-first responsive layout
- SEO-friendly media names and metadata
- Conversion-first UX (sticky order CTA, best-sellers, map, trust section)
- Accessible semantic HTML
- Preloader video intro (16:9) with reduced-motion support

## Run locally

```bash
cd /Users/lawrence/Desktop/pizza
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Key files

- `/Users/lawrence/Desktop/pizza/index.html`
- `/Users/lawrence/Desktop/pizza/styles.css`
- `/Users/lawrence/Desktop/pizza/script.js`
- `/Users/lawrence/Desktop/pizza/assets/images/*`
- `/Users/lawrence/Desktop/pizza/assets/video/pizza-cantina-preloader-intro-16x9.mp4`

## Launch checklist

1. Confirm your preferred order URL if you want direct online checkout (currently `tel:` call CTA).
2. Deploy to your host (Cloudflare Pages, Netlify, Vercel, etc.).
3. Point DNS for `pizzacantina.ca`.
4. Submit `https://pizzacantina.ca/sitemap.xml` in Google Search Console.
