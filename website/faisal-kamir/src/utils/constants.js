// Replace with the real business WhatsApp number (in international format, no +, no spaces)
export const WHATSAPP_NUMBER = '923001234567';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const waProductLink = (product) => {
  const msg = `Hi Faisal Kamir, I'd like to order:\n${product.name} (${product.color}) — Rs. ${(product.salePrice || product.price).toLocaleString()}\nSKU: ${product.sku}`;
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`;
};

export const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sargodha',
  'Bahawalpur', 'Sukkur', 'Larkana', 'Sheikhupura', 'Rahim Yar Khan',
  'Gujrat', 'Mardan', 'Kasur', 'Okara', 'Abbottabad',
];

export const PAKISTAN_PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory',
];
