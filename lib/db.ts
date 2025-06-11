import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'bike-shop.db'));

// Create tables only if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );
`);

// Check if data already exists before inserting
const checkCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
const checkBrands = db.prepare('SELECT COUNT(*) as count FROM brands').get() as { count: number };
const checkLinks = db.prepare('SELECT COUNT(*) as count FROM links').get() as { count: number };

// Only insert sample data if tables are empty
if (checkCategories.count === 0) {
  console.log('Initializing categories...');
  const categories = [
    'B2B Portal',
    'Consumer Site',
    'Manuals/Docs',
    'Tech Specs',
    'Warranty Info',
    'Support/Contact',
    'Ordering System',
    'Training Resources',
    'News/Updates',
    'Other'
  ];

  const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
  categories.forEach(cat => insertCategory.run(cat));
}

if (checkBrands.count === 0) {
  console.log('Initializing brands...');
  const brands = ['Shimano', 'SRAM', 'Trek', 'Specialized', 'Giant'];
  const insertBrand = db.prepare('INSERT INTO brands (name) VALUES (?)');
  brands.forEach(brand => insertBrand.run(brand));
}

if (checkLinks.count === 0) {
  console.log('Initializing sample links...');
  const sampleLinks = [
    { brand: 'Shimano', category: 'B2B Portal', title: 'Shimano B2B Portal', url: 'https://b2b.shimano.com', description: 'Dealer ordering and account management' },
    { brand: 'Shimano', category: 'Tech Specs', title: 'Tech Docs', url: 'https://si.shimano.com', description: 'Technical documents and specifications' },
    { brand: 'SRAM', category: 'B2B Portal', title: 'SRAM B2B', url: 'https://b2b.sram.com', description: 'SRAM dealer portal' },
    { brand: 'SRAM', category: 'Manuals/Docs', title: 'Service Manuals', url: 'https://www.servicearchive.sram.com', description: 'Complete service documentation' },
    { brand: 'Trek', category: 'B2B Portal', title: 'Trek B2B', url: 'https://b2b.trekbikes.com', description: 'Trek dealer portal' },
    { brand: 'Trek', category: 'Warranty Info', title: 'Warranty Portal', url: 'https://warranty.trekbikes.com', description: 'Submit and track warranty claims' },
    { brand: 'Specialized', category: 'B2B Portal', title: 'Specialized B2B', url: 'https://b2b.specialized.com', description: 'Specialized dealer portal' },
    { brand: 'Specialized', category: 'Training Resources', title: 'SBCU', url: 'https://sbcu.specialized.com', description: 'Specialized Bicycle Components University' },
    { brand: 'Giant', category: 'B2B Portal', title: 'Giant B2B', url: 'https://b2b.giant-bicycles.com', description: 'Giant dealer portal' },
    { brand: 'Giant', category: 'Consumer Site', title: 'Giant Bicycles', url: 'https://www.giant-bicycles.com', description: 'Consumer website and bike finder' }
  ];

  const insertLink = db.prepare(`
    INSERT INTO links (brand_id, category_id, title, url, description)
    VALUES (
      (SELECT id FROM brands WHERE name = ?),
      (SELECT id FROM categories WHERE name = ?),
      ?, ?, ?
    )
  `);

  sampleLinks.forEach(link => {
    insertLink.run(link.brand, link.category, link.title, link.url, link.description);
  });
}

export default db;
