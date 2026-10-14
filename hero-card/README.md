# Hero card (shelved)

The graded trading-card hero that sat to the right of the headline. Pulled out
on 2026-10-14 because `images/andrew.jpg` was never added, so the card rendered
as an empty frame with "AG" initials in it — which reads as unfinished template
text to anyone who doesn't already know it's a card motif.

Nothing is wrong with the design. It goes back as soon as there's a photo.

## What's here

| File             | Goes back into                                           |
| ---------------- | -------------------------------------------------------- |
| `hero-card.html` | `index.html`, inside `<section class="hero">`, after `</div>` closing `.hero-copy` |
| `hero-card.css`  | `style.css`, between the `.coursework` rules and `/* ---------- Sections ---------- */` |
| `hero-card.js`   | `script.js`, above the `// Project carousel.` block       |

## To restore

1. Add the photo at `images/andrew.jpg` — portrait crop, head and shoulders,
   roughly 800x1000 (4:5). The frame is `object-fit: cover`, so anything close
   to 4:5 works; anything wider gets cropped at the sides. Plain or blurred
   background reads best against the purple plate.
2. Paste the three files back into the three places in the table above.
3. In `style.css`, restore the two-column hero — replace the current `.hero`
   rule with:

   ```css
   .hero {
     display: grid;
     grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
     align-items: center;
     gap: 3rem 4rem;
     max-width: var(--wrap);
     margin: 0 auto;
     padding-top: clamp(2.5rem, 7vh, 5rem);
   }
   ```

   The narrow-screen overrides are at the bottom of `hero-card.css`; fold those
   two lines back into the existing `@media (max-width: 52rem)` block rather
   than leaving a second one.
4. Check the flip (click, and Enter/Space when focused) and the cursor tilt.

## Known detail

`<img onerror="this.remove()">` is what makes it fall back to the "AG" initials
when the photo is missing. Keep it — but the initials state is the state that
got this shelved, so don't ship it that way again.
