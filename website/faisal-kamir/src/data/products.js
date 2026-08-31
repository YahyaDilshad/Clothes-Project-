// Mock product data. Images are real fabric photography (see data/images.js),
// mapped by fabric category so every product shows a photo of its actual
// fabric family. Replace with per-SKU product photography when the Node/
// Express/MongoDB API is wired up — the shape of each product object is
// designed to map 1:1 onto a future `/api/products` response.

import { categoryImage } from './images.js';

export const CATEGORIES = [
  { slug: 'wash-and-wear', name: 'Wash & Wear', blurb: 'Easy-care, crease-resistant everyday fabric.' },
  { slug: 'cotton', name: 'Cotton', blurb: 'Breathable, pure-cotton comfort for all seasons.' },
  { slug: 'boski', name: 'Boski', blurb: 'Silk-touch sheen with a soft, luxurious drape.' },
  { slug: 'khaddar', name: 'Khaddar', blurb: 'Handwoven warmth, built for Pakistani winters.' },
  { slug: 'linen', name: 'Linen', blurb: 'Lightweight, breathable weave for humid summers.' },
  { slug: 'premium-blends', name: 'Premium Blends', blurb: 'Engineered fibre blends for refined structure.' },
];

export const OCCASIONS = ['Everyday', 'Office', 'Festive', 'Wedding', 'Casual Friday', 'Eid'];
export const SEASONS = ['Summer', 'Winter', 'All Season'];
export const COLORS = [
  { name: 'Charcoal Black', hex: '#1c1c1c' },
  { name: 'Warm Ivory', hex: '#efe8da' },
  { name: 'Steel Grey', hex: '#6b6b6b' },
  { name: 'Navy', hex: '#1f2a44' },
  { name: 'Olive', hex: '#5c5a3f' },
  { name: 'Rust', hex: '#8a4a2e' },
  { name: 'Bottle Green', hex: '#254d3b' },
  { name: 'Stone Beige', hex: '#c8b898' },
  { name: 'Maroon', hex: '#5c1f28' },
  { name: 'Slate Blue', hex: '#3d4f63' },
];

const reviewCount = (seed) => 12 + (seed % 47);
const rating = (seed) => (3.9 + ((seed % 11) / 10)).toFixed(1);

export const PRODUCTS = [
  { id: 'fk-101', name: 'Charcoal Herringbone Wash & Wear', category: 'wash-and-wear', fabric: 'Wash & Wear', color: 'Charcoal Black', colorHex: '#1c1c1c', price: 4990, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Office', weight: 'Medium weight', badge: 'Best Seller', stock: 18, sku: 'FK-WW-101' },
  { id: 'fk-102', name: 'Ivory Self-Stripe Wash & Wear', category: 'wash-and-wear', fabric: 'Wash & Wear', color: 'Warm Ivory', colorHex: '#efe8da', price: 4790, salePrice: 3990, length: '4.25m', season: 'All Season', occasion: 'Everyday', weight: 'Medium weight', badge: 'Sale', stock: 24, sku: 'FK-WW-102' },
  { id: 'fk-103', name: 'Steel Grey Textured Wash & Wear', category: 'wash-and-wear', fabric: 'Wash & Wear', color: 'Steel Grey', colorHex: '#6b6b6b', price: 5190, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Office', weight: 'Medium weight', badge: null, stock: 12, sku: 'FK-WW-103' },
  { id: 'fk-104', name: 'Navy Dobby Wash & Wear', category: 'wash-and-wear', fabric: 'Wash & Wear', color: 'Navy', colorHex: '#1f2a44', price: 5290, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Casual Friday', weight: 'Medium weight', badge: 'New', stock: 20, sku: 'FK-WW-104' },

  { id: 'fk-201', name: 'Classic White Cotton Karandi', category: 'cotton', fabric: 'Cotton', color: 'Warm Ivory', colorHex: '#efe8da', price: 3490, salePrice: null, length: '4.5m', season: 'Summer', occasion: 'Everyday', weight: 'Light weight', badge: 'Best Seller', stock: 30, sku: 'FK-CT-201' },
  { id: 'fk-202', name: 'Stone Beige Pima Cotton', category: 'cotton', fabric: 'Cotton', color: 'Stone Beige', colorHex: '#c8b898', price: 3690, salePrice: 2990, length: '4.5m', season: 'Summer', occasion: 'Casual Friday', weight: 'Light weight', badge: 'Sale', stock: 16, sku: 'FK-CT-202' },
  { id: 'fk-203', name: 'Olive Cross-Weave Cotton', category: 'cotton', fabric: 'Cotton', color: 'Olive', colorHex: '#5c5a3f', price: 3590, salePrice: null, length: '4.5m', season: 'Summer', occasion: 'Everyday', weight: 'Light weight', badge: null, stock: 22, sku: 'FK-CT-203' },
  { id: 'fk-204', name: 'Slate Blue Fine Cotton', category: 'cotton', fabric: 'Cotton', color: 'Slate Blue', colorHex: '#3d4f63', price: 3790, salePrice: null, length: '4.5m', season: 'Summer', occasion: 'Office', weight: 'Light weight', badge: 'New', stock: 14, sku: 'FK-CT-204' },
  { id: 'fk-205', name: 'Rust Yarn-Dyed Cotton', category: 'cotton', fabric: 'Cotton', color: 'Rust', colorHex: '#8a4a2e', price: 3690, salePrice: null, length: '4.5m', season: 'Summer', occasion: 'Casual Friday', weight: 'Light weight', badge: null, stock: 19, sku: 'FK-CT-205' },

  { id: 'fk-301', name: 'Charcoal Boski Silk-Touch', category: 'boski', fabric: 'Boski', color: 'Charcoal Black', colorHex: '#1c1c1c', price: 6990, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Festive', weight: 'Medium weight', badge: 'Best Seller', stock: 11, sku: 'FK-BK-301' },
  { id: 'fk-302', name: 'Maroon Sheen Boski', category: 'boski', fabric: 'Boski', color: 'Maroon', colorHex: '#5c1f28', price: 7290, salePrice: 6290, length: '4.25m', season: 'All Season', occasion: 'Eid', weight: 'Medium weight', badge: 'Sale', stock: 9, sku: 'FK-BK-302' },
  { id: 'fk-303', name: 'Bottle Green Lustre Boski', category: 'boski', fabric: 'Boski', color: 'Bottle Green', colorHex: '#254d3b', price: 6890, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Wedding', weight: 'Medium weight', badge: null, stock: 8, sku: 'FK-BK-303' },
  { id: 'fk-304', name: 'Ivory Pearl Boski', category: 'boski', fabric: 'Boski', color: 'Warm Ivory', colorHex: '#efe8da', price: 7190, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Eid', weight: 'Medium weight', badge: 'New', stock: 13, sku: 'FK-BK-304' },

  { id: 'fk-401', name: 'Heritage Charcoal Khaddar', category: 'khaddar', fabric: 'Khaddar', color: 'Charcoal Black', colorHex: '#1c1c1c', price: 4290, salePrice: null, length: '4.5m', season: 'Winter', occasion: 'Everyday', weight: 'Heavy weight', badge: 'Best Seller', stock: 17, sku: 'FK-KH-401' },
  { id: 'fk-402', name: 'Rust Handloom Khaddar', category: 'khaddar', fabric: 'Khaddar', color: 'Rust', colorHex: '#8a4a2e', price: 4490, salePrice: 3790, length: '4.5m', season: 'Winter', occasion: 'Casual Friday', weight: 'Heavy weight', badge: 'Sale', stock: 15, sku: 'FK-KH-402' },
  { id: 'fk-403', name: 'Olive Brushed Khaddar', category: 'khaddar', fabric: 'Khaddar', color: 'Olive', colorHex: '#5c5a3f', price: 4390, salePrice: null, length: '4.5m', season: 'Winter', occasion: 'Everyday', weight: 'Heavy weight', badge: null, stock: 21, sku: 'FK-KH-403' },
  { id: 'fk-404', name: 'Stone Beige Village Khaddar', category: 'khaddar', fabric: 'Khaddar', color: 'Stone Beige', colorHex: '#c8b898', price: 4190, salePrice: null, length: '4.5m', season: 'Winter', occasion: 'Everyday', weight: 'Heavy weight', badge: 'New', stock: 10, sku: 'FK-KH-404' },

  { id: 'fk-501', name: 'Ivory Pure Linen', category: 'linen', fabric: 'Linen', color: 'Warm Ivory', colorHex: '#efe8da', price: 5990, salePrice: null, length: '4.25m', season: 'Summer', occasion: 'Office', weight: 'Light weight', badge: 'Best Seller', stock: 14, sku: 'FK-LN-501' },
  { id: 'fk-502', name: 'Steel Grey Linen Blend', category: 'linen', fabric: 'Linen', color: 'Steel Grey', colorHex: '#6b6b6b', price: 6190, salePrice: 5290, length: '4.25m', season: 'Summer', occasion: 'Casual Friday', weight: 'Light weight', badge: 'Sale', stock: 12, sku: 'FK-LN-502' },
  { id: 'fk-503', name: 'Slate Blue Linen Weave', category: 'linen', fabric: 'Linen', color: 'Slate Blue', colorHex: '#3d4f63', price: 5890, salePrice: null, length: '4.25m', season: 'Summer', occasion: 'Office', weight: 'Light weight', badge: null, stock: 16, sku: 'FK-LN-503' },
  { id: 'fk-504', name: 'Stone Beige Linen Karandi', category: 'linen', fabric: 'Linen', color: 'Stone Beige', colorHex: '#c8b898', price: 5790, salePrice: null, length: '4.25m', season: 'Summer', occasion: 'Everyday', weight: 'Light weight', badge: 'New', stock: 18, sku: 'FK-LN-504' },

  { id: 'fk-601', name: 'Signature Charcoal Wool Blend', category: 'premium-blends', fabric: 'Premium Blend', color: 'Charcoal Black', colorHex: '#1c1c1c', price: 9990, salePrice: null, length: '4.25m', season: 'Winter', occasion: 'Wedding', weight: 'Heavy weight', badge: 'Signature', stock: 7, sku: 'FK-PB-601' },
  { id: 'fk-602', name: 'Navy Cotton-Silk Blend', category: 'premium-blends', fabric: 'Premium Blend', color: 'Navy', colorHex: '#1f2a44', price: 8990, salePrice: 7490, length: '4.25m', season: 'All Season', occasion: 'Festive', weight: 'Medium weight', badge: 'Sale', stock: 9, sku: 'FK-PB-602' },
  { id: 'fk-603', name: 'Bottle Green Tencel Blend', category: 'premium-blends', fabric: 'Premium Blend', color: 'Bottle Green', colorHex: '#254d3b', price: 8590, salePrice: null, length: '4.25m', season: 'All Season', occasion: 'Wedding', weight: 'Medium weight', badge: 'Signature', stock: 6, sku: 'FK-PB-603' },
  { id: 'fk-604', name: 'Maroon Cashmere-Touch Blend', category: 'premium-blends', fabric: 'Premium Blend', color: 'Maroon', colorHex: '#5c1f28', price: 10490, salePrice: null, length: '4.25m', season: 'Winter', occasion: 'Wedding', weight: 'Heavy weight', badge: 'Signature', stock: 5, sku: 'FK-PB-604' },
].map((p, i) => ({
  ...p,
  img: categoryImage(p.category, 700, 900),
  images: [
    categoryImage(p.category, 700, 900),
    categoryImage(p.category, 720, 920),
    categoryImage(p.category, 680, 880),
    categoryImage(p.category, 700, 700),
  ],
  rating: rating(i + 7),
  reviews: reviewCount(i + 3),
  description: `${p.name} is cut from premium ${p.fabric.toLowerCase()} fabric, engineered for ${p.season.toLowerCase() === 'all season' ? 'year-round wear' : p.season.toLowerCase() + ' wear'}. Finished in ${p.color.toLowerCase()}, it carries a ${p.weight.toLowerCase()} hand-feel suited to ${p.occasion.toLowerCase()} dressing, with a clean drape built for tailoring into a shalwar kameez or kurta.`,
  care: [
    'Dry clean recommended for first wash',
    'Machine wash cold with similar colours after first wash',
    'Do not bleach',
    'Iron on medium heat from the reverse side',
    'Line dry in shade to preserve colour',
  ],
}));

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id);
export const getProductsByCategory = (slug) => PRODUCTS.filter((p) => p.category === slug);
export const getRelatedProducts = (product, count = 4) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, count);
