import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Missing username or password' }, { status: 400 });
    }
    const db = await getDb();
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
    // Return user data (omit password)
    return NextResponse.json({ success: true, username: user.username, email: user.email });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 