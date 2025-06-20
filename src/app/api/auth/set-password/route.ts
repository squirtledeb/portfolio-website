import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, newPassword } = await req.json();
    if (!username || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const db = await getDb();
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Username not found' }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne(
      { username },
      { $set: { password: hashedPassword } }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 