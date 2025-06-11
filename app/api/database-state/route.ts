// app/api/database-state/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Get all data from each table
    const brands = db.prepare('SELECT * FROM brands ORDER BY id').all();
    const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
    const links = db.prepare('SELECT * FROM links ORDER BY id').all();
    
    // Get table schemas
    const brandsSchema = db.prepare("PRAGMA table_info(brands)").all();
    const categoriesSchema = db.prepare("PRAGMA table_info(categories)").all();
    const linksSchema = db.prepare("PRAGMA table_info(links)").all();
    
    // Get row counts
    const counts = {
      brands: db.prepare('SELECT COUNT(*) as count FROM brands').get() as { count: number },
      categories: db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number },
      links: db.prepare('SELECT COUNT(*) as count FROM links').get() as { count: number }
    };
    
    // Get auto-increment values
    const sequences = db.prepare("SELECT name, seq FROM sqlite_sequence").all() as Array<{ name: string; seq: number }>;
    
    return NextResponse.json({
      counts: {
        brands: counts.brands.count,
        categories: counts.categories.count,
        links: counts.links.count
      },
      sequences: sequences.reduce((acc, { name, seq }) => {
        acc[name] = seq;
        return acc;
      }, {} as Record<string, number>),
      schemas: {
        brands: brandsSchema,
        categories: categoriesSchema,
        links: linksSchema
      },
      data: {
        brands,
        categories,
        links
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get database state:', error);
    return NextResponse.json({ error: 'Failed to get database state' }, { status: 500 });
  }
}