# 🎨 Image Generation Prompts for Foddo

The app currently uses curated **Unsplash** photography (free to use, hot-linked).
If you'd rather generate your own unique, on-brand imagery, use the prompts below.

## Where images are used
| Location | What it needs | How to swap |
| --- | --- | --- |
| Hero background | A warm, cinematic dining scene | Edit the `<img src>` in `src/components/sections/Hero.tsx` |
| About section | Chef plating / kitchen craft | `src/components/sections/About.tsx` |
| Delivery section | Fresh meal tray / food prep | `src/components/sections/DeliverySection.tsx` |
| Reservations | Elegant restaurant interior | `src/app/reservations/page.tsx` |
| Testimonial avatars | Portrait headshots | `src/components/sections/Testimonials.tsx` |
| **Menu dishes** | Individual plated dishes | Seed file `prisma/seed.ts` → re-run `npm run db:reset`, OR edit each item's Image URL in the Admin → Menu panel |

> Tip: Generate images, drop them into `public/images/`, then reference them as
> `/images/your-file.jpg`. Local files don't need the `next.config.js` remote-pattern allowlist.

---

## 🔧 Free image-generation tools you can use
- **Bing Image Creator** (DALL·E 3, free) — https://www.bing.com/images/create
- **Leonardo.Ai** (free daily credits) — https://leonardo.ai
- **Playground AI** (free tier) — https://playground.com
- **Ideogram** (great at text/logos, free tier) — https://ideogram.ai
- **Stable Diffusion via Hugging Face Spaces** (free) — https://huggingface.co/spaces (search "SDXL")
- **Krea.ai** (free real-time gen) — https://krea.ai
- **Adobe Firefly** (free credits, commercially safe) — https://firefly.adobe.com

### Free stock photo sources (no generation needed)
- **Unsplash** — https://unsplash.com/s/photos/food (already used)
- **Pexels** — https://pexels.com
- **Foodiesfeed** (food only) — https://foodiesfeed.com

---

## 📝 The Prompts

### 1. Hero background — cinematic shared dinner
```
A warm, cinematic overhead-to-eye-level shot of a diverse group of friends sharing
an elegant dinner around a round table, soft golden hour window light, rich earthy
tones, plates of beautifully plated food, glasses of red wine, shallow depth of field,
moody premium restaurant ambiance, editorial food photography, 35mm, ultra detailed,
8k --ar 16:9
```

### 2. Signature steak (Truffle Wagyu)
```
Top-down studio photograph of a seared A5 wagyu steak finished with black truffle
butter and red-wine jus, on a matte ceramic plate, microgreens, dramatic side
lighting, dark slate background, glossy highlights, Michelin-star plating, hyper
detailed food photography --ar 4:3
```

### 3. Omakase sushi set
```
A minimalist arrangement of eight pieces of premium nigiri sushi on a dark slate
board, fresh wasabi and aged soy, glistening fish, soft studio light, Japanese fine
dining aesthetic, shallow depth of field, ultra sharp, 8k --ar 4:3
```

### 4. Butter chicken (Indian)
```
A rich, creamy butter chicken curry in a copper bowl, velvety orange tomato-cashew
gravy, fresh cream swirl and fenugreek garnish, warm spice tones, rustic dark wood
table, steam rising, appetizing professional food photography --ar 4:3
```

### 5. Smash burger deluxe
```
A double smash burger with aged cheddar, house pickles and a glossy brioche bun,
juicy and dramatic, dark moody background, rim lighting, crumbs and texture detail,
premium fast-casual food photography, mouthwatering --ar 4:3
```

### 6. Molten chocolate lava dessert
```
A warm dark-chocolate lava cake with liquid center flowing out, scoop of vanilla
bean gelato, dusted cocoa, gold fork, elegant dark plate, soft spotlight, luxurious
dessert photography, glossy and rich --ar 4:3
```

### 7. Signature cocktail (Old Fashioned)
```
A barrel-aged old fashioned cocktail in a heavy crystal glass, large clear ice cube,
flamed orange peel, amber bourbon glow, dark bar backdrop with bokeh, premium
beverage photography, dramatic warm lighting --ar 4:3
```

### 8. Chef plating (About section)
```
Close-up of a chef's hands precisely plating a gourmet dish with tweezers in a
professional kitchen, motion and focus, warm tungsten light, stainless steel,
documentary fine-dining feel, cinematic shallow depth of field --ar 4:5
```

### 9. Restaurant interior (Reservations)
```
An elegant modern restaurant interior at golden hour, warm pendant lighting, plush
seating, set tables with candles, lush plants, inviting premium ambiance, wide angle
architectural photography, cozy and sophisticated --ar 16:10
```

### 10. Brand mark (optional logo)
```
A minimalist monogram logo for a premium restaurant named "Foddo", a clean stylized
letter C forming a plate/leaf, single warm yellow accent (#F5D547) on charcoal,
flat vector, modern, geometric, high contrast --ar 1:1
```

---

### Negative prompt (paste where supported)
```
blurry, low quality, distorted, deformed hands, extra fingers, watermark, text,
logo overlay, oversaturated, cartoonish, plastic-looking food, messy, cluttered
```

### Style keywords to keep it consistent
`premium · minimalist · warm earthy palette · charcoal + butter-yellow accent · cinematic light · editorial food photography · shallow depth of field · 8k`
