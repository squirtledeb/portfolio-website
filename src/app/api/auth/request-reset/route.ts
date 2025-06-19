import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import nodemailer from 'nodemailer';

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, confirm } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Email not found' }, { status: 404 });
    }
    if (!confirm) {
      // Step 1: Just check if email exists
      return NextResponse.json({ success: true });
    }
    // Step 2: Generate OTP, save to user, and send email
    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await db.collection('users').updateOne(
      { email },
      { $set: { resetOtp: otp, resetOtpExpiry: otpExpiry } }
    );
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `OceanTideCo <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OceanTideCo Password Reset OTP',
      text: `Hey ${user.username},\n\nHere is your OTP to reset your password: ${otp}\n\nIf you did not request this, please ignore this email.\n\nThanks,\nOceanTideCo Team`,
      // You can customize the message above!
    };
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}