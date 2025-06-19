import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

export async function POST(req: NextRequest) {
  const event = await req.json();
  if (event.event_type === 'INVOICING.INVOICE.PAID') {
    const invoiceId = event.resource.id;
    const db = await getDb();
    await db.collection('service_requests').updateOne(
      { invoiceId },
      { $set: { paid: true, paidAt: new Date(), paymentDetails: event.resource } }
    );
  }
  return NextResponse.json({ received: true });
} 