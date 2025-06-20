import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (name.length <= 2) return email;
  return name[0] + "*".repeat(Math.max(0, name.length - 5)) + name.slice(-4) + "@" + domain;
}

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }
    const db = await getDb();
    const user = await db.collection('users').findOne({ username });
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Username not found' }, { status: 404 });
    }
    // Return masked email for confirmation and real email for frontend check
    return NextResponse.json({ success: true, maskedEmail: maskEmail(user.email), realEmail: user.email });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}