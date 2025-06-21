import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('contact_messages');

    const messageDocument = {
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      read: false,
    };

    await collection.insertOne(messageDocument);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving contact message:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to save message.' }, { status: 500 });
  }
} 