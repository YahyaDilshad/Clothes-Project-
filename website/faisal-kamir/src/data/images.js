// Curated photography — all sourced from Unsplash under the Unsplash License
// (free for commercial use, no attribution required). Each entry below is a
// specific, verified photo ID rather than a random placeholder, chosen to
// match the fabric family it represents. Swap these for real in-house
// product photography when it's available; the helper signature stays the
// same either way.

const unsplashUrl = (id, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Photo IDs (Unsplash), one per fabric family + a hero shot + shop/bundle shots.
export const PHOTO_IDS = {
  hero: '1764161229555-13f730bb126e', // dramatic dark draped fabric — Liana S
  washAndWear: '1636715986446-d58f0f9b3916', // grey/white woven texture — engin akyurt
  cotton: '1756068785746-8aa1a82d2d1d', // soft white fabric folds — Pawel Czerwinski
  boski: '1764161229555-13f730bb126e', // dark lustrous drape (same as hero, fits Boski's sheen)
  khaddar: '1599568723850-14196ee0f991', // warm brown handloom-style textile — Noah Kroes
  linen: '1528458909336-e7a0adfed0a5', // natural beige linen texture — Annie Spratt
  premiumBlends: '1650406268594-c5d310f6fbce', // fine grey canvas weave — engin akyurt
  shopRolls: '1759405327498-9cdb5313d078', // colourful fabric rolls on shelves — Eddie Pipocas
  shopShelves: '1755870190861-20a9902a4412', // fabric rolls, shop entrance — Tanya Barrow
};

export const CATEGORY_IMAGES = {
  'wash-and-wear': unsplashUrl(PHOTO_IDS.washAndWear),
  cotton: unsplashUrl(PHOTO_IDS.cotton),
  boski: unsplashUrl(PHOTO_IDS.boski),
  khaddar: unsplashUrl(PHOTO_IDS.khaddar),
  linen: unsplashUrl(PHOTO_IDS.linen),
  'premium-blends': unsplashUrl(PHOTO_IDS.premiumBlends),
};

export const heroImage = (w = 1200, h = 1400) => unsplashUrl(PHOTO_IDS.hero, w, h);
export const shopImage = (w = 800, h = 600) => unsplashUrl(PHOTO_IDS.shopRolls, w, h);
export const shopShelvesImage = (w = 800, h = 600) => unsplashUrl(PHOTO_IDS.shopShelves, w, h);
export const categoryImage = (slug, w = 800, h = 1000) =>
  unsplashUrl(PHOTO_IDS[toCamelKey(slug)] || PHOTO_IDS.cotton, w, h);

function toCamelKey(slug) {
  const map = {
    'wash-and-wear': 'washAndWear',
    cotton: 'cotton',
    boski: 'boski',
    khaddar: 'khaddar',
    linen: 'linen',
    'premium-blends': 'premiumBlends',
  };
  return map[slug];
}
