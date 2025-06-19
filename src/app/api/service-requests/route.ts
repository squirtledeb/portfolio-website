import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

// POST: Create a new service request
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/service-requests called');
    const body = await req.json();
    console.log('Request body:', body);
    const db = await getDb();
    console.log('Database connected for POST');
    const collection = db.collection('service_requests');
    const doc = {
      ...body,
      status: body.status || 'Pending',
      created_at: new Date(),
    };
    console.log('Document to insert:', doc);
    const result = await collection.insertOne(doc);
    console.log('Insert result:', result);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error('POST API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: List all service requests (optionally filter by username)
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/service-requests called');
    const db = await getDb();
    console.log('Database connected');
    const collection = db.collection('service_requests');
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const query = username ? { username } : {};
    console.log('Query:', query);
    const requests = await collection.find(query).sort({ created_at: -1 }).toArray();
    console.log('Found requests:', requests.length);
    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 