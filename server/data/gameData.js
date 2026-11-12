export const BINS = [
  { key: 'recycle', label: 'Recycle', emoji: '♻️', color: '#10b981', desc: 'Materials that can be processed and made into new products.' },
  { key: 'reuse', label: 'Reuse', emoji: '🔁', color: '#0ea5e9', desc: 'Working items that can still be used or repaired and resold.' },
  { key: 'hazardous', label: 'Hazardous', emoji: '⚠️', color: '#f43f5e', desc: 'Dangerous materials needing special, careful disposal.' },
];

export const GAME_ITEMS = [
  { name: 'Smartphone', emoji: '📱', desc: 'Still powers on and functions normally.', bin: 'reuse', hint: 'Works fine — don’t waste it!' },
  { name: 'Laptop', emoji: '💻', desc: 'Boots up and runs applications.', bin: 'reuse', hint: 'Still functional — resell or donate.' },
  { name: 'Lithium battery', emoji: '🪫', desc: 'Swollen, old cell phone battery.', bin: 'hazardous', hint: 'Batteries contain toxic chemicals.' },
  { name: 'Copper wire', emoji: '🧲', desc: 'Bare copper wiring from electronics.', bin: 'recycle', hint: 'Copper is highly recyclable.' },
  { name: 'Phone charger', emoji: '🔌', desc: 'Plugging micro-USB charger, works.', bin: 'reuse', hint: 'Still works — give it another life.' },
  { name: 'CFL bulb', emoji: '💡', desc: 'Compact fluorescent lamp, broken.', bin: 'hazardous', hint: 'Contains small amounts of mercury!' },
  { name: 'Circuit board', emoji: '🔧', desc: 'Motherboard with a burnt chip.', bin: 'recycle', hint: 'Recyclers recover gold and copper.' },
  { name: 'CRT monitor', emoji: '🖥️', desc: 'Old bulky monitor with lead glass.', bin: 'hazardous', hint: 'Lead and phosphor — special handling required.' },
  { name: 'Keyboard', emoji: '⌨️', desc: 'Mechanical keyboard, all keys work.', bin: 'reuse', hint: 'Works — someone will use it!' },
  { name: 'Plastic modem shell', emoji: '📦', desc: 'Empty router casing, plastic only.', bin: 'recycle', hint: 'Plastics from e-waste can be recycled.' },
  { name: 'Printer toner', emoji: '🖨️', desc: 'Empty laser printer toner cartridge.', bin: 'hazardous', hint: 'Toner dust is a respiratory hazard.' },
  { name: 'Mouse', emoji: '🖱️', desc: 'Wireless mouse, needs battery.', bin: 'reuse', hint: 'Works — extend its life.' },
  { name: 'Headphones', emoji: '🎧', desc: 'Over-ear headphones, one side dead.', bin: 'hazardous', hint: 'Damaged battery inside — handle with care.' },
  { name: 'Aluminium heatsink', emoji: '🌀', desc: 'Old CPU heatsink with fan.', bin: 'recycle', hint: 'Aluminium can be melted and reused.' },
  { name: 'E-reader', emoji: '📚', desc: 'Old Kindle, still reads books.', bin: 'reuse', hint: 'Perfect for a second-hand home.' },
  { name: 'Game console', emoji: '🎮', desc: 'Old console that overheats fast.', bin: 'hazardous', hint: 'Internal power board is failing.' },
  { name: 'Glass from TV', emoji: '🪟', desc: 'LED panel screen glass, cracked.', bin: 'recycle', hint: 'Glass can be safely recycled.' },
  { name: 'Smartwatch', emoji: '⌚', desc: 'Works, battery holds a charge.', bin: 'reuse', hint: 'Fully functional — reuse!' },
  { name: 'Expired UPS battery', emoji: '🔋', desc: 'Swollen uninterruptible power supply battery.', bin: 'hazardous', hint: 'Lead-acid — never toss in trash.' },
  { name: 'Speaker magnets', emoji: '📢', desc: 'Neodymium magnets from old speakers.', bin: 'recycle', hint: 'Rare earth metals — recyclable.' },
  { name: 'DVD player', emoji: '💿', desc: 'Disc drive that stopped reading discs.', bin: 'recycle', hint: 'Strip for reusable parts.' },
  { name: 'Fan from PC', emoji: '💨', desc: 'Cooling fan, spins quietly.', bin: 'reuse', hint: 'Perfect case-fan spare.' },
  { name: 'Solar cell strip', emoji: '☀️', desc: 'Broken thin-film solar strip.', bin: 'hazardous', hint: 'Cadmium content — special handling.' },
  { name: 'Camera lens', emoji: '📷', desc: 'DSLR lens, sharp optics, works.', bin: 'reuse', hint: 'Optics hold value — resell it.' },
];

export const CATEGORIES = [
  'Mobile Phones',
  'Laptops & Tablets',
  'Televisions',
  'Batteries',
  'Cables & Peripherals',
  'Home Appliances',
  'Audio & Wearables',
  'Console & Parts',
];