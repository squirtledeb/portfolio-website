import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    if (!email || !username || !password) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const db = await getDb();
    const existing = await db.collection('users').findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Username or email already exists' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ email, username, password: hashedPassword });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 