import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Missing email or OTP' }, { status: 400 });
    }
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return NextResponse.json({ success: false, error: 'OTP not found. Please request a new one.' }, { status: 404 });
    }
    if (user.resetOtp !== otp) {
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 401 });
    }
    if (Date.now() > user.resetOtpExpiry) {
      return NextResponse.json({ success: false, error: 'OTP expired' }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 