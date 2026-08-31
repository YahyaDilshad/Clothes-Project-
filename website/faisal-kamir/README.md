# Faisal Kamir — Men's Unstitched Clothing Website

Premium, fully responsive e-commerce frontend for a Pakistani men's unstitched
fabric brand. Built with React + Vite, Tailwind CSS, React Router DOM and
Lucide React. Frontend-only — all data is local mock data, and cart/wishlist/
orders persist to `localStorage`.

## Getting started

This project was written directly as source files (the build sandbox that
generated it has no network access, so packages were never installed or
compiled here). To run it locally:

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  data/            mock products, collections, reviews, fabric guide
  context/         CartContext, WishlistContext, ToastContext (all localStorage-backed)
  hooks/           useLocalStorage
  utils/           constants (WhatsApp number, PK cities/provinces)
  components/      reusable UI: Navbar, Footer, ProductCard, CartDrawer, FilterDrawer, etc.
  pages/           one file per route
  App.jsx          route table
  main.jsx         provider tree + root render
```

## Before going live

1. **WhatsApp number** — replace the placeholder in `src/utils/constants.js`
   (`WHATSAPP_NUMBER`) with the real business number, international format,
   no `+` or spaces.
2. **Product photography** — `src/data/products.js` and
   `src/data/collections.js` currently use placeholder images
   (`picsum.photos`, seeded so they render consistently). Swap the `img()`
   URLs for real CDN product photography — the product object shape is
   already designed to map onto a future API response.
3. **Payment methods** — the checkout screen shows COD, JazzCash, Easypaisa,
   Bank Transfer and Card as selectable options, but no payment gateway is
   wired up. Plug in real gateway SDKs when ready.

## Wiring up a real backend later

The data layer is intentionally isolated in `src/data/` and consumed only
through a few functions (`getProductById`, `getProductsByCategory`,
`getRelatedProducts`, plus the raw `PRODUCTS` / `COLLECTIONS` arrays). To
swap in a Node/Express/MongoDB API:

- Replace the contents of `src/data/products.js` and `collections.js` with
  `fetch`/`axios` calls to your API, keeping the same exported function
  names and object shape so components don't need to change.
- `CartContext`, `WishlistContext` and the order created in `Checkout.jsx`
  are the natural places to add API calls (e.g. POST `/api/orders`) — they
  already centralize all cart/wishlist/order mutations.
- Orders are currently stored under the `fk_orders` localStorage key from
  `Checkout.jsx`; `TrackOrder.jsx` reads from the same key. Point both at a
  real `/api/orders` endpoint when available.

## Notes

- Mobile product grid is 2 columns per the brief; scales to 3–4 columns on
  larger screens.
- Free delivery threshold is Rs. 8,000, flat Rs. 250 shipping below that —
  adjust in `CartContext.jsx`.
- All Pakistani context (cities, provinces, currency, COD, WhatsApp
  ordering) is centralized in `src/utils/constants.js`.
