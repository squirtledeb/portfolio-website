import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Validate required fields
    if (!data.username || !data.projectName || !data.rating || !data.review || !data.title || !data.serviceType) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const db = await getDb();
    await db.collection('reviews').insertOne({
      username: data.username,
      projectName: data.projectName,
      serviceType: data.serviceType,
      rating: data.rating,
      review: data.review,
      title: data.title,
      avatar: data.avatar,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const reviews = await db.collection('reviews').find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
} 