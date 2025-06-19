import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne(
      { email },
      { $set: { password: hashedPassword }, $unset: { resetOtp: '', resetOtpExpiry: '' } }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 