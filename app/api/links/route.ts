import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const links = db.prepare(`
      SELECT l.*, b.name as brand_name, c.name as category_name 
      FROM links l 
      JOIN brands b ON l.brand_id = b.id 
      JOIN categories c ON l.category_id = c.id 
      ORDER BY b.name, c.name, l.title
    `).all();
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { brandId, categoryId, title, url, description } = await request.json();
    const result = db.prepare(
      'INSERT INTO links (brand_id, category_id, title, url, description) VALUES (?, ?, ?, ?, ?)'
    ).run(brandId, categoryId, title, url, description || null);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
