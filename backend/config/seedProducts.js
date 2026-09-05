const db = require('./db');

const initialProducts = [
  {
    product_name: "Floral Diamond Gold Bracelet",
    description: "A delicate gold-finish bracelet featuring beautifully detailed floral motifs accented with sparkling white stones. Small connecting stones add a subtle shimmer between each flower, creating a feminine and elegant design that works well for festive occasions, celebrations, and daily premium styling.",
    category: "Bracelets",
    price: 899.00,
    stock: 15,
    image: JSON.stringify([
      "1787892079697-ChatGPT Image Aug 24, 2026, 10_35_57 PM.png",
      "1787892079732-ChatGPT Image Aug 24, 2026, 10_35_42 PM.png"
    ]),
    product_type: "new_arrival",
    luvy_product_id: "LUVY-PRD-0023"
  },
  {
    product_name: "Gold & Diamond Infinity Ring",
    description: "Beautiful infinity ring embedded with small brilliant diamonds set in pure 18k polished gold band.",
    category: "Rings",
    price: 650.00,
    stock: 20,
    image: "1781429297264-Gold & Diamond Infinity Ring home.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0003"
  },
  {
    product_name: "Diamond & Sapphire Drop Earrings",
    description: "Elegant drop earrings featuring a stunning deep blue sapphire surrounded by sparkling diamond halos.",
    category: "Earrings",
    price: 499.00,
    stock: 12,
    image: "1781424171649-Diamond & Sapphire Drop Earrings home.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0001"
  },
  {
    product_name: "Classic Navy Leather Handbag",
    description: "Premium navy leather handbag with gold-tone hardware, structured silhouette, and spacious interior.",
    category: "Handbags",
    price: 899.00,
    stock: 8,
    image: "1781423936221-Classic Navy Leather Handbag home.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0002"
  },
  {
    product_name: "Emerald Pendant Necklace",
    description: "Stunning Zambian emerald pendant set in 18k yellow gold with a delicate shimmering chain.",
    category: "Necklaces",
    price: 520.00,
    stock: 14,
    image: "1781429587996-Emerald Pendant Necklace home.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0004"
  },
  {
    product_name: "Emerald Cut Solitaire Ring",
    description: "Stunning emerald cut diamond ring with tapered platinum band setting for timeless grandeur.",
    category: "Rings",
    price: 899.00,
    stock: 10,
    image: "1781429245663-Emerald Cut Ring.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0016"
  },
  {
    product_name: "Pearl Promise Ring",
    description: "Delicate freshwater pearl promise ring with pavé diamond side accents and polished gold band.",
    category: "Rings",
    price: 429.00,
    stock: 25,
    image: "1781424633708-Pearl Promise Ring.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0017"
  },
  {
    product_name: "Vintage Filigree Ring",
    description: "Artisan vintage-inspired ring featuring intricate Victorian filigree craftsmanship.",
    category: "Rings",
    price: 559.00,
    stock: 18,
    image: "1781429414193-Vintage Style Ring.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0024"
  },
  {
    product_name: "Silver Band Minimalist Ring",
    description: "Simple solid sterling silver band ring designed for effortless daily elegance and stacking.",
    category: "Rings",
    price: 199.00,
    stock: 30,
    image: "1781424829888-Silver Band Ring.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0015"
  },
  {
    product_name: "Diamond Tennis Necklace",
    description: "Breathtaking full tennis necklace with brilliant round cut diamonds set in white gold.",
    category: "Necklaces",
    price: 1299.00,
    stock: 5,
    image: "1781429531940-Diamond Tennis Necklace.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0012"
  },
  {
    product_name: "Pearl Strand Luxury Necklace",
    description: "Classic hand-knotted freshwater pearl strand necklace with vintage gold floral clasp.",
    category: "Necklaces",
    price: 459.00,
    stock: 16,
    image: "1781429714827-Pearl Strand Necklace.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0013"
  },
  {
    product_name: "Gold Cable Chain Necklace",
    description: "Sophisticated 18k solid gold link chain necklace perfect for pendants or luxury layering.",
    category: "Necklaces",
    price: 329.00,
    stock: 22,
    image: "1781429669827-Gold Chain Necklace.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0014"
  },
  {
    product_name: "Silver Vintage Locket Necklace",
    description: "Vintage-inspired sterling silver photo locket necklace engraved with floral crests.",
    category: "Necklaces",
    price: 289.00,
    stock: 19,
    image: "1781424692785-Silver Locket Necklace.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0023B"
  },
  {
    product_name: "Crystal Heart Pendant Necklace",
    description: "Delicate faceted crystal heart pendant suspended on a fine silver cable chain.",
    category: "Necklaces",
    price: 380.00,
    stock: 24,
    image: "1781424095021-Crystal Heart Necklace home.png",
    product_type: "new_arrival",
    luvy_product_id: "LUVY-PRD-0103"
  },
  {
    product_name: "Pearl Cascade Drop Earrings",
    description: "Stunning waterfall cascade earrings with radiant baroque freshwater pearls.",
    category: "Earrings",
    price: 420.00,
    stock: 15,
    image: "1781429933686-Pearl Cascade Earrings home.png",
    product_type: "new_arrival",
    luvy_product_id: "LUVY-PRD-0102"
  },
  {
    product_name: "Crystal Chandelier Grand Earrings",
    description: "Dazzling crystal chandelier earrings designed to sparkle with dramatic red carpet radiance.",
    category: "Earrings",
    price: 389.00,
    stock: 14,
    image: "1781424029863-Crystal Chandelier Earrings.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0022"
  },
  {
    product_name: "Classic Gold Hoop Earrings",
    description: "Timeless polished gold hoop earrings crafted with lightweight hollow tube construction.",
    category: "Earrings",
    price: 189.00,
    stock: 28,
    image: "1781424290260-Gold Hoop Earrings.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0010"
  },
  {
    product_name: "Pearl Teardrop Earrings",
    description: "Classic teardrop pearl earrings with modern diamond pavé wire settings.",
    category: "Earrings",
    price: 299.00,
    stock: 20,
    image: "1781429992757-Pearl Drop Earrings.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0008"
  },
  {
    product_name: "3-Layer Royal Gold Bangle",
    description: "Stunning 3-layer solid gold bangle encrusted with sparkling diamond clusters and hidden safety clasp.",
    category: "Bracelets",
    price: 850.00,
    stock: 11,
    image: JSON.stringify([
      "1787594407464-Gold Bangle.png",
      "1787594407465-Gold Bangle2.png"
    ]),
    product_type: "premium",
    luvy_product_id: "LUVY-PRD-0027"
  },
  {
    product_name: "Golden Floral Diamond Bracelet",
    description: "Magnificent bridal gold bracelet designed with intricate stone-studded blossom clusters.",
    category: "Bracelets",
    price: 940.00,
    stock: 7,
    image: JSON.stringify([
      "1787595534087-Golden Floral Diamond Bracelet.png",
      "1787595534088-Golden Floral Diamond Bracelet1.png"
    ]),
    product_type: "premium",
    luvy_product_id: "LUVY-PRD-0028"
  },
  {
    product_name: "Pearl Tennis Charm Bracelet",
    description: "Luxurious pearl and bezel-set diamond tennis bracelet with timeless bridal appeal.",
    category: "Bracelets",
    price: 799.00,
    stock: 13,
    image: "1781424742819-Pearl Tennis Bracelet.png",
    product_type: "shop",
    luvy_product_id: "LUVY-PRD-0020"
  },
  {
    product_name: "Handmade Beaded Bohemian Bracelet",
    description: "Artisan woven beaded bracelet featuring vibrant gemstones and traditional patterns.",
    category: "Bracelets",
    price: 120.00,
    stock: 40,
    image: "1781424376262-Handmade Beaded Bracelet home.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0006"
  },
  {
    product_name: "Genuine Leather Wrap Bracelet",
    description: "Braided genuine leather wrap bracelet accented with silver charms and magnetic clasp.",
    category: "Bracelets",
    price: 180.00,
    stock: 25,
    image: "1781430096449-Leather Wrap Bracelet home.png",
    product_type: "new_arrival",
    luvy_product_id: "LUVY-PRD-0104"
  },
  {
    product_name: "Crossbody Mini Designer Bag",
    description: "Chic crossbody mini bag crafted in textured vegan leather with gleaming chain strap.",
    category: "Handbags",
    price: 520.00,
    stock: 12,
    image: "1781423987724-Crossbody Mini Bag home.png",
    product_type: "new_arrival",
    luvy_product_id: "LUVY-PRD-0105"
  },
  {
    product_name: "Luxury Metallic Evening Clutch",
    description: "Compact evening clutch in metallic shimmer fabric with crystal encrusted clasp.",
    category: "Handbags",
    price: 450.00,
    stock: 15,
    image: "1781430235878-Luxury Evening Clutch.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0007"
  },
  {
    product_name: "Royal Temple Gold Necklace Set",
    description: "Opulent handcrafted gold bridal choker set with ruby center stones and matching royal jhumkas.",
    category: "Necklaces",
    price: 1499.00,
    stock: 6,
    image: JSON.stringify([
      "1788373291112-ChatGPT Image Sep 2, 2026, 11_40_10 PM.png",
      "1788373291162-ChatGPT Image Sep 2, 2026, 11_26_38 PM.png"
    ]),
    product_type: "premium",
    luvy_product_id: "LUVY-PRD-0030"
  },
  {
    product_name: "Handcrafted Artisan Tote",
    description: "Unique handmade structured tote bag with rich leather trim and elegant gold embellishments.",
    category: "Handbags",
    price: 340.00,
    stock: 18,
    image: "1781424554486-Handbag home.png",
    product_type: "special",
    luvy_product_id: "LUVY-PRD-0005"
  }
];

function seedProductsIfEmpty() {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) as count FROM products', (err, results) => {
      if (err) {
        console.error('Error checking products count:', err);
        return resolve();
      }

      const count = results[0]?.count || 0;
      if (count > 0) {
        console.log(`Products table already contains ${count} products.`);
        return resolve();
      }

      console.log('Seeding initial products into database...');
      let completed = 0;

      initialProducts.forEach((p) => {
        const query = `
          INSERT INTO products
          (product_name, description, category, price, stock, image, product_type, status, luvy_product_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
          query,
          [
            p.product_name,
            p.description,
            p.category,
            p.price,
            p.stock,
            p.image,
            p.product_type,
            'Active',
            p.luvy_product_id
          ],
          (insertErr) => {
            if (insertErr) {
              console.error(`Failed to seed ${p.product_name}:`, insertErr);
            }
            completed++;
            if (completed === initialProducts.length) {
              console.log(`Successfully seeded ${initialProducts.length} initial products!`);
              resolve();
            }
          }
        );
      });
    });
  });
}

module.exports = seedProductsIfEmpty;
