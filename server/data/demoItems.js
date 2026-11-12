const CONDITION_DETAILS = {
  Refurbished: { age: 'Professionally refurbished', defects: 'None — tested and working' },
  Good: { age: '1–3 years', defects: 'Minor cosmetic wear only' },
  Fair: { age: '3–5 years', defects: 'Visible scratches and wear' },
  'Spare Parts': { age: '3+ years', defects: 'Sold as spares — not fully functional' },
};

const DEMO_ITEMS_RAW = [
  { name: 'iPhone 11 – 64GB', emoji: '📱', image: 'iPhone 11 – 64GB.jpg', category: 'Mobile Phones', condition: 'Good', price: 14999, description: 'Well maintained iPhone 11, battery health 86%. Face ID works. Comes with a screen guard.' },
  { name: 'Dell Inspiron 15 (i5, 8GB)', emoji: '💻', image: 'Dell Inspiron 15 (i5, 8GB).jpg', category: 'Laptops & Tablets', condition: 'Refurbished', price: 22999, description: 'Refurbished laptop with a new battery and SSD. Perfect for students and office work.' },
  { name: 'Samsung 43" LED TV', emoji: '📺', image: 'Samsung 43 LED TV.jpg', category: 'Televisions', condition: 'Good', price: 18999, description: 'Full HD smart TV. Working remote included. Minor scratch on the lower bezel.' },
  { name: 'iPhone 7 – Spare Parts', emoji: '🔧', image: 'iPhone 7 – Spare Parts.jpg', category: 'Mobile Phones', condition: 'Spare Parts', price: 1499, description: 'No display, rest intact. Great for spare parts: battery, cameras, board.' },
  { name: 'USB-C Cable Bundle (5)', emoji: '🔌', image: 'USB-C Cable Bundle (5).jpeg', category: 'Cables & Peripherals', condition: 'Good', price: 499, description: 'Five working USB-C cables, tested and sorted. Mixed lengths.' },
  { name: 'Logitech MX Master 2S', emoji: '🖱️', image: 'Logitech MX Master 2S.jpg', category: 'Cables & Peripherals', condition: 'Good', price: 2499, description: 'Flagship ergonomic mouse. All buttons work, charging USB cable included.' },
  { name: 'Mechanical Keyboard (Blue)', emoji: '⌨️', image: 'Mechanical Keyboard (Blue).webp', category: 'Cables & Peripherals', condition: 'Refurbished', price: 1999, description: 'Cleaned and switch-tested. A few keycaps replaced. Clicky blue switches.' },
  { name: 'HP LaserJet P1108', emoji: '🖨️', image: 'HP LaserJet P1108.jpg', category: 'Home Appliances', condition: 'Spare Parts', price: 899, description: 'Non-printing unit sold as spares: rollers, motors and boards all intact.' },
  { name: 'Sony WH-CH510 Headphones', emoji: '🎧', image: 'Sony WH-CH510 Headphones.webp', category: 'Audio & Wearables', condition: 'Good', price: 1799, description: 'Wireless on-ear headphones. 25hr battery life. Earpads replaced last month.' },
  { name: 'Apple Watch Series 4', emoji: '⌚', image: 'Apple Watch Series 4.jpg', category: 'Audio & Wearables', condition: 'Good', price: 6999, description: 'GPS + cellular. Works with iOS 16+. Battery replaced at 3rd party service.' },
  { name: 'Sony PS4 Slim 500GB', emoji: '🎮', image: 'Sony PS4 Slim 500GB.webp', category: 'Console & Parts', condition: 'Good', price: 11999, description: 'With controller and HDMI. Slightly noisy fan but runs all games fine.' },
  { name: 'Bluetooth Speaker (JBL GO 2)', emoji: '📢', image: 'Bluetooth Speaker (JBL GO 2).jpg', category: 'Audio & Wearables', condition: 'Good', price: 999, description: 'Pocket speaker, working mic. Charging cable included.' },
  { name: 'Asus Router RT-AC58U', emoji: '📡', image: 'Asus Router RT-AC58U.webp', category: 'Cables & Peripherals', condition: 'Refurbished', price: 1599, description: 'Dual-band AC1200 router. Firmware updated. Adapter included.' },
  { name: 'UPS 600VA (Battery Dead)', emoji: '🔋', image: 'UPS 600VA (Battery Dead).webp', category: 'Home Appliances', condition: 'Spare Parts', price: 599, description: 'UPS body in good condition, battery needs replacement. Board works.' },
  { name: 'PSP 3000 – Retro Handheld', emoji: '🎮', image: 'PSP 3000 – Retro Handheld.jpg', category: 'Console & Parts', condition: 'Good', price: 3499, description: 'Classic PSP, plays UMDs, comes with charger and 2 games.' },
  { name: 'Nikon D3500 Body Only', emoji: '📷', image: 'Nikon D3500 Body Only.webp', category: 'Audio & Wearables', condition: 'Good', price: 24999, description: 'DSLR body, shutter count ~8k. Sensor clean. Battery + charger included.' },
  { name: 'Lenovo Tab M10 – 64GB', emoji: '💻', image: 'Lenovo Tab M10 – 64GB.webp', category: 'Laptops & Tablets', condition: 'Good', price: 8999, description: 'Wi-Fi tablet for study and streaming. Screen protector fitted, minor scuffs on the back.' },
  { name: 'Anker 20000mAh Power Bank', emoji: '🔋', image: 'Anker 20000mAh Power Bank.webp', category: 'Batteries', condition: 'Good', price: 1499, description: 'High-capacity power bank, both ports tested. Holds charge well, cable included.' },
];

export const DEMO_ITEMS = DEMO_ITEMS_RAW.map(({ image, ...item }) => {
  const details = CONDITION_DETAILS[item.condition] || {};
  return {
    ...item,
    images: [`/media/products/${image}`],
    age: item.age || details.age || '',
    defects: item.defects || details.defects || '',
  };
});
