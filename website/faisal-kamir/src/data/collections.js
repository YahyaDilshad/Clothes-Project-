import { categoryImage, heroImage } from './images.js';

export const COLLECTIONS = [
  {
    id: 'signature-2026',
    name: 'Signature 2026',
    tagline: 'The house edit of premium blends',
    description: 'A tightly curated capsule of our finest cotton-silk and wool blends, developed for men who dress with restraint. Each piece is limited in run and cut for structured tailoring.',
    image: categoryImage('premium-blends', 900, 1100),
    categories: ['premium-blends', 'boski'],
  },
  {
    id: 'winter-khaddar',
    name: 'Winter Khaddar Edit',
    tagline: 'Handwoven warmth for the season',
    description: 'Heavyweight, handloom khaddar sourced from Punjab\'s weaving belts — brushed for softness and built to hold heat through the coldest months.',
    image: categoryImage('khaddar', 900, 1100),
    categories: ['khaddar'],
  },
  {
    id: 'summer-linen',
    name: 'Summer Linen',
    tagline: 'Breathable weaves for the heat',
    description: 'Airy, breathable linen and linen-blend fabrics designed to move with you through Karachi summers and Lahore afternoons alike.',
    image: categoryImage('linen', 900, 1100),
    categories: ['linen', 'cotton'],
  },
  {
    id: 'eid-festive',
    name: 'Eid Festive',
    tagline: 'Boski and blends for celebration',
    description: 'Lustrous boski and festive-ready premium blends in deep, celebratory tones — cut for the occasions that call for a little more shine.',
    image: heroImage(900, 1100),
    categories: ['boski', 'premium-blends'],
  },
];

export const REVIEWS = [
  { id: 1, name: 'Ahmed Raza', city: 'Lahore', rating: 5, text: 'Fabric quality is genuinely premium — the khaddar held its shape through the whole winter. Stitched two suits from one order.', product: 'Heritage Charcoal Khaddar' },
  { id: 2, name: 'Bilal Farooq', city: 'Karachi', rating: 5, text: 'Ordered the Boski for Eid, delivery was fast and the fabric feel is exactly like the photos. Tailor said it was easy to cut.', product: 'Charcoal Boski Silk-Touch' },
  { id: 3, name: 'Usman Tariq', city: 'Islamabad', rating: 4, text: 'Wash & wear fabric is great for office wear, barely needs ironing. Would like a few more colour options.', product: 'Steel Grey Textured Wash & Wear' },
  { id: 4, name: 'Hamza Sheikh', city: 'Faisalabad', rating: 5, text: 'Been buying unstitched fabric locally for years, Faisal Kamir is a level above. The linen breathes so well in summer.', product: 'Ivory Pure Linen' },
  { id: 5, name: 'Danish Iqbal', city: 'Rawalpindi', rating: 5, text: 'COD was smooth, WhatsApp confirmation was quick, and the cotton fabric feels premium for the price point.', product: 'Classic White Cotton Karandi' },
  { id: 6, name: 'Fahad Malik', city: 'Multan', rating: 4, text: 'The premium blend suiting fabric is beautiful — ordered for a wedding and got compliments on the drape.', product: 'Signature Charcoal Wool Blend' },
];

export const FABRIC_GUIDE = [
  { name: 'Wash & Wear', desc: 'A poly-viscose blend engineered for crease resistance and easy daily care — press once, wear all day.' },
  { name: 'Cotton', desc: 'Breathable, natural fibre that stays cool against the skin — the everyday choice for Pakistan\'s climate.' },
  { name: 'Boski', desc: 'A silk-touch synthetic weave with a soft sheen and fluid drape, favoured for festive dressing.' },
  { name: 'Khaddar', desc: 'A handwoven, heavyweight cotton fabric with natural texture, prized for winter warmth.' },
  { name: 'Linen', desc: 'An airy, breathable natural fibre with a relaxed texture, ideal for humid summer days.' },
  { name: 'Premium Blends', desc: 'Engineered fibre combinations — cotton-silk, wool blends and tencel — built for structured, refined tailoring.' },
];

const INSTAGRAM_CATEGORIES = ['wash-and-wear', 'cotton', 'boski', 'khaddar', 'linen', 'premium-blends'];

export const INSTAGRAM_POSTS = INSTAGRAM_CATEGORIES.map((slug, i) => ({
  id: i,
  image: categoryImage(slug, 500, 500),
}));
