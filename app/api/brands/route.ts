import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const brands = db.prepare('SELECT * FROM brands ORDER BY name').all();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const result = db.prepare('INSERT INTO brands (name) VALUES (?)').run(name);
    return NextResponse.json({ id: result.lastInsertRowid, name });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
