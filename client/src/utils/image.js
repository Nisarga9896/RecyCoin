const CATEGORY_IMAGES = {
  'Mobile Phones': '/media/products/mobile-phones.svg',
  'Laptops & Tablets': '/media/products/laptops-tablets.svg',
  Televisions: '/media/products/televisions.svg',
  Batteries: '/media/products/batteries.svg',
  'Cables & Peripherals': '/media/products/cables-peripherals.svg',
  'Home Appliances': '/media/products/home-appliances.svg',
  'Audio & Wearables': '/media/products/audio-wearables.svg',
  'Console & Parts': '/media/products/console-parts.svg',
};

const FALLBACK_IMAGE = '/media/products/generic.svg';

export function itemImage(item) {
  if (!item) return FALLBACK_IMAGE;
  const images = Array.isArray(item.images) ? item.images : [];
  const cover = images.find((src) => typeof src === 'string' && src.trim());
  if (cover) return cover;
  if (typeof item.image === 'string' && item.image.trim()) return item.image;
  return CATEGORY_IMAGES[item.category] || FALLBACK_IMAGE;
}

export function orderImage(order) {
  if (!order) return FALLBACK_IMAGE;
  return order.itemImage || itemImage({ category: order.itemCategory });
}

export function compressImage(file, { maxDimension = 1200, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Please choose a valid image file'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load that image'));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#050e15';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          reject(new Error('Could not process that image'));
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
