// app/api/reset-database/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
  try {
    // Start a transaction
    const resetDb = db.transaction(() => {
      // Clear all existing data
      db.prepare('DELETE FROM links').run();
      db.prepare('DELETE FROM categories').run();
      db.prepare('DELETE FROM brands').run();
      
      // Reset auto-increment counters
      db.prepare("DELETE FROM sqlite_sequence WHERE name='links'").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name='categories'").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name='brands'").run();
      
      // Re-insert categories
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
      
      // Re-insert brands
      const brands = ['Shimano', 'SRAM', 'Trek', 'Specialized', 'Giant'];
      const insertBrand = db.prepare('INSERT INTO brands (name) VALUES (?)');
      brands.forEach(brand => insertBrand.run(brand));
      
      // Re-insert sample links
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
    });
    
    // Execute the transaction
    resetDb();
    
    return NextResponse.json({ success: true, message: 'Database reset successfully' });
  } catch (error) {
    console.error('Failed to reset database:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}