import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Curated Unsplash dish photography (free to use, hot-linked via next/image remotePatterns).
// Replace any of these with your own generated images in /public/images later.
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const categories = [
  { name: 'Signature Dishes', slug: 'signature', order: 1 },
  { name: 'Japanese', slug: 'japanese', order: 2 },
  { name: 'Indian', slug: 'indian', order: 3 },
  { name: 'Western', slug: 'western', order: 4 },
  { name: 'Desserts', slug: 'desserts', order: 5 },
  { name: 'Drinks', slug: 'drinks', order: 6 },
];

type SeedItem = {
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string;
  cuisine: string;
  spicy?: number;
  featured?: boolean;
  prepMinutes?: number;
  calories?: number;
  category: string; // slug
};

const items: SeedItem[] = [
  {
    name: 'Truffle Wagyu Steak',
    description:
      'Grade A5 wagyu, seared over oak, finished with black truffle butter and a red-wine jus.',
    price: 48,
    image: IMG('photo-1546964124-0cce460f38ef'),
    tags: '2min Craft,1lt Oil,30min Cook',
    cuisine: 'Western',
    featured: true,
    prepMinutes: 30,
    calories: 720,
    category: 'signature',
  },
  {
    name: 'Saffron Lobster Risotto',
    description:
      'Carnaroli rice slow-stirred in saffron broth, folded with butter-poached lobster.',
    price: 36,
    image: IMG('photo-1476124369491-e7addf5db371'),
    tags: '5min Craft,Creamy,25min Cook',
    cuisine: 'Western',
    featured: true,
    prepMinutes: 25,
    calories: 540,
    category: 'signature',
  },
  {
    name: 'Charred Octopus',
    description:
      'Mediterranean octopus, smoked paprika, confit potato and salsa verde.',
    price: 28,
    image: IMG('photo-1599487488170-d11ec9c172f0'),
    tags: '3min Craft,Grilled,20min Cook',
    cuisine: 'Western',
    featured: true,
    prepMinutes: 20,
    calories: 410,
    category: 'signature',
  },
  {
    name: 'Omakase Sushi Set',
    description:
      "Chef's daily selection of eight nigiri with fresh wasabi and aged soy.",
    price: 42,
    image: IMG('photo-1579871494447-9811cf80d66c'),
    tags: '2min Craft,Raw,Fresh',
    cuisine: 'Japanese',
    featured: true,
    prepMinutes: 15,
    calories: 480,
    category: 'japanese',
  },
  {
    name: 'Black Garlic Ramen',
    description:
      '20-hour tonkotsu broth, chashu pork, ajitama egg and burnt garlic oil.',
    price: 19,
    image: IMG('photo-1569718212165-3a8278d5f624'),
    tags: '4min Craft,Hot,12min Cook',
    cuisine: 'Japanese',
    spicy: 1,
    prepMinutes: 12,
    calories: 650,
    category: 'japanese',
  },
  {
    name: 'Crispy Tempura Platter',
    description:
      'Tiger prawns and seasonal vegetables in a feather-light tempura batter.',
    price: 22,
    image: IMG('photo-1606502973842-f64bc2785fe5'),
    tags: '3min Craft,1lt Oil,15min Cook',
    cuisine: 'Japanese',
    prepMinutes: 15,
    calories: 520,
    category: 'japanese',
  },
  {
    name: 'Butter Chicken',
    description:
      'Tandoor chicken in a velvety tomato-cashew gravy, finished with cream and fenugreek.',
    price: 18,
    image: IMG('photo-1603894584373-5ac82b2ae398'),
    tags: '2min Craft,1lt Oil,30min Cook',
    cuisine: 'Indian',
    spicy: 2,
    featured: true,
    prepMinutes: 30,
    calories: 690,
    category: 'indian',
  },
  {
    name: 'Lamb Rogan Josh',
    description:
      'Slow-braised lamb shoulder in Kashmiri chilies and warming aromatics.',
    price: 24,
    image: IMG('photo-1545247181-516773cae754'),
    tags: '5min Craft,Spicy,45min Cook',
    cuisine: 'Indian',
    spicy: 3,
    prepMinutes: 45,
    calories: 730,
    category: 'indian',
  },
  {
    name: 'Paneer Tikka Masala',
    description:
      'Char-grilled paneer in a smoky, spiced tomato cream — fully vegetarian.',
    price: 16,
    image: IMG('photo-1631452180519-c014fe946bc7'),
    tags: '3min Craft,Veg,25min Cook',
    cuisine: 'Indian',
    spicy: 2,
    prepMinutes: 25,
    calories: 560,
    category: 'indian',
  },
  {
    name: 'Smash Burger Deluxe',
    description:
      'Double dry-aged beef smash patties, aged cheddar, house pickles, brioche bun.',
    price: 17,
    image: IMG('photo-1568901346375-23c9450c58cd'),
    tags: '2min Craft,1lt Oil,10min Cook',
    cuisine: 'Western',
    featured: true,
    prepMinutes: 10,
    calories: 820,
    category: 'western',
  },
  {
    name: 'Wild Mushroom Pasta',
    description:
      'Hand-rolled tagliatelle, wild mushrooms, parmesan and a whisper of truffle.',
    price: 21,
    image: IMG('photo-1473093295043-cdd812d0e601'),
    tags: '4min Craft,Veg,18min Cook',
    cuisine: 'Western',
    prepMinutes: 18,
    calories: 610,
    category: 'western',
  },
  {
    name: 'Margherita di Bufala',
    description:
      'San Marzano tomato, buffalo mozzarella, basil — 60-hour fermented dough.',
    price: 15,
    image: IMG('photo-1574071318508-1cdbab80d002'),
    tags: '2min Craft,Wood-fired,8min Cook',
    cuisine: 'Western',
    prepMinutes: 8,
    calories: 700,
    category: 'western',
  },
  {
    name: 'Molten Chocolate Lava',
    description:
      'Warm dark-chocolate fondant with a liquid center and vanilla bean gelato.',
    price: 12,
    image: IMG('photo-1606313564200-e75d5e30476c'),
    tags: '2min Craft,Sweet,12min Cook',
    cuisine: 'Dessert',
    featured: true,
    prepMinutes: 12,
    calories: 480,
    category: 'desserts',
  },
  {
    name: 'Matcha Tiramisu',
    description:
      'Ceremonial matcha, mascarpone cream and espresso-soaked ladyfingers.',
    price: 11,
    image: IMG('photo-1571877227200-a0d98ea607e9'),
    tags: '3min Craft,Sweet,Chilled',
    cuisine: 'Dessert',
    prepMinutes: 5,
    calories: 420,
    category: 'desserts',
  },
  {
    name: 'Yuzu Cheesecake',
    description:
      'Baked Japanese-style cheesecake with bright yuzu curd and torched meringue.',
    price: 12,
    image: IMG('photo-1533134242443-d4fd215305ad'),
    tags: '2min Craft,Citrus,Chilled',
    cuisine: 'Dessert',
    prepMinutes: 5,
    calories: 390,
    category: 'desserts',
  },
  {
    name: 'Signature Old Fashioned',
    description:
      'Barrel-aged bourbon, demerara, aromatic bitters and a flamed orange peel.',
    price: 14,
    image: IMG('photo-1514362545857-3bc16c4c7d1b'),
    tags: 'Craft,Spirit-forward',
    cuisine: 'Drink',
    prepMinutes: 4,
    calories: 180,
    category: 'drinks',
  },
  {
    name: 'Hibiscus Spritz',
    description:
      'Sparkling hibiscus, elderflower and citrus — a bright zero-proof refresher.',
    price: 9,
    image: IMG('photo-1551024709-8f23befc6f87'),
    tags: 'Craft,Zero-proof',
    cuisine: 'Drink',
    prepMinutes: 3,
    calories: 90,
    category: 'drinks',
  },
  {
    name: 'Cold Brew Tonic',
    description:
      'Single-origin cold brew over tonic with an orange twist and a hint of vanilla.',
    price: 7,
    image: IMG('photo-1461023058943-07fcbe16d735'),
    tags: 'Craft,Caffeine',
    cuisine: 'Drink',
    prepMinutes: 2,
    calories: 30,
    category: 'drinks',
  },
];

// French translations keyed by English dish name.
const FR: Record<string, { name: string; description: string }> = {
  'Truffle Wagyu Steak': {
    name: 'Steak Wagyu à la Truffe',
    description: 'Wagyu A5, saisi au feu de chêne, beurre de truffe noire et jus au vin rouge.',
  },
  'Saffron Lobster Risotto': {
    name: 'Risotto au Homard et Safran',
    description: 'Riz carnaroli mijoté dans un bouillon au safran, homard poché au beurre.',
  },
  'Charred Octopus': {
    name: 'Poulpe Grillé',
    description: 'Poulpe méditerranéen, paprika fumé, pomme de terre confite et salsa verde.',
  },
  'Omakase Sushi Set': {
    name: 'Assortiment Sushi Omakase',
    description: 'Sélection du jour du chef : huit nigiri, wasabi frais et soja vieilli.',
  },
  'Black Garlic Ramen': {
    name: "Ramen à l'Ail Noir",
    description: "Bouillon tonkotsu 20 h, porc chashu, œuf ajitama et huile d'ail grillé.",
  },
  'Crispy Tempura Platter': {
    name: 'Plateau de Tempura Croustillant',
    description: 'Gambas et légumes de saison dans une pâte à tempura légère comme une plume.',
  },
  'Butter Chicken': {
    name: 'Poulet au Beurre',
    description:
      'Poulet tandoori dans une sauce onctueuse tomate-noix de cajou, crème et fenugrec.',
  },
  'Lamb Rogan Josh': {
    name: 'Agneau Rogan Josh',
    description: "Épaule d'agneau braisée aux piments du Cachemire et épices chaleureuses.",
  },
  'Paneer Tikka Masala': {
    name: 'Paneer Tikka Masala',
    description: 'Paneer grillé dans une crème de tomate épicée et fumée — entièrement végétarien.',
  },
  'Smash Burger Deluxe': {
    name: 'Smash Burger Deluxe',
    description: 'Double steak de bœuf maturé, cheddar affiné, pickles maison, pain brioché.',
  },
  'Wild Mushroom Pasta': {
    name: 'Pâtes aux Champignons Sauvages',
    description: 'Tagliatelles maison, champignons sauvages, parmesan et une touche de truffe.',
  },
  'Margherita di Bufala': {
    name: 'Margherita di Bufala',
    description: 'Tomate San Marzano, mozzarella de bufflonne, basilic — pâte fermentée 60 h.',
  },
  'Molten Chocolate Lava': {
    name: 'Fondant au Chocolat Coulant',
    description: 'Fondant tiède au chocolat noir, cœur coulant et glace à la vanille.',
  },
  'Matcha Tiramisu': {
    name: 'Tiramisu au Matcha',
    description: "Matcha cérémonial, crème de mascarpone et biscuits imbibés d'espresso.",
  },
  'Yuzu Cheesecake': {
    name: 'Cheesecake au Yuzu',
    description: 'Cheesecake japonais cuit, crème de yuzu acidulée et meringue flambée.',
  },
  'Signature Old Fashioned': {
    name: 'Old Fashioned Signature',
    description: "Bourbon vieilli en fût, demerara, bitters aromatiques et zeste d'orange flambé.",
  },
  'Hibiscus Spritz': {
    name: "Spritz à l'Hibiscus",
    description: 'Hibiscus pétillant, fleur de sureau et agrumes — rafraîchissant sans alcool.',
  },
  'Cold Brew Tonic': {
    name: 'Cold Brew Tonic',
    description: "Café cold brew pure origine sur tonic, zeste d'orange et pointe de vanille.",
  },
};

async function main() {
  // Idempotent: if the menu already exists, don't wipe live data on redeploys.
  const alreadySeeded = await prisma.menuItem.count();
  if (alreadySeeded > 0) {
    console.log(`✅ Database already seeded (${alreadySeeded} items) — skipping.`);
    return;
  }

  console.log('🌱 Seeding Foddo database...');

  // Clean slate (order matters for FKs)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();

  const categoryIdBySlug: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    categoryIdBySlug[c.slug] = created.id;
  }
  console.log(`  ✓ ${categories.length} categories`);

  for (const item of items) {
    const { category, ...rest } = item;
    await prisma.menuItem.create({
      data: {
        ...rest,
        nameFr: FR[item.name]?.name ?? '',
        descriptionFr: FR[item.name]?.description ?? '',
        categoryId: categoryIdBySlug[category],
      },
    });
  }
  console.log(`  ✓ ${items.length} menu items`);

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@foddo.dev';
  const password = process.env.ADMIN_PASSWORD || 'foddo-admin';
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: { email, passwordHash, name: 'Foddo Admin' },
  });
  console.log(`  ✓ admin user: ${email} (password: ${password})`);

  // A few sample orders + reservations so the dashboard isn't empty on first run.
  const menu = await prisma.menuItem.findMany({ take: 6 });
  const sampleNames = ['Olivia Hart', 'Marcus Lee', 'Sofia Rossi', 'James Park'];
  const statuses = ['PAID', 'PREPARING', 'READY', 'COMPLETED'] as const;
  const types = ['DELIVERY', 'PICKUP', 'DINE_IN'] as const;

  for (let i = 0; i < 8; i++) {
    const picks = menu.slice(i % 3, (i % 3) + 2);
    const subtotal = picks.reduce((s, p) => s + p.price, 0);
    const deliveryFee = 4.5;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);
    const createdAt = new Date(Date.now() - i * 1000 * 60 * 60 * 7);

    await prisma.order.create({
      data: {
        code: `FD-${(1000 + i).toString(36).toUpperCase()}`,
        customerName: sampleNames[i % sampleNames.length],
        customerEmail: `guest${i}@example.com`,
        customerPhone: '+1 555 0100',
        address: '250 Hawtown Road, New York',
        type: types[i % types.length],
        status: statuses[i % statuses.length],
        subtotal,
        deliveryFee,
        tax,
        total,
        paid: true,
        createdAt,
        updatedAt: createdAt,
        items: {
          create: picks.map((p) => ({
            menuItemId: p.id,
            name: p.name,
            price: p.price,
            quantity: 1,
            image: p.image,
          })),
        },
      },
    });
  }
  console.log('  ✓ 8 sample orders');

  for (let i = 0; i < 4; i++) {
    await prisma.reservation.create({
      data: {
        name: sampleNames[i],
        email: `guest${i}@example.com`,
        phone: '+1 555 0100',
        partySize: 2 + i,
        date: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24),
        time: ['18:00', '19:30', '20:00', '21:00'][i],
        occasion: ['Anniversary', 'Birthday', 'Business', 'Casual'][i],
        status: i === 0 ? 'CONFIRMED' : 'REQUESTED',
      },
    });
  }
  console.log('  ✓ 4 sample reservations');

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
